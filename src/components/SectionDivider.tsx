import React from 'react';
import { motion } from 'motion/react';

interface SectionDividerProps {
  variant?: 'line' | 'wave' | 'glow';
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'line', className = '' }) => {
  return (
    <div className={`relative w-full py-6 flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-96 h-12 bg-gradient-to-r from-transparent via-[#F26A2E]/10 to-transparent blur-xl pointer-events-none" />

      {variant === 'wave' ? (
        <div className="w-full max-w-7xl px-4 sm:px-8">
          <svg
            viewBox="0 0 1200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 opacity-70"
          >
            <defs>
              <linearGradient id="dividerGradWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F26A2E" stopOpacity="0" />
                <stop offset="25%" stopColor="#F26A2E" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#F26A2E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F26A2E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 20 Q 300 35, 600 20 T 1200 20"
              stroke="url(#dividerGradWave)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0.2, opacity: 0.3 }}
              animate={{
                pathLength: [0.2, 1, 0.2],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      ) : (
        <div className="w-full max-w-5xl px-6 flex items-center justify-center gap-4">
          {/* Left Gradient Line */}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#F26A2E]/30 to-[#F26A2E]/80" />

          {/* Center Glowing Crest / Diamond */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-3 h-3 rotate-45 bg-gradient-to-tr from-[#F26A2E] to-amber-400 rounded-sm shadow-[0_0_12px_rgba(242,106,46,0.8)] border border-amber-200/50"
            />
            <div className="absolute w-6 h-6 rounded-full bg-[#F26A2E]/20 blur-md" />
          </div>

          {/* Right Gradient Line */}
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#F26A2E]/30 to-[#F26A2E]/80" />
        </div>
      )}
    </div>
  );
};
