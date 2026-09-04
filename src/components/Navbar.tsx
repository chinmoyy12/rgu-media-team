import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Home, Film, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { UniversityLogo } from './UniversityLogo';

interface NavbarProps {
  onApplyClick: () => void;
  onSearchOpen?: () => void;
  onMembersClick?: () => void;
  onWorksClick?: () => void;
  onHomeClick?: () => void;
  currentPage?: 'home' | 'members' | 'works';
}

export const Navbar: React.FC<NavbarProps> = ({
  onApplyClick,
  onMembersClick,
  onWorksClick,
  onHomeClick,
  currentPage = 'home',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile/tablet menu on screen resize to lg (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (currentPage !== 'home' && onHomeClick) {
      e.preventDefault();
      onHomeClick();
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavAction = (action?: () => void) => {
    setIsMobileMenuOpen(false);
    if (action) action();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 max-w-full ${
        isScrolled || isMobileMenuOpen
          ? 'glass-nav py-2.5 sm:py-3.5 border-b border-stone-800/80 shadow-2xl bg-stone-950/95 backdrop-blur-2xl'
          : 'bg-stone-950/85 backdrop-blur-xl py-3 sm:py-4 border-b border-stone-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 md:gap-4 max-w-full">
        {/* Left Side: Brand Logo + Title */}
        <a
          href="#home"
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-pointer select-none shrink min-w-0"
        >
          <div className="shrink-0 scale-90 sm:scale-100 origin-left">
            <UniversityLogo variant="nav" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2 leading-tight whitespace-nowrap">
              <span className="font-cinzel text-sm sm:text-lg md:text-2xl lg:text-3xl font-black text-white tracking-wide group-hover:text-[#F26A2E] transition-colors truncate">
                MEDIA TEAM
              </span>
              <span className="font-mono text-[9px] sm:text-xs font-extrabold text-[#F26A2E] tracking-wider uppercase bg-[#F26A2E]/10 border border-[#F26A2E]/30 px-1.5 sm:px-2 py-0.5 rounded shadow-[0_0_12px_rgba(242,106,46,0.2)] shrink-0 hidden sm:inline-block">
                STUDENT BODY
              </span>
            </div>
            <span className="font-inter text-[9px] sm:text-xs text-stone-400 font-medium tracking-wider hidden sm:block truncate">
              THE ASSAM ROYAL GLOBAL UNIVERSITY
            </span>
          </div>
        </a>

        {/* Right Side: Desktop Navigation Buttons (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2.5 md:gap-3 shrink-0">
          {/* Members Info Button */}
          <button
            onClick={() => handleNavAction(currentPage === 'members' ? onHomeClick : onMembersClick)}
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-full font-bold text-xs md:text-sm transition-all duration-200 shadow-md cursor-pointer select-none active:scale-95 ${
              currentPage === 'members'
                ? 'bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white shadow-[0_0_20px_rgba(242,106,46,0.6)] border border-amber-300/50'
                : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700/80 hover:border-[#F26A2E]'
            }`}
            title={currentPage === 'members' ? 'Switch back to Home Page' : 'Open Members Information Page'}
          >
            {currentPage === 'members' ? (
              <>
                <Home className="w-4 h-4 shrink-0 text-white animate-pulse" />
                <span>Home Page</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 shrink-0 text-[#F26A2E]" />
                <span>Members Info</span>
              </>
            )}
          </button>

          {/* Media Team Works Button */}
          <button
            onClick={() => handleNavAction(currentPage === 'works' ? onHomeClick : onWorksClick)}
            className={`inline-flex items-center gap-2 py-2 px-4 rounded-full font-bold text-xs md:text-sm transition-all duration-200 shadow-md cursor-pointer select-none active:scale-95 ${
              currentPage === 'works'
                ? 'bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white shadow-[0_0_20px_rgba(242,106,46,0.6)] border border-amber-300/50'
                : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700/80 hover:border-[#F26A2E]'
            }`}
            title={currentPage === 'works' ? 'Switch back to Home Page' : 'Open Media Team Works Page'}
          >
            {currentPage === 'works' ? (
              <>
                <Home className="w-4 h-4 shrink-0 text-white animate-pulse" />
                <span>Home Page</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4 shrink-0 text-[#F26A2E]" />
                <span>Media Team Works</span>
              </>
            )}
          </button>

          {/* Apply Here CTA */}
          <button
            onClick={() => handleNavAction(onApplyClick)}
            className="group relative inline-flex items-center gap-1.5 py-2 px-4.5 rounded-full bg-gradient-to-r from-[#F26A2E] via-[#FF7A3D] to-amber-500 text-white font-extrabold text-xs md:text-sm shadow-[0_0_25px_rgba(242,106,46,0.6)] hover:shadow-[0_0_40px_rgba(242,106,46,0.9)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-amber-300/40 select-none"
            aria-label="Apply Here to Join RGU Media Team"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse shrink-0" />
            <span className="tracking-wider uppercase font-poppins font-black">APPLY HERE</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-100 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Right Side: Mobile & Tablet Compact Bar (< 1024px) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {/* Quick Apply Button on Mobile & Tablets */}
          <button
            onClick={() => handleNavAction(onApplyClick)}
            className="inline-flex items-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase border border-amber-300/40 shadow-[0_0_15px_rgba(242,106,46,0.5)] active:scale-95 transition-transform"
          >
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-200 animate-pulse" />
            <span className="hidden sm:inline">APPLY NOW</span>
            <span className="sm:hidden">APPLY</span>
          </button>

          {/* Mobile/Tablet Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 sm:p-2.5 rounded-xl bg-stone-900/90 text-stone-200 hover:text-white border border-stone-800 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#F26A2E]" />
            ) : (
              <Menu className="w-5 h-5 text-stone-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Slide-Down Navigation Drawer (< 1024px) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-t border-stone-800/80 bg-stone-950/98 backdrop-blur-2xl mt-2.5 shadow-2xl"
          >
            <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-3">
              {/* Grid Layout for Tablet, Single-Column for Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Home Link */}
                <button
                  onClick={() => handleNavAction(onHomeClick)}
                  className={`flex items-center justify-between p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                    currentPage === 'home'
                      ? 'bg-[#F26A2E]/20 text-white border border-[#F26A2E]/60 shadow-[0_0_15px_rgba(242,106,46,0.3)]'
                      : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className={`w-4 h-4 ${currentPage === 'home' ? 'text-[#F26A2E]' : 'text-stone-400'}`} />
                    <span>Home Page</span>
                  </div>
                  {currentPage === 'home' && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F26A2E] text-white font-bold">Active</span>
                  )}
                </button>

                {/* Members Info Link */}
                <button
                  onClick={() => handleNavAction(onMembersClick)}
                  className={`flex items-center justify-between p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                    currentPage === 'members'
                      ? 'bg-[#F26A2E]/20 text-white border border-[#F26A2E]/60 shadow-[0_0_15px_rgba(242,106,46,0.3)]'
                      : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className={`w-4 h-4 ${currentPage === 'members' ? 'text-[#F26A2E]' : 'text-stone-400'}`} />
                    <span>Members Info</span>
                  </div>
                  {currentPage === 'members' && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F26A2E] text-white font-bold">Active</span>
                  )}
                </button>

                {/* Media Team Works Link */}
                <button
                  onClick={() => handleNavAction(onWorksClick)}
                  className={`flex items-center justify-between p-3.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                    currentPage === 'works'
                      ? 'bg-[#F26A2E]/20 text-white border border-[#F26A2E]/60 shadow-[0_0_15px_rgba(242,106,46,0.3)]'
                      : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Film className={`w-4 h-4 ${currentPage === 'works' ? 'text-[#F26A2E]' : 'text-stone-400'}`} />
                    <span>Team Works</span>
                  </div>
                  {currentPage === 'works' && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F26A2E] text-white font-bold">Active</span>
                  )}
                </button>
              </div>

              {/* Full Width Apply Button */}
              <button
                onClick={() => handleNavAction(onApplyClick)}
                className="w-full mt-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#F26A2E] via-[#FF7A3D] to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(242,106,46,0.6)] cursor-pointer active:scale-98 transition-transform border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                <span className="tracking-wider uppercase font-poppins font-black">APPLY HERE TO JOIN MEDIA TEAM</span>
                <ArrowRight className="w-4 h-4 text-amber-100" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
