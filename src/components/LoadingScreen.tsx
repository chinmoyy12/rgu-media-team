import React, { useEffect, useRef, useState } from 'react';
import { galleryItems } from '../data/mockData';

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

  // start the 3D scene (code-split so the site's main bundle isn't held up)
  useEffect(() => {
    if (!use3D || !stageRef.current) return;
    let cancelled = false;
    const small = window.matchMedia('(pointer: coarse)').matches || innerWidth < 700;
    import('../three/intro')
      .then(({ CinemaIntro }) => {
        if (cancelled || !stageRef.current) return;
        const intro = new CinemaIntro(stageRef.current, introPhotos(), small);
        intro.onStart = () => (sceneStart.current = performance.now());
        introRef.current = intro;
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
    const tick = () => {
      const now = performance.now();
      const el = now - t0.current;
      // if the scene never starts (slow device / WebGL failure) give up waiting after 3 s
      const from = sceneStart.current ?? (el > 3000 ? t0.current + 3000 : null);
      const sceneEl = from === null ? 0 : now - from;
      const minOk = !use3D || sceneEl > MIN_INTRO_MS;
      const cap = (valleyReady || el > 4500) && minOk ? 100 : use3D ? Math.min(96, (sceneEl / MIN_INTRO_MS) * 96) : 88;
      setProgress((p) => Math.min(cap, p + Math.max(0.5, (cap - p) * 0.06)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
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
      setDone(true);
      onLoaded?.();
    };
    if (use3D) {
      // dive into the lens, open the iris part-way through the push
      introRef.current?.exit();
      timers.push(window.setTimeout(() => setLeaving(true), 900));
      timers.push(window.setTimeout(finish, 900 + 1000));
    } else {
      timers.push(window.setTimeout(() => setLeaving(true), 250));
      timers.push(window.setTimeout(finish, 1350));
    }
    return () => timers.forEach(clearTimeout);
  }, [ready, onLoaded, use3D]);

  if (done) return null;

  if (use3D) {
    const el = (performance.now() - t0.current) / 1000;
    const tc = [Math.floor(el / 3600), Math.floor(el / 60) % 60, Math.floor(el) % 60, Math.floor((el % 1) * 24)]
      .map((n) => String(n).padStart(2, '0'))
      .join(':');
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
              <b /> REC <em>{tc}</em>
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
            <p className="loader-sub intro-sub">The Assam Royal Global University · Lights, camera, action</p>
          </div>
          <span className="loader-count intro-count">{String(Math.floor(progress)).padStart(3, '0')}</span>
        </div>
        <div className="loader-bar" style={{ transform: `scaleX(${progress / 100})` }} />
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
        <span className="loader-count">{String(Math.floor(progress)).padStart(3, '0')}</span>
      </div>
      <div className="loader-bar" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
};
