/**
 * Coordinates the opening intro with the heavy parts of the page so they never
 * compete for the CPU/GPU:
 *   1. the hero valley builds first (while the screen is still black),
 *   2. the 3D intro then plays with nothing else rendering,
 *   3. once the intro opens onto the site, everything else starts.
 */
let done = false;
const waiters = new Set<() => void>();

export const isIntroDone = () => done;

/** Called by the loading screen as the iris opens onto the site. */
export function markIntroDone() {
  if (done) return;
  done = true;
  waiters.forEach((f) => f());
  waiters.clear();
}

/** Run `cb` once the intro has finished (immediately if it already has). Returns a cancel function. */
export function afterIntro(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  waiters.add(cb);
  return () => waiters.delete(cb);
}

/** Like afterIntro, but also waits for an idle moment so the reveal animation stays smooth. */
export function afterIntroIdle(cb: () => void, delay = 250) {
  let t = 0;
  let idle = 0;
  const cancel = afterIntro(() => {
    t = window.setTimeout(() => {
      const ric = (window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(cb, { timeout: 1200 });
      else cb();
    }, delay);
  });
  return () => {
    cancel();
    clearTimeout(t);
    const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    if (idle && cic) cic(idle);
  };
}
