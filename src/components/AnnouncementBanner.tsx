import React, { useState } from 'react';
import { X } from 'lucide-react';
import { config } from '../config';

interface AnnouncementBannerProps {
  onApplyClick: () => void;
}

/** Slim ticker that loops the recruitment message. */
export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ onApplyClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible || !config.recruitment.isOpen) return null;
  const msg = config.recruitment.announcementBanner;

  return (
    <div className="ticker" role="region" aria-label="Announcement">
      <button className="ticker-track" onClick={onApplyClick} aria-label={msg}>
        {[0, 1].map((k) => (
          <span className="ticker-row" key={k} aria-hidden={k === 1}>
            {[0, 1, 2].map((j) => (
              <span key={j}>
                <i /> {msg} <em>Apply now →</em>
              </span>
            ))}
          </span>
        ))}
      </button>
      <button className="ticker-close" onClick={() => setIsVisible(false)} aria-label="Dismiss announcement">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
