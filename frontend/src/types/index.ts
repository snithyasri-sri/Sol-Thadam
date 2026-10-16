export interface SenseDetail {
  id: number;
  target_word: string;
  target_form: string;
  sense_label: string;
  meaning_tamil: string;
  meaning_english?: string | null;
  explanation_tamil: string;
  sentence: string;
  context_clues: string[];
  image_alt_text?: string | null;
  image_prompt?: string | null;
  image_search_url?: string | null;
  image_url?: string | null;
  scene_contrast?: string | null;
  image_status?: string | null;
  score?: number | null;
}

export interface WordSummary {
  word: string;
  senses_count: number;
  meanings_tamil: string[];
  sample_sentence: string;
}

export interface WordDetailResponse {
  word: string;
  total_senses: number;
  senses: SenseDetail[];
}

export interface ImageMetadata {
  alt_text?: string | null;
  prompt?: string | null;
  search_url?: string | null;
  image_url?: string | null;
  scene_contrast?: string | null;
  has_image: boolean;
}

export interface AnalyzeResponse {
  success: boolean;
  sentence: string;
  target_word: string;
  matched_form?: string | null;
  selected_meaning_tamil: string;
  selected_meaning_english?: string | null;
  explanation_tamil: string;
  example_sentence: string;
  alternatives: SenseDetail[];
  score?: number | null;
  score_type: string;
  reasoning_basis: string;
  image_metadata?: ImageMetadata | null;
  warning?: string | null;
  detected_clues: string[];
}

export interface QuizOption {
  sense_label: string;
  meaning_tamil: string;
  meaning_english?: string | null;
}

export interface QuizQuestion {
  id: number;
  sentence: string;
  target_word: string;
  target_form: string;
  correct_sense_label: string;
  correct_meaning_tamil: string;
  options: QuizOption[];
  explanation_tamil: string;
}

export interface HealthResponse {
  status: string;
  dataset_loaded: boolean;
  total_records: number;
  unique_words: number;
  multi_sense_words: number;
  version: string;
}

export type ActivePage = 'home' | 'analyze' | 'words' | 'quiz' | 'about';
