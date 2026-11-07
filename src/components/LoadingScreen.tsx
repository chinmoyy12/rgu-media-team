import React, { useEffect, useRef, useState } from 'react';
import { galleryItems } from '../data/mockData';
import { markIntroDone } from '../lib/introGate';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

const WORD = 'MEDIA TEAM';
/** the 3D intro always plays at least this long before diving into the lens */
const MIN_INTRO_MS = 3600;

const can3D = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const introPhotos = () =>
  galleryItems
    .filter((g) => g.imageUrl && g.id !== 'gal-4')
    .map((g) => g.imageUrl.replace(/w=\d+/, 'w=480'))
    .slice(0, 9);

/**
 * Opening intro.
 *  - 3D: a cinema camera assembles, reels unspool a film strip of team photos,
 *    a clapperboard snaps and polaroids orbit; then the view dives into the lens
 *    and an iris opens onto the site.
 *  - Fallback (no WebGL / reduced motion): letter reveal + counter.
 * Either way it waits for the hero valley's first frame (max ~4.5 s).
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [use3D] = useState(can3D);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<import('../three/intro').CinemaIntro | null>(null);
  const t0 = useRef(performance.now());
  /** when the 3D scene drew its first frame — the intro's clock starts here */
  const sceneStart = useRef<number | null>(null);
  const progressRef = useRef(0);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const tcRef = useRef<HTMLElement | null>(null);
  const doneRef = useRef(false);
  // safety: never leave the rest of the page waiting on an intro that went away
  useEffect(() => () => markIntroDone(), []);

  // start the 3D scene (code-split so the site's main bundle isn't held up)
  useEffect(() => {
    if (!use3D || !stageRef.current) return;
    let cancelled = false;
    const small = window.matchMedia('(pointer: coarse)').matches || innerWidth < 700;
    // download the scene code right away, but only build it once the hero valley
    // has finished its own heavy setup — otherwise both fight for the main thread
    // and the intro stutters
    const valleyReady = new Promise<void>((res) => {
      const ok = () => res();
      window.addEventListener('valley:loaded', ok, { once: true });
      window.setTimeout(() => !document.getElementById('home') && ok(), 300); // no hero on this page
      window.setTimeout(ok, 2200); // never wait longer than this
    });
    Promise.all([import('../three/intro'), valleyReady])
      .then(([{ CinemaIntro }]) => {
        if (cancelled || !stageRef.current) return;
        // one frame for the browser to paint/settle before the heavy scene build
        requestAnimationFrame(() => {
          if (cancelled || !stageRef.current) return;
          const intro = new CinemaIntro(stageRef.current, introPhotos(), small);
          intro.onStart = () => {
            sceneStart.current = performance.now();
            performance.mark('intro:start');
          };
          introRef.current = intro;
        });
      })
      .catch(() => {
        /* scene failed — the overlay still counts down and exits */
      });
    return () => {
      cancelled = true;
      introRef.current?.dispose();
      introRef.current = null;
    };
  }, [use3D]);

  useEffect(() => {
    let valleyReady = false;
    const onValley = () => (valleyReady = true);
    window.addEventListener('valley:loaded', onValley);
    // if the hero isn't on this page, don't wait for it
    const noHero = window.setTimeout(() => {
      if (!document.getElementById('home')) valleyReady = true;
    }, 300);
    let raf = 0;
    let last = performance.now();
    // time-based (not per-frame) so a slow device or throttled tab can't stall the intro
    const update = () => {
      const now = performance.now();
      const dt = Math.min(0.5, (now - last) / 1000);
      last = now;
      const el = now - t0.current;
      // if the scene never starts (slow device / WebGL failure) give up waiting after 3 s
      const from = sceneStart.current ?? (el > 3000 ? t0.current + 3000 : null);
      const sceneEl = from === null ? 0 : now - from;
      const minOk = !use3D || sceneEl > MIN_INTRO_MS;
      // hard safety: the intro never lasts more than 9 s, whatever happens
      const cap =
        el > 9000 || ((valleyReady || el > 4500) && minOk) ? 100 : use3D ? Math.min(96, (sceneEl / MIN_INTRO_MS) * 96) : 88;
      const p = progressRef.current;
      const next = Math.min(cap, p + Math.max(18 * dt, (cap - p) * (1 - Math.exp(-dt * 7))));
      progressRef.current = next;
      // write the counter/bar straight to the DOM; React only re-renders when it hits 100
      if (countRef.current) countRef.current.textContent = String(Math.floor(next)).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${next / 100})`;
      if (tcRef.current) {
        const s = (now - t0.current) / 1000;
        tcRef.current.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, Math.floor(s) % 60, Math.floor((s % 1) * 24)]
          .map((n) => String(n).padStart(2, '0'))
          .join(':');
      }
      if (next >= 100) setProgress(100);
    };
    const tick = () => {
      update();
      if (!doneRef.current) raf = requestAnimationFrame(tick);
      else clearInterval(iv);
    };
    raf = requestAnimationFrame(tick);
    const iv = window.setInterval(update, 250); // keeps going even when frames are throttled
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(iv);
      clearTimeout(noHero);
      window.removeEventListener('valley:loaded', onValley);
    };
  }, [use3D]);

  useEffect(() => {
    if (progress >= 100 && !ready) setReady(true);
  }, [progress, ready]);

  useEffect(() => {
    if (!ready) return;
    const timers: number[] = [];
    const finish = () => {
      markIntroDone();
      doneRef.current = true;
      setDone(true);
      onLoaded?.();
    };
    if (use3D) {
      // dive into the lens, open the iris part-way through the push
      introRef.current?.exit();
      timers.push(
        window.setTimeout(() => {
          setLeaving(true);
          markIntroDone(); // the page behind starts animating as the iris opens
        }, 900)
      );
      timers.push(window.setTimeout(finish, 900 + 1000));
    } else {
      timers.push(
        window.setTimeout(() => {
          setLeaving(true);
          markIntroDone();
        }, 250)
      );
      timers.push(window.setTimeout(finish, 1350));
    }
    return () => timers.forEach(clearTimeout);
  }, [ready, onLoaded, use3D]);

  if (done) return null;

  const pct = String(Math.floor(progressRef.current)).padStart(3, '0');
  const bar = { transform: `scaleX(${progressRef.current / 100})` };

  if (use3D) {
    return (
      <div className={`loader-root is-3d ${leaving ? 'iris' : ''}`} role="status" aria-label="Loading">
        <div ref={stageRef} className="intro-stage" />
        <div className="intro-hud" aria-hidden="true">
          <i className="intro-corner tl" />
          <i className="intro-corner tr" />
          <i className="intro-corner bl" />
          <i className="intro-corner br" />
          <div className="intro-top">
            <span className="intro-rec">
              <b /> REC <em ref={tcRef}>00:00:00:00</em>
            </span>
            <span className="intro-meta">4K · 24 FPS · ƒ/1.8</span>
          </div>
          <div className="intro-focus" />
        </div>
        <div className="intro-bottom">
          <div>
            <p className="loader-word intro-word" aria-hidden="true">
              {Array.from(WORD).map((c, i) => (
                <span key={i} style={{ animationDelay: `${400 + i * 70}ms` }}>
                  {c === ' ' ? String.fromCharCode(160) : c}
                </span>
              ))}
            </p>
            <p className="loader-sub intro-sub">
              The Assam Royal Global University<span className="intro-sub-extra"> · Lights, camera, action</span>
            </p>
          </div>
          <span ref={countRef} className="loader-count intro-count">
            {pct}
          </span>
        </div>
        <div ref={barRef} className="loader-bar" style={bar} />
      </div>
    );
  }

  return (
    <div className={`loader-root ${leaving ? 'leave' : ''}`} role="status" aria-label="Loading">
      <div className="loader-inner">
        <span className="loader-dot" />
        <p className="loader-word" aria-hidden="true">
          {Array.from(WORD).map((c, i) => (
            <span key={i} style={{ animationDelay: `${i * 60}ms` }}>
              {c === ' ' ? String.fromCharCode(160) : c}
            </span>
          ))}
        </p>
        <p className="loader-sub">The Assam Royal Global University</p>
      </div>
      <div className="loader-foot">
        <span>GUWAHATI · ASSAM</span>
        <span ref={countRef} className="loader-count">
          {pct}
        </span>
      </div>
      <div ref={barRef} className="loader-bar" style={bar} />
    </div>
  );
};
