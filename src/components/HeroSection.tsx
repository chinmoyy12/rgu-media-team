import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Camera, Video, Film, Radio, Mic, Aperture } from 'lucide-react';
import { UniversityLogo } from './UniversityLogo';

interface HeroSectionProps {
  onApplyClick: () => void;
  onMembersClick?: () => void;
  onShowreelClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onApplyClick, onMembersClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Interactive Media & Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle type with camera / media shapes
    interface MediaParticle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      type: 'dot' | 'cross' | 'frame' | 'aperture';
      size: number;
      rotation: number;
      vRot: number;
    }

    const particles: MediaParticle[] = [];
    const colors = ['#F26A2E', '#FF8F50', '#FFD700', '#FFFFFF'];
    const types: ('dot' | 'cross' | 'frame' | 'aperture')[] = ['dot', 'dot', 'cross', 'frame', 'aperture'];

    for (let i = 0; i < 55; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const baseAlpha = Math.random() * 0.45 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.15,
        alpha: baseAlpha,
        baseAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        size: Math.random() * 12 + 8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.01,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle creative grid lines
      const gridSize = 80;
      ctx.strokeStyle = '#F26A2E';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.04;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particles & camera motifs
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha = p.baseAlpha + Math.sin(time * 3 + p.x) * 0.12;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0.05, Math.min(0.75, p.alpha));
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;

        if (p.type === 'cross') {
          // Camera focus crosshair
          const s = p.size * 0.5;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
          ctx.moveTo(0, -s); ctx.lineTo(0, s);
          ctx.stroke();
        } else if (p.type === 'frame') {
          // Viewfinder focus rectangle box
          const s = p.size;
          ctx.lineWidth = 0.7;
          ctx.strokeRect(-s / 2, -s / 2, s, s);
        } else if (p.type === 'aperture') {
          // Small circle motif
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          // Glow dot
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleExploreClick = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#050505] selection:bg-[#F26A2E] selection:text-white">
      {/* Animated Subtle Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1] animated-grid-bg opacity-70" />

      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.035]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Particle & Creative Grid Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80 z-0" />

      {/* Viewfinder HUD Overlays - Top Corners */}
      <div className="absolute top-28 left-6 sm:left-12 z-10 flex items-center gap-2 font-mono text-[11px] text-stone-400/80 pointer-events-none select-none">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
        <span className="text-red-400 font-bold tracking-wider">REC • 4K 60FPS</span>
      </div>

      <div className="absolute top-28 right-6 sm:right-12 z-10 font-mono text-[11px] text-stone-400/80 pointer-events-none select-none hidden sm:block">
        <span>ISO 400 • F/1.8 • 1/250s</span>
      </div>

      {/* Viewfinder Corner Framing Lines */}
      <div className="absolute top-24 left-4 sm:left-8 w-6 h-6 border-t-2 border-l-2 border-[#F26A2E]/40 pointer-events-none" />
      <div className="absolute top-24 right-4 sm:right-8 w-6 h-6 border-t-2 border-r-2 border-[#F26A2E]/40 pointer-events-none" />
      <div className="absolute bottom-12 left-4 sm:left-8 w-6 h-6 border-b-2 border-l-2 border-[#F26A2E]/40 pointer-events-none" />
      <div className="absolute bottom-12 right-4 sm:right-8 w-6 h-6 border-b-2 border-r-2 border-[#F26A2E]/40 pointer-events-none" />

      {/* Cinematic Studio Gradient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F26A2E]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#F26A2E]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Media Icons */}
      <div className="absolute top-32 left-[8%] p-3 rounded-2xl glass-card border border-stone-800/80 animate-float opacity-30 pointer-events-none hidden md:flex items-center justify-center text-[#F26A2E]">
        <Camera className="w-5 h-5" />
      </div>
      <div className="absolute top-44 right-[10%] p-3 rounded-2xl glass-card border border-stone-800/80 animate-float opacity-30 pointer-events-none hidden md:flex items-center justify-center text-amber-400" style={{ animationDelay: '1.5s' }}>
        <Video className="w-5 h-5" />
      </div>
      <div className="absolute bottom-32 left-[12%] p-3 rounded-2xl glass-card border border-[#F26A2E]/30 animate-float opacity-40 pointer-events-none hidden md:flex items-center justify-center text-[#F26A2E]" style={{ animationDelay: '2.5s' }}>
        <Film className="w-5 h-5" />
      </div>
      <div className="absolute bottom-40 right-[8%] p-3 rounded-2xl glass-card border border-stone-800/80 animate-float opacity-30 pointer-events-none hidden md:flex items-center justify-center text-amber-300" style={{ animationDelay: '3.5s' }}>
        <Aperture className="w-5 h-5" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* University Badge Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full glass-card border border-[#F26A2E]/40 text-[11px] sm:text-xs md:text-sm font-semibold text-stone-100 mb-6 sm:mb-8 shadow-[0_0_20px_rgba(242,106,46,0.2)]">
          <ShieldCheck className="w-4 h-4 text-[#F26A2E] shrink-0" />
          <span className="tracking-wide">OFFICIAL MEDIA CELL • GUWAHATI, ASSAM</span>
        </div>

        {/* Center University Crest Seal */}
        <div className="mb-5 sm:mb-6 transform hover:scale-105 transition-transform duration-500">
          <UniversityLogo variant="hero" showText={false} />
        </div>

        {/* Main Heading: MEDIA TEAM (Fluid clamp typography for seamless mobile scaling) */}
        <h1 className="font-cinzel text-fluid-hero font-black tracking-tight sm:tracking-wider text-white mb-4 drop-shadow-2xl max-w-full">
          MEDIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F26A2E] via-amber-400 to-orange-500 text-glow-orange inline-block">TEAM</span>
        </h1>

        {/* Subheading lines with enhanced accessibility contrast */}
        <div className="max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
          <p className="font-playfair text-xl sm:text-2xl md:text-3xl italic text-stone-100 tracking-wide font-medium">
            Capturing Moments. Creating Stories.
          </p>
          <p className="font-inter text-sm sm:text-base md:text-lg text-stone-200 font-normal tracking-wide leading-relaxed">
            Preserving Memories. Building the University's Digital Identity.
          </p>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-14">
          {/* Apply Now */}
          <button
            onClick={onApplyClick}
            className="group relative inline-flex items-center gap-2.5 py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#F26A2E] via-[#FF7A3D] to-amber-600 text-white font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(242,106,46,0.5)] hover:shadow-[0_0_50px_rgba(242,106,46,0.8)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer overflow-hidden"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Explore Team */}
          <button
            onClick={onMembersClick || handleExploreClick}
            className="py-3.5 px-6 rounded-full glass-card border border-stone-700 hover:border-[#F26A2E]/60 text-stone-100 hover:text-white font-semibold text-sm sm:text-base transition-all hover:bg-stone-800/50 cursor-pointer"
          >
            Explore Team
          </button>
        </div>

        {/* Mouse Scroll Indicator */}
        <button
          onClick={handleExploreClick}
          className="flex flex-col items-center gap-2 text-stone-300 hover:text-[#F26A2E] transition-colors cursor-pointer group"
          aria-label="Scroll down"
        >
          <span className="font-inter text-[11px] uppercase tracking-[0.25em] font-medium text-stone-300 group-hover:text-[#F26A2E]">
            SCROLL TO EXPLORE
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-stone-700 group-hover:border-[#F26A2E] flex items-start justify-center p-1.5 transition-colors">
            <div className="w-1.5 h-2.5 rounded-full bg-[#F26A2E] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};

