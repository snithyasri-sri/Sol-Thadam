import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    HealthResponse,
    WordSummary,
    WordDetailResponse,
    QuizQuestion,
)
from app.services.dataset_loader import DatasetLoader
from app.services.sense_engine import SenseEngine
from app.services.quiz_service import QuizService
from app.utils.tamil_helpers import normalize_tamil

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api")

# Singletons initialized in main.py
loader_instance: Optional[DatasetLoader] = None
engine_instance: Optional[SenseEngine] = None
quiz_instance: Optional[QuizService] = None


def get_loader() -> DatasetLoader:
    if loader_instance is None or not loader_instance.is_loaded:
        raise HTTPException(
            status_code=503,
            detail="தரவுத்தொகுப்பு இன்னும் முழுமையாக ஏற்றப்படவில்லை (Dataset not loaded)"
        )
    return loader_instance


def get_engine() -> SenseEngine:
    if engine_instance is None:
        raise HTTPException(
            status_code=503,
            detail="பொருள் பகுப்பாய்வு பொறி தயாராக இல்லை (Engine not initialized)"
        )
    return engine_instance


def get_quiz_service() -> QuizService:
    if quiz_instance is None:
        raise HTTPException(
            status_code=503,
            detail="பயிற்சி வினாடி வினா சேவை தயாராக இல்லை (Quiz service not ready)"
        )
    return quiz_instance


@router.get("/health", response_model=HealthResponse)
def health(loader: DatasetLoader = Depends(get_loader)):
    """
    Returns service health and dataset statistics.
    """
    unique_words_count = len(loader.words_map)
    multi_sense_count = sum(1 for senses in loader.words_map.values() if len(senses) > 1)

    return HealthResponse(
        status="இயங்குகிறது",
        dataset_loaded=loader.is_loaded,
        total_records=len(loader.records),
        unique_words=unique_words_count,
        multi_sense_words=multi_sense_count,
        version="1.0.0"
    )


@router.get("/words", response_model=List[WordSummary])
def get_words(
    search: Optional[str] = Query(None, description="தேட வேண்டிய சொல்"),
    multi_sense_only: bool = Query(False, description="பல பொருள் கொண்ட சொற்கள் மட்டும்"),
    loader: DatasetLoader = Depends(get_loader)
):
    """
    Returns list of available words in the dataset with optional search filter.
    """
    summaries = loader.get_all_words_summary()

    if search:
        norm_search = normalize_tamil(search)
        summaries = [s for s in summaries if norm_search in s.word or any(norm_search in m for m in s.meanings_tamil)]

    if multi_sense_only:
        summaries = [s for s in summaries if s.senses_count > 1]

    return summaries


@router.get("/words/{word}", response_model=WordDetailResponse)
def get_word_details(word: str, loader: DatasetLoader = Depends(get_loader)):
    """
    Returns all senses, example sentences, and metadata for a specific Tamil word.
    """
    norm_word = normalize_tamil(word)
    senses = loader.get_word_senses(norm_word)

    if not senses:
        raise HTTPException(
            status_code=404,
            detail=f"'{norm_word}' என்ற சொல் களஞ்சியத்தில் கிடைக்கவில்லை (Word not found)"
        )

    return WordDetailResponse(
        word=norm_word,
        total_senses=len(senses),
        senses=senses
    )


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_sentence(
    payload: AnalyzeRequest,
    engine: SenseEngine = Depends(get_engine)
):
    """
    Disambiguates the sense of target_word in the given sentence context.
    """
    result = engine.analyze(
        sentence=payload.sentence,
        target_word=payload.target_word
    )
    return result


@router.get("/quiz/questions", response_model=List[QuizQuestion])
def get_quiz_questions(
    limit: int = Query(10, ge=1, le=50),
    quiz_service: QuizService = Depends(get_quiz_service)
):
    """
    Returns multiple-choice quiz questions based strictly on valid multi-sense records.
    """
    return quiz_service.get_questions(limit=limit)
