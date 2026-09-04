import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = 'absolute inset-0 pointer-events-none z-0',
  particleCount = 65,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 130,
    };

    const updateDimensions = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    updateDimensions();

    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      color: string;
      glowRadius: number;
      shape: 'dot' | 'cross' | 'frame';
      size: number;
      rotation: number;
      vRot: number;
    }

    const particles: Particle[] = [];
    const colors = ['#F26A2E', '#FFA048', '#FFC107', '#FF6D00', '#FFFFFF'];
    const shapes: ('dot' | 'cross' | 'frame')[] = ['dot', 'dot', 'cross', 'frame'];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.45 + 0.18;
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.12,
        baseAlpha,
        alpha: baseAlpha,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
        glowRadius: Math.random() * 8 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 10 + 6,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.008,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render subtle background creative media grid lines
      const gridSize = 90;
      ctx.strokeStyle = '#F26A2E';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.035;

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

      // Render connected lines between nearby particles
      const maxDistance = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#F26A2E';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Render particles & camera motifs
      particles.forEach((p) => {
        p.alpha = p.baseAlpha + Math.sin(time * 4 + p.x) * 0.12;
        p.alpha = Math.max(0.05, Math.min(0.85, p.alpha));

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (interactive && mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 1.5;
            p.y += Math.sin(angle) * force * 1.5;
          }
        }

        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === 'cross') {
          const s = p.size * 0.4;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
          ctx.moveTo(0, -s); ctx.lineTo(0, s);
          ctx.stroke();
        } else if (p.shape === 'frame') {
          const s = p.size * 0.8;
          ctx.lineWidth = 0.6;
          ctx.strokeRect(-s / 2, -s / 2, s, s);
        } else {
          // Soft glow
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 2, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha * 0.2;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: 0.85 }}
    />
  );
};

