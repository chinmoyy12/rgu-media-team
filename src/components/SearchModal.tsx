import React, { useState } from 'react';
import { Search, X, Users, Layers, Camera, ArrowRight } from 'lucide-react';
import { teamMembers, departmentsData, galleryItems } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onApplyClick }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedMembers = query.trim()
    ? teamMembers.filter((m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.position.toLowerCase().includes(query.toLowerCase()) ||
        m.department.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedDepts = query.trim()
    ? departmentsData.filter((d) =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.shortDesc.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedGallery = query.trim()
    ? galleryItems.filter((g) =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.category.toLowerCase().includes(query.toLowerCase()) ||
        g.photographer.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalResults = matchedMembers.length + matchedDepts.length + matchedGallery.length;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl glass-card rounded-3xl p-6 border border-[#F26A2E]/40 shadow-[0_0_60px_rgba(242,106,46,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#F26A2E]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team members, departments, or photo archives..."
            className="w-full bg-stone-900 border border-stone-800 focus:border-[#F26A2E] text-white text-sm sm:text-base rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none transition-colors"
          />
          <button
            onClick={onClose}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
          {!query.trim() && (
            <div className="py-12 text-center text-stone-400 text-xs sm:text-sm font-inter">
              Type keywords like <span className="text-[#F26A2E] font-mono">"Photography"</span>, <span className="text-[#F26A2E] font-mono">"Jitumoni"</span>, or <span className="text-[#F26A2E] font-mono">"Convocation"</span> to search the RGU Media Portal.
            </div>
          )}

          {query.trim() && totalResults === 0 && (
            <div className="py-12 text-center text-stone-400 text-xs sm:text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Members Match */}
          {matchedMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F26A2E] uppercase mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Team Members ({matchedMembers.length})</span>
              </div>
              <div className="space-y-2">
                {matchedMembers.map((m) => (
                  <a
                    key={m.id}
                    href="#members"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 hover:bg-[#F26A2E]/10 border border-stone-800 hover:border-[#F26A2E]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F26A2E]/20 text-[#F26A2E] font-cinzel text-xs font-bold flex items-center justify-center border border-[#F26A2E]/40 shrink-0">
                        {m.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <span className="font-cinzel text-sm font-bold text-white block">{m.name}</span>
                        <span className="font-inter text-xs text-stone-400">{m.position} • {m.department}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F26A2E]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Departments Match */}
          {matchedDepts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Departments ({matchedDepts.length})</span>
              </div>
              <div className="space-y-2">
                {matchedDepts.map((d) => (
                  <a
                    key={d.id}
                    href="#departments"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/40 transition-colors"
                  >
                    <div>
                      <span className="font-cinzel text-sm font-bold text-white block">{d.title}</span>
                      <span className="font-inter text-xs text-stone-400">{d.shortDesc}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Match */}
          {matchedGallery.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase mb-3">
                <Camera className="w-3.5 h-3.5" />
                <span>Gallery Archives ({matchedGallery.length})</span>
              </div>
              <div className="space-y-2">
                {matchedGallery.map((g) => (
                  <a
                    key={g.id}
                    href="#gallery"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-900/80 hover:bg-emerald-500/10 border border-stone-800 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={g.imageUrl} alt={g.title} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <span className="font-cinzel text-sm font-bold text-white block">{g.title}</span>
                        <span className="font-inter text-xs text-stone-400">{g.category} • By {g.photographer}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
