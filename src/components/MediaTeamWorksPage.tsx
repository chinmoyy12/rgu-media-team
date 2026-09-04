import React from 'react';
import { ArrowLeft, Sparkles, Camera, Film, Image as ImageIcon, ExternalLink, Calendar, Layers, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { MediaGallerySection } from './MediaGallerySection';
import { GallerySection } from './GallerySection';

interface MediaTeamWorksPageProps {
  onBackToHome: () => void;
  onApplyClick: () => void;
}

export const MediaTeamWorksPage: React.FC<MediaTeamWorksPageProps> = ({
  onBackToHome,
  onApplyClick,
}) => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#050505] text-stone-100 relative">
      {/* Glow Effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#F26A2E]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-[#F26A2E] text-xs font-semibold transition-all duration-300 cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#F26A2E]" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-stone-400">RGU Official Media Portfolio</span>
            <span className="w-2 h-2 rounded-full bg-[#F26A2E] animate-pulse" />
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-bold mb-4 shadow-[0_0_20px_rgba(242,106,46,0.2)]"
          >
            <Film className="w-3.5 h-3.5 text-amber-300" />
            <span>MEDIA TEAM WORKS & CREATIVE SHOWCASE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-wide leading-tight mb-6"
          >
            CAPTURING STORIES.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-[#F26A2E]">
              PRESERVING MEMORIES.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-inter text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
          >
            Explore the official event coverages, high-definition photography, stage productions, and creative media wing achievements produced by The Assam Royal Global University Student Media Team.
          </motion.p>

          {/* Quick Highlight Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto p-4 rounded-2xl glass-card border border-stone-800/80 bg-stone-950/70"
          >
            <div className="text-center p-2">
              <div className="font-cinzel text-xl sm:text-2xl font-black text-[#F26A2E]">500+</div>
              <div className="font-inter text-[11px] text-stone-400">Events Covered</div>
            </div>
            <div className="text-center p-2 border-l border-stone-800/80">
              <div className="font-cinzel text-xl sm:text-2xl font-black text-amber-400">7 Wings</div>
              <div className="font-inter text-[11px] text-stone-400">Creative Departments</div>
            </div>
            <div className="text-center p-2 border-l border-stone-800/80">
              <div className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">100% Live</div>
              <div className="font-inter text-[11px] text-stone-400">Campus Broadcasting</div>
            </div>
            <div className="text-center p-2 border-l border-stone-800/80">
              <div className="font-cinzel text-xl sm:text-2xl font-black text-[#F26A2E]">HD Quality</div>
              <div className="font-inter text-[11px] text-stone-400">Archived Media</div>
            </div>
          </motion.div>
        </div>

        {/* Shipped RGU MEDIA PHOTO GALLERY Component */}
        <div className="rounded-3xl border border-stone-800/80 bg-stone-950/40 p-2 sm:p-6 mb-12 shadow-2xl">
          <MediaGallerySection />
        </div>

        {/* Shipped Instagram / Socials Showcase */}
        <div className="rounded-3xl border border-stone-800/80 bg-stone-950/40 p-2 sm:p-6 mb-12">
          <GallerySection />
        </div>

        {/* CTA Bottom Box */}
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-[#F26A2E]/40 text-center relative overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#F26A2E]/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Want to create works like these?
          </h2>
          <p className="font-inter text-stone-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Join the official Media Team of Royal Global University. Operate professional gear, cover major campus concerts, and build your creative portfolio.
          </p>
          <button
            onClick={onApplyClick}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(242,106,46,0.6)] hover:shadow-[0_0_35px_rgba(242,106,46,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Apply to Join Media Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
