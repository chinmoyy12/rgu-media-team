import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { teamMembers } from '../data/mockData';
import { TeamMember } from '../types';
import { ParticleBackground } from './ParticleBackground';
import { MemberCardSkeleton, ImageWithSkeleton } from './Skeleton';
import {
  UserCheck,
  ArrowLeft,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Award
} from 'lucide-react';

interface MembersPageProps {
  onBackToHome: () => void;
  onApplyClick: () => void;
}

export const MembersPage: React.FC<MembersPageProps> = ({ onBackToHome, onApplyClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Sort team members strictly according to hierarchyOrder
  const sortedMembers = [...teamMembers].sort((a, b) => a.hierarchyOrder - b.hierarchyOrder);

  // Extract unique categories for filter tabs
  const categories = ['All', 'Head', 'Executive', 'Chief', 'Deputy', 'Department Head', 'Coordinator'];

  // Filter members by category
  const filteredMembers = sortedMembers.filter((member) => {
    return (
      selectedCategory === 'All' ||
      member.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

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
    <div className="min-h-screen bg-[#050505] text-stone-100 pt-28 pb-20 relative overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://ik.imagekit.io/w61rg4ucfs/MEDIA%20Animation.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505]" />
      </div>

      {/* Particle Animated Background */}
      <ParticleBackground particleCount={80} interactive={true} />

      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#F26A2E]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800/80">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-[#F26A2E] text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#F26A2E] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Main Page</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span className="text-stone-500 hover:text-stone-300 cursor-pointer" onClick={onBackToHome}>Home</span>
            <span>/</span>
            <span className="text-[#F26A2E] font-bold">Members Information</span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-bold mb-4 shadow-[0_0_15px_rgba(242,106,46,0.2)]">
            <UserCheck className="w-4 h-4" />
            <span>OFFICIAL STUDENT BODY ROSTER</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            LEADERSHIP & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-orange-500">CREATIVE CREW</span>
          </h1>
          <p className="font-inter text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the visionary leaders, department heads, and coordinators steering the digital storytelling, broadcasts, and creative media for The Assam Royal Global University.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center justify-start md:justify-center gap-1.5 overflow-x-auto w-full mb-10 p-3 sm:p-4 rounded-2xl glass-card border border-stone-800/80 bg-stone-950/60 backdrop-blur-md scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white shadow-[0_0_15px_rgba(242,106,46,0.4)]'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="font-mono text-xs text-stone-400">
            Showing <span className="text-[#F26A2E] font-bold">{filteredMembers.length}</span> of {sortedMembers.length} members
          </p>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-mono text-[#F26A2E] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filteredMembers.map((member) => {
              const hasImage = member.photoUrl && !failedImages[member.id];

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedMember(member)}
                  className="group glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/70 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  {/* Subtle top glow line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F26A2E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Profile Picture / Monogram Badge */}
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-[#F26A2E] transition-all shadow-xl group-hover:shadow-[0_0_25px_rgba(242,106,46,0.4)] bg-stone-900 flex items-center justify-center shrink-0">
                      {hasImage ? (
                        <ImageWithSkeleton
                          src={member.photoUrl}
                          alt={member.name}
                          onError={() => handleImageError(member.id)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="eager"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          fallbackIcon={
                            <span className="font-cinzel text-xl font-bold text-stone-300">
                              {getInitials(member.name)}
                            </span>
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F26A2E]/25 via-amber-500/10 to-stone-900">
                          <span className="font-cinzel text-2xl font-bold text-white group-hover:text-[#F26A2E] transition-colors">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}

                      {/* Rank Indicator Badge */}
                      <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-stone-950 border border-[#F26A2E] text-[10px] font-mono text-[#F26A2E] flex items-center justify-center font-bold shadow-md">
                        #{member.hierarchyOrder}
                      </span>
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
                      <p className="font-inter text-stone-400 text-xs text-center line-clamp-2 leading-relaxed italic mb-4">
                        "{member.bio}"
                      </p>
                    )}
                  </div>

                  {/* Actions / Details Footer */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-stone-400 text-xs">
                    <span className="font-mono text-[10px] text-stone-500 group-hover:text-[#F26A2E] transition-colors">
                      View Profile Details →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-2xl border border-stone-800">
            <UserCheck className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="font-cinzel text-xl font-bold text-stone-300">No Members Found</h3>
            <p className="font-inter text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              No crew members match the selected category filter. Try selecting another role or clearing filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#F26A2E] text-white text-xs font-bold cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Bottom Call to Action Section */}
        <div className="mt-16 p-8 rounded-3xl glass-card border border-[#F26A2E]/30 text-center relative overflow-hidden bg-gradient-to-b from-stone-950/80 via-stone-900/60 to-stone-950">
          <div className="max-w-2xl mx-auto relative z-10">
            <Sparkles className="w-8 h-8 text-[#F26A2E] mx-auto mb-3 animate-pulse" />
            <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mb-2">
              WANT TO JOIN THE CREATIVE CREW?
            </h3>
            <p className="font-inter text-xs sm:text-sm text-stone-300 mb-6">
              Applications are officially open for student coordinators, photographers, video editors, podcasters, and media managers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onApplyClick}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F26A2E] to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-[0_0_30px_rgba(242,106,46,0.6)] transition-all cursor-pointer"
              >
                APPLY FOR RECRUITMENT HERE
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-full bg-stone-900 text-stone-200 border border-stone-700 hover:border-stone-500 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg glass-card-gradient rounded-3xl p-6 sm:p-8 border border-[#F26A2E]/40 shadow-[0_0_60px_rgba(242,106,46,0.25)] overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors z-20 border border-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {/* Large Profile Picture */}
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#F26A2E] shadow-[0_0_30px_rgba(242,106,46,0.4)] bg-stone-900 flex items-center justify-center">
                  {selectedMember.photoUrl && !failedImages[selectedMember.id] ? (
                    <img
                      src={selectedMember.photoUrl}
                      alt={selectedMember.name}
                      onError={() => handleImageError(selectedMember.id)}
                      className="w-full h-full object-cover"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F26A2E]/30 via-amber-500/20 to-stone-900">
                      <span className="font-cinzel text-3xl font-bold text-white">
                        {getInitials(selectedMember.name)}
                      </span>
                    </div>
                  )}
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F26A2E]/20 text-[#F26A2E] border border-[#F26A2E]/40 mb-2 uppercase tracking-wider">
                  {selectedMember.position}
                </span>

                <h3 className="font-cinzel text-2xl font-bold text-white mb-1">
                  {selectedMember.name}
                </h3>

                <p className="font-inter text-xs text-stone-400 font-medium mb-4 flex items-center justify-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#F26A2E]" />
                  <span>{selectedMember.department}</span>
                </p>

                {/* Bio & Details */}
                {selectedMember.bio && (
                  <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-left">
                    <p className="font-mono text-[11px] text-stone-500 mb-1 uppercase tracking-wider font-semibold">
                      Role Description & Responsibilities
                    </p>
                    <p className="font-inter text-xs sm:text-sm text-stone-300 leading-relaxed italic whitespace-pre-line">
                      "{selectedMember.bio}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
