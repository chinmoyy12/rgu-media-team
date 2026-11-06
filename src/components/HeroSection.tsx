import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { FlowerValley, AmbientAudio } from '../three/valley';
import { siteText } from '../content/store';

interface HeroSectionProps {
  onApplyClick: () => void;
  onMembersClick?: () => void;
  onShowreelClick?: () => void;
}

/** Splits text into per-character spans for staggered reveals. */
const Split: React.FC<{ text: string; offset?: number; className?: string }> = ({ text, offset = 0, className = '' }) => (
  <span className={`split-line ${className}`} aria-hidden="true">
    {Array.from(text).map((ch, i) => (
      <span key={i} className="split-char" style={{ ['--i' as any]: i + offset }}>
        {ch === ' ' ? ' ' : ch}
      </span>
    ))}
  </span>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ onApplyClick, onMembersClick }) => {
  const trackRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const depthRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const valleyRef = useRef<FlowerValley | null>(null);
  const audioRef = useRef<AmbientAudio | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [uiOn, setUiOn] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const host = hostRef.current,
      track = trackRef.current;
    if (!host || !track) return;

    let valley: FlowerValley;
    try {
      valley = new FlowerValley(host, {
        onLoaded: () => {
          setLoaded(true);
          window.dispatchEvent(new Event('valley:loaded'));
        },
        onIntroDone: () => setUiOn(true),
        getAudioLevel: () => audioRef.current?.level() ?? 0,
      });
    } catch {
      setWebgl(false);
      setLoaded(true);
      setUiOn(true);
      window.dispatchEvent(new Event('valley:loaded'));
      return;
    }
    valleyRef.current = valley;    audioRef.current = new AmbientAudio();

    // Fallback: never keep the UI hidden for long
    const failsafe = window.setTimeout(() => setUiOn(true), 4500);

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const hp = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      valley.setScroll(hp);
      const c = contentRef.current;
      if (c) {
        const k = Math.min(1, hp * 1.7);
        c.style.opacity = String(1 - k);
        c.style.transform = `translate3d(0,${-k * 14}vh,0) scale(${1 + k * 0.08})`;
        c.style.filter = k > 0.01 ? `blur(${k * 10}px)` : '';
      }
      if (barRef.current) barRef.current.style.transform = `scaleY(${hp})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    // headline parallax: the type floats in 3D against the cursor
    const stage = host.parentElement!;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      praf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const ptick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      stage.style.setProperty('--mx', cx.toFixed(4));
      stage.style.setProperty('--my', cy.toFixed(4));
      praf = requestAnimationFrame(ptick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    praf = requestAnimationFrame(ptick);

    // live depth readout
    const depthTimer = window.setInterval(() => {
      if (depthRef.current) depthRef.current.textContent = valley.depth.toFixed(1).padStart(5, '0');
    }, 90);

    const io = new IntersectionObserver(([e]) => valley.setActive(e.isIntersecting), { threshold: 0 });
    io.observe(track);

    return () => {
      clearTimeout(failsafe);
      clearInterval(depthTimer);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(praf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      valley.dispose();
      audioRef.current?.dispose();
      valleyRef.current = null;
    };
  }, []);

  const hoverOn = () => {
    valleyRef.current?.startHoverTransition();
    audioRef.current?.muffle(true);
  };
  const hoverOff = () => {
    valleyRef.current?.stopHoverTransition();
    audioRef.current?.muffle(false);
  };

  const toggleSound = () => {
    const a = audioRef.current;
    if (!a) return;
    const muted = a.toggle();
    setSoundOn(!muted);
  };

  const handleExploreClick = () => {
    const el = document.getElementById('works-reel') || document.getElementById('about');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" ref={trackRef} className="valley-track" aria-label="Media Team — Capturing moments">
      <div className="valley-stage">
        <div ref={hostRef} className="valley-canvas" aria-hidden="true" />
        {!webgl && <div className="valley-fallback" aria-hidden="true" />}
        <div className="valley-shade" aria-hidden="true" />

        <div className={`valley-loader ${loaded ? 'gone' : ''}`} aria-hidden="true">
          <span />
        </div>

        <div className={`valley-ui ${uiOn ? 'on' : ''}`}>
          <div ref={contentRef} className="valley-hero">
            <p className="valley-eyebrow">
              <i /> {siteText.heroEyebrow} <i />
            </p>
            <h1 className="valley-title" aria-label={`${siteText.heroLine1} ${siteText.heroLine2}`}>
              <Split text={siteText.heroLine1} />
              <Split text={siteText.heroLine2} offset={siteText.heroLine1.length} className="valley-title-accent" />
            </h1>
            <p className="valley-cap">
              {siteText.heroCaption.split('\n').map((l, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {l}
                </React.Fragment>
              ))}
            </p>
            <div className="valley-actions">
              <button
                className="valley-go"
                onPointerEnter={hoverOn}
                onPointerLeave={hoverOff}
                onFocus={hoverOn}
                onBlur={hoverOff}
                onClick={onMembersClick || handleExploreClick}
                aria-label="Meet the team"
              >
                <span className="valley-go-ring" />
                <svg className="valley-go-text" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <path id="vgo" d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
                  </defs>
                  <text>
                    <textPath href="#vgo">MEET THE TEAM ✦ MEET THE TEAM ✦ </textPath>
                  </text>
                </svg>
                <ArrowRight />
              </button>
              <button className="valley-pill" onClick={onApplyClick}>
                <span className="valley-pill-dot" />
                Apply now
              </button>
            </div>
          </div>

          <div className="valley-hud valley-hud-l">
            <span className="valley-rec">
              <b /> REC
            </span>
            <span>26.14°N · 91.74°E</span>
            <span>
              DEPTH <span ref={depthRef}>000.0</span>m
            </span>
            <span className="valley-tip">Click anywhere — send a ripple</span>
          </div>

          <div className="valley-progress" aria-hidden="true">
            <span ref={barRef} />
          </div>

          <div className="valley-corner">
            <button className="valley-scroll" onClick={handleExploreClick}>
              Scroll to wander
            </button>
            <i />
            <button
              className="valley-sound"
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Mute ambient sound' : 'Play ambient sound'}
              onClick={toggleSound}
            >
              <svg viewBox="0 0 24 24">
                <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5Z" />
                <path className="w" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
                <path className="x" d="m16 10 4 4m0-4-4 4" />
              </svg>
              <span className="valley-eq" aria-hidden="true">
                <b />
                <b />
                <b />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
