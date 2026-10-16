import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startListening = () => {
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('உங்கள் உலாவியில் குரல் உள்ளீட்டு வசதி கிடைக்கவில்லை (Web Speech API). Chrome அல்லது Edge உலாவியைப் பயன்படுத்தவும்.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ta-IN'; // Tamil (India)
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('ஒலிவாங்கி (Microphone) அனுமதி மறுக்கப்பட்டுள்ளது. உலாவி அமைப்புகளில் அனுமதியை வழங்கவும்.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('குரல் எதுவும் கேட்கவில்லை. மீண்டும் பொத்தானை அழுத்திப் பேசவும்.');
        } else {
          setErrorMessage(`குரல் அறிவதில் சிக்கல் ஏற்பட்டது: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage('குரல் பதிவைத் தொடங்குவதில் பிழை ஏற்பட்டது.');
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={startListening}
        disabled={disabled || isListening}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
          isListening
            ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-400'
            : 'bg-[#FAF8F5] text-[#163828] border border-[#D5CDBC] hover:bg-[#EFE9DF] hover:border-[#163828] active:scale-95'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title="தமிழில் பேசி வாக்கியத்தை உள்ளிடவும்"
        aria-label="பேசித் தேடுங்கள் பொத்தான்"
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-white" />
            <span>கேட்கிறது... தமிழில் பேசவும்</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-[#2A7F62]" />
            <span>பேசித் தேடுங்கள்</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded border border-amber-200 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
