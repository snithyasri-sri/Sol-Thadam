import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  AlertCircle,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { apiService } from '../services/api';
import type { WordSummary, WordDetailResponse } from '../types';
import { SenseIllustration } from '../components/SenseIllustration';
import { SceneComparison } from '../components/SceneComparison';

interface WordsExplorerPageProps {
  onNavigateToAnalyze: (word: string, sentence?: string) => void;
}

export const WordsExplorerPage: React.FC<WordsExplorerPageProps> = ({
  onNavigateToAnalyze,
}) => {
  const [words, setWords] = useState<WordSummary[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDetail, setWordDetail] = useState<WordDetailResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [multiSenseOnly, setMultiSenseOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'scenes'>('scenes');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load words list on mount or filter change
  useEffect(() => {
    loadWords();
  }, [multiSenseOnly]);

  const loadWords = async (search = searchQuery) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiService.getWords(search, multiSenseOnly);
      setWords(data);
      // Auto-select first word if none selected
      if (data.length > 0 && !selectedWord) {
        selectWord(data[0].word);
      }
    } catch (err: any) {
      setErrorMessage(err.tamilMessage || 'சொற்கள் பட்டியலை ஏற்றுவதில் பிழை ஏற்பட்டது.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadWords(searchQuery);
  };

  const selectWord = async (word: string) => {
    setSelectedWord(word);
    setDetailLoading(true);
    try {
      const detail = await apiService.getWordDetail(word);
      setWordDetail(detail);
    } catch (err: any) {
      // Handle detail load error
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Title Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163828]">
          சொற்களின் தொகுப்பு
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl">
          சொல் தடம் களஞ்சியத்தில் உள்ள தமிழ் சொற்கள் மற்றும் அவற்றின் பலவகைச் சூழல் பொருள்களை இங்கே விரிவாகக் காணலாம்.
        </p>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2DBD0] card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="சொல்லைத் தேடுங்கள்..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7F62]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </form>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMultiSenseOnly(!multiSenseOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold border transition-all cursor-pointer ${
              multiSenseOnly
                ? 'bg-[#163828] text-white border-[#163828]'
                : 'bg-[#FAF8F5] text-stone-700 border-[#E7E1D7] hover:border-[#2A7F62]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>பல பொருள் கொண்ட சொற்கள் மட்டும்</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Word List Sidebar + Word Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Words List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2DBD0] card-shadow overflow-hidden flex flex-col">
          <div className="p-4 bg-[#FAF8F5] border-b border-[#E7E1D7] flex items-center justify-between">
            <span className="text-xs font-bold text-[#163828] uppercase tracking-wider">
              கிடைக்கும் சொற்கள் ({words.length})
            </span>
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y divide-[#F2EDE4] p-2 space-y-1">
            {loading ? (
              <div className="p-8 text-center text-stone-500 text-sm">
                சொற்கள் ஏற்றப்படுகின்றன...
              </div>
            ) : words.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-sm">
                சொற்கள் எதுவும் கண்டறியப்படவில்லை.
              </div>
            ) : (
              words.map((w) => (
                <button
                  key={w.word}
                  type="button"
                  onClick={() => selectWord(w.word)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    selectedWord === w.word
                      ? 'bg-[#163828] text-white shadow-sm'
                      : 'hover:bg-[#FAF8F5] text-[#1F2E24]'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-base">{w.word}</div>
                    <div
                      className={`text-xs truncate max-w-[200px] ${
                        selectedWord === w.word ? 'text-[#C28B38]' : 'text-stone-500'
                      }`}
                    >
                      {w.meanings_tamil.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selectedWord === w.word
                        ? 'bg-[#2A7F62] text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {w.senses_count} பொருள்
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Senses & Examples for Selected Word (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {detailLoading ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E2DBD0] text-center text-stone-500">
              விவரங்கள் ஏற்றப்படுகின்றன...
            </div>
          ) : wordDetail ? (
            <div className="bg-white rounded-2xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-6">
              {/* Header for Selected Word */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E7E1D7]">
                <div>
                  <div className="text-xs font-semibold text-[#2A7F62] uppercase tracking-wider mb-1">
                    களஞ்சியச் சொல் விளக்கம்
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#163828]">
                    {wordDetail.word}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Toggle: Scene Comparison vs List */}
                  <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E7E1D7]">
                    <button
                      type="button"
                      onClick={() => setViewMode('scenes')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'scenes'
                          ? 'bg-[#163828] text-white shadow-sm'
                          : 'text-stone-700 hover:text-[#163828]'
                      }`}
                      title="புகைப்படக் காட்சிகளை அருகருகே ஒப்பிட்டுப் பார்க்க"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>சூழல் காட்சி ஒப்பீடு</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-[#163828] text-white shadow-sm'
                          : 'text-stone-700 hover:text-[#163828]'
                      }`}
                      title="பட்டியல் வடிவில் விரிவாகக் காண"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>பட்டியல் காட்சி</span>
                    </button>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2A7F62]/10 text-[#163828] border border-[#2A7F62]/20">
                    மொத்தப் பொருள்கள்: {wordDetail.total_senses}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onNavigateToAnalyze(
                        wordDetail.word,
                        wordDetail.senses[0]?.sentence || ''
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#163828] text-white text-xs font-bold hover:bg-[#2A7F62] transition-colors cursor-pointer"
                  >
                    <span>வாக்கியத்தில் சோதிக்க</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C28B38]" />
                  </button>
                </div>
              </div>

              {/* Conditional Rendering: Scene Comparison Gallery vs Detailed List */}
              {viewMode === 'scenes' ? (
                <SceneComparison
                  targetWord={wordDetail.word}
                  allSenses={wordDetail.senses}
                  onSelectSense={(s) => onNavigateToAnalyze(wordDetail.word, s.sentence)}
                />
              ) : (
                <div className="space-y-6">
                  {wordDetail.senses.map((sense, index) => (
                    <div
                      key={sense.id}
                      className="p-5 rounded-2xl border border-[#E7E1D7] bg-[#FAF8F5] flex flex-col md:flex-row gap-5 items-start justify-between"
                    >
                    {/* Meaning info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#163828] text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-bold text-[#163828]">
                          {sense.meaning_tamil}
                        </h3>
                      </div>

                      {sense.meaning_english && (
                        <div className="text-xs text-stone-600 italic bg-white px-3 py-1.5 rounded-lg border border-[#E7E1D7] inline-block">
                          <span className="font-semibold text-stone-800 not-italic mr-1">
                            ஆங்கிலப் பொருள்:
                          </span>
                          {sense.meaning_english}
                        </div>
                      )}

                      <p className="text-sm text-stone-700 leading-relaxed">
                        {sense.explanation_tamil}
                      </p>

                      {/* Example sentence */}
                      <div className="p-3 bg-white rounded-xl border border-[#E7E1D7] text-xs">
                        <span className="font-bold text-[#163828] block mb-1">
                          சான்று வாக்கியம்:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="italic text-stone-800 font-medium">
                            “{sense.sentence}”
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onNavigateToAnalyze(wordDetail.word, sense.sentence)
                            }
                            className="text-[11px] font-bold text-[#2A7F62] hover:underline shrink-0"
                          >
                            ஆய்வு செய்
                          </button>
                        </div>
                      </div>

                      {/* Context Clues */}
                      {sense.context_clues && sense.context_clues.length > 0 && (
                        <div className="text-xs text-stone-600 flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-stone-500">சூழல் குறிப்புகள்:</span>
                          {sense.context_clues.slice(0, 5).map((clue, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 rounded bg-stone-200/70 text-stone-800 text-[11px]"
                            >
                              {clue}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Small Sense Illustration on the right */}
                    <div className="w-full md:w-48 shrink-0">
                      <SenseIllustration
                        senseLabel={sense.sense_label}
                        imageMetadata={{
                          alt_text: sense.image_alt_text,
                          prompt: sense.image_prompt,
                          search_url: sense.image_search_url,
                          image_url: sense.image_url,
                          scene_contrast: sense.scene_contrast,
                          has_image: Boolean(sense.image_alt_text || sense.image_url),
                        }}
                        meaningTamil={sense.meaning_tamil}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-[#E2DBD0] text-center text-stone-500">
              சொல்லைத் தேர்ந்தெடுத்து விவரங்களைக் காண்க.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
