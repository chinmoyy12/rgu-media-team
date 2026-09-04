import React from 'react';
import { timelineData } from '../data/mockData';
import { History, CheckCircle2, Sparkles } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  return (
    <section className="py-24 relative bg-[#050505] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <History className="w-3.5 h-3.5" />
            <span>OUR EVOLUTIONARY JOURNEY</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            THE MEDIA TEAM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] to-amber-400">TIMELINE</span>
          </h2>
          <p className="font-inter text-stone-400 text-sm sm:text-base">
            Tracing our historic trajectory from a foundational 5-member photo club in 2017 to Northeast India's award-winning university media unit.
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative border-l-2 border-stone-800 ml-4 md:ml-32 space-y-12">
          {timelineData.map((milestone) => (
            <div key={milestone.id} className="relative pl-8 md:pl-10 group">
              {/* Glowing Node Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-stone-900 border-2 border-[#F26A2E] group-hover:bg-[#F26A2E] group-hover:scale-125 transition-all shadow-[0_0_12px_#F26A2E]" />

              {/* Year Label on left for desktop */}
              <div className="hidden md:block absolute -left-32 top-0 w-24 text-right">
                <span className="font-cinzel font-black text-2xl text-[#F26A2E] block">
                  {milestone.year}
                </span>
                {milestone.quarter && (
                  <span className="font-mono text-xs text-stone-400">{milestone.quarter}</span>
                )}
              </div>

              {/* Card Container */}
              <div className="glass-card p-6 rounded-2xl border border-stone-800 group-hover:border-[#F26A2E]/50 transition-all">
                <div className="md:hidden mb-2">
                  <span className="font-cinzel font-extrabold text-lg text-[#F26A2E]">
                    {milestone.year} {milestone.quarter && `(${milestone.quarter})`}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl font-bold text-white mb-1">
                  {milestone.title}
                </h3>
                <p className="font-inter text-xs font-semibold text-[#F26A2E] mb-3">
                  {milestone.subtitle}
                </p>
                <p className="font-inter text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {milestone.description}
                </p>

                {/* Highlights list */}
                <div className="space-y-1.5 pt-3 border-t border-stone-800">
                  {milestone.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
