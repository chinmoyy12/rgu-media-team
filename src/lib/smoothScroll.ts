import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Starts Lenis inertial scrolling; returns a cleanup function. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  // touch devices already have native momentum scrolling — leave them alone
  if (window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches) return () => {};
  // lerp-based easing feels natural on both mouse wheels (Windows) and trackpads (Mac)
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 });
  let raf = 0;
  const tick = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  // route in-page anchor links through Lenis
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a || a.getAttribute('href') === '#') return;
    const el = document.querySelector(a.getAttribute('href')!);
    if (el) {
      e.preventDefault();
      lenis?.scrollTo(el as HTMLElement, { offset: -60 });
    }
  };
  document.addEventListener('click', onClick);

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener('click', onClick);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;
