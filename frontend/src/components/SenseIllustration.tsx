import React, { useState } from 'react';
import { ExternalLink, Image as ImageIcon, Camera, Palette } from 'lucide-react';
import type { ImageMetadata } from '../types';

interface SenseIllustrationProps {
  senseLabel: string;
  imageMetadata?: ImageMetadata | null;
  meaningTamil: string;
  compact?: boolean;
}

export const SenseIllustration: React.FC<SenseIllustrationProps> = ({
  senseLabel,
  imageMetadata,
  meaningTamil,
  compact = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | 'vector'>('photo');

  const photoUrl = imageMetadata?.image_url;
  const canShowPhoto = photoUrl && !imgError;

  // Render thematic educational vector illustration based on senseLabel
  const renderSenseSvg = () => {
    switch (senseLabel) {
      case 'PADI_STUDY':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <path d="M40 95 L100 85 L160 95 L155 45 L100 38 L45 45 Z" fill="#FFFFFF" stroke="#163828" strokeWidth="2.5" />
            <path d="M100 38 L100 85" stroke="#163828" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="55" y1="55" x2="90" y2="52" stroke="#2A7F62" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="65" x2="88" y2="62" stroke="#2A7F62" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="75" x2="82" y2="72" stroke="#2A7F62" strokeWidth="2" strokeLinecap="round" />
            <line x1="110" y1="52" x2="145" y2="55" stroke="#2A7F62" strokeWidth="2" strokeLinecap="round" />
            <line x1="110" y1="62" x2="145" y2="65" stroke="#2A7F62" strokeWidth="2" strokeLinecap="round" />
            <line x1="110" y1="72" x2="138" y2="75" stroke="#2A7F62" strokeWidth="2" strokeLinecap="round" />
            <circle cx="100" cy="22" r="14" fill="#F59E0B" fillOpacity="0.2" />
            <circle cx="100" cy="22" r="6" fill="#D97706" />
          </svg>
        );

      case 'PADI_STAIR':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <path d="M30 115 H65 V95 H100 V75 H135 V55 H170 V35" stroke="#163828" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 115 V125 H170 V35" stroke="#2A7F62" strokeWidth="1.5" strokeDasharray="4 4" fill="#E8DFD3" fillOpacity="0.4" />
            <path d="M55 70 L95 35 M95 35 H75 M95 35 V55" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'PADI_MANNER':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <rect x="50" y="30" width="100" height="80" rx="8" fill="#FFFFFF" stroke="#163828" strokeWidth="2" />
            <circle cx="68" cy="50" r="5" fill="#2A7F62" />
            <line x1="82" y1="50" x2="135" y2="50" stroke="#163828" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="68" cy="70" r="5" fill="#2A7F62" />
            <line x1="82" y1="70" x2="130" y2="70" stroke="#163828" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="68" cy="90" r="5" fill="#2A7F62" />
            <line x1="82" y1="90" x2="120" y2="90" stroke="#163828" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'AARU_RIVER':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#E8F4F0" />
            <path d="M20 50 Q60 30 100 65 T180 50" stroke="#163828" strokeWidth="3" fill="none" />
            <path d="M20 75 Q60 55 100 90 T180 75" stroke="#2A7F62" strokeWidth="4" fill="none" />
            <path d="M20 100 Q60 80 100 115 T180 100" stroke="#0D9488" strokeWidth="3" fill="none" />
            <path d="M125 55 L155 55 L145 65 L130 65 Z" fill="#B45309" stroke="#163828" strokeWidth="1.5" />
            <path d="M140 40 V55 M140 40 L152 48 H140" stroke="#163828" strokeWidth="1.5" fill="#D97706" />
          </svg>
        );

      case 'AARU_NUM6':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <text x="70" y="85" fontFamily="system-ui, sans-serif" fontSize="56" fontWeight="bold" fill="#163828">6</text>
            <circle cx="130" cy="45" r="7" fill="#2A7F62" />
            <circle cx="150" cy="45" r="7" fill="#2A7F62" />
            <circle cx="130" cy="70" r="7" fill="#2A7F62" />
            <circle cx="150" cy="70" r="7" fill="#2A7F62" />
            <circle cx="130" cy="95" r="7" fill="#2A7F62" />
            <circle cx="150" cy="95" r="7" fill="#2A7F62" />
          </svg>
        );

      case 'MAALAI_GARLAND':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <path d="M45 40 Q100 130 155 40" stroke="#2A7F62" strokeWidth="3" fill="none" />
            {[
              [50, 48], [62, 65], [78, 85], [100, 95], [122, 85], [138, 65], [150, 48]
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={8} fill={i % 2 === 0 ? "#E11D48" : "#F59E0B"} />
                <circle cx={cx} cy={cy} r={3} fill="#FFFFFF" />
              </g>
            ))}
          </svg>
        );

      case 'MAALAI_EVENING':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#FEF3C7" />
            <circle cx="100" cy="75" r="32" fill="#F97316" fillOpacity="0.8" />
            <path d="M20 90 Q60 85 100 95 T180 88 L180 120 L20 120 Z" fill="#163828" />
            <path d="M50 45 Q55 40 60 45 Q65 40 70 45" stroke="#78350F" strokeWidth="1.5" fill="none" />
            <path d="M130 40 Q135 35 140 40 Q145 35 150 40" stroke="#78350F" strokeWidth="1.5" fill="none" />
          </svg>
        );

      case 'PAAL_MILK':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <path d="M60 40 L65 105 A10 10 0 0 0 75 115 H95 A10 10 0 0 0 105 105 L110 40 Z" fill="#FFFFFF" stroke="#163828" strokeWidth="2.5" />
            <path d="M66 60 H104 L101 105 A6 6 0 0 1 95 110 H75 A6 6 0 0 1 69 105 Z" fill="#E2E8F0" />
            <path d="M145 75 C145 85 135 95 135 95 C135 95 125 85 125 75 A10 10 0 0 1 145 75 Z" fill="#38BDF8" />
          </svg>
        );

      case 'PAAL_SIDE':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <line x1="100" y1="25" x2="100" y2="115" stroke="#163828" strokeWidth="4" />
            <line x1="80" y1="115" x2="120" y2="115" stroke="#163828" strokeWidth="4" />
            <line x1="50" y1="45" x2="150" y2="45" stroke="#163828" strokeWidth="3" />
            <path d="M35 75 H65 L50 85 Z" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
            <line x1="50" y1="45" x2="35" y2="75" stroke="#78716C" strokeWidth="1" />
            <line x1="50" y1="45" x2="65" y2="75" stroke="#78716C" strokeWidth="1" />
            <path d="M135 75 H165 L150 85 Z" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
            <line x1="150" y1="45" x2="135" y2="75" stroke="#78716C" strokeWidth="1" />
            <line x1="150" y1="45" x2="165" y2="75" stroke="#78716C" strokeWidth="1" />
          </svg>
        );

      case 'ADI_FOOT':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <ellipse cx="100" cy="85" rx="20" ry="26" fill="#C28B38" fillOpacity="0.7" stroke="#163828" strokeWidth="2" />
            <circle cx="85" cy="50" r="5" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
            <circle cx="95" cy="46" r="5.5" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
            <circle cx="106" cy="48" r="5" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
            <circle cx="116" cy="53" r="4.5" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
            <circle cx="124" cy="59" r="4" fill="#C28B38" stroke="#163828" strokeWidth="1.5" />
          </svg>
        );

      case 'ADI_HIT':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <rect x="50" y="40" width="18" height="65" rx="4" transform="rotate(-35 50 40)" fill="#B45309" stroke="#163828" strokeWidth="2" />
            <circle cx="135" cy="55" r="14" fill="#DC2626" stroke="#163828" strokeWidth="2" />
            <path d="M105 50 L115 45 L112 55 L120 58 L110 62 L112 70 L104 64 Z" fill="#FBBF24" />
          </svg>
        );

      case 'ADI_MEASURE':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <rect x="30" y="55" width="140" height="30" rx="4" fill="#FDE047" stroke="#163828" strokeWidth="2" />
            {[45, 60, 75, 90, 105, 120, 135, 150].map((x, i) => (
              <line key={i} x1={x} y1="55" x2={x} y2={i % 2 === 0 ? "70" : "64"} stroke="#163828" strokeWidth="2" />
            ))}
            <text x="100" y="105" fontFamily="system-ui" fontSize="13" fontWeight="bold" fill="#163828" textAnchor="middle">1 அடி (1 Foot = 12")</text>
          </svg>
        );

      case 'THINGAL_MOON':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#0F172A" />
            <circle cx="100" cy="70" r="34" fill="#F8FAFC" />
            <circle cx="92" cy="62" r="6" fill="#E2E8F0" />
            <circle cx="112" cy="75" r="8" fill="#E2E8F0" />
            <circle cx="98" cy="85" r="5" fill="#E2E8F0" />
            <circle cx="45" cy="30" r="1.5" fill="#FFFFFF" />
            <circle cx="160" cy="40" r="1.5" fill="#FFFFFF" />
            <circle cx="140" cy="110" r="1.5" fill="#FFFFFF" />
          </svg>
        );

      case 'THINGAL_MONDAY':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <rect x="50" y="25" width="100" height="90" rx="8" fill="#FFFFFF" stroke="#163828" strokeWidth="2" />
            <rect x="50" y="25" width="100" height="25" rx="8" fill="#163828" />
            <text x="100" y="42" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">திங்கள் (MON)</text>
            <text x="100" y="85" fontFamily="system-ui" fontSize="32" fontWeight="bold" fill="#2A7F62" textAnchor="middle">1</text>
          </svg>
        );

      case 'THINGAL_MONTH':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#FEF3C7" />
            <path d="M75 90 Q65 115 100 115 Q135 115 125 90 L120 70 H80 Z" fill="#92400E" stroke="#163828" strokeWidth="2" />
            <ellipse cx="100" cy="70" rx="20" ry="6" fill="#FDE68A" stroke="#163828" strokeWidth="2" />
            <path d="M85 70 Q100 50 115 70" fill="#FFFFFF" />
            <line x1="50" y1="120" x2="150" y2="120" stroke="#163828" strokeWidth="3" />
            <text x="100" y="45" fontFamily="system-ui" fontSize="13" fontWeight="bold" fill="#92400E" textAnchor="middle">தைப்பொங்கல்</text>
          </svg>
        );

      case 'KALAI_ART':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <ellipse cx="95" cy="70" rx="45" ry="35" fill="#E2E8F0" stroke="#163828" strokeWidth="2" />
            <circle cx="70" cy="65" r="6" fill="#EF4444" />
            <circle cx="90" cy="55" r="6" fill="#3B82F6" />
            <circle cx="115" cy="60" r="6" fill="#EAB308" />
            <circle cx="120" cy="80" r="6" fill="#10B981" />
            <circle cx="75" cy="85" r="5" fill="#FFFFFF" stroke="#163828" />
            <line x1="60" y1="105" x2="145" y2="30" stroke="#B45309" strokeWidth="5" strokeLinecap="round" />
            <polygon points="145,30 155,20 160,25 150,35" fill="#163828" />
          </svg>
        );

      case 'KALAI_DEER':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#E8F4F0" />
            <path d="M70 110 L80 60 L120 70 L135 110" stroke="#92400E" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="78" cy="50" r="14" fill="#B45309" />
            <path d="M70 40 L60 20 M60 20 L50 22 M60 20 L65 10" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M85 40 L95 20 M95 20 L105 22 M95 20 L90 10" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="74" cy="48" r="2" fill="#000000" />
          </svg>
        );

      case 'KALAI_DISPERSE':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#F4EFEA" />
            <circle cx="100" cy="70" r="8" fill="#163828" />
            <path d="M100 50 L100 30 M100 30 L95 35 M100 30 L105 35" stroke="#2A7F62" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M100 90 L100 110 M100 110 L95 105 M100 110 L105 105" stroke="#2A7F62" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M80 70 L60 70 M60 70 L65 65 M60 70 L65 75" stroke="#2A7F62" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M120 70 L140 70 M140 70 L135 65 M140 70 L135 75" stroke="#2A7F62" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="45" r="5" fill="#78716C" />
            <circle cx="150" cy="45" r="5" fill="#78716C" />
            <circle cx="50" cy="95" r="5" fill="#78716C" />
            <circle cx="150" cy="95" r="5" fill="#78716C" />
          </svg>
        );

      case 'NAADU_COUNTRY':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#E8F4F0" />
            <path d="M60 40 Q90 30 110 50 Q140 60 135 90 Q120 115 90 110 Q65 100 55 80 Z" fill="#2A7F62" fillOpacity="0.3" stroke="#163828" strokeWidth="2.5" />
            <circle cx="95" cy="75" r="4" fill="#DC2626" />
            <text x="100" y="125" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#163828" textAnchor="middle">தேசம் / நாடு</text>
          </svg>
        );

      case 'NAADU_SEEK':
        return (
          <svg className="w-full h-full" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="140" rx="12" fill="#FEF3C7" />
            <rect x="50" y="45" width="100" height="40" rx="6" fill="#D97706" stroke="#163828" strokeWidth="2" />
            <line x1="60" y1="58" x2="140" y2="58" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="60" y1="70" x2="130" y2="70" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="100" cy="30" r="10" fill="#163828" />
            <text x="100" y="112" fontFamily="system-ui" fontSize="12" fontWeight="bold" fill="#92400E" textAnchor="middle">அறிவை நாடுதல்</text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-500 p-4">
            <ImageIcon className="w-10 h-10 text-[#2A7F62]/50 mb-2" />
            <span className="text-xs text-stone-600 font-medium text-center">{meaningTamil}</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-[#E2DBD0] bg-white shadow-sm transition-all">
      {/* Visual Canvas Container */}
      <div className={`w-full ${compact ? 'h-32' : 'h-44 sm:h-48'} relative bg-[#F7F4EE] flex items-center justify-center overflow-hidden group`}>
        {canShowPhoto && viewMode === 'photo' ? (
          <img
            src={photoUrl}
            alt={imageMetadata?.alt_text || meaningTamil}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          renderSenseSvg()
        )}

        {/* View Mode Toggle Pill (Photo vs Vector) */}
        {canShowPhoto && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1 rounded-lg flex items-center gap-1 text-[11px] text-white">
            <button
              type="button"
              onClick={() => setViewMode('photo')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                viewMode === 'photo' ? 'bg-[#2A7F62] text-white font-bold' : 'hover:bg-white/20 text-stone-200'
              }`}
              title="மெய்யான சூழல் புகைப்படம்"
            >
              <Camera className="w-3 h-3" />
              <span>புகைப்படம்</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('vector')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                viewMode === 'vector' ? 'bg-[#2A7F62] text-white font-bold' : 'hover:bg-white/20 text-stone-200'
              }`}
              title="கல்விசார் வரைபட விளக்கம்"
            >
              <Palette className="w-3 h-3" />
              <span>வரைபடம்</span>
            </button>
          </div>
        )}

        {/* Scene Category Tag */}
        <div className="absolute bottom-2 left-2 bg-[#163828]/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
          {meaningTamil}
        </div>
      </div>

      {/* Metadata & Scene Description */}
      <div className="p-3 bg-white text-xs border-t border-[#EAE4D7] flex flex-col gap-1.5">
        {imageMetadata?.scene_contrast ? (
          <div className="text-[#163828] font-medium leading-relaxed">
            <span className="text-[#2A7F62] font-bold block text-[11px] mb-0.5">
              சூழல் காட்சி விளக்கம்:
            </span>
            <span className="text-stone-700">{imageMetadata.scene_contrast}</span>
          </div>
        ) : imageMetadata?.alt_text ? (
          <div className="flex items-start gap-1 text-[#163828] font-medium leading-relaxed">
            <span className="text-stone-400 shrink-0">காட்சி விளக்கம்:</span>
            <span>{imageMetadata.alt_text}</span>
          </div>
        ) : null}

        {imageMetadata?.search_url && (
          <a
            href={imageMetadata.search_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#2A7F62] hover:text-[#163828] underline underline-offset-2 transition-colors mt-0.5"
            title="விக்கிமீடியா களஞ்சியத்தில் மேலதிகப் படங்களைத் தேட"
          >
            <ExternalLink className="w-3 h-3" />
            <span>விக்கிமீடியா களஞ்சியப் படங்களைத் தேடுக</span>
          </a>
        )}
      </div>
    </div>
  );
};
