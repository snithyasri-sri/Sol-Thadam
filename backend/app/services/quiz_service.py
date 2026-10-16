import random
from typing import List
from app.models.schemas import QuizQuestion, QuizOption
from app.services.dataset_loader import DatasetLoader


class QuizService:
    def __init__(self, loader: DatasetLoader):
        self.loader = loader

    def get_questions(self, limit: int = 10) -> List[QuizQuestion]:
        """
        Generate multiple-choice quiz questions strictly using verified multi-sense records.
        Distractors are chosen from genuine alternative senses of the same target word.
        """
        questions: List[QuizQuestion] = []
        q_id = 1

        # Group senses by word
        for word, senses in self.loader.words_map.items():
            if len(senses) < 2:
                continue

            for sense in senses:
                # Target sentence must be present
                if not sense.sentence:
                    continue

                # Correct option
                correct_opt = QuizOption(
                    sense_label=sense.sense_label,
                    meaning_tamil=sense.meaning_tamil,
                    meaning_english=sense.meaning_english
                )

                # Alternative options strictly from the same ambiguous word's other senses
                distractor_opts = [
                    QuizOption(
                        sense_label=other.sense_label,
                        meaning_tamil=other.meaning_tamil,
                        meaning_english=other.meaning_english
                    )
                    for other in senses
                    if other.sense_label != sense.sense_label
                ]

                if not distractor_opts:
                    continue

                all_options = [correct_opt] + distractor_opts
                # Deterministic or controlled shuffle so it's not always in first position
                random.seed(sense.id * 42)
                random.shuffle(all_options)

                explanation = (
                    f"'{sense.sentence}' என்ற வாக்கியத்தில் '{word}' என்பது "
                    f"'{sense.meaning_tamil}' என்ற பொருளைத் தருகிறது. {sense.explanation_tamil}"
                )

                q = QuizQuestion(
                    id=q_id,
                    sentence=sense.sentence,
                    target_word=word,
                    target_form=sense.target_form,
                    correct_sense_label=sense.sense_label,
                    correct_meaning_tamil=sense.meaning_tamil,
                    options=all_options,
                    explanation_tamil=explanation
                )
                questions.append(q)
                q_id += 1

        # Shuffle questions for an engaging quiz experience
        random.seed(12345)
        random.shuffle(questions)
        return questions[:limit]
