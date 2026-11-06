import React, { useEffect, useRef } from 'react';

/** Smooth dot + lagging ring cursor with magnetic pull on buttons and links. */
export const CustomCursor: React.FC = () => {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const d = dot.current!,
      r = ring.current!;
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      scale = 1,
      targetScale = 1,
      raf = 0,
      shown = false;
    let magnet: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        d.style.opacity = r.style.opacity = '1';
      }
      const t = (e.target as HTMLElement | null)?.closest?.('a,button,[role="button"],input,textarea,select,.cursor-pointer') as HTMLElement | null;
      if (t !== magnet) {
        if (magnet) magnet.style.transform = '';
        magnet = t && (t.tagName === 'BUTTON' || t.tagName === 'A') && t.offsetWidth < 260 ? t : null;
      }
      targetScale = t ? 2.1 : 1;
      if (magnet) {
        const b = magnet.getBoundingClientRect();
        const mx = (x - (b.left + b.width / 2)) * 0.18,
          my = (y - (b.top + b.height / 2)) * 0.18;
        magnet.style.transform = `translate(${mx}px,${my}px)`;
      }
    };
    const down = () => (targetScale *= 0.7);
    const up = () => (targetScale /= 0.7);
    const leave = () => {
      shown = false;
      d.style.opacity = r.style.opacity = '0';
    };
    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.15;
      d.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      r.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (magnet) magnet.style.transform = '';
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[#f5efe2] opacity-0 mix-blend-difference"
      />
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 rounded-full border border-[#f5efe2]/70 opacity-0 mix-blend-difference transition-opacity duration-300"
      />
    </>
  );
};
