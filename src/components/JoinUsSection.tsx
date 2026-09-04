import React from 'react';
import { EventCountdown } from './EventCountdown';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Camera,
  Video,
  Mic,
  FileText,
  Palette,
  Smartphone,
  Share2,
  Users,
  Award,
  Briefcase,
  Layers,
  Network
} from 'lucide-react';

interface JoinUsSectionProps {
  onApplyClick: () => void;
}

export const JoinUsSection: React.FC<JoinUsSectionProps> = ({ onApplyClick }) => {
  const benefits = [
    { name: 'Photography', icon: <Camera className="w-4 h-4 text-[#F26A2E]" /> },
    { name: 'Videography', icon: <Video className="w-4 h-4 text-red-400" /> },
    { name: 'Podcast', icon: <Mic className="w-4 h-4 text-purple-400" /> },
    { name: 'Content Writing', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
    { name: 'Graphic Design', icon: <Palette className="w-4 h-4 text-blue-400" /> },
    { name: 'Reels & Shorts', icon: <Smartphone className="w-4 h-4 text-amber-400" /> },
    { name: 'Social Media', icon: <Share2 className="w-4 h-4 text-cyan-400" /> },
    { name: 'Networking', icon: <Network className="w-4 h-4 text-pink-400" /> },
    { name: 'Leadership', icon: <Users className="w-4 h-4 text-indigo-400" /> },
    { name: 'Certificates', icon: <Award className="w-4 h-4 text-[#F26A2E]" /> },
    { name: 'Portfolio Building', icon: <Briefcase className="w-4 h-4 text-amber-300" /> },
    { name: 'Professional Experience', icon: <Layers className="w-4 h-4 text-emerald-300" /> },
  ];

  return (
    <section id="join" className="py-28 relative bg-[#050505] overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F26A2E]/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-8 md:p-14 rounded-3xl border border-[#F26A2E]/40 shadow-[0_0_80px_rgba(242,106,46,0.25)] relative overflow-hidden text-center">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F26A2E]/15 border border-[#F26A2E]/40 text-[#F26A2E] font-mono text-xs font-semibold mb-4">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>RECRUITMENT DRIVE 2026-27</span>
            </div>

            <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4">
              JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-orange-500 text-glow-orange">MEDIA TEAM</span>
            </h2>

            <p className="font-playfair text-xl sm:text-2xl text-stone-100 italic font-medium">
              Become the creative force behind our university.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <EventCountdown />
          </div>

          {/* Benefits Grid */}
          <div className="mb-12">
            <h3 className="font-inter text-xs font-bold uppercase tracking-[0.25em] text-stone-300 mb-6">
              WHAT YOU WILL GAIN & MASTER
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
              {benefits.map((item) => (
                <div
                  key={item.name}
                  className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3 hover:border-[#F26A2E]/50 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-black/60 border border-stone-800 shrink-0">
                    {item.icon}
                  </div>
                  <span className="font-inter text-xs font-semibold text-stone-100">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Large Animated Apply Now CTA */}
          <div className="pt-6 border-t border-stone-800 flex flex-col items-center">
            <button
              onClick={onApplyClick}
              className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 px-6 sm:px-10 rounded-full bg-gradient-to-r from-[#F26A2E] via-[#FF7A3D] to-amber-600 text-white font-extrabold text-sm sm:text-base md:text-lg shadow-[0_0_40px_rgba(242,106,46,0.6)] hover:shadow-[0_0_60px_rgba(242,106,46,0.9)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer max-w-full"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 shrink-0" />
              <span className="truncate">Apply Now for Media Team 2026</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>

            <p className="font-inter text-xs text-stone-300 mt-4 leading-relaxed">
              Open to all undergraduate, postgraduate, and doctoral students of The Assam Royal Global University.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
