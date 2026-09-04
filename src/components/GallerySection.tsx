import React from 'react';
import { Instagram, ExternalLink, Sparkles, Heart, MessageCircle, Share2, Compass, Film, Image } from 'lucide-react';
import { config } from '../config';

export const GallerySection: React.FC = () => {
  const instagramUrl = "https://www.instagram.com/royalglobaluniversity/";

  return (
    <section id="gallery" className="py-20 relative bg-[#050505] overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F26A2E]/15 via-pink-500/10 to-amber-500/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F26A2E]/15 to-pink-500/15 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <Instagram className="w-3.5 h-3.5" />
            <span>OFFICIAL INSTAGRAM & SOCIAL CHANNEL</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            ROYAL GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-pink-500 to-amber-400">INSTAGRAM</span>
          </h2>
          <p className="font-inter text-stone-300 text-sm sm:text-base leading-relaxed">
            Follow our official social handle for real-time updates, event highlights, student achievements, and visual stories from The Assam Royal Global University campus.
          </p>
        </div>

        {/* Large Primary Action Card */}
        <div className="glass-card-gradient p-8 md:p-12 rounded-3xl border border-[#F26A2E]/40 text-center relative overflow-hidden shadow-[0_0_50px_rgba(242,106,46,0.15)]">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-[#F26A2E] to-pink-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center text-white">
                <Instagram className="w-10 h-10 text-[#F26A2E]" />
              </div>
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-black text-white">
              Connect with us on Instagram
            </h3>
            <p className="font-inter text-stone-300 text-sm sm:text-base leading-relaxed">
              Explore thousands of photos, festival reels, live updates, and student stories directly on our official Instagram page.
            </p>

            <div className="pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 py-4 px-8 rounded-full bg-gradient-to-r from-pink-600 via-[#F26A2E] to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-[0_0_35px_rgba(242,106,46,0.6)] hover:shadow-[0_0_55px_rgba(242,106,46,0.9)] hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
                <span>Open @royalglobaluniversity Page</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
