import React, { useEffect, useRef } from 'react';
import { perfTier } from '../lib/device';

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  phase: number;
  color: string;
  shape: 'dot' | 'cross' | 'frame';
  size: number;
  rotation: number;
  vRot: number;
}

const COLORS = ['#F26A2E', '#FFA048', '#FFC107', '#FF6D00', '#FFFFFF'];
const SHAPES: Particle['shape'][] = ['dot', 'dot', 'cross', 'frame'];

/**
 * Drifting media-motif particles behind a section.
 * The canvas is only ever viewport-sized (it sticks while its section scrolls),
 * pauses when off-screen or in a background tab, and runs at the same speed on
 * any refresh rate. Weak devices get fewer particles and no connecting lines.
 */
export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = 'absolute inset-0 pointer-events-none z-0',
  particleCount = 65,
  interactive = true,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tier = perfTier();
    const count = Math.round(particleCount * (tier === 'low' ? 0.45 : tier === 'mid' ? 0.75 : 1));
    const links = tier !== 'low';
    const dpr = Math.min(tier === 'high' ? 1.5 : 1, devicePixelRatio || 1);
    const pointer = interactive && window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    const resize = () => {
      width = canvas.clientWidth || wrap.clientWidth;
      height = canvas.clientHeight || Math.min(wrap.clientHeight, innerHeight);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.12,
      baseAlpha: Math.random() * 0.45 + 0.18,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: Math.random() * 10 + 6,
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.01,
    }));

    const mouse = { x: -1000, y: -1000, radius: 130 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -1000;
    };
    if (pointer) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    let raf = 0;
    let last = 0;
    let time = 0;
    let onScreen = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const f = last ? Math.min(3, (now - last) / 16.67) : 1; // 1 at 60 fps
      last = now;
      time += 0.015 * f;
      ctx.clearRect(0, 0, width, height);

      if (links) {
        const max = 110;
        ctx.strokeStyle = '#F26A2E';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < max * max) {
              ctx.globalAlpha = (1 - Math.sqrt(d2) / max) * 0.12;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const p of particles) {
        const alpha = Math.max(0.05, Math.min(0.85, p.baseAlpha + Math.sin(time * 4 + p.phase) * 0.12));
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.rotation += p.vRot * f;
        if (pointer && mouse.x > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < mouse.radius && d > 0.01) {
            const force = ((mouse.radius - d) / mouse.radius) * 1.5 * f;
            p.x += (dx / d) * force;
            p.y += (dy / d) * force;
          }
        }
        if (p.x < -15) p.x = width + 15;
        else if (p.x > width + 15) p.x = -15;
        if (p.y < -15) p.y = height + 15;
        else if (p.y > height + 15) p.y = -15;

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.shape === 'dot') {
          ctx.globalAlpha = alpha * 0.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = alpha;
          if (p.shape === 'cross') {
            const s = p.size * 0.4;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
          } else {
            const s = p.size * 0.8;
            ctx.lineWidth = 0.6;
            ctx.strokeRect(-s / 2, -s / 2, s, s);
          }
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    };

    const play = () => {
      if (raf || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) play();
      else pause();
    });
    io.observe(wrap);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (pointer) {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [particleCount, interactive]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true" style={{ overflow: 'clip' }}>
      {/* faint media grid as a static background instead of redrawing it every frame */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'sticky',
          top: 0,
          display: 'block',
          width: '100%',
          height: 'min(100%, 100vh)',
          maxHeight: '100vh',
          opacity: 0.85,
          backgroundImage:
            'linear-gradient(to right, rgba(242,106,46,.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,106,46,.035) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />
    </div>
  );
};
