import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SectionItem {
  id: string;
  label: string;
}

const sections: SectionItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About RGU' },
  { id: 'departments', label: 'Wings' },
  { id: 'members', label: 'Leadership' },
  { id: 'media-family', label: 'Media Family' },
  { id: 'media-gallery', label: 'Photo Gallery' },
  { id: 'gallery', label: 'Instagram' },
  { id: 'why-join', label: 'Why Join' },
  { id: 'join', label: 'Recruitment' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

export const ScrollIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top - 100) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Section Navigation"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-2.5 p-2 rounded-full glass-card border border-stone-800/80 bg-stone-950/40 backdrop-blur-md shadow-2xl pointer-events-auto select-none"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const isHovered = hoveredSection === section.id;

        return (
          <div
            key={section.id}
            className="relative flex items-center group cursor-pointer"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
            onClick={() => scrollToSection(section.id)}
          >
            {/* Tooltip Label */}
            <AnimatePresence>
              {(isHovered || isActive) && (
                <motion.span
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-7 whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold tracking-wider pointer-events-none shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white shadow-[0_0_15px_rgba(242,106,46,0.4)]'
                      : 'bg-stone-900/90 text-stone-300 border border-stone-800'
                  }`}
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Indicator Dot */}
            <button
              type="button"
              aria-label={`Scroll to ${section.label}`}
              className="relative p-1.5 flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.3 : isHovered ? 1.15 : 1,
                  backgroundColor: isActive ? '#F26A2E' : isHovered ? '#f59e0b' : '#78716c',
                }}
                transition={{ duration: 0.2 }}
                className={`w-2 h-2 rounded-full ${
                  isActive
                    ? 'shadow-[0_0_10px_#F26A2E]'
                    : 'opacity-60 group-hover:opacity-100'
                }`}
              />

              {/* Active Outer Ring Pulse */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicatorRing"
                  className="absolute w-5 h-5 rounded-full border border-[#F26A2E]/70 shadow-[0_0_8px_rgba(242,106,46,0.5)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          </div>
        );
      })}
    </nav>
  );
};
