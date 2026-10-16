import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { apiService, ApiError } from '../services/api';
import type { AnalyzeResponse } from '../types';
import { VoiceInput } from '../components/VoiceInput';
import { ResultCard } from '../components/ResultCard';
import { SceneComparison } from '../components/SceneComparison';

interface AnalyzePageProps {
  initialWord?: string;
  initialSentence?: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  initialWord = '',
  initialSentence = '',
}) => {
  const [sentence, setSentence] = useState(initialSentence);
  const [targetWord, setTargetWord] = useState(initialWord);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preset example sentences
  const exampleSentences = [
    { sentence: 'நன்றாகப் படி.', word: 'படி', note: 'படித்தல்' },
    { sentence: 'அவன் படியில் ஏறினான்.', word: 'படி', note: 'படிக்கட்டு' },
    { sentence: 'அவள் சொன்னபடி செய்தேன்.', word: 'படி', note: 'கூறிய விதத்தில்' },
    { sentence: 'ஆற்றில் தண்ணீர் ஓடுகிறது.', word: 'ஆறு', note: 'நதி' },
    { sentence: 'என்னிடம் ஆறு புத்தகங்கள் உள்ளன.', word: 'ஆறு', note: 'ஆறு என்ற எண்' },
    { sentence: 'அவள் பூ மாலை அணிந்தாள்.', word: 'மாலை', note: 'பூமாலை' },
    { sentence: 'மாலை நேரத்தில் விளையாடினோம்.', word: 'மாலை', note: 'மாலை நேரம்' },
    { sentence: 'குழந்தை பசும்பால் குடித்தது.', word: 'பால்', note: 'உணவு' },
    { sentence: 'நீதிபதி நடுநிலையோடு தீர்ப்பு கூறினார், எந்தப் பாலும் சாயவில்லை.', word: 'பால்', note: 'பக்கம் / சார்பு' },
    { sentence: 'அவனுடைய பாதத்தின் அடியில் காயம் ஏற்பட்டது.', word: 'அடி', note: 'பாதத்தின் கீழ்ப்பகுதி' },
    { sentence: 'அவன் பந்தை வேகமாக அடித்தான்.', word: 'அடி', note: 'அடித்தல்' },
    { sentence: 'இந்த அறையின் நீளம் பத்து அடி.', word: 'அடி', note: 'அளவு அலகு' },
  ];

  // If initial props are passed (e.g. from homepage), update state and analyze
  useEffect(() => {
    if (initialSentence) {
      setSentence(initialSentence);
    }
    if (initialWord) {
      setTargetWord(initialWord);
    }
    if (initialSentence && initialWord) {
      handleAnalyze(initialSentence, initialWord);
    }
  }, [initialSentence, initialWord]);

  // Extract clickable word tokens from sentence
  const sentenceTokens = sentence
    .replace(/[^\w\s\u0B80-\u0BFF]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.trim().length > 0);

  const handleSelectExample = (exSentence: string, exWord: string) => {
    setSentence(exSentence);
    setTargetWord(exWord);
    setErrorMessage(null);
    handleAnalyze(exSentence, exWord);
  };

  const handleReset = () => {
    setSentence('');
    setTargetWord('');
    setResult(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async (sentToAnalyze = sentence, wordToAnalyze = targetWord) => {
    const s = sentToAnalyze.trim();
    const w = wordToAnalyze.trim();

    setErrorMessage(null);

    // Validation
    if (!s) {
      setErrorMessage('தயவுசெய்து தமிழ் வாக்கியத்தை உள்ளிடுங்கள்.');
      return;
    }
    if (!w) {
      setErrorMessage('தயவுசெய்து பொருள் காண வேண்டிய சொல்லை உள்ளிடுங்கள் அல்லது கீழே உள்ள சொல்லில் ஒன்றை அழுத்துங்கள்.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await apiService.analyze(s, w);
      if (!response.success) {
        setErrorMessage(response.explanation_tamil || response.warning || 'பகுப்பாய்வு தோல்வியடைந்தது.');
      } else {
        setResult(response);
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMessage(err.tamilMessage);
      } else {
        setErrorMessage('சேவையகத்துடன் இணைப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Page Title & Subtitle */}
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163828]">
          பொருள் கண்டறிதல்
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl">
          நீங்கள் வழங்கும் வாக்கியத்தின் சூழலைக் கொண்டு, அச்சொல்லுக்குரிய சரியான பொருளைப் பகுப்பாய்வு செய்து கண்டறியவும்.
        </p>
      </div>

      {/* Preset Example Sentences Dropdown/Carousel */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7E1D7] flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#163828]">
          <BookOpen className="w-4 h-4 text-[#2A7F62]" />
          <span>மாதிரி வாக்கியங்களைத் தேர்ந்தெடுக்கலாம்:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {exampleSentences.slice(0, 6).map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(ex.sentence, ex.word)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-[#E7E1D7] text-[#163828] hover:border-[#2A7F62] hover:bg-[#FAF8F5] transition-all text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span className="font-bold text-[#2A7F62]">{ex.word}:</span>
              <span>“{ex.sentence}”</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAnalyze();
        }}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2DBD0] card-shadow flex flex-col gap-6"
      >
        {/* 1. Sentence Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="sentence-input"
              className="text-sm font-bold text-[#163828] flex items-center gap-1.5"
            >
              <span>தமிழ் வாக்கியத்தை உள்ளிடுங்கள்</span>
              <span className="text-rose-500">*</span>
            </label>

            {/* Voice input button */}
            <VoiceInput
              onTranscript={(transcript) => {
                setSentence(transcript);
                setErrorMessage(null);
              }}
              disabled={loading}
            />
          </div>

          <textarea
            id="sentence-input"
            rows={3}
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="எடுத்துக்காட்டு: அவன் படியில் ஏறினான். அல்லது ஆற்றில் தண்ணீர் ஓடுகிறது."
            className="w-full px-4 py-3 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-stone-900 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7F62] focus:border-transparent transition-all placeholder:text-stone-400"
          />

          {/* Quick Word Selector from Sentence Tokens */}
          {sentenceTokens.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-500">
                வாக்கியத்திலிருந்து சொல்லைத் தேர்ந்தெடுக்கவும்:
              </span>
              {sentenceTokens.map((tok, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTargetWord(tok);
                    setErrorMessage(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    targetWord === tok
                      ? 'bg-[#163828] text-white border-[#163828] font-bold'
                      : 'bg-[#F4EFEA] text-[#163828] border-[#E7E1D7] hover:border-[#2A7F62]'
                  }`}
                >
                  {tok}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Target Word Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="target-word-input"
            className="text-sm font-bold text-[#163828] flex items-center gap-1.5"
          >
            <span>பொருள் காண வேண்டிய சொல்</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="target-word-input"
              type="text"
              value={targetWord}
              onChange={(e) => {
                setTargetWord(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="எடுத்துக்காட்டு: படி, ஆறு, மாலை, பால், அடி..."
              className="w-full px-4 py-3 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-stone-900 text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A7F62] focus:border-transparent transition-all placeholder:text-stone-400"
            />
          </div>
          <span className="text-xs text-stone-500">
            குறிப்பு: வாக்கியத்தில் உள்ள அதே சொல்லையோ அல்லது அதன் மூலச் சொல்லையோ (படி, ஆறு, மாலை...) குறிப்பிடலாம்.
          </span>
        </div>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">கவனிக்க:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#163828] text-white font-bold text-base shadow-sm hover:bg-[#2A7F62] active:scale-95 transition-all cursor-pointer ${
              loading ? 'opacity-60 cursor-wait' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>பகுப்பாய்வு செய்யப்படுகிறது...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 text-[#C28B38]" />
                <span>பொருளைக் கண்டறி</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5] transition-colors text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>மீண்டும் தொடங்கு</span>
          </button>
        </div>
      </form>

      {/* Result Display Section (Page C) */}
      {result && (
        <section className="pt-2 flex flex-col gap-8">
          <ResultCard result={result} />

          {/* Contextual Scene Comparison Section */}
          {result.alternatives && result.alternatives.length > 0 && (
            <SceneComparison
              targetWord={result.target_word}
              selectedSenseLabel="SELECTED_PRIMARY_SENSE"
              selectedMeaningTamil={result.selected_meaning_tamil}
              allSenses={[
                {
                  id: 0,
                  target_word: result.target_word,
                  target_form: result.matched_form || result.target_word,
                  sense_label: 'SELECTED_PRIMARY_SENSE',
                  meaning_tamil: result.selected_meaning_tamil,
                  meaning_english: result.selected_meaning_english,
                  explanation_tamil: result.explanation_tamil,
                  sentence: result.example_sentence,
                  context_clues: result.detected_clues,
                  image_alt_text: result.image_metadata?.alt_text,
                  image_prompt: result.image_metadata?.prompt,
                  image_search_url: result.image_metadata?.search_url,
                  image_url: result.image_metadata?.image_url,
                  scene_contrast: result.image_metadata?.scene_contrast,
                  score: result.score,
                },
                ...result.alternatives,
              ]}
            />
          )}
        </section>
      )}
    </div>
  );
};
