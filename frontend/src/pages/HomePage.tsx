import React from 'react';
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import type { ActivePage } from '../types';

interface HomePageProps {
  onNavigate: (page: ActivePage, params?: { word?: string; sentence?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Sample ambiguous words showcase
  const sampleWords = [
    {
      word: 'படி',
      meanings: ['படித்தல் (கல்வி)', 'படிக்கட்டு (மாடி)', 'கூறிய விதத்தில் (முறை)'],
      example: 'நன்றாகப் படி.',
    },
    {
      word: 'ஆறு',
      meanings: ['நதி (நீர்நிலை)', 'ஆறு என்ற எண் (6)'],
      example: 'ஆற்றில் தண்ணீர் ஓடுகிறது.',
    },
    {
      word: 'மாலை',
      meanings: ['பூமாலை (மலர்)', 'மாலை நேரம் (அந்திப்பொழுது)'],
      example: 'அவள் பூ மாலை அணிந்தாள்.',
    },
    {
      word: 'பால்',
      meanings: ['பால் என்ற உணவு (திரவம்)', 'ஒரு பக்கம் அல்லது சார்பு (பகுதி)'],
      example: 'குழந்தை பசும்பால் குடித்தது.',
    },
    {
      word: 'அடி',
      meanings: ['பாதத்தின் கீழ்ப்பகுதி', 'அடித்தல் (தாக்குதல்)', 'அளவுக்கான அலகு (Foot)'],
      example: 'இந்த அறையின் நீளம் பத்து அடி.',
    },
    {
      word: 'திங்கள்',
      meanings: ['சந்திரன் / நிலா', 'திங்கள் கிழமை', 'தைத்திங்கள் (மாதம்)'],
      example: 'வானில் முழுத் திங்கள் ஒளி வீசியது.',
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9DF] border border-[#D5CDBC] text-[#163828] text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-[#C28B38]" />
          <span>தமிழ் சூழல் சொல் பொருள் ஆய்வி</span>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-[#2A7F62] font-semibold tracking-wide mb-3">
          “சொற்களின் பொருளைச் சூழலுடன் அறிந்திடுவோம்!”
        </p>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#163828] tracking-tight leading-tight mb-6">
          ஒரு சொல்லின் உண்மையான பொருளைக் கண்டறியுங்கள்
        </h1>

        {/* Short explanation */}
        <p className="text-base sm:text-xl text-stone-700 leading-relaxed max-w-2xl mb-8">
          தமிழில் ஒரே சொல் பல இடங்களில் வெவ்வேறு பொருள்களைத் தரும் ஆற்றல் கொண்டது. வாக்கியத்தின் சூழலையும் துணைச் சொற்களையும் பகுப்பாய்வு செய்து, அச்சொல்லுக்குரிய சரியான பொருளை எளிதாகக் கண்டறியும் தமிழ்க் கல்வி தளம்.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#163828] text-white text-base font-bold shadow-md hover:bg-[#2A7F62] active:scale-95 transition-all cursor-pointer"
          >
            <span>சொல்லின் பொருளைக் கண்டறி</span>
            <ArrowRight className="w-5 h-5 text-[#C28B38]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('quiz')}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-[#163828] border-2 border-[#163828] text-base font-bold hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-[#2A7F62]" />
            <span>பயிற்சி தொடங்கு</span>
          </button>
        </div>
      </section>

      {/* How it works section */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#163828] mb-2">
            எவ்வாறு செயல்படுகிறது?
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            மூன்று எளிய படிகளில் சொல்லின் சூழல்சார் பொருள் விளக்கம்
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D7] card-shadow flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#D5CDBC] text-[#163828] flex items-center justify-center font-extrabold text-lg">
              க
            </div>
            <h3 className="text-lg font-bold text-[#163828]">
              1. வாக்கியத்தை உள்ளிடுங்கள்
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              பொருள் அறிய விரும்பும் தமிழ் வாக்கியத்தை எழுதுங்கள் அல்லது பேசிப் பதிவு செய்யுங்கள்; அல்லது மாதிரி வாக்கியங்களைத் தேர்ந்தெடுக்கலாம்.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D7] card-shadow flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#D5CDBC] text-[#2A7F62] flex items-center justify-center font-extrabold text-lg">
              உ
            </div>
            <h3 className="text-lg font-bold text-[#163828]">
              2. சூழலை ஆராயுங்கள்
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              அமைப்பில் உள்ள சூழல் பகுப்பாய்வு பொறி, வாக்கியத்திலுள்ள துணைச் சொற்கள் மற்றும் இலக்கண வடிவங்களை ஆய்வு செய்கிறது.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E1D7] card-shadow flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#D5CDBC] text-[#C28B38] flex items-center justify-center font-extrabold text-lg">
              ௩
            </div>
            <h3 className="text-lg font-bold text-[#163828]">
              3. தெளிவான விளக்கம் பெறுங்கள்
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              அச்சூழலுக்குரிய சரியான பொருள், எளிய விளக்கம், பொருத்தக் குறியீடு, ஓவிய விளக்கம் மற்றும் பிற சாத்தியக் கூறுகளையும் அறிந்து கொள்ளுங்கள்.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Ambiguous Words Showcase */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#163828] mb-2">
              பல பொருள் தரும் தமிழ் சொற்கள்
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              கீழ்க்கண்ட சொற்களை அழுத்தி உடனடியாகப் பகுப்பாய்வு செய்து பாருங்கள்
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('words')}
            className="text-sm font-bold text-[#2A7F62] hover:text-[#163828] flex items-center gap-1 cursor-pointer"
          >
            <span>அனைத்துச் சொற்களையும் காண்க</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleWords.map((item, index) => (
            <div
              key={index}
              onClick={() => onNavigate('analyze', { word: item.word, sentence: item.example })}
              className="bg-white p-5 rounded-2xl border border-[#E7E1D7] card-shadow card-hover cursor-pointer flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-[#163828]">{item.word}</span>
                  <span className="text-xs bg-[#FAF8F5] text-[#2A7F62] font-semibold px-2.5 py-1 rounded-full border border-[#E7E1D7]">
                    {item.meanings.length} பொருள்கள்
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {item.meanings.map((meaning, mIdx) => (
                    <div key={mIdx} className="flex items-center gap-2 text-xs text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C28B38] shrink-0" />
                      <span>{meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs">
                <span className="text-stone-500 italic truncate max-w-[190px]">
                  சான்று: “{item.example}”
                </span>
                <span className="text-[#2A7F62] font-bold flex items-center gap-1 shrink-0">
                  ஆராய்க <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Banner */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="bg-[#163828] text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl z-10">
            <div className="text-xs font-bold text-[#C28B38] tracking-wider uppercase mb-2">
              கற்றல் வாய்ப்பு
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-[#FDFBF7]">
              உங்கள் தமிழ் சொல்லறிவைச் சோதித்துப் பார்க்க விருப்பமா?
            </h3>
            <p className="text-sm text-[#E2DBD0] leading-relaxed">
              வாக்கியங்களில் இடம்பெறும் சொற்களின் உண்மைப் பொருளைக் கண்டறியும் சுவாரசியமான வினாடி வினாப் பயிற்சியில் பங்கேற்கவும்.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('quiz')}
            className="z-10 shrink-0 px-6 py-3.5 rounded-xl bg-[#C28B38] text-white font-bold text-sm shadow hover:bg-[#D97706] active:scale-95 transition-all cursor-pointer"
          >
            வினாடி வினா தொடங்க
          </button>
        </div>
      </section>
    </div>
  );
};
