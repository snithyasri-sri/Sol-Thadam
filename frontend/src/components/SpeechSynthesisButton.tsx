import React, { useState } from 'react';
import { Volume2, VolumeX, AlertCircle } from 'lucide-react';

interface SpeechSynthesisButtonProps {
  textToSpeak: string;
}

export const SpeechSynthesisButton: React.FC<SpeechSynthesisButtonProps> = ({ textToSpeak }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const speakText = () => {
    setInfoMessage(null);

    if (!('speechSynthesis' in window)) {
      setInfoMessage('உங்கள் உலாவியில் குரல் வாசிப்பு வசதி (Speech Synthesis) கிடைக்கவில்லை.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.9; // Slightly slower for clear Tamil articulation

    // Look for a Tamil voice
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(
      (v) => v.lang.toLowerCase().includes('ta') || v.lang.toLowerCase().includes('tamil')
    );

    if (tamilVoice) {
      utterance.voice = tamilVoice;
    } else {
      // Browser will attempt default matching, but notify user
      setInfoMessage('குறிப்பு: உங்கள் கணினியில் பிரத்யேக தமிழ் குரல் (Tamil Voice Pack) நிறுவப்படவில்லை எனில் உச்சரிப்பு இயல்பு குரலில் ஒலிக்கும்.');
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setInfoMessage('குரல் வாசிப்பில் தற்காலிகத் தடை ஏற்பட்டது.');
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={speakText}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
          isPlaying
            ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
            : 'bg-[#EAE4D7] text-[#163828] hover:bg-[#DED6C7] active:scale-95'
        }`}
        title="விளக்கத்தை ஒலியாகக் கேட்க"
        aria-label="விளக்கத்தைக் கேளுங்கள்"
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-white" />
            <span>நிறுத்துங்கள்</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#163828]" />
            <span>விளக்கத்தைக் கேளுங்கள்</span>
          </>
        )}
      </button>

      {infoMessage && (
        <div className="flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200 mt-0.5">
          <AlertCircle className="w-3 h-3 shrink-0 text-stone-500" />
          <span>{infoMessage}</span>
        </div>
      )}
    </div>
  );
};
