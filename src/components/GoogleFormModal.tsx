import React from 'react';
import { ExternalLink, X, Sparkles, CheckCircle2, Clock, FileText, MessageSquare, Home } from 'lucide-react';
import { config } from '../config';
import confetti from 'canvas-confetti';

interface GoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHomeClick?: () => void;
}

export const GoogleFormModal: React.FC<GoogleFormModalProps> = ({ isOpen, onClose, onHomeClick }) => {
  if (!isOpen) return null;

  const handleOpenGoogleForm = () => {
    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F26A2E', '#FF8F50', '#FFFFFF', '#FFD700']
    });

    // Open Google Form in new browser tab
    window.open(config.googleFormUrl, '_blank', 'noopener,noreferrer');
    if (onHomeClick) onHomeClick();
    onClose();
  };

  const handleOpenWhatsappGroup = () => {
    // Open WhatsApp group in new tab
    window.open(config.recruitment.whatsappAssistGroup, '_blank', 'noopener,noreferrer');
    if (onHomeClick) onHomeClick();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl glass-card rounded-2xl p-5 sm:p-7 border border-[#F26A2E]/30 shadow-[0_0_60px_rgba(242,106,46,0.25)] overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Radial Glows */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#F26A2E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5 pr-8">
          <div className="p-3 rounded-2xl bg-[#F26A2E]/15 text-[#F26A2E] border border-[#F26A2E]/30 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Recruitment Live
              </span>
              <span className="text-xs text-stone-400 font-mono">
                AY {config.recruitment.academicYear}
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              Apply & Connect
            </h3>
            <p className="font-inter text-xs sm:text-sm text-stone-300 mt-1">
              Select your preferred option below to apply or get recruitment support:
            </p>
          </div>
        </div>

        {/* Deadline Banner */}
        <div className="bg-stone-900/80 border border-stone-800/90 rounded-xl p-3.5 mb-6 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <Clock className="w-4 h-4 text-[#F26A2E] shrink-0" />
            <span>Application Deadline:</span>
          </div>
          <span className="font-bold text-[#F26A2E] bg-[#F26A2E]/10 px-2.5 py-1 rounded-md border border-[#F26A2E]/20">
            {config.recruitment.deadlineDate}
          </span>
        </div>

        {/* Options Grid / Cards */}
        <div className="space-y-4 mb-6">
          {/* Option 1: Google Form */}
          <div 
            onClick={handleOpenGoogleForm}
            className="group relative bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-[#F26A2E]/70 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_25px_rgba(242,106,46,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[#F26A2E]/15 text-[#F26A2E] border border-[#F26A2E]/30 group-hover:scale-110 transition-transform shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base group-hover:text-[#F26A2E] transition-colors">
                    Official Google Form
                  </h4>
                  <span className="bg-[#F26A2E]/20 text-[#F26A2E] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#F26A2E]/30 uppercase tracking-wider">
                    Primary
                  </span>
                </div>
                <p className="font-inter text-xs text-stone-300 mt-1 leading-relaxed">
                  Fill out the official online application form to register for departments across the Media Team.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F26A2E] to-amber-600 hover:from-[#e0591d] hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 shadow-sm transition-all group-hover:scale-105"
            >
              <span>Open Google Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option 2: WhatsApp Group */}
          <div 
            onClick={handleOpenWhatsappGroup}
            className="group relative bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-emerald-500/70 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                    WhatsApp Recruitment Group
                  </h4>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    Help & Updates
                  </span>
                </div>
                <p className="font-inter text-xs text-stone-300 mt-1 leading-relaxed">
                  Join our official WhatsApp group to ask queries, connect with team leads, and get real-time guidance.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 shadow-sm transition-all group-hover:scale-105"
            >
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer / Close */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
          {onHomeClick ? (
            <button
              onClick={() => {
                onHomeClick();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-800 hover:border-[#F26A2E] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#F26A2E]" />
              <span>Switch to Home Page</span>
            </button>
          ) : <div />}
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/60 text-xs font-medium transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
