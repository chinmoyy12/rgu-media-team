import React, { useEffect, useState } from 'react';
import { Camera, Video, Mic, Share2, Award, Users, MapPin, Sparkles } from 'lucide-react';
import { config } from '../config';

export const AboutSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    events: 0,
    photos: 0,
    videos: 0,
    podcasts: 0,
    projects: 0,
    reach: 0,
  });

  const targets = {
    events: 150,
    photos: 5,
    videos: 4,
    podcasts: 25,
    projects: 180,
    reach: 2.5,
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('about');
      if (el && !hasAnimated) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
          setHasAnimated(true);

          let start = 0;
          const duration = 2000;
          const intervalTime = 30;
          const steps = duration / intervalTime;

          const timer = setInterval(() => {
            start++;
            const progress = Math.min(start / steps, 1);

            setCounts({
              events: Math.floor(targets.events * progress),
              photos: Math.floor(targets.photos * progress),
              videos: Math.floor(targets.videos * progress),
              podcasts: Math.floor(targets.podcasts * progress),
              projects: Math.floor(targets.projects * progress),
              reach: Number((targets.reach * progress).toFixed(1)),
            });

            if (progress >= 1) clearInterval(timer);
          }, intervalTime);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  return (
    <section id="about" className="py-24 relative bg-[#08080C] overflow-hidden border-t border-stone-800/60">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#F26A2E]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT THE MEDIA CELL</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            CREATIVE FORCES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] to-amber-400">BEHIND RGU</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#F26A2E] to-transparent mx-auto rounded-full" />
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative & Mission */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-stone-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26A2E]/10 rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-2 text-stone-300 text-xs font-semibold uppercase tracking-widest mb-4">
                <MapPin className="w-4 h-4 text-[#F26A2E]" />
                <span>{config.universityLocation}</span>
              </div>

              <blockquote className="font-playfair text-lg sm:text-xl md:text-2xl text-stone-100 font-medium leading-relaxed mb-6 border-l-2 border-[#F26A2E] pl-4">
                "The Media Team of The Assam Royal Global University is responsible for documenting, designing, promoting, and preserving the university's journey through photography, videography, podcasts, digital storytelling, creative content, and social media."
              </blockquote>

              <p className="font-inter text-stone-300 text-sm sm:text-base leading-relaxed">
                Operating under the institutional umbrella of <strong className="text-white">{config.universityName}</strong>, our crew consists of student photographers, directors, editors, graphic designers, podcasters, and social media strategists driving digital narrative excellence across Northeast India.
              </p>

              {/* Pillars badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-stone-800 text-xs text-stone-300 font-medium">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#F26A2E]" />
                  <span>4K Photo & Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#F26A2E]" />
                  <span>Live Streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#F26A2E]" />
                  <span>Audio Podcasts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#F26A2E]" />
                  <span>Social Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#F26A2E]" />
                  <span>National Awards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#F26A2E]" />
                  <span>Student Crew</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Statistics Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all text-center group">
              <span className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#F26A2E] text-glow-orange block mb-1">
                {counts.events}+
              </span>
              <span className="font-inter text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Events Covered
              </span>
            </div>

            {/* Stat 2 */}
            <div className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all text-center group">
              <span className="font-cinzel text-3xl sm:text-4xl font-extrabold text-amber-400 block mb-1">
                {counts.photos}k+
              </span>
              <span className="font-inter text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Photos Captured
              </span>
            </div>

            {/* Stat 3 */}
            <div className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all text-center group">
              <span className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#F26A2E] text-glow-orange block mb-1">
                {counts.videos}k+
              </span>
              <span className="font-inter text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Videos Produced
              </span>
            </div>

            {/* Stat 4 */}
            <div className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all text-center group">
              <span className="font-cinzel text-3xl sm:text-4xl font-extrabold text-purple-400 block mb-1">
                {counts.podcasts}+
              </span>
              <span className="font-inter text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Podcasts Released
              </span>
            </div>

            {/* Stat 5 */}
            <div className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all text-center group">
              <span className="font-cinzel text-3xl sm:text-4xl font-extrabold text-emerald-400 block mb-1">
                {counts.projects}+
              </span>
              <span className="font-inter text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Projects Done
              </span>
            </div>

            {/* Stat 6 */}
            <div className="glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/50 transition-all text-center group">
              <span className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#F26A2E] text-glow-orange block mb-1">
                {counts.reach}M+
              </span>
              <span className="font-inter text-xs text-stone-300 font-semibold uppercase tracking-wider">
                Social Reach
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
