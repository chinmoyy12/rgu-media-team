import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UniversityLogo } from './UniversityLogo';
import { getLenis } from '../lib/smoothScroll';
import { Lock, Search } from 'lucide-react';

interface NavbarProps {
  onApplyClick: () => void;
  onSearchOpen?: () => void;
  onMembersClick?: () => void;
  onWorksClick?: () => void;
  onHomeClick?: () => void;
  currentPage?: 'home' | 'members' | 'works';
  onAdminClick?: () => void;
  isDraft?: boolean;
}

/** Text that rolls up to a duplicate on hover. */
const Roll: React.FC<{ children: string }> = ({ children }) => (
  <span className="nav-roll" data-text={children}>
    <span>{children}</span>
  </span>
);

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, onSearchOpen, onMembersClick, onWorksClick, onHomeClick, currentPage = 'home', onAdminClick, isDraft }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      if (Math.abs(y - lastY) > 6) {
        setIsHidden(y > lastY && y > 240);
        lastY = y;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock scrolling behind the full-screen menu
  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (fn?: () => void) => {
    setOpen(false);
    fn?.();
  };
  const toSection = (id: string) => () => {
    const run = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const l = getLenis();
      if (l) l.scrollTo(el, { offset: -40 });
      else el.scrollIntoView({ behavior: 'smooth' });
    };
    if (currentPage !== 'home') {
      onHomeClick?.();
      window.setTimeout(run, 400);
    } else run();
  };

  const links: { label: string; active?: boolean; onClick: () => void; idx: string }[] = [
    { idx: '01', label: 'Home', active: currentPage === 'home', onClick: () => go(currentPage === 'home' ? toSection('home') : onHomeClick) },
    { idx: '02', label: 'Members', active: currentPage === 'members', onClick: () => go(onMembersClick) },
    { idx: '03', label: 'Works', active: currentPage === 'works', onClick: () => go(onWorksClick) },
    { idx: '04', label: 'About', onClick: () => go(toSection('about')) },
    { idx: '05', label: 'Contact', onClick: () => go(toSection('contact')) },
    ...(onSearchOpen ? [{ idx: '06', label: 'Search', onClick: () => go(onSearchOpen) }] : []),
  ];

  return (
    <>
      <header className={`nav-bar ${isScrolled ? 'is-scrolled' : ''} ${isHidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
        <a
          href="#home"
          className="nav-brand"
          onClick={(e) => {
            e.preventDefault();
            go(currentPage === 'home' ? toSection('home') : onHomeClick);
          }}
        >
          <span className="nav-logo">
            <UniversityLogo variant="nav" showText={false} />
          </span>
          <span className="nav-word">
            <b>Media Team</b>
            <small>Royal Global University</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main">
          {links.slice(0, 4).map((l) => (
            <button key={l.label} onClick={l.onClick} className={l.active ? 'is-active' : ''}>
              <Roll>{l.label}</Roll>
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          {onSearchOpen && (
            <button className="nav-admin nav-search" onClick={() => go(onSearchOpen)} aria-label="Search the site" title="Search (Ctrl/⌘ + K)">
              <Search size={15} />
            </button>
          )}
          {onAdminClick && (
            <button
              className={`nav-admin ${isDraft ? 'is-draft' : ''}`}
              onClick={() => go(onAdminClick)}
              aria-label="Admin settings"
              title={isDraft ? 'Admin — previewing an unpublished draft' : 'Admin settings'}
            >
              <Lock size={14} />
              <span>Admin</span>
            </button>
          )}
          <button className="nav-pill" onClick={() => go(onApplyClick)}>
            <i />
            <Roll>Apply now</Roll>
          </button>
          <button className="nav-burger" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="nav-overlay-glow" />
            <ul className="nav-overlay-list">
              {links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-60%', opacity: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button onClick={l.onClick} className={l.active ? 'is-active' : ''}>
                    <small>{l.idx}</small>
                    <span>{l.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="nav-overlay-foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <span>Betkuchi, Guwahati — Assam</span>
              <button className="nav-pill" onClick={() => go(onApplyClick)}>
                <i />
                Join the crew
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
