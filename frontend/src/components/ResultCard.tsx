import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  Quote,
} from 'lucide-react';
import type { AnalyzeResponse } from '../types';
import { SenseIllustration } from './SenseIllustration';
import { SpeechSynthesisButton } from './SpeechSynthesisButton';

interface ResultCardProps {
  result: AnalyzeResponse;
  onSelectAlternative?: (altWord: string, altMeaning: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const {
    sentence,
    target_word,
    matched_form,
    selected_meaning_tamil,
    selected_meaning_english,
    explanation_tamil,
    example_sentence,
    alternatives,
    score,
    score_type,
    reasoning_basis,
    image_metadata,
    warning,
    detected_clues,
  } = result;

  // Text for Speech synthesis
  const speechText = `${target_word}. சூழல் பொருள்: ${selected_meaning_tamil}. ${explanation_tamil}.`;

  // Highlight target word in the user's sentence
  const renderHighlightedSentence = () => {
    const wordToHighlight = matched_form || target_word;
    const parts = sentence.split(new RegExp(`(${wordToHighlight})`, 'gi'));

    return (
      <span className="text-lg leading-relaxed text-[#1F2E24]">
        {parts.map((part, index) =>
          part.toLowerCase() === wordToHighlight.toLowerCase() ? (
            <span
              key={index}
              className="bg-[#C28B38]/20 text-[#163828] font-bold px-1.5 py-0.5 rounded border-b-2 border-[#C28B38]"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E2DBD0] card-shadow overflow-hidden transition-all animate-fadeIn">
      {/* Top Banner / Header */}
      <div className="bg-[#163828] text-[#FAF8F5] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A7F62] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#C28B38] tracking-wider uppercase">
              பகுப்பாய்வு முடிவு
            </div>
            <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <span>இலக்குச் சொல்:</span>
              <span className="text-[#FDFBF7] underline decoration-[#C28B38] decoration-2 underline-offset-4">
                {target_word}
              </span>
              {matched_form && matched_form !== target_word && (
                <span className="text-xs bg-[#2A7F62]/60 text-white font-normal px-2 py-0.5 rounded-full">
                  வடிவம்: {matched_form}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Speech audio button */}
        <SpeechSynthesisButton textToSpeak={speechText} />
      </div>

      {/* Warning Alert if context evidence is scarce */}
      {warning && (
        <div className="mx-6 mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold block mb-0.5">சூழல் தெளிவின்மை எச்சரிக்கை:</span>
            <span>{warning}</span>
          </div>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Selected Meaning & Reasoning */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Sentence Quote */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] flex items-start gap-3">
            <Quote className="w-5 h-5 text-[#2A7F62] shrink-0 mt-1" />
            <div>
              <div className="text-xs text-stone-500 font-medium mb-1">
                நீங்கள் அளித்த வாக்கியம்:
              </div>
              <div>{renderHighlightedSentence()}</div>
            </div>
          </div>

          {/* Primary Meaning Highlight Box */}
          <div className="p-5 rounded-xl bg-[#FAF8F5] border-2 border-[#2A7F62]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2A7F62] uppercase tracking-wide bg-[#2A7F62]/10 px-2.5 py-1 rounded-full">
                சூழலுக்குப் பொருத்தமான பொருள்
              </span>
              {score !== null && score !== undefined && (
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800"
                  title={score_type}
                >
                  பொருத்தக் குறியீடு: {score} / 1.0
                </span>
              )}
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-[#163828]">
              {selected_meaning_tamil}
            </div>

            {selected_meaning_english && (
              <div className="flex items-baseline gap-2 text-sm text-stone-700 bg-white px-3 py-2 rounded-lg border border-[#E7E1D7]">
                <span className="font-bold text-[#163828] shrink-0 text-xs uppercase tracking-wider">
                  ஆங்கிலப் பொருள்:
                </span>
                <span className="italic">{selected_meaning_english}</span>
              </div>
            )}

            <div className="text-sm sm:text-base text-stone-800 leading-relaxed pt-1">
              {explanation_tamil}
            </div>
          </div>

          {/* Detected Context Clues */}
          {detected_clues && detected_clues.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#E7E1D7]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#163828] mb-2">
                <Sparkles className="w-4 h-4 text-[#C28B38]" />
                <span>கண்டறியப்பட்ட சூழல் குறிப்புச் சொற்கள்:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detected_clues.map((clue, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 bg-[#2A7F62]/10 text-[#163828] rounded-full border border-[#2A7F62]/20"
                  >
                    ‘{clue}’
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning Basis */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E1D7] flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#2A7F62] shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-[#163828] block mb-1">
                முடிவுக்கான காரண விளக்கம்:
              </span>
              <p className="text-stone-700 leading-relaxed">{reasoning_basis}</p>
              <div className="text-[11px] text-stone-400 mt-2">
                மதிப்பீட்டு முறைமை: {score_type}
              </div>
            </div>
          </div>

          {/* Canonical Example from Dataset */}
          {example_sentence && (
            <div className="p-4 rounded-xl bg-white border border-[#E7E1D7] flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#C28B38] shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-[#163828] block mb-1">
                  களஞ்சியச் சான்று வாக்கியம்:
                </span>
                <p className="text-stone-700 italic">“{example_sentence}”</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Illustration & Alternatives */}
        <div className="flex flex-col gap-5">
          {/* Educational Sense Illustration */}
          <SenseIllustration
            senseLabel={result.alternatives[0]?.sense_label || 'DEFAULT'}
            imageMetadata={image_metadata}
            meaningTamil={selected_meaning_tamil}
          />

          {/* Alternatives Card */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E1D7] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#163828]">
              <Layers className="w-4 h-4 text-[#2A7F62]" />
              <span>இச்சொல்லின் பிற சாத்தியமான பொருள்கள்</span>
            </div>

            {alternatives && alternatives.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 bg-white rounded-lg border border-[#E7E1D7] hover:border-[#2A7F62] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#163828] mb-1">
                      <span>{alt.meaning_tamil}</span>
                      {alt.score !== undefined && alt.score !== null && (
                        <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                          மதிப்பெண்: {alt.score}
                        </span>
                      )}
                    </div>
                    {alt.meaning_english && (
                      <div className="text-[11px] text-stone-500 italic mb-1">
                        {alt.meaning_english}
                      </div>
                    )}
                    <div className="text-xs text-stone-600 line-clamp-2">
                      சான்று: “{alt.sentence}”
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-stone-500 py-2">
                இச்சொல்லுக்குக் களஞ்சியத்தில் பதிவு செய்யப்பட்ட பிற மாற்றுப் பொருள்கள் இல்லை.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
