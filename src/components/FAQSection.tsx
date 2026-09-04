import React, { useState } from 'react';
import { faqData } from '../data/mockData';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 relative bg-[#08080C] overflow-hidden border-t border-stone-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            RECRUITMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] to-amber-400">FAQ</span>
          </h2>
          <p className="font-inter text-stone-400 text-sm sm:text-base">
            Everything you need to know about joining the Media Team of The Assam Royal Global University.
          </p>
        </div>

        {/* Animated Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="glass-card rounded-2xl border border-stone-800 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-900/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-cinzel text-base md:text-lg font-bold text-white flex items-center gap-3">
                    <span className="text-[#F26A2E] font-mono text-sm">?</span>
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-full bg-stone-900 text-[#F26A2E] border border-stone-800 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#F26A2E] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 font-inter text-stone-300 text-xs sm:text-sm leading-relaxed border-t border-stone-800/80 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
