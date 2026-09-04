import React, { useEffect, useState } from 'react';
import { UniversityLogo } from './UniversityLogo';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            if (onLoaded) onLoaded();
          }, 100);
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 25;
        return Math.min(prev + step, 100);
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onLoaded]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-300 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F26A2E]/15 rounded-full blur-[100px] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Animated University Seal Logo */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-[#F26A2E]/20 blur-xl animate-ping opacity-50" />
          <UniversityLogo variant="loader" showText={false} />
        </div>

        {/* Title branding */}
        <h1 className="font-cinzel text-2xl md:text-3xl font-extrabold tracking-widest text-white mb-1">
          THE ASSAM ROYAL GLOBAL UNIVERSITY
        </h1>
        <div className="flex items-center gap-3 mb-8">
          <span className="h-[1px] w-8 bg-[#F26A2E]" />
          <p className="font-inter text-sm font-bold tracking-[0.3em] text-[#F26A2E] text-glow-orange">
            MEDIA TEAM
          </p>
          <span className="h-[1px] w-8 bg-[#F26A2E]" />
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-stone-900/80 rounded-full h-1.5 p-0.5 border border-stone-800 relative overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-[#F26A2E] via-amber-500 to-[#F26A2E] h-full rounded-full transition-all duration-200 shadow-[0_0_12px_#F26A2E]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter and Tagline */}
        <div className="flex items-center justify-between w-full font-inter text-xs text-stone-400">
          <span className="tracking-wider">GUWAHATI, ASSAM</span>
          <span className="font-mono text-[#F26A2E] font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
