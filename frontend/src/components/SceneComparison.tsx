import { CheckCircle2, ArrowRightLeft, Sparkles } from 'lucide-react';
import type { SenseDetail } from '../types';
import { SenseIllustration } from './SenseIllustration';

interface SceneComparisonProps {
  targetWord: string;
  selectedSenseLabel?: string;
  selectedMeaningTamil?: string;
  allSenses: SenseDetail[];
  onSelectSense?: (sense: SenseDetail) => void;
}

export const SceneComparison: React.FC<SceneComparisonProps> = ({
  targetWord,
  selectedSenseLabel,
  allSenses,
  onSelectSense,
}) => {
  if (!allSenses || allSenses.length <= 1) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E2DBD0] card-shadow p-6 sm:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E1D7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#163828] text-[#C28B38] flex items-center justify-center font-bold shadow-sm">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#2A7F62] uppercase tracking-wider">
              சூழல் காட்சி ஒப்பீடு (Visual Scene Comparison)
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#163828]">
              ‘{targetWord}’ — வெவ்வேறு வாக்கியக் காட்சிகளின் வேறுபாடு
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs text-stone-600 bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#E7E1D7] font-medium self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#C28B38]" />
          <span>{allSenses.length} காட்சி வேறுபாடுகள்</span>
        </div>
      </div>

      {/* Explanatory introduction */}
      <p className="text-sm text-stone-700 leading-relaxed">
        ஒரே சொல்லான ‘{targetWord}’, வெவ்வேறு வாக்கியங்களில் இடம்பெறும் போது முற்றிலும் மாறுபட்ட உண்மை உலகக் காட்சிகளை (Visual Real-world Scenes) உணர்த்துகிறது. கீழ்க்கண்ட புகைப்படக் காட்சிகளை ஒப்பிட்டுப் பாருங்கள்:
      </p>

      {/* Side-by-side Scene Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {allSenses.map((sense, idx) => {
          const isSelected = selectedSenseLabel === sense.sense_label;

          return (
            <div
              key={sense.id || idx}
              onClick={() => onSelectSense && onSelectSense(sense)}
              className={`rounded-2xl border-2 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isSelected
                  ? 'border-[#2A7F62] bg-[#F7FAF8] shadow-md ring-4 ring-[#2A7F62]/10'
                  : 'border-[#E7E1D7] bg-[#FAF8F5] hover:border-[#C28B38] hover:shadow-sm'
              }`}
            >
              {/* Top Scene Photo / Illustration */}
              <div className="p-3">
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
                  compact={false}
                />
              </div>

              {/* Scene Details */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                      காட்சி {idx + 1}
                    </span>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>இவ்வாக்கியத்திற்குரிய காட்சி</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        மாற்றுச் சூழல் காட்சி
                      </span>
                    )}
                  </div>

                  {/* Meaning Header */}
                  <div className="text-lg font-bold text-[#163828] mb-1">
                    {sense.meaning_tamil}
                  </div>
                  {sense.meaning_english && (
                    <div className="text-xs text-stone-500 italic mb-2">
                      {sense.meaning_english}
                    </div>
                  )}

                  {/* Contrast description */}
                  {sense.scene_contrast && (
                    <div className="p-2.5 rounded-xl bg-white border border-[#E7E1D7] text-xs text-stone-700 leading-relaxed mb-3">
                      <span className="font-semibold text-[#163828] block text-[11px] mb-0.5">
                        நேரடிக் காட்சி விளக்கம்:
                      </span>
                      {sense.scene_contrast}
                    </div>
                  )}

                  {/* Canonical Sentence */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#E7E1D7] text-xs">
                    <span className="text-[11px] font-bold text-stone-500 block mb-0.5">
                      மாதிரி வாக்கியம்:
                    </span>
                    <span className="font-medium text-[#163828] italic">
                      “{sense.sentence}”
                    </span>
                  </div>
                </div>

                {/* Context Clues triggering this scene */}
                {sense.context_clues && sense.context_clues.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE4D7] text-[11px] text-stone-600">
                    <span className="font-semibold text-stone-500 block mb-1">
                      இக்காட்சியை உறுதிப்படுத்தும் குறிப்புகள்:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sense.context_clues.slice(0, 4).map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded bg-stone-200/60 text-stone-800 text-[10px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
