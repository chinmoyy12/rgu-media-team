import React, { useEffect, useRef } from 'react';
import { VideoRibbon, RibbonItem } from '../three/ribbon';
import { galleryItems } from '../data/mockData';
import { siteText } from '../content/store';

interface MotionRibbonSectionProps {
  onWorksClick?: () => void;
  onApplyClick?: () => void;
}

// The official media reel + the gallery (editable in Admin). Images must be CORS-enabled for WebGL.
const buildItems = (): RibbonItem[] => [
  { title: 'Media Team Reel', type: 'video', src: 'https://ik.imagekit.io/w61rg4ucfs/MEDIA%20Animation.mp4' },
  ...galleryItems
    .filter((g) => g.imageUrl && g.id !== 'gal-4' /* source image 404s */)
    .slice(0, 7)
    .map((g) => ({ title: g.title, type: 'image' as const, src: g.imageUrl })),
];

export const MotionRibbonSection: React.FC<MotionRibbonSectionProps> = ({ onWorksClick, onApplyClick }) => {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends HTMLElement>(s: string) => el.querySelector(s) as T;
    let ribbon: VideoRibbon | null = null;
    try {
      ribbon = new VideoRibbon(
        {
          track: el,
          stage: q('.vr-stage'),
          canvas: q<HTMLCanvasElement>('.vr-gl') as unknown as HTMLCanvasElement,
          l1: q('.vr-l1'),
          l2: q('.vr-l2'),
          cap: q('.vr-cap'),
          intro: Array.from(el.querySelectorAll<HTMLElement>('.vr-intro')),
          rule: q('.vr-rule'),
          name: q('.vr-name'),
          counter: q('.vr-counter'),
        },
        buildItems(),
        onWorksClick ? () => onWorksClick() : undefined
      );
    } catch {
      /* WebGL unavailable: headline still renders */
    }
    return () => ribbon?.dispose();
  }, [onWorksClick]);

  return (
    <div id="works-reel" ref={root} className="vr-track">
      <section className="vr-stage" aria-label="Frames in motion — our work">
        <h2 className="sr-only">
          {siteText.ribbonHeadline1} {siteText.ribbonHeadline2}
        </h2>
        <div className="vr-hl vr-l1" aria-hidden="true">
          <span>{siteText.ribbonHeadline1}</span>
        </div>
        <div className="vr-hl vr-l2" aria-hidden="true">
          <span>{siteText.ribbonHeadline2}</span>
        </div>
        <div className="vr-cap">{siteText.ribbonCaption}</div>
        <div className="vr-glow vr-intro" />
        <div className="vr-cross vr-intro">
          <i>+</i>
        </div>
        <div className="vr-rule" />
        <canvas className="vr-gl" />
        <button className="vr-hint vr-intro" onClick={onApplyClick}>
          JOIN THE CREW &nbsp;→
        </button>
        <header className="vr-top">
          <div className="vr-logo">
            <svg viewBox="0 0 22 18">
              <path d="M11 0l11 18h-6.2L11 9.6 6.2 18H0z" />
            </svg>
            OUR WORK
          </div>
          <div className="vr-pager vr-intro">
            <span>←</span>
            <span>→</span>
          </div>
          <nav className="vr-acts">
            <span className="vr-counter">01 / 08</span>
          </nav>
        </header>
        <footer className="vr-bot">
          <p>Events, campaigns, films and portraits — documented by the students of the RGU Media Team.</p>
          <div className="vr-mid">
            PHOTO<s>/</s>FILM<s>/</s>PODCAST<s>/</s>DESIGN
          </div>
          <button className="vr-r" onClick={onWorksClick}>
            VIEW ALL WORKS
          </button>
        </footer>
        <div className="vr-name" />
      </section>
    </div>
  );
};
