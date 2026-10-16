import React from 'react';
import {
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
      {/* Title */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#D5CDBC] text-[#163828] text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-[#2A7F62]" />
          <span>திட்டத்தின் பின்னணி மற்றும் கட்டமைப்பு</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#163828]">
          திட்டத்தைப் பற்றி
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl">
          சொல் தடம் (Sol Thadam) — தமிழ் சூழல் சொல் பொருள் ஆய்வியின் நோக்கம் மற்றும் மொழியியல் அடிப்படைகள்.
        </p>
      </div>

      {/* Section 1: What is contextual word meaning? */}
      <section className="bg-white rounded-2xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#2A7F62] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#163828]">
            1. சூழல் சார் சொல் பொருள் (Contextual Word Meaning) என்றால் என்ன?
          </h2>
        </div>
        <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
          மொழியில் ஒரு சொல் தனித்து நிற்கும் போது அது அகராதியில் பல பொருள்களைக் கொண்டிருக்கலாம். ஆனால், அச்சொல் ஒரு வாக்கியத்தில் இடம்பெறும் போது, அதனுடன் இணையும் பிற சொற்கள், வினைச்சொற்கள் மற்றும் தொடரமைப்பு ஆகியவை அச்சொல்லுக்குரிய ஒரே ஒரு குறிப்பிட்ட பொருளைத் தீர்மானிக்கின்றன. இதனை கணினி மொழியியலில் <strong>சூழல் சொல் பொருள் தெளிவு (Word Sense Disambiguation - WSD)</strong> என்று அழைக்கிறோம்.
        </p>
      </section>

      {/* Section 2: Why do Tamil words have multiple meanings? */}
      <section className="bg-white rounded-2xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#163828] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#163828]">
            2. ஒரே சொல் பல்வேறு பொருள்களைத் தருவது ஏன்?
          </h2>
        </div>
        <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
          தமிழ் செம்மொழியில் நீண்ட இலக்கிய மரபும் வரலாற்று வளர்ச்சியும் உண்டு. தொல்காப்பியம் மற்றும் நன்னூல் போன்ற இலக்கண நூல்கள் இதனை <strong>‘ஒரு பொருள் குறித்த பல சொல்’</strong> மற்றும் <strong>‘பல பொருள் குறித்த ஒரு சொல்’</strong> என வகைப்படுத்துகின்றன:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] text-xs sm:text-sm">
            <span className="font-bold text-[#163828] block mb-1">
              எடுத்துக்காட்டு 1: ‘படி’
            </span>
            <span className="text-stone-600 block mb-1">
              • “நன்றாகப் படி” — படித்தல் (கல்வி)
            </span>
            <span className="text-stone-600 block mb-1">
              • “படியில் ஏறினான்” — படிக்கட்டு (மாடி)
            </span>
            <span className="text-stone-600 block">
              • “சொன்னபடி செய்தேன்” — கூறிய விதத்தில்
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E1D7] text-xs sm:text-sm">
            <span className="font-bold text-[#163828] block mb-1">
              எடுத்துக்காட்டு 2: ‘ஆறு’
            </span>
            <span className="text-stone-600 block mb-1">
              • “ஆற்றில் தண்ணீர் ஓடுகிறது” — நதி
            </span>
            <span className="text-stone-600 block">
              • “ஆறு புத்தகங்கள் உள்ளன” — ஆறு என்ற எண் (6)
            </span>
          </div>
        </div>
      </section>

      {/* Section 3: How the engine works */}
      <section className="bg-white rounded-2xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#C28B38] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#163828]">
            3. தொழில்நுட்ப அமைப்பு மற்றும் பகுப்பாய்வு முறை
          </h2>
        </div>
        <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
          இத்தளம் வெற்று காட்சி வடிவம் (Mockup) அல்ல. பைதான் (FastAPI) பின்தளத்தில் செயல்படும் <strong>சூழல் பகுப்பாய்வு பொறி (Sense Engine)</strong> பின்வரும் வெளிப்படையான மொழியியல் முறைகளைப் பின்பற்றுகிறது:
        </p>
        <ul className="space-y-3 text-sm text-stone-700">
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2A7F62] shrink-0 mt-2" />
            <div>
              <strong>தமிழ் ஒருங்குறிச் சீராக்கம் (Unicode NFC Normalization):</strong> எழுத்துருக் குறியீடுகளை முறைப்படுத்தி துல்லியமான சொல் பகுப்பாய்வு செய்கிறது.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2A7F62] shrink-0 mt-2" />
            <div>
              <strong>வேற்றுமை உருபு மற்றும் சொல் வடிவம் அறிதல்:</strong> படியில், ஆற்றில், அடித்தான் போன்ற தொடரமைப்பு மாற்றங்களை மூலச் சொல்லோடு இணைக்கிறது.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2A7F62] shrink-0 mt-2" />
            <div>
              <strong>சூழல் குறிப்புகள் பொருத்தம் (Context Clues Matching):</strong> வாக்கியத்திலுள்ள ஏனைய சொற்களையும் களஞ்சியக் குறிப்புகளையும் ஒப்பிட்டுப் பொருத்தக் குறியீட்டைத் தீர்மானிக்கிறது.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2A7F62] shrink-0 mt-2" />
            <div>
              <strong>நேர்மையான மதிப்பீடு:</strong> வாக்கியத்தில் போதிய சூழல் குறிப்புகள் இல்லாதபோது, கண்மூடித்தனமாக யூகிக்காமல் “மேலும் சூழல் தேவைப்படலாம்” என வெளிப்படையாகத் தெரிவிக்கிறது.
            </div>
          </li>
        </ul>
      </section>

      {/* Section 4: Educational value and Open Data */}
      <section className="bg-white rounded-2xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#163828]">
            4. நம்பகத்தன்மையும் வெளிப்படைத்தன்மையும்
          </h2>
        </div>
        <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
          இத்திட்டம் உண்மைத்தன்மைக்கு முதலிடம் அளிக்கிறது. இல்லாத தரவுகளையோ, போலியான செயற்கை நுண்ணறிவு துல்லிய சதவீதங்களையோ இது முன்வைக்கவில்லை. பள்ளி மற்றும் கல்லூரி மாணவர்கள் தமிழ் இலக்கணத்தையும் சொல் பொருளையும் எளிய முறையில் கற்றுக்கொள்ள இத்தளம் வடிவமைக்கப்பட்டுள்ளது.
        </p>
      </section>
    </div>
  );
};
