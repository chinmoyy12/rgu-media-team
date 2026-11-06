/**
 * Site-wide micro-interactions, applied by delegation so existing components
 * don't need to change:
 *  - 3D tilt + cursor glare on glass cards
 *  - masked, rising reveals for section headings
 *  - spotlight that follows the cursor across sections
 */
export function startFx() {
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanups: Array<() => void> = [];

  /* ---------- tilt + glare ---------- */
  if (fine && !reduce) {
    const SEL = '.glass-card, .glass-card-gradient, [data-tilt]';
    let cur: HTMLElement | null = null;
    let raf = 0;
    let ev: PointerEvent | null = null;

    const release = (el: HTMLElement) => {
      el.classList.remove('fx-tilt');
      el.classList.add('fx-tilt-out');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--go', '0');
      window.setTimeout(() => el.classList.remove('fx-tilt-out', 'fx-glare'), 700);
    };

    const apply = () => {
      raf = 0;
      if (!ev) return;
      const off = document.documentElement.classList.contains('fx-no-tilt');
      const t = off ? null : ((ev.target as HTMLElement)?.closest?.(SEL) as HTMLElement | null);
      const ok = t && t.offsetWidth < 760 && t.offsetHeight < 640 && !t.closest('.vr-track, .valley-track');
      const el = ok ? t : null;
      if (el !== cur) {
        if (cur) release(cur);
        cur = el;
        if (el) {
          if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
          el.classList.remove('fx-tilt-out');
          el.classList.add('fx-tilt', 'fx-glare');
        }
      }
      if (!cur) return;
      const b = cur.getBoundingClientRect();
      const px = (ev.clientX - b.left) / b.width,
        py = (ev.clientY - b.top) / b.height;
      const k = Math.min(1, 420 / Math.max(b.width, b.height)); // big cards tilt less
      cur.style.setProperty('--rx', `${(0.5 - py) * 10 * k}deg`);
      cur.style.setProperty('--ry', `${(px - 0.5) * 12 * k}deg`);
      cur.style.setProperty('--gx', `${px * 100}%`);
      cur.style.setProperty('--gy', `${py * 100}%`);
      cur.style.setProperty('--go', '1');
    };
    const onMove = (e: PointerEvent) => {
      ev = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (cur) release(cur);
      cur = null;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    });
  }

  /* ---------- heading reveals ---------- */
  if (!reduce) {
    // A fully clipped element has no visible area for IntersectionObserver,
    // so watch each heading's parent and reveal the heading(s) inside it.
    const owners = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // reveal when on screen, or when the page jumped past it
          if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
          (owners.get(e.target) || []).forEach((h) => h.classList.add('in'));
          owners.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );
    const watch = (h: HTMLElement) => {
      const p = h.parentElement || h;
      const list = owners.get(p);
      if (list) list.push(h);
      else {
        owners.set(p, [h]);
        io.observe(p);
      }
    };
    const scan = () => {
      document.querySelectorAll<HTMLElement>('main h2:not([data-fx]), main section h3.font-cinzel:not([data-fx])').forEach((h) => {
        h.dataset.fx = '1';
        if (h.closest('.vr-track, .valley-track') || h.classList.contains('sr-only')) return;
        const r = h.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) return; // already on screen
        h.classList.add('fx-reveal');
        watch(h);
      });
    };
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    // safety net for jumps that skip straight past a heading
    let sraf = 0;
    const onScroll = () => {
      if (sraf) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        owners.forEach((hs, p) => {
          if (p.getBoundingClientRect().top < window.innerHeight * 0.9) {
            hs.forEach((h) => h.classList.add('in'));
            owners.delete(p);
            io.unobserve(p);
          }
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(sraf);
      io.disconnect();
      mo.disconnect();
      // un-mark anything this run claimed so a later run can pick it up
      document.querySelectorAll<HTMLElement>('[data-fx]').forEach((h) => {
        delete h.dataset.fx;
        if (!h.classList.contains('in')) h.classList.remove('fx-reveal');
      });
    });
  }

  /* ---------- section spotlight ---------- */
  if (fine && !reduce) {
    let raf = 0;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const s = (e.target as HTMLElement)?.closest?.('main section:not(.valley-stage):not(.vr-stage)') as HTMLElement | null;
        if (last && last !== s) last.classList.remove('fx-spot-on');
        last = s;
        if (!s) return;
        const b = s.getBoundingClientRect();
        s.classList.add('fx-spot', 'fx-spot-on');
        s.style.setProperty('--sx', `${e.clientX - b.left}px`);
        s.style.setProperty('--sy', `${e.clientY - b.top}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    cleanups.push(() => document.removeEventListener('pointermove', onMove));
  }

  return () => cleanups.forEach((f) => f());
}
