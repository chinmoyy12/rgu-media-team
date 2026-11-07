import React, { useEffect, useRef, useState } from 'react';

/**
 * One-time "swarm rebuild" intro for the Members page.
 *
 * Timeline (6 s, first visit per browser session only):
 *   0.0 – 2.4 s  particles stream in from the edges and rebuild the whole
 *                visible page: every word, plus the outlines of cards, chips,
 *                buttons and photos. The real page stays hidden.
 *   1.9 – 3.0 s  the real page fades in underneath while the particles hold.
 *   3.0 – 4.8 s  the particles burst off the layout and swarm the cursor.
 *   4.8 – 6.0 s  everything fades out and the canvas removes itself.
 *
 * Skipped for reduced-motion users. Click / key / scroll keeps working the whole
 * time (the canvas never takes pointer events).
 */

const COLORS = ['#f26a2e', '#ff8a4c', '#f5b14a', '#ffd9a8', '#f5efe2'];
const SEEN_KEY = 'rgu-members-swarm-seen';
const T_BUILD = 2.4,
  T_REVEAL = 1.9,
  T_BURST = 3.0,
  T_FADE = 4.8,
  T_END = 6.0;

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** target in page coordinates (scroll-independent) */
  tx: number;
  ty: number;
  a: number;
  r: number;
  w: number;
  size: number;
  c: string;
  delay: number;
}

const shouldPlay = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true; // storage blocked — just play
  }
};
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* ignore */
  }
};

export const SwarmCursor: React.FC<{ targetRef: React.RefObject<HTMLElement | null> }> = ({ targetRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active] = useState(shouldPlay);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const root = targetRef.current;
    if (!canvas || !root) return;
    markSeen();

    const ctx = canvas.getContext('2d')!;
    const small = window.matchMedia('(pointer: coarse)').matches || innerWidth < 700;
    const COUNT = small ? 2200 : 4200;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = innerWidth,
      H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // hide the real page content until the particles have rebuilt it
    root.style.transition = 'none';
    root.style.opacity = '0';
    root.style.filter = 'blur(10px)';
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      root.style.transition = 'opacity 1.1s ease, filter 1.1s ease';
      root.style.opacity = '1';
      root.style.filter = 'blur(0)';
    };

    const parts: P[] = [];
    for (let i = 0; i < COUNT; i++) {
      const side = (Math.random() * 4) | 0;
      parts.push({
        x: side === 0 ? -30 : side === 1 ? W + 30 : Math.random() * W,
        y: side === 2 ? -30 : side === 3 ? H + 30 : Math.random() * H,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        a: Math.random() * Math.PI * 2,
        r: 16 + Math.pow(Math.random(), 1.6) * 170,
        w: (0.5 + Math.random() * 1.5) * (Math.random() < 0.5 ? -1 : 1),
        size: 0.7 + Math.random() * 1.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        delay: Math.random() * 0.7,
      });
    }

    /* ---------- trace the visible page into target points ---------- */
    let step = 3;
    const sample = () => {
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const o = off.getContext('2d', { willReadFrequently: true })!;
      o.fillStyle = '#fff';
      o.strokeStyle = '#fff';
      o.textBaseline = 'middle';
      const onScreen = (b: DOMRect) => b.width > 0 && b.bottom > 0 && b.top < H && b.right > 0 && b.left < W;

      // 1) every word, drawn where the browser laid it out
      const range = document.createRange();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const el = node.parentElement;
        const text = node.textContent || '';
        if (!el || !text.trim()) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const upper = cs.textTransform === 'uppercase';
        o.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const re = /\S+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          range.setStart(node, m.index);
          range.setEnd(node, m.index + m[0].length);
          const b = range.getBoundingClientRect();
          if (!onScreen(b)) continue;
          const word = upper ? m[0].toUpperCase() : m[0];
          const mw = o.measureText(word).width || 1;
          o.save();
          o.translate(b.left, b.top + b.height / 2);
          o.scale(b.width / mw, 1);
          o.fillText(word, 0, 0);
          o.restore();
        }
      }

      // text first: it gets most of the particles so words stay readable
      const textData = o.getImageData(0, 0, W, H).data;

      // 2) outlines of the page's boxes: cards, chips, buttons, photos (drawn on a separate layer)
      o.clearRect(0, 0, W, H);
      o.lineWidth = 1.6;
      const boxes = Array.from(
        root.querySelectorAll(
          'button, a, img, .glass-card, .glass-card-gradient, [class*="rounded-full"][class*="border"], [class*="rounded-2xl"][class*="border"], [class*="rounded-3xl"][class*="border"]'
        )
      ) as HTMLElement[];
      boxes.forEach((el) => {
        const b = el.getBoundingClientRect();
        if (!onScreen(b) || b.width < 14 || b.height < 14 || b.width > W * 0.98) return;
        const rad = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, b.width / 2, b.height / 2);
        o.beginPath();
        o.roundRect(b.left + 0.5, b.top + 0.5, b.width - 1, b.height - 1, rad);
        o.stroke();
      });

      const boxData = o.getImageData(0, 0, W, H).data;

      const count = (d: Uint8ClampedArray) => {
        let n = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 110) n++;
        return n;
      };
      const grid = (d: Uint8ClampedArray, s: number) => {
        const out: Array<[number, number]> = [];
        for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) if (d[(y * W + x) * 4 + 3] > 110) out.push([x, y]);
        return out;
      };
      // 75% of particles for words, 25% for outlines
      const textStep = Math.max(2, Math.round(Math.sqrt(count(textData) / (COUNT * 0.75))));
      // outlines are thin, so walk every lit pixel and keep every k-th one
      const boxK = Math.max(2, Math.ceil(count(boxData) / (COUNT * 0.25)));
      const boxPts: Array<[number, number]> = [];
      for (let i = 3, n = 0; i < boxData.length; i += 4)
        if (boxData[i] > 110 && n++ % boxK === 0) boxPts.push([((i - 3) / 4) % W, Math.floor((i - 3) / 4 / W)]);
      step = textStep;
      const pts = [...grid(textData, textStep), ...boxPts];
      if (!pts.length) pts.push([W / 2, H / 2]);
      for (let i = pts.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      const sy = scrollY;
      parts.forEach((p, i) => {
        const t = pts[i % pts.length];
        const extra = i >= pts.length;
        p.tx = t[0] + (extra ? (Math.random() - 0.5) * step : 0);
        p.ty = t[1] + (extra ? (Math.random() - 0.5) * step : 0) + sy;
      });
    };

    /* ---------- run ---------- */
    let mx = W / 2,
      my = H / 2,
      pmx = mx,
      pmy = my,
      speed = 0,
      hasPointer = false,
      burst = false,
      raf = 0,
      t0 = 0,
      last = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      hasPointer = true;
    };

    const finish = () => {
      cancelAnimationFrame(raf);
      reveal();
      setDone(true);
    };

    const frame = (now: number) => {
      if (!t0) t0 = last = now;
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (t >= T_END) return finish();
      raf = requestAnimationFrame(frame);

      if (t > T_REVEAL) reveal();
      const swarm = t > T_BURST;
      if (swarm && !burst) {
        burst = true;
        parts.forEach((p) => {
          const ang = Math.random() * Math.PI * 2,
            f = 2 + Math.random() * 8;
          p.vx += Math.cos(ang) * f;
          p.vy += Math.sin(ang) * f - 1;
        });
      }

      const cvx = mx - pmx,
        cvy = my - pmy;
      pmx = mx;
      pmy = my;
      speed += (Math.min(60, Math.hypot(cvx, cvy)) - speed) * 0.15;
      const tail = Math.min(1, speed / 30);
      const ax = hasPointer ? mx : W / 2 + Math.cos(t * 1.3) * W * 0.18,
        ay = hasPointer ? my : H * 0.5 + Math.sin(t * 1.7) * H * 0.12;
      // global fade at the end
      const fade = t < T_FADE ? 1 : Math.max(0, 1 - (t - T_FADE) / (T_END - T_FADE));

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = swarm ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.55)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      // particles thin out over the build→hold so the real page reads through
      const holdDim = t < T_REVEAL ? 1 : t < T_BURST ? 1 - ((t - T_REVEAL) / (T_BURST - T_REVEAL)) * 0.45 : 0.75;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        let gx: number, gy: number, k: number, damp: number;
        if (swarm) {
          p.a += p.w * dt * (1.4 + tail * 2);
          const rr = p.r * (1 + tail * 0.5);
          gx = ax + Math.cos(p.a) * rr - cvx * tail * (p.r / 18);
          gy = ay + Math.sin(p.a) * rr * 0.8 - cvy * tail * (p.r / 18);
          k = 0.014 + (1 - p.r / 190) * 0.03;
          damp = 0.88;
        } else {
          const go = t > p.delay;
          gx = go ? p.tx : p.x;
          gy = go ? p.ty - scrollY : p.y; // targets are in page coords, so they follow scrolling
          // ease the pull in so arrivals look like a rebuild, not a snap
          k = 0.02 + Math.min(1, Math.max(0, (t - p.delay) / 1.2)) * 0.09;
          damp = 0.78;
        }
        p.vx = (p.vx + (gx - p.x) * k) * damp + (Math.random() - 0.5) * (swarm ? 0.55 : 0.05);
        p.vy = (p.vy + (gy - p.y) * k) * damp + (Math.random() - 0.5) * (swarm ? 0.55 : 0.05);
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) continue;
        const v = Math.min(1, Math.hypot(p.vx, p.vy) / 12);
        ctx.globalAlpha = (swarm ? 0.5 + v * 0.5 : 0.9) * holdDim * fade;
        ctx.fillStyle = p.c;
        // while rebuilding, each dot covers its grid cell so the words read as solid shapes
        const s = swarm ? p.size * (1 + v * 0.8) : Math.max(p.size, step * 0.75) * (1 + v * 0.5);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    // let the page lay out (and its cards mount) before tracing it
    const start = window.setTimeout(() => {
      sample();
      raf = requestAnimationFrame(frame);
    }, 120);
    window.addEventListener('pointermove', onMove, { passive: true });
    const onVis = () => {
      if (document.hidden) finish(); // don't leave the page hidden in a background tab
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      root.style.opacity = '';
      root.style.filter = '';
      root.style.transition = '';
    };
  }, [active, targetRef]);

  if (!active || done) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="swarm-canvas" />;
};
