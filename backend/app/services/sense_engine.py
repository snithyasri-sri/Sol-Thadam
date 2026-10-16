import logging
from typing import List, Optional, Tuple, Dict
from app.models.schemas import AnalyzeResponse, SenseDetail, ImageMetadata
from app.services.dataset_loader import DatasetLoader
from app.utils.tamil_helpers import (
    normalize_tamil,
    tokenize_tamil,
    get_tamil_stem,
    find_target_word_in_sentence,
    TAMIL_STOPWORDS,
)

logger = logging.getLogger(__name__)


class SenseEngine:
    def __init__(self, loader: DatasetLoader):
        self.loader = loader

    def analyze(self, sentence: str, target_word: str) -> AnalyzeResponse:
        norm_sentence = normalize_tamil(sentence)
        norm_target = normalize_tamil(target_word)

        # 1. Validation: Sentence & target word cannot be empty
        if not norm_sentence.strip():
            return AnalyzeResponse(
                success=False,
                sentence=norm_sentence,
                target_word=norm_target,
                selected_meaning_tamil="பிழை",
                explanation_tamil="தயவுசெய்து பரிசீலிக்க வேண்டிய தமிழ் வாக்கியத்தை உள்ளிடுங்கள்.",
                example_sentence="",
                reasoning_basis="வாக்கியம் காலியாக உள்ளது.",
                warning="வாக்கியம் காலியாக உள்ளது."
            )

        if not norm_target.strip():
            return AnalyzeResponse(
                success=False,
                sentence=norm_sentence,
                target_word=norm_target,
                selected_meaning_tamil="பிழை",
                explanation_tamil="தயவுசெய்து பொருள் காண வேண்டிய சொல்லை உள்ளிடுங்கள்.",
                example_sentence="",
                reasoning_basis="சொல் குறிப்பிடப்படவில்லை.",
                warning="சொல் குறிப்பிடப்படவில்லை."
            )

        # 2. Check if target word exists in sentence
        found, matched_token = find_target_word_in_sentence(norm_target, norm_sentence)
        if not found:
            return AnalyzeResponse(
                success=False,
                sentence=norm_sentence,
                target_word=norm_target,
                matched_form=None,
                selected_meaning_tamil="சொல் வாக்கியத்தில் இல்லை",
                explanation_tamil=f"கொடுக்கப்பட்ட வாக்கியத்தில் '{norm_target}' என்ற சொல் கண்டறியப்படவில்லை. தயவுசெய்து சொல்லையும் வாக்கியத்தையும் சரிபார்க்கவும்.",
                example_sentence="",
                reasoning_basis="இலக்குச் சொல் வாக்கியத்தில் இடம்பெறவில்லை.",
                warning="இலக்குச் சொல் வாக்கியத்தில் இல்லை."
            )

        # 3. Retrieve senses for the target word from dataset
        candidate_senses = self.loader.get_word_senses(norm_target)
        if not candidate_senses:
            # Fallback: check if target word is matched as a stem in dictionary
            stem = get_tamil_stem(norm_target)
            candidate_senses = self.loader.get_word_senses(stem)

        if not candidate_senses:
            return AnalyzeResponse(
                success=False,
                sentence=norm_sentence,
                target_word=norm_target,
                matched_form=matched_token,
                selected_meaning_tamil="களஞ்சியத்தில் இல்லை",
                explanation_tamil=f"மன்னிக்கவும், '{norm_target}' என்ற சொல் சொல் தடம் களஞ்சியத்தில் இன்னும் சேர்க்கப்படவில்லை. தற்போது கிடைக்கும் சொற்களைப் பட்டியலிலிருந்து தேர்ந்தெடுக்கலாம்.",
                example_sentence="",
                reasoning_basis="களஞ்சியத்தில் தரவு இல்லை.",
                warning=f"'{norm_target}' களஞ்சியத்தில் பதிவு செய்யப்படவில்லை."
            )

        # 4. Tokenize and prepare context tokens (excluding target word token itself)
        sentence_tokens = tokenize_tamil(norm_sentence)
        context_tokens = [
            t for t in sentence_tokens
            if t != matched_token and t != norm_target and t not in TAMIL_STOPWORDS
        ]
        context_stems = [get_tamil_stem(t) for t in context_tokens]

        # 5. Score each candidate sense
        scored_senses: List[Tuple[float, SenseDetail, List[str], Dict[str, float]]] = []

        for sense in candidate_senses:
            clue_matches: List[str] = []
            
            # Context clues matching
            for clue in sense.context_clues:
                clue_norm = normalize_tamil(clue)
                clue_stem = get_tamil_stem(clue_norm)

                # Check if clue appears directly in tokens or stems or in sentence
                if (clue_norm in context_tokens or 
                    clue_stem in context_stems or 
                    clue_norm in norm_sentence):
                    if clue_norm not in clue_matches and clue_norm != norm_target:
                        clue_matches.append(clue_norm)

            # Calculate clue overlap score
            num_clues_matched = len(clue_matches)
            clue_score = min(1.0, num_clues_matched / 1.5) if num_clues_matched > 0 else 0.0

            # Example sentence token overlap
            ex_tokens = [
                t for t in tokenize_tamil(sense.sentence)
                if t not in TAMIL_STOPWORDS and t != sense.target_word
            ]
            ex_stems = [get_tamil_stem(t) for t in ex_tokens]
            
            overlap_count = 0
            for ct, cs in zip(context_tokens, context_stems):
                if ct in ex_tokens or cs in ex_stems:
                    overlap_count += 1
            
            total_unique = len(set(context_tokens + ex_tokens))
            sentence_similarity = (overlap_count / total_unique) if total_unique > 0 else 0.0

            # Surface form match bonus
            form_bonus = 0.0
            if matched_token and sense.target_form:
                if normalize_tamil(matched_token) == normalize_tamil(sense.target_form):
                    form_bonus = 0.35
                elif normalize_tamil(matched_token).startswith(normalize_tamil(sense.target_form)):
                    form_bonus = 0.20

            # Composite heuristic score
            # Weight: Clues 55%, Example similarity 25%, Surface form 20%
            raw_score = (0.55 * clue_score) + (0.25 * min(1.0, sentence_similarity * 2.0)) + (0.20 * form_bonus)
            final_score = round(min(1.0, raw_score), 2)

            score_breakdown = {
                "clue_score": round(clue_score, 2),
                "sentence_similarity": round(sentence_similarity, 2),
                "form_bonus": round(form_bonus, 2)
            }

            # Create a copy with the score field populated
            sense_copy = sense.model_copy(update={"score": final_score})
            scored_senses.append((final_score, sense_copy, clue_matches, score_breakdown))

        # Sort senses by score descending
        scored_senses.sort(key=lambda x: x[0], reverse=True)

        best_score, best_sense, best_clues, breakdown = scored_senses[0]

        # Check evidence threshold
        warning_msg: Optional[str] = None
        if len(candidate_senses) > 1 and best_score < 0.15:
            warning_msg = "இவ்வாக்கியத்தில் சொல்லின் குறிப்பிட்ட பொருளைத் துல்லியமாகத் தீர்மானிக்கப் போதிய சூழல் குறிப்புகள் கிடைக்கவில்லை. வாக்கியத்தை மேலும் விரிவாக எழுதலாம் அல்லது மாற்றுப் பொருள்களைக் கவனிக்கலாம்."

        # Build transparent explanation in Tamil
        if best_clues:
            clues_str = "‘" + "’, ‘".join(best_clues[:4]) + "’"
            reasoning = f"இவ்வாக்கியத்தில் இடம்பெற்றுள்ள சூழல் குறிப்புச் சொற்களான {clues_str} ஆகியவை, '{norm_target}' என்ற சொல்லுக்கு '{best_sense.meaning_tamil}' என்ற பொருளே மிகச்சிறப்பாகப் பொருந்துகிறது என்பதைக் காட்டுகின்றன."
        elif breakdown.get("form_bonus", 0) > 0:
            reasoning = f"வாக்கியத்தில் இடம்பெற்றுள்ள '{matched_token}' என்ற சொல்லின் இலக்கண வடிவம், '{best_sense.meaning_tamil}' என்ற பொருளைத் தெளிவாகச் சுட்டுகிறது."
        else:
            reasoning = f"வாக்கியத்தின் பொதுவான சூழல் அமைப்பைக் கொண்டு '{best_sense.meaning_tamil}' என்ற பொருள் முதன்மையாகத் தேர்ந்தெடுக்கப்பட்டுள்ளது."

        # Prepare alternatives
        alternatives = [s[1] for s in scored_senses[1:]]

        # Image metadata
        img_meta = ImageMetadata(
            alt_text=best_sense.image_alt_text,
            prompt=best_sense.image_prompt,
            search_url=best_sense.image_search_url,
            image_url=best_sense.image_url,
            scene_contrast=best_sense.scene_contrast,
            has_image=bool(best_sense.image_alt_text or best_sense.image_url)
        )

        return AnalyzeResponse(
            success=True,
            sentence=norm_sentence,
            target_word=norm_target,
            matched_form=matched_token,
            selected_meaning_tamil=best_sense.meaning_tamil,
            selected_meaning_english=best_sense.meaning_english,
            explanation_tamil=best_sense.explanation_tamil,
            example_sentence=best_sense.sentence,
            alternatives=alternatives,
            score=best_score,
            reasoning_basis=reasoning,
            image_metadata=img_meta,
            warning=warning_msg,
            detected_clues=best_clues
        )
