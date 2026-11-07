import React, { useEffect, useRef } from 'react';

/**
 * Particle swarm for the Members page.
 *
 *  1. Rebuild — on open, particles fly in from the screen edges and assemble
 *     the page title (the real heading fades in once they land).
 *  2. Swarm — the title then bursts and the particles flock around the cursor,
 *     stretching out behind it when it moves fast.
 *  3. Hovering the title (or clicking anywhere empty) rebuilds it again.
 *
 * Pure 2D canvas, pointer-events: none, paused while the tab is hidden, and
 * skipped entirely for reduced-motion users.
 */

const COLORS = ['#f26a2e', '#ff8a4c', '#f5b14a', '#ffd9a8', '#f5efe2'];

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** target offset inside the title, relative to its top-left */
  tx: number;
  ty: number;
  /** swarm orbit */
  a: number;
  r: number;
  w: number;
  size: number;
  c: string;
  delay: number;
}

type Mode = 'build' | 'hold' | 'swarm';

export const SwarmCursor: React.FC<{ targetRef: React.RefObject<HTMLElement | null> }> = ({ targetRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const title = targetRef.current;
    if (!canvas || !title) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d')!;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const COUNT = touch || innerWidth < 700 ? 520 : 1100;
    const dpr = Math.min(2, devicePixelRatio || 1);
    let W = 0,
      H = 0;

    // hide the real heading until the particles have built it
    title.style.transition = 'opacity .9s ease, filter .9s ease';
    title.style.opacity = '0';
    title.style.filter = 'blur(8px)';
    const showTitle = (on: boolean) => {
      title.style.opacity = on ? '1' : '0.12';
      title.style.filter = on ? 'blur(0)' : 'blur(6px)';
    };

    const parts: P[] = [];
    for (let i = 0; i < COUNT; i++) {
      parts.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        a: Math.random() * Math.PI * 2,
        r: 14 + Math.pow(Math.random(), 1.7) * 120,
        w: (0.6 + Math.random() * 1.6) * (Math.random() < 0.5 ? -1 : 1),
        size: 0.7 + Math.random() * 1.5,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        delay: Math.random() * 0.55,
      });
    }

    /* ---- sample the title's glyphs into target points ---- */
    const sampleTargets = () => {
      const rect = title.getBoundingClientRect();
      const tw = Math.max(1, Math.ceil(rect.width)),
        th = Math.max(1, Math.ceil(rect.height));
      const off = document.createElement('canvas');
      off.width = tw;
      off.height = th;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.fillStyle = '#fff';
      o.textBaseline = 'middle';

      // draw each word where the browser actually laid it out
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent || '';
        const cs = getComputedStyle(node.parentElement!);
        const upper = cs.textTransform === 'uppercase';
        o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const re = /\S+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          const b = range.getBoundingClientRect();
          if (!b.width) continue;
          const word = upper ? m[0].toUpperCase() : m[0];
          const mw = o.measureText(word).width || 1;
          o.save();
          o.translate(b.left - rect.left, b.top - rect.top + b.height / 2);
          o.scale(b.width / mw, 1); // match the browser's letter-spacing
          o.fillText(word, 0, 0);
          o.restore();
        }
      }

      const data = o.getImageData(0, 0, tw, th).data;
      // pick a grid step that yields roughly COUNT points
      let filled = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] > 128) filled++;
      const step = Math.max(2, Math.round(Math.sqrt((filled * 4) / COUNT)));
      const pts: Array<[number, number]> = [];
      for (let y = 0; y < th; y += step)
        for (let x = 0; x < tw; x += step) if (data[(y * tw + x) * 4 + 3] > 128) pts.push([x, y]);
      if (!pts.length) return false;
      for (let i = pts.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      parts.forEach((p, i) => {
        const t = pts[i % pts.length];
        p.tx = t[0] + (i >= pts.length ? (Math.random() - 0.5) * step : 0);
        p.ty = t[1] + (i >= pts.length ? (Math.random() - 0.5) * step : 0);
      });
      return true;
    };

    const resize = () => {
      W = innerWidth;
      H = innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sampleTargets();
    };

    // start everyone off-screen, scattered around the edges
    const scatter = () => {
      parts.forEach((p) => {
        const side = (Math.random() * 4) | 0;
        p.x = side === 0 ? -40 : side === 1 ? W + 40 : Math.random() * W;
        p.y = side === 2 ? -40 : side === 3 ? H + 40 : Math.random() * H;
        p.vx = p.vy = 0;
      });
    };

    let mode: Mode = 'build';
    let modeT = 0;
    let mx = W / 2,
      my = H * 0.4,
      pmx = mx,
      pmy = my,
      speed = 0,
      hasPointer = false,
      overTitle = false,
      raf = 0,
      last = performance.now(),
      titleShown = false;

    const setMode = (m: Mode) => {
      mode = m;
      modeT = 0;
      if (m === 'swarm') {
        // burst outward from the letters
        parts.forEach((p) => {
          const ang = Math.random() * Math.PI * 2,
            f = 2 + Math.random() * 7;
          p.vx += Math.cos(ang) * f;
          p.vy += Math.sin(ang) * f - 1.5;
        });
        showTitle(true);
      }
      if (m === 'build') {
        titleShown = false;
        showTitle(false);
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      hasPointer = true;
      const r = title.getBoundingClientRect();
      const inside = mx > r.left - 20 && mx < r.right + 20 && my > r.top - 20 && my < r.bottom + 20;
      if (inside && !overTitle && mode === 'swarm') setMode('build');
      overTitle = inside;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a,button,input,select,textarea,[role="button"]')) return;
      if (mode === 'swarm') setMode('build');
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      modeT += dt;

      const rect = title.getBoundingClientRect();
      const ox = rect.left,
        oy = rect.top;

      // cursor velocity (for the comet tail)
      const cvx = mx - pmx,
        cvy = my - pmy;
      pmx = mx;
      pmy = my;
      speed += (Math.min(60, Math.hypot(cvx, cvy)) - speed) * 0.15;

      // timeline: build → short hold → swarm (unless the cursor sits on the title)
      if (mode === 'build' && modeT > 1.5 && !titleShown) {
        titleShown = true;
        showTitle(true);
      }
      if (mode === 'build' && modeT > 2.1) setMode('hold');
      if (mode === 'hold' && modeT > 0.7 && !overTitle) setMode('swarm');

      // swarm anchor: the cursor, or a slow drift when there's no pointer (touch)
      const ax = hasPointer ? mx : W / 2 + Math.cos(now / 2100) * W * 0.25,
        ay = hasPointer ? my : H * 0.45 + Math.sin(now / 1700) * H * 0.15;

      // fade trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = mode === 'swarm' ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      const tail = Math.min(1, speed / 30);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        let gx: number, gy: number, k: number, damp: number;
        if (mode === 'swarm') {
          p.a += p.w * dt * (1.4 + tail * 2);
          // orbit, squashed and dragged behind fast movement
          const rr = p.r * (1 + tail * 0.6);
          gx = ax + Math.cos(p.a) * rr - cvx * tail * (p.r / 18);
          gy = ay + Math.sin(p.a) * rr * 0.8 - cvy * tail * (p.r / 18);
          k = 0.018 + (1 - p.r / 140) * 0.03;
          damp = 0.88;
        } else {
          const ready = mode === 'hold' || modeT > p.delay;
          gx = ready ? ox + p.tx : p.x;
          gy = ready ? oy + p.ty : p.y;
          k = mode === 'hold' ? 0.12 : 0.045;
          damp = 0.8;
        }
        p.vx = (p.vx + (gx - p.x) * k) * damp;
        p.vy = (p.vy + (gy - p.y) * k) * damp;
        // a little life
        p.vx += (Math.random() - 0.5) * (mode === 'swarm' ? 0.6 : 0.08);
        p.vy += (Math.random() - 0.5) * (mode === 'swarm' ? 0.6 : 0.08);
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) continue;
        const v = Math.min(1, Math.hypot(p.vx, p.vy) / 12);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = mode === 'swarm' ? 0.55 + v * 0.45 : 0.85;
        const s = p.size * (1 + v * 0.8);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    scatter();
    // re-sample once the web fonts are in (the title width changes)
    document.fonts?.ready.then(() => sampleTargets());
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
      title.style.opacity = '';
      title.style.filter = '';
      title.style.transition = '';
    };
  }, [targetRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="swarm-canvas" />;
};
