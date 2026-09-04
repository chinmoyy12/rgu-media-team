import React, { useState } from 'react';
import { Users, Heart, Sparkles, Maximize2, ExternalLink, X } from 'lucide-react';
import { ImageWithSkeleton } from './Skeleton';

export const MediaTeamFamilySection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl = "https://i.ibb.co/4Z4J91Dd/Whats-App-Image-2026-07-28-at-11-05-29-PM.jpg";
  const pageUrl = "https://ibb.co/HDGX1hMd";

  return (
    <section id="media-family" className="py-24 relative bg-[#050505] overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-r from-[#F26A2E]/15 via-amber-500/10 to-[#F26A2E]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>THE PEOPLE BEHIND THE LENS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            MEDIA TEAM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-[#F26A2E]">FAMILY</span>
          </h2>
          <p className="font-inter text-stone-300 text-sm sm:text-base leading-relaxed">
            More than just a crew — we are a passionate community of creators, storytellers, editors, and photographers united by creativity and teamwork at The Assam Royal Global University.
          </p>
        </div>

        {/* Feature Image Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="glass-card-gradient rounded-3xl p-4 sm:p-6 md:p-8 border border-[#F26A2E]/40 shadow-[0_0_50px_rgba(242,106,46,0.15)] relative overflow-hidden group">
            {/* Image Container with Zoom hover */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer mb-4"
            >
              <ImageWithSkeleton
                src={imageUrl}
                alt="Media Team Family - The Assam Royal Global University"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/20 opacity-80 group-hover:opacity-40 transition-opacity" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-[#F26A2E]/40 text-[11px] sm:text-xs font-mono text-white shadow-md">
                <Heart className="w-3.5 h-3.5 text-[#F26A2E] fill-[#F26A2E]" />
                <span>RGU Media Squad 2026</span>
              </div>

              {/* Expand Hint */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-[#F26A2E] text-white shadow-lg opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 sm:scale-75 group-hover:scale-100">
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Caption & Actions Box below photo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-stone-800/80 backdrop-blur-md">
              <div>
                <h3 className="font-cinzel text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F26A2E] shrink-0" />
                  One Team, Infinite Memories
                </h3>
                <p className="font-inter text-xs text-stone-300 mt-1 leading-relaxed">
                  Official group photograph of the Royal Global University Media Team coordinators & crew.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold transition-all cursor-pointer shrink-0"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#F26A2E]" />
                  <span>Expand</span>
                </button>

                <a
                  href={pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#F26A2E]/20 hover:bg-[#F26A2E] text-[#F26A2E] hover:text-white border border-[#F26A2E]/40 text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  <span>View High-Res Photo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full glass-card-gradient rounded-3xl border border-[#F26A2E]/40 p-4 sm:p-6 shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-3 rounded-full bg-stone-900/90 text-stone-300 hover:text-white hover:bg-[#F26A2E] transition-all cursor-pointer z-20 border border-stone-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[65vh] sm:max-h-[75vh] w-full rounded-2xl overflow-hidden bg-stone-950 flex items-center justify-center mb-4 border border-stone-800 mt-8 sm:mt-0">
              <img
                src={imageUrl}
                alt="Media Team Family"
                className="max-h-[65vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">Media Team Family</h3>
                <p className="font-inter text-xs text-stone-300">The Assam Royal Global University Media Cell</p>
              </div>

              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 px-4 sm:py-2.5 sm:px-5 rounded-full bg-[#F26A2E] hover:bg-amber-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shrink-0"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
