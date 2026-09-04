import React from 'react';
import { X, Play, Film } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl glass-card rounded-2xl overflow-hidden border border-[#F26A2E]/30 shadow-[0_0_80px_rgba(242,106,46,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-stone-800 bg-black/40">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#F26A2E]" />
            <span className="font-cinzel text-sm md:text-base font-bold text-white tracking-wider">
              OFFICIAL SHOWREEL 2025-26 — ROYAL GLOBAL UNIVERSITY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player / Presentation Frame */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          {/* Background Poster Image */}
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80"
            alt="Showreel Preview"
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Interactive Play Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#F26A2E]/90 hover:bg-[#F26A2E] text-white flex items-center justify-center shadow-[0_0_40px_#F26A2E] transform transition-transform group-hover:scale-110 cursor-pointer mb-4">
              <Play className="w-10 h-10 ml-1 fill-white" />
            </div>
            <h4 className="font-cinzel text-2xl md:text-3xl font-extrabold text-white text-glow-orange mb-2">
              Capturing RGU's Finest Moments
            </h4>
            <p className="font-inter text-stone-300 text-sm max-w-lg">
              Experience the energy, emotion, and creativity of Assam's flagship university media crew in 4K resolution.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 bg-stone-950 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            <span>Produced by: </span>
            <strong className="text-stone-200">RGU Videography & Reels Wings</strong>
          </div>
          <div>
            <span>Run time: </span>
            <strong className="text-[#F26A2E]">03:45 mins</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
