from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class SenseDetail(BaseModel):
    id: int
    target_word: str
    target_form: str
    sense_label: str
    meaning_tamil: str
    meaning_english: Optional[str] = None
    explanation_tamil: str
    sentence: str
    context_clues: List[str] = Field(default_factory=list)
    image_alt_text: Optional[str] = None
    image_prompt: Optional[str] = None
    image_search_url: Optional[str] = None
    image_url: Optional[str] = None
    scene_contrast: Optional[str] = None
    image_status: Optional[str] = None
    score: Optional[float] = None


class WordSummary(BaseModel):
    word: str
    senses_count: int
    meanings_tamil: List[str]
    sample_sentence: str


class WordDetailResponse(BaseModel):
    word: str
    total_senses: int
    senses: List[SenseDetail]


class AnalyzeRequest(BaseModel):
    sentence: str = Field(..., min_length=1, description="பகுப்பாய்வு செய்ய வேண்டிய தமிழ் வாக்கியம்")
    target_word: str = Field(..., min_length=1, description="பொருள் காண வேண்டிய சொல்")


class ImageMetadata(BaseModel):
    alt_text: Optional[str] = None
    prompt: Optional[str] = None
    search_url: Optional[str] = None
    image_url: Optional[str] = None
    scene_contrast: Optional[str] = None
    has_image: bool = False


class AnalyzeResponse(BaseModel):
    success: bool
    sentence: str
    target_word: str
    matched_form: Optional[str] = None
    selected_meaning_tamil: str
    selected_meaning_english: Optional[str] = None
    explanation_tamil: str
    example_sentence: str
    alternatives: List[SenseDetail] = Field(default_factory=list)
    score: Optional[float] = None
    score_type: str = "சுயாதீன மொழியியல் தொடரமைப்பு மதிப்பீடு (Linguistic Heuristic Score)"
    reasoning_basis: str
    image_metadata: Optional[ImageMetadata] = None
    warning: Optional[str] = None
    detected_clues: List[str] = Field(default_factory=list)


class QuizOption(BaseModel):
    sense_label: str
    meaning_tamil: str
    meaning_english: Optional[str] = None


class QuizQuestion(BaseModel):
    id: int
    sentence: str
    target_word: str
    target_form: str
    correct_sense_label: str
    correct_meaning_tamil: str
    options: List[QuizOption]
    explanation_tamil: str


class HealthResponse(BaseModel):
    status: str
    dataset_loaded: bool
    total_records: int
    unique_words: int
    multi_sense_words: int
    version: str = "1.0.0"
