import React from 'react';

interface UniversityLogoProps {
  variant?: 'nav' | 'hero' | 'loader' | 'footer' | 'icon';
  className?: string;
  showText?: boolean;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  variant = 'nav',
  className = '',
  showText = true,
}) => {
  const isHero = variant === 'hero';
  const isLoader = variant === 'loader';
  const isFooter = variant === 'footer';

  return (
    <div className={`inline-flex flex-col items-center group select-none text-center ${className}`}>
      {/* Official Emblem: Globe + Dynamic Swooshes */}
      <div
        className={`relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105 ${
          isHero
            ? 'w-24 h-24 sm:w-32 sm:h-32 mb-3'
            : isLoader
            ? 'w-28 h-28 mb-3'
            : isFooter
            ? 'w-16 h-16 mb-2'
            : 'w-12 h-12 mb-1'
        }`}
      >
        {/* Glow behind emblem */}
        <div className="absolute inset-0 rounded-full bg-[#F26A2E]/20 blur-lg group-hover:bg-[#F26A2E]/40 transition-opacity duration-500" />

        <svg
          viewBox="0 0 220 200"
          className="w-full h-full relative z-10 drop-shadow-[0_0_18px_rgba(242,106,46,0.65)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="rguOrangeGrad" x1="0" y1="0" x2="220" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="0.5" stopColor="#F26A2E" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          {/* Globe Circle (Orange filled with white map cutout) */}
          <path
            d="M 90 20 A 75 75 0 1 0 90 170 A 75 75 0 0 0 90 20 Z"
            fill="url(#rguOrangeGrad)"
          />

          {/* Globe Continents (White shapes over orange globe) */}
          {/* Eurasia & India */}
          <path
            d="M 68 42 C 75 38, 88 36, 95 40 C 102 44, 106 52, 98 58 C 92 62, 86 65, 82 72 C 78 78, 82 88, 76 92 C 70 96, 62 102, 58 112 C 55 118, 48 114, 46 108 C 42 100, 48 90, 52 82 C 58 72, 62 60, 58 52 C 55 46, 60 42, 68 42 Z"
            fill="#FFFFFF"
            opacity="0.98"
          />
          {/* Africa */}
          <path
            d="M 44 72 C 48 68, 55 70, 52 78 C 48 85, 40 92, 35 88 C 30 84, 35 78, 44 72 Z"
            fill="#FFFFFF"
            opacity="0.98"
          />
          {/* East Asia / Japan island accents */}
          <path
            d="M 102 38 C 108 35, 115 40, 112 48 C 108 52, 102 48, 102 38 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* Dynamic 3 Sweeping Grass / Flame Blades (Orange with white spacing) */}
          {/* Blade 1 (Inner Left Blade) */}
          <path
            d="M 98 170 C 98 170, 125 110, 195 62 C 160 88, 125 130, 98 170 Z"
            fill="url(#rguOrangeGrad)"
          />
          {/* Blade 2 (Middle Blade) */}
          <path
            d="M 118 170 C 118 170, 148 105, 212 92 C 172 118, 140 148, 118 170 Z"
            fill="url(#rguOrangeGrad)"
          />
          {/* Blade 3 (Outer Right Blade) */}
          <path
            d="M 138 170 C 138 170, 172 135, 218 128 C 190 148, 160 162, 138 170 Z"
            fill="url(#rguOrangeGrad)"
          />

          {/* White Dot Accents on Swooshes representing students/people */}
          <circle cx="162" cy="72" r="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx="178" cy="98" r="3" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {/* Official Text Branding */}
      {showText && variant !== 'icon' && (
        <div className="flex flex-col items-center">
          {/* Top text: THE ASSAM */}
          <span className="font-cinzel tracking-[0.25em] text-[9px] sm:text-[11px] font-normal text-stone-200 uppercase leading-tight">
            THE ASSAM
          </span>

          {/* Main text: ROYAL GLOBAL UNIVERSITY */}
          <span
            className={`font-cinzel font-black tracking-[0.08em] text-white group-hover:text-[#F26A2E] transition-colors leading-tight ${
              isHero
                ? 'text-lg sm:text-2xl md:text-3xl'
                : isLoader
                ? 'text-base sm:text-xl'
                : isFooter
                ? 'text-xs sm:text-sm'
                : 'text-xs sm:text-sm'
            }`}
          >
            ROYAL GLOBAL UNIVERSITY
          </span>

          {/* Bottom ornament line: —— GUWAHATI —— */}
          <div className="flex items-center gap-2 mt-1 w-full max-w-[220px] justify-center">
            {/* Left line with diamond */}
            <div className="flex-1 h-[1.5px] bg-[#F26A2E] relative flex items-center justify-end">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#F26A2E] absolute right-0" />
            </div>

            <span className="font-cinzel tracking-[0.3em] text-[8px] sm:text-[10px] font-bold text-stone-300 uppercase px-1">
              GUWAHATI
            </span>

            {/* Right line with diamond */}
            <div className="flex-1 h-[1.5px] bg-[#F26A2E] relative flex items-center justify-start">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#F26A2E] absolute left-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
