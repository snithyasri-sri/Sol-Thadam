import React from 'react';
import { Heart, Compass } from 'lucide-react';
import type { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto bg-[#163828] text-[#FAF8F5] border-t border-[#1B4D36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2A7F62] text-white flex items-center justify-center font-bold text-xl border border-[#C28B38]">
                சொ
              </div>
              <span className="text-xl font-extrabold tracking-wide text-[#FDFBF7]">
                சொல் தடம்
              </span>
            </div>
            <p className="text-sm text-[#E2DBD0] leading-relaxed max-w-md">
              “சொற்களின் பொருளைச் சூழலுடன் அறிந்திடுவோம்!” — ஒரே தமிழ் சொல் பல்வேறு வாக்கியச் சூழல்களில் வேறுபடும் நுட்பமான பொருளை மாணவர்களுக்கும் மொழியியல் ஆர்வலர்களுக்கும் எளிய வடிவில் விளக்கும் தமிழ்க் கல்வித்தளம்.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C28B38] font-medium pt-2">
              <Compass className="w-4 h-4" />
              <span>தமிழ் சூழல் சொல் பொருள் தெளிவு (Tamil Word Sense Disambiguation)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#C28B38] uppercase tracking-wider">
              பக்கங்கள்
            </span>
            <button
              onClick={() => onNavigate('home')}
              className="text-sm text-left text-[#E2DBD0] hover:text-white transition-colors"
            >
              முகப்புப் பக்கம்
            </button>
            <button
              onClick={() => onNavigate('analyze')}
              className="text-sm text-left text-[#E2DBD0] hover:text-white transition-colors"
            >
              பொருள் கண்டறிதல்
            </button>
            <button
              onClick={() => onNavigate('words')}
              className="text-sm text-left text-[#E2DBD0] hover:text-white transition-colors"
            >
              சொற்களின் தொகுப்பு
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="text-sm text-left text-[#E2DBD0] hover:text-white transition-colors"
            >
              பயிற்சி & வினாடி வினா
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-sm text-left text-[#E2DBD0] hover:text-white transition-colors"
            >
              திட்டத்தைப் பற்றி
            </button>
          </div>

          {/* Literary Quote & Technical Integrity */}
          <div className="flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#C28B38] uppercase tracking-wider">
              தொல்காப்பிய நெறி
            </span>
            <div className="p-3 rounded-lg bg-[#1B4D36]/50 border border-[#2A7F62]/40 text-xs text-[#E2DBD0] leading-relaxed italic">
              “எல்லாச் சொல்லும் பொருள் குறித்தனவே”
              <br />
              <span className="text-[11px] text-[#C28B38] block mt-1 not-italic">
                — தொல்காப்பியம், சொல்லதிகாரம் (சூத்திரம் 155)
              </span>
            </div>
            <div className="text-xs text-[#A3B899] pt-1">
              எழுத்துரு: நோட்டோ சான்ஸ் தமிழ் (Noto Sans Tamil)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#1B4D36] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A3B899] gap-4">
          <div className="flex items-center gap-1.5">
            <span>சொல் தடம் (Sol Thadam) கல்வித் திட்டம். தமிழ் மொழிக் கல்விக்கான திறவூற்று முன்முயற்சி.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>அன்புடன் தமிழ் அறிவூட்டலுக்காக உருவாக்கப்பட்டது</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
