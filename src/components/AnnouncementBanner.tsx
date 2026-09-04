import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { config } from '../config';

interface AnnouncementBannerProps {
  onApplyClick: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ onApplyClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !config.recruitment.isOpen) return null;

  return (
    <div className="relative z-[60] bg-gradient-to-r from-[#B33E0A] via-[#F26A2E] to-amber-600 text-white py-2 px-4 text-xs md:text-sm font-medium border-b border-orange-400/30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center justify-center p-1 rounded-full bg-white/20 text-white animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="font-poppins font-medium text-white/95 truncate">
            {config.recruitment.announcementBanner}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onApplyClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-sm transition-colors border border-white/20 cursor-pointer"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
