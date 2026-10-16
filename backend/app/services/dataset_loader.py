import os
import csv
import logging
from typing import List, Dict, Optional, Any
from app.models.schemas import SenseDetail, WordSummary
from app.utils.tamil_helpers import normalize_tamil, tokenize_tamil

logger = logging.getLogger(__name__)


class DatasetLoader:
    def __init__(self, csv_path: Optional[str] = None):
        if csv_path is None:
            # Default to backend/data/tamil_wsd_dataset.csv
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.csv_path = os.path.join(base_dir, "data", "tamil_wsd_dataset.csv")
        else:
            self.csv_path = csv_path

        self.records: List[SenseDetail] = []
        self.words_map: Dict[str, List[SenseDetail]] = {}
        self.is_loaded: bool = False

    def load(self) -> bool:
        """
        Load dataset from CSV supporting UTF-8 and UTF-8-SIG encodings.
        Handles missing fields and cleans Tamil text.
        """
        if not os.path.exists(self.csv_path):
            logger.error(f"Dataset CSV file not found at: {self.csv_path}")
            self.is_loaded = False
            return False

        records = []
        words_map: Dict[str, List[SenseDetail]] = {}

        # Attempt utf-8-sig first to cleanly handle potential BOMs
        encodings = ["utf-8-sig", "utf-8", "latin-1"]
        file_content = None

        for enc in encodings:
            try:
                with open(self.csv_path, mode="r", encoding=enc) as f:
                    file_content = f.read()
                logger.info(f"Dataset read successfully with {enc} encoding.")
                break
            except (UnicodeDecodeError, Exception) as e:
                logger.warning(f"Failed to read with {enc}: {e}")
                continue

        if file_content is None:
            logger.error("Failed to decode dataset with any supported encoding.")
            self.is_loaded = False
            return False

        # Parse CSV
        reader = csv.DictReader(file_content.splitlines())
        row_id = 1

        for row in reader:
            try:
                # Column normalization
                target_word = normalize_tamil(row.get("target_word", "").strip())
                target_form = normalize_tamil(row.get("target_form", "").strip()) or target_word
                sense_label = row.get("sense_label", f"SENSE_{row_id}").strip()
                meaning_tamil = normalize_tamil(row.get("meaning_tamil", "").strip())
                meaning_english = row.get("meaning_english", "").strip() or None
                explanation_tamil = normalize_tamil(row.get("explanation_tamil", "").strip())
                sentence = normalize_tamil(row.get("sentence", "").strip())

                # Context clues parsed into clean tokens
                raw_clues = row.get("context_clues", "").strip()
                clues = []
                if raw_clues:
                    # Can be comma-separated or space-separated
                    parts = raw_clues.replace(",", " ").split()
                    clues = [normalize_tamil(p) for p in parts if p.strip()]

                image_alt_text = row.get("image_alt_text", "").strip() or None
                image_prompt = row.get("image_prompt", "").strip() or None
                image_search_url = row.get("image_search_url", "").strip() or None
                image_url = row.get("image_url", "").strip() or None
                scene_contrast = row.get("scene_contrast", "").strip() or None
                image_status = row.get("image_status", "").strip() or None

                if not target_word or not meaning_tamil:
                    continue

                item = SenseDetail(
                    id=row_id,
                    target_word=target_word,
                    target_form=target_form,
                    sense_label=sense_label,
                    meaning_tamil=meaning_tamil,
                    meaning_english=meaning_english,
                    explanation_tamil=explanation_tamil or meaning_tamil,
                    sentence=sentence,
                    context_clues=clues,
                    image_alt_text=image_alt_text,
                    image_prompt=image_prompt,
                    image_search_url=image_search_url,
                    image_url=image_url,
                    scene_contrast=scene_contrast,
                    image_status=image_status
                )
                records.append(item)

                if target_word not in words_map:
                    words_map[target_word] = []
                words_map[target_word].append(item)

                row_id += 1
            except Exception as ex:
                logger.warning(f"Error parsing row {row}: {ex}")
                continue

        self.records = records
        self.words_map = words_map
        self.is_loaded = len(records) > 0
        logger.info(f"Loaded {len(records)} senses across {len(words_map)} unique words.")
        return self.is_loaded

    def get_all_words_summary(self) -> List[WordSummary]:
        summaries = []
        for word, senses in self.words_map.items():
            meanings = [s.meaning_tamil for s in senses]
            sample_sentence = senses[0].sentence if senses else ""
            summaries.append(
                WordSummary(
                    word=word,
                    senses_count=len(senses),
                    meanings_tamil=meanings,
                    sample_sentence=sample_sentence
                )
            )
        # Sort words alphabetically in Tamil
        summaries.sort(key=lambda x: x.word)
        return summaries

    def get_word_senses(self, word: str) -> List[SenseDetail]:
        norm_word = normalize_tamil(word)
        return self.words_map.get(norm_word, [])

    def get_multi_sense_records(self) -> List[SenseDetail]:
        """
        Returns records for words that have 2 or more distinct senses.
        """
        multi_records = []
        for word, senses in self.words_map.items():
            if len(senses) >= 2:
                multi_records.extend(senses)
        return multi_records
