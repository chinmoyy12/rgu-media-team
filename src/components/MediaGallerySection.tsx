import React, { useState } from 'react';
import { Camera, Maximize2, ExternalLink, Sparkles, Image as ImageIcon, X, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUpItemVariants } from './AnimatedSection';
import { ImageWithSkeleton } from './Skeleton';

interface MediaImage {
  id: number;
  title: string;
  category: string;
  directUrl: string;
  pageUrl: string;
  caption: string;
  date: string;
}

export const MediaGallerySection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<MediaImage | null>(null);

  const mediaImages: MediaImage[] = [
    {
      id: 1,
      title: "Royal Campus Celebrations",
      category: "Event Photography",
      directUrl: "https://i.ibb.co/DhkKShw/Whats-App-Image-2026-07-28-at-10-41-58-PM.jpg",
      pageUrl: "https://ibb.co/hbH8tb2",
      caption: "High-energy moments from the official Royal Global University campus fest coverage.",
      date: "May 14, 2026",
    },
    {
      id: 2,
      title: "Cultural Fest Highlights",
      category: "Cultural & Stage",
      directUrl: "https://i.ibb.co/7dbFJn9L/Whats-App-Image-2026-07-28-at-10-42-02-PM.jpg",
      pageUrl: "https://ibb.co/dw7y0Phx",
      caption: "Vibrant stage performances captured live by the RGU Media Photography Wing.",
      date: "April 22, 2026",
    },
    {
      id: 3,
      title: "Student Showcase & Energy",
      category: "Campus Life",
      directUrl: "https://i.ibb.co/27T7PX64/Whats-App-Image-2026-07-28-at-10-42-38-PM.jpg",
      pageUrl: "https://ibb.co/5WPWvq9H",
      caption: "Capturing the spirit, enthusiasm, and unforgettable memories of Royalites.",
      date: "March 18, 2026",
    },
    {
      id: 4,
      title: "Live Production Coverage",
      category: "Media Production",
      directUrl: "https://i.ibb.co/99hXbdJz/Whats-App-Image-2026-07-28-at-10-43-02-PM.jpg",
      pageUrl: "https://ibb.co/pvQDfkgG",
      caption: "Unfiltered live moments and candid frames from major varsity events.",
      date: "February 28, 2026",
    },
    {
      id: 5,
      title: "Behind The Scenes",
      category: "RGU Media Crew",
      directUrl: "https://i.ibb.co/5xkmcV5d/Whats-App-Image-2026-07-28-at-10-56-27-PM.jpg",
      pageUrl: "https://ibb.co/M5frNLRb",
      caption: "The media crew operating cameras, rigs, and production desks in action.",
      date: "January 15, 2026",
    },
    {
      id: 6,
      title: "Stage & Lighting Spectacle",
      category: "Concert & Night Events",
      directUrl: "https://i.ibb.co/dswM0SWN/Whats-App-Image-2026-07-28-at-10-57-03-PM.jpg",
      pageUrl: "https://ibb.co/TDx2BZvQ",
      caption: "Illuminated stage setups and electrifying musical night performances.",
      date: "December 10, 2025",
    },
  ];

  return (
    <section id="media-gallery" className="py-24 relative bg-[#080808] overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#F26A2E]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26A2E]/10 border border-[#F26A2E]/30 text-[#F26A2E] font-mono text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>OFFICIAL MEDIA CELL GALLERY</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            RGU MEDIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-[#F26A2E]">PHOTO GALLERY</span>
          </h2>
          <p className="font-inter text-stone-300 text-sm sm:text-base leading-relaxed">
            High-definition visual captures from major events, stage performances, and behind-the-scenes moments produced by the official Media Team.
          </p>
        </div>

        {/* 6-Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {mediaImages.map((image) => (
            <motion.div
              key={image.id}
              variants={fadeInUpItemVariants}
              onClick={() => setActiveImage(image)}
              className="group relative glass-card rounded-3xl overflow-hidden border border-stone-800 hover:border-[#F26A2E]/60 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_0_30px_rgba(242,106,46,0.25)] hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-900 relative">
                <ImageWithSkeleton
                  src={image.directUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 text-[11px] font-mono text-stone-200">
                  {image.category}
                </div>

                {/* Hover-to-reveal Event Date Subtle Overlay */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-[#F26A2E]/50 text-xs font-mono text-stone-100 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <Calendar className="w-3.5 h-3.5 text-[#F26A2E]" />
                  <span>{image.date}</span>
                </div>

                {/* Maximize Icon */}
                <div className="absolute top-4 right-4 p-2.5 rounded-full bg-[#F26A2E]/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-5 bg-stone-950/90 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white group-hover:text-[#F26A2E] transition-colors">
                    {image.title}
                  </h3>
                  <p className="font-inter text-xs text-stone-300 line-clamp-1 mt-0.5">
                    {image.caption}
                  </p>
                </div>

                <a
                  href={image.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl text-stone-400 hover:text-[#F26A2E] hover:bg-stone-900 transition-colors shrink-0 ml-2"
                  title="Open source image"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full glass-card-gradient rounded-3xl border border-[#F26A2E]/40 p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-stone-900/90 text-stone-300 hover:text-white hover:bg-[#F26A2E] transition-all cursor-pointer z-20 border border-stone-700"
              aria-label="Close image modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="max-h-[70vh] w-full rounded-2xl overflow-hidden bg-stone-950 flex items-center justify-center mb-4 border border-stone-800">
              <img
                src={activeImage.directUrl}
                alt={activeImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <span className="font-mono text-xs text-[#F26A2E] font-semibold uppercase tracking-wider block mb-1">
                  {activeImage.category}
                </span>
                <h3 className="font-cinzel text-xl font-bold text-white">
                  {activeImage.title}
                </h3>
                <p className="font-inter text-stone-300 text-xs sm:text-sm mt-1">
                  {activeImage.caption}
                </p>
              </div>

              <a
                href={activeImage.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-stone-900 hover:bg-[#F26A2E] text-stone-200 hover:text-white border border-stone-700 hover:border-[#F26A2E] transition-all font-semibold text-xs shrink-0 cursor-pointer"
              >
                <span>View Original Photo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
