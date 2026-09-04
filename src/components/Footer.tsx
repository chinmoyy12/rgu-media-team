import React from 'react';
import { UniversityLogo } from './UniversityLogo';
import { config } from '../config';
import { Sparkles, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onApplyClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onApplyClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#030305] text-stone-300 pt-20 pb-10 border-t border-stone-800/80 overflow-hidden">
      {/* Animated SVG Wave Divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-0 opacity-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-[#F26A2E]"
          fill="currentColor"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pb-12 border-b border-stone-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Branding */}
          <div className="space-y-3 max-w-xl">
            <a href="#home" onClick={scrollToTop}>
              <UniversityLogo variant="footer" />
            </a>

            <p className="font-inter text-xs text-stone-400 leading-relaxed">
              The official Media Team of The Assam Royal Global University, Guwahati. Capturing moments, creating stories, preserving memories, and building the university's digital identity.
            </p>
          </div>

          {/* Call To Action */}
          <div className="shrink-0">
            <button
              onClick={onApplyClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F26A2E] to-amber-600 text-white font-semibold text-xs shadow-[0_0_15px_#F26A2E] hover:shadow-[0_0_25px_#F26A2E] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Apply to Join Media Team</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-inter">
          <div>
            © {new Date().getFullYear()} {config.universityName}. All Rights Reserved.
          </div>

          <div className="flex items-center gap-1 text-stone-400">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
            <span>by <strong className="text-stone-200">Media Team, Royal Global University</strong></span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-[#F26A2E] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
