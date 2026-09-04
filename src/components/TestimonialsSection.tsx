import React, { useEffect, useState } from 'react';
import { testimonialsData } from '../data/mockData';
import { Quote, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section className="py-24 relative bg-[#08080C] overflow-hidden border-t border-stone-800/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COMMUNITY VOICES</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            WHAT THEY SAY ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] to-amber-400">RGU MEDIA</span>
          </h2>
        </div>

        {/* Testimonial Auto-Sliding Glass Card */}
        <div
          className="relative glass-card p-8 md:p-12 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          {/* Decorative quote mark */}
          <Quote className="absolute top-6 right-8 w-20 h-20 text-stone-800/40 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Category Pill */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F26A2E]/15 text-[#F26A2E] border border-[#F26A2E]/30 mb-6">
              {currentTestimonial.category} Endorsement
            </span>

            {/* Quote */}
            <p className="font-playfair text-lg sm:text-xl md:text-2xl text-stone-100 italic leading-relaxed mb-8">
              "{currentTestimonial.quote}"
            </p>

            {/* Avatar & Author Info */}
            <div className="flex items-center gap-4 text-left">
              <img
                src={currentTestimonial.avatarUrl}
                alt={currentTestimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#F26A2E]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-cinzel text-base md:text-lg font-bold text-white">
                  {currentTestimonial.name}
                </h4>
                <p className="font-inter text-xs text-[#F26A2E] font-medium">
                  {currentTestimonial.role}
                </p>
                <p className="font-inter text-[11px] text-stone-400">
                  {currentTestimonial.batchOrDept}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-800/80">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoplay(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-[#F26A2E]' : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-xl glass-card border border-stone-800 text-stone-300 hover:text-white hover:border-[#F26A2E] transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-xl glass-card border border-stone-800 text-stone-300 hover:text-white hover:border-[#F26A2E] transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
