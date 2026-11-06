import React, { useEffect, useRef } from 'react';

/**
 * VelocityMarquee: two bands of oversized type that drift in opposite
 * directions; scrolling speeds them up and skews them.
 */
export const VelocityMarquee: React.FC<{ words: string[] }> = ({ words }) => {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll('.km-row')) as HTMLElement[];
    let x = 0,
      v = 0,
      lastY = window.scrollY,
      raf = 0,
      visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    function tick() {
      raf = 0;
      if (!visible) return;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      v += (dy * 0.12 - v) * 0.1;
      x -= 0.6 + Math.abs(v) * 1.4;
      const skew = Math.max(-10, Math.min(10, v * 1.2));
      rows.forEach((r, i) => {
        const w = r.scrollWidth / 2 || 1;
        const off = ((i % 2 ? -x : x) % w + w) % w;
        r.style.transform = `translate3d(${-off}px,0,0) skewX(${i % 2 ? skew : -skew}deg)`;
      });
      raf = requestAnimationFrame(tick);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const line = (outline: boolean) => (
    <div className={`km-row ${outline ? 'km-outline' : ''}`}>
      {[0, 1].map((k) => (
        <span key={k} aria-hidden={k === 1}>
          {words.map((w, i) => (
            <React.Fragment key={i}>
              <b>{w}</b>
              <i>✦</i>
            </React.Fragment>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className="km" aria-label={words.join(', ')}>
      {line(false)}
      {line(true)}
    </div>
  );
};

/**
 * Manifesto: a large statement whose words light up one by one as it
 * scrolls through the viewport.
 */
export const Manifesto: React.FC<{ label: string; text: string; accent?: string[] }> = ({ label, text, accent = [] }) => {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll('.mf-w')) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.2)));
      const n = words.length;
      words.forEach((w, i) => {
        const k = Math.min(1, Math.max(0, p * n * 1.15 - i));
        w.style.setProperty('--k', k.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [text]);

  const acc = new Set(accent.map((a) => a.toLowerCase()));
  return (
    <section ref={root} className="mf" aria-label={label}>
      <p className="mf-label">
        <i /> {label}
      </p>
      <p className="mf-text">
        {text.split(' ').map((w, i) => (
          <span key={i} className={`mf-w ${acc.has(w.replace(/[^\w]/g, '').toLowerCase()) ? 'mf-acc' : ''}`}>
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  );
};
