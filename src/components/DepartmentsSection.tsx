import React, { useState } from 'react';
import { motion } from 'motion/react';
import { fadeInUpItemVariants } from './AnimatedSection';
import { departmentsData } from '../data/mockData';
import { Department } from '../types';
import {
  Camera,
  Video,
  Smartphone,
  Mic,
  FileText,
  Palette,
  SmartphoneNfc,
  Share2,
  Archive,
  ChevronRight,
  X,
  Sparkles,
  Layers
} from 'lucide-react';

interface DepartmentsSectionProps {
  onApplyClick: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ onApplyClick }) => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-6 h-6 text-[#F26A2E]" />;
      case 'Video':
        return <Video className="w-6 h-6 text-red-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-amber-400" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-purple-400" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-emerald-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-blue-400" />;
      case 'SmartphoneNfc':
        return <SmartphoneNfc className="w-6 h-6 text-pink-400" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-cyan-400" />;
      case 'Archive':
        return <Archive className="w-6 h-6 text-indigo-400" />;
      default:
        return <Layers className="w-6 h-6 text-[#F26A2E]" />;
    }
  };

  return (
    <section id="departments" className="py-24 relative bg-[#050505] overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#F26A2E]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SPECIALIZED CREATIVE WINGS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-orange-500">DEPARTMENTS</span>
          </h2>
          <p className="font-inter text-stone-300 text-sm sm:text-base">
            Ten specialized media wings collaborating seamlessly to bring campus stories, cultural fests, and academic achievements to life.
          </p>
        </div>

        {/* Department Glass Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {departmentsData.map((dept) => (
            <motion.div
              key={dept.id}
              variants={fadeInUpItemVariants}
              onClick={() => setSelectedDept(dept)}
              className="group relative glass-card p-6 rounded-2xl border border-stone-800 hover:border-[#F26A2E]/60 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Card Ambient Glow background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div>
                {/* Header row with Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 group-hover:border-[#F26A2E]/40 transition-colors">
                    {getDepartmentIcon(dept.iconName)}
                  </div>
                </div>

                {/* Title & Short Description */}
                <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#F26A2E] transition-colors mb-2">
                  {dept.title}
                </h3>
                <p className="font-inter text-stone-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                  {dept.shortDesc}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {dept.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-stone-900/80 text-[11px] text-stone-400 border border-stone-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {dept.skills.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-stone-900/80 text-[11px] text-[#F26A2E]">
                      +{dept.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                <span>Head: <strong className="text-stone-200">{dept.headName}</strong></span>
                <span className="text-[#F26A2E] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Wing <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Department Detail Modal Drawer */}
      {selectedDept && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl glass-card rounded-3xl p-5 sm:p-6 md:p-8 border border-[#F26A2E]/40 shadow-[0_0_60px_rgba(242,106,46,0.3)] overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#F26A2E]/15 border border-[#F26A2E]/30">
                {getDepartmentIcon(selectedDept.iconName)}
              </div>
              <div>
                <span className="text-xs text-[#F26A2E] font-mono font-semibold uppercase tracking-widest">
                  DEPARTMENT OVERVIEW
                </span>
                <h3 className="font-cinzel text-2xl md:text-3xl font-extrabold text-white">
                  {selectedDept.title}
                </h3>
              </div>
            </div>

            <p className="font-inter text-stone-300 text-sm md:text-base leading-relaxed mb-6">
              {selectedDept.fullDesc}
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 mb-6 text-xs text-stone-300">
              <div>
                <span className="text-stone-400 block mb-1">Department Head</span>
                <strong className="text-white text-sm">{selectedDept.headName}</strong>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">Archived Works</span>
                <strong className="text-amber-400 text-sm">{selectedDept.featuredWorksCount}+ Items</strong>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-inter text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Core Skills & Tooling
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDept.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-stone-900 text-xs font-medium text-stone-200 border border-stone-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedDept(null);
                  onApplyClick();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F26A2E] to-amber-600 text-white text-sm font-semibold shadow-[0_0_20px_#F26A2E] transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Apply for this Wing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
