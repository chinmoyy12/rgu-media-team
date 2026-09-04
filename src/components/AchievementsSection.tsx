import React from 'react';
import { achievementsData } from '../data/mockData';
import { Trophy, Medal, Award, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AchievementsSection: React.FC = () => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F26A2E', '#FFD700', '#FFFFFF', '#FF8F50']
    });
  };

  const getMedalIcon = (type: string) => {
    switch (type) {
      case 'Gold':
        return <Trophy className="w-7 h-7 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />;
      case 'Silver':
        return <Medal className="w-7 h-7 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.6)]" />;
      default:
        return <Award className="w-7 h-7 text-[#F26A2E] drop-shadow-[0_0_10px_rgba(242,106,46,0.6)]" />;
    }
  };

  return (
    <section id="achievements" className="py-24 relative bg-[#08080C] overflow-hidden border-t border-stone-800/60">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#F26A2E]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONORS & MILESTONES</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            AWARDS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#F26A2E] to-orange-500">ACHIEVEMENTS</span>
          </h2>
          <p className="font-inter text-stone-400 text-sm sm:text-base mb-6">
            National accolades, digital reach milestones, and broadcasting excellence awards earned by our student media crew.
          </p>

          <button
            onClick={triggerConfetti}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <PartyPopper className="w-4 h-4 text-amber-400" />
            <span>Celebrate Team Triumphs 🎉</span>
          </button>
        </div>

        {/* Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 md:p-8 rounded-3xl border border-stone-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Background gradient blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:bg-amber-500/20 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800">
                    {getMedalIcon(item.badgeType)}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-[#F26A2E] uppercase tracking-wider block">
                      {item.year}
                    </span>
                    <span className="text-[11px] text-stone-400 font-inter">{item.category}</span>
                  </div>
                </div>

                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="font-inter text-xs font-semibold text-[#F26A2E] mb-3">
                  {item.organization}
                </p>
                <p className="font-inter text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Counter Badge */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-xs text-stone-400 font-inter">Milestone Highlight</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                  <Sparkles className="w-3 h-3" />
                  {item.counterValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
