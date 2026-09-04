import React, { useState } from 'react';
import { motion } from 'motion/react';
import { fadeInUpItemVariants } from './AnimatedSection';
import { teamMembers } from '../data/mockData';
import { Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';

interface MembersSectionProps {
  onMembersClick?: () => void;
}

export const MembersSection: React.FC<MembersSectionProps> = ({ onMembersClick }) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Sort team members strictly according to hierarchy
  const filteredMembers = [...teamMembers].sort((a, b) => a.hierarchyOrder - b.hierarchyOrder);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="members" className="py-24 relative bg-[#08080C] overflow-hidden border-t border-stone-800/60">
      {/* Smooth Particle Animated Background */}
      <ParticleBackground particleCount={50} interactive={true} />

      {/* Background Lights */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#F26A2E]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>LEADERSHIP & CREATIVE CREW</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            MEMBERS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-orange-500">INFORMATION</span>
          </h2>
          <p className="font-inter text-stone-300 text-sm sm:text-base mb-6">
            Meet the leaders, department heads, and coordinators steering the digital and media identity of The Assam Royal Global University.
          </p>

          {onMembersClick && (
            <button
              onClick={onMembersClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-[0_0_25px_rgba(242,106,46,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Open Full Members Info Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Members Hierarchy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const hasImage = member.photoUrl && !failedImages[member.id];

            return (
              <motion.div
                key={member.id}
                variants={fadeInUpItemVariants}
                className="group glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/60 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle top glow line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F26A2E]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Profile Picture / Monogram Badge */}
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-[#F26A2E] transition-all shadow-lg group-hover:shadow-[0_0_20px_rgba(242,106,46,0.35)] bg-stone-900 flex items-center justify-center">
                    {hasImage ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        onError={() => handleImageError(member.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F26A2E]/25 via-amber-500/10 to-stone-900">
                        <span className="font-cinzel text-xl font-bold text-white group-hover:text-[#F26A2E] transition-colors">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name & Position */}
                  <div className="text-center mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F26A2E]/10 text-[#F26A2E] border border-[#F26A2E]/30 mb-1.5 uppercase tracking-wider">
                      {member.position}
                    </span>
                    <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#F26A2E] transition-colors">
                      {member.name}
                    </h3>
                    <p className="font-inter text-xs text-stone-400 font-medium mt-0.5">
                      {member.department}
                    </p>
                  </div>

                  {/* Bio text if available */}
                  {member.bio && (
                    <p className="font-inter text-stone-400 text-xs text-center line-clamp-2 leading-relaxed italic">
                      "{member.bio}"
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View Full Members Info Page Banner at bottom */}
        {onMembersClick && (
          <div className="mt-12 text-center">
            <button
              onClick={onMembersClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700/80 hover:border-[#F26A2E] font-bold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(242,106,46,0.3)] cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#F26A2E]" />
              <span>Explore Dedicated Members Information Page</span>
              <ArrowRight className="w-4 h-4 text-[#F26A2E]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

