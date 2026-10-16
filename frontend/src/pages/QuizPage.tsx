import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { apiService } from '../services/api';
import type { QuizQuestion } from '../types';

export const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setErrorMessage(null);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCompleted(false);

    try {
      const data = await apiService.getQuizQuestions(8);
      if (data.length === 0) {
        setErrorMessage('பயிற்சி வினாக்களை உருவாக்கப் போதுமான பல பொருள் கொண்ட சொற்கள் கிடைக்கவில்லை.');
      } else {
        setQuestions(data);
      }
    } catch (err: any) {
      setErrorMessage(err.tamilMessage || 'வினாக்களை ஏற்றுவதில் பிழை ஏற்பட்டது.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (senseLabel: string) => {
    if (isAnswered) return;
    setSelectedOption(senseLabel);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    if (senseLabel === currentQ.correct_sense_label) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-stone-600">
        <div className="w-8 h-8 border-4 border-[#163828] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <span>பயிற்சி வினாக்கள் தயாராகின்றன...</span>
      </div>
    );
  }

  if (errorMessage || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-6 bg-white rounded-2xl border border-rose-200 text-rose-800">
          <HelpCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">வினாக்கள் கிடைக்கவில்லை</h2>
          <p className="text-sm text-stone-600 mb-6">{errorMessage}</p>
          <button
            onClick={loadQuestions}
            className="px-5 py-2.5 rounded-xl bg-[#163828] text-white text-sm font-bold"
          >
            மீண்டும் முயற்சிக்கவும்
          </button>
        </div>
      </div>
    );
  }

  // Quiz Completed View
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#E2DBD0] card-shadow p-8 text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#163828] text-[#C28B38] flex items-center justify-center font-bold shadow-lg">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#2A7F62] uppercase tracking-wider">
              வாழ்த்துகள்!
            </span>
            <h2 className="text-3xl font-extrabold text-[#163828] mt-1">
              பயிற்சி நிறைவுற்றது!
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D7] w-full flex flex-col items-center gap-2">
            <div className="text-sm text-stone-600">உங்கள் இறுதி மதிப்பெண்:</div>
            <div className="text-4xl font-extrabold text-[#163828]">
              {score} / {questions.length}
            </div>
            <div className="text-xs font-semibold text-[#2A7F62]">
              வெற்றி விகிதம்: {percentage}%
            </div>
          </div>

          <p className="text-sm text-stone-600 max-w-sm">
            {percentage >= 75
              ? 'அருமை! சூழலுக்கு ஏற்ப தமிழ்ச் சொற்களின் சரியான பொருளைத் தெளிவாக உணர்ந்துள்ளீர்கள்.'
              : 'நன்று! மேலும் மாதிரி வாக்கியங்களைப் பகுப்பாய்வு செய்து சொல் பொருள் வேறுபாடுகளைத் தெளிவாகப் பயிலுங்கள்.'}
          </p>

          <button
            type="button"
            onClick={loadQuestions}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#163828] text-white font-bold text-sm shadow hover:bg-[#2A7F62] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#C28B38]" />
            <span>மீண்டும் பயிற்சி செய்</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedOption === currentQ.correct_sense_label;

  // Highlight target word in question sentence
  const renderHighlightedSentence = (sent: string, target: string) => {
    const parts = sent.split(new RegExp(`(${target})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === target.toLowerCase() ? (
        <span
          key={i}
          className="bg-[#C28B38]/20 text-[#163828] font-bold px-1.5 py-0.5 rounded border-b-2 border-[#C28B38]"
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#2A7F62]" />
          <span className="text-sm font-bold text-[#163828]">
            சொல் பொருள் பயிற்சி
          </span>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E1D7] text-stone-700">
          வினா {currentIndex + 1} / {questions.length} • மதிப்பெண்: {score}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EAE4D7] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#2A7F62] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            வாக்கியம்:
          </div>
          <div className="text-xl sm:text-2xl font-medium text-stone-900 leading-relaxed p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D7]">
            “{renderHighlightedSentence(currentQ.sentence, currentQ.target_form || currentQ.target_word)}”
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-[#163828] mb-3">
            இவ்வாக்கியத்தில் ‘{currentQ.target_word}’ என்ற சொல்லின் சரியான பொருள் எது?
          </div>

          {/* Multiple choice options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isThisSelected = selectedOption === opt.sense_label;
              const isThisCorrect = opt.sense_label === currentQ.correct_sense_label;

              let btnStyle = 'bg-[#FAF8F5] border-[#E7E1D7] text-stone-800 hover:border-[#2A7F62]';

              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                } else if (isThisSelected && !isThisCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt.sense_label}
                  type="button"
                  onClick={() => handleSelectOption(opt.sense_label)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div>
                    <div className="text-base font-bold">{opt.meaning_tamil}</div>
                    {opt.meaning_english && (
                      <div className="text-xs text-stone-500 italic">
                        {opt.meaning_english}
                      </div>
                    )}
                  </div>

                  {isAnswered && isThisCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isThisSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Immediate Feedback Explanation */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-sm flex flex-col gap-2 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>சரியான விடை! வாழ்த்துகள்!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span>தவறான விடை. சரியான பொருள்: {currentQ.correct_meaning_tamil}</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-stone-700">
              {currentQ.explanation_tamil}
            </p>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#163828] text-white font-bold text-sm shadow hover:bg-[#2A7F62] active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentIndex + 1 === questions.length ? 'முடிவுகளைக் காண்க' : 'அடுத்த வினா'}</span>
              <ArrowRight className="w-4 h-4 text-[#C28B38]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
