import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

const WORD = 'MEDIA TEAM';

/** Minimal cinematic loader: counter + letter reveal, lifts away once the 3D valley has its first frame. */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    let valleyReady = false;
    const onValley = () => (valleyReady = true);
    window.addEventListener('valley:loaded', onValley);
    // if the hero isn't on this page, don't wait for it
    const noHero = window.setTimeout(() => {
      if (!document.getElementById('home')) valleyReady = true;
    }, 300);
    let raf = 0;
    const tick = () => {
      const el = performance.now() - t0;
      const cap = valleyReady || el > 4500 ? 100 : 88;
      setProgress((p) => Math.min(cap, p + Math.max(0.6, (cap - p) * 0.06)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(noHero);
      window.removeEventListener('valley:loaded', onValley);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && !ready) setReady(true);
  }, [progress, ready]);

  useEffect(() => {
    if (!ready) return;
    const a = window.setTimeout(() => setLeaving(true), 250);
    const b = window.setTimeout(() => {
      setDone(true);
      onLoaded?.();
    }, 1350);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [ready, onLoaded]);

  if (done) return null;

  return (
    <div className={`loader-root ${leaving ? 'leave' : ''}`} role="status" aria-label="Loading">
      <div className="loader-inner">
        <span className="loader-dot" />
        <p className="loader-word" aria-hidden="true">
          {Array.from(WORD).map((c, i) => (
            <span key={i} style={{ animationDelay: `${i * 60}ms` }}>
              {c === ' ' ? ' ' : c}
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
