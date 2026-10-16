import type {
  AnalyzeResponse,
  HealthResponse,
  QuizQuestion,
  WordDetailResponse,
  WordSummary,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  tamilMessage: string;
  constructor(tamilMessage: string, originalMessage?: string) {
    super(originalMessage || tamilMessage);
    this.name = 'ApiError';
    this.tamilMessage = tamilMessage;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorDetail = '';
      try {
        const errJson = await res.json();
        errorDetail = errJson.detail || '';
      } catch {
        // non-json response
      }

      if (res.status === 404) {
        throw new ApiError(errorDetail || 'கோரப்பட்ட தகவல் கிடைக்கவில்லை (404).');
      } else if (res.status === 503) {
        throw new ApiError('சேவையகம் அல்லது தரவுத்தொகுப்பு இன்னும் தயாராகவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து முயற்சிக்கவும்.');
      } else {
        throw new ApiError(errorDetail || `சேவையகப் பிழை ஏற்பட்டது (${res.status}).`);
      }
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network failure / server offline
    throw new ApiError(
      'சேவையகத்துடன் இணைக்க முடியவில்லை. பின்தளம் (Backend: http://localhost:8000) இயங்குகிறதா என்பதைச் சரிபார்க்கவும்.',
      err.message
    );
  }
}

export const apiService = {
  async getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  async getWords(search?: string, multiSenseOnly: boolean = false): Promise<WordSummary[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (multiSenseOnly) params.append('multi_sense_only', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<WordSummary[]>(`/words${query}`);
  },

  async getWordDetail(word: string): Promise<WordDetailResponse> {
    return request<WordDetailResponse>(`/words/${encodeURIComponent(word)}`);
  },

  async analyze(sentence: string, targetWord: string): Promise<AnalyzeResponse> {
    return request<AnalyzeResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        sentence: sentence.trim(),
        target_word: targetWord.trim(),
      }),
    });
  },

  async getQuizQuestions(limit: number = 10): Promise<QuizQuestion[]> {
    return request<QuizQuestion[]>(`/quiz/questions?limit=${limit}`);
  },
};
