/**
 * Rough device performance tier, decided once per page load.
 *  - 'low'  : software rendering, ≤2 GB RAM, ≤2 cores, data-saver, or old mobile GPUs
 *  - 'mid'  : phones / tablets / modest laptops
 *  - 'high' : desktops and recent laptops
 * Every 3D/particle effect reads this to pick its quality.
 */
export type Tier = 'low' | 'mid' | 'high';

let cached: Tier | null = null;
let gpu = '';

function gpuName(): string {
  if (gpu) return gpu;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return (gpu = 'none');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    gpu = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) || 'unknown';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    gpu = 'unknown';
  }
  return gpu;
}

export function perfTier(): Tier {
  if (cached) return cached;
  // manual override for testing / user choice: ?quality=low|mid|high
  const forced = new URLSearchParams(location.search).get('quality');
  if (forced === 'low' || forced === 'mid' || forced === 'high') {
    cached = forced;
    document.documentElement.dataset.tier = cached;
    return cached;
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const smallScreen = Math.min(screen.width, screen.height) < 500;
  const g = gpuName().toLowerCase();
  const softwareGL = /swiftshader|llvmpipe|software|basic render|microsoft basic/.test(g);
  const weakGPU = /mali-[2-4]|mali-t[67]|adreno \(tm\) [2-5]\d\d|powervr sgx|intel\(r\) hd graphics( [2-4]\d{3})?$|gma/.test(g);

  if (g === 'none' || softwareGL || mem <= 2 || cores <= 2 || nav.connection?.saveData || weakGPU) cached = 'low';
  else if (coarse || smallScreen || mem <= 4 || cores <= 4) cached = 'mid';
  else cached = 'high';
  document.documentElement.dataset.tier = cached;
  return cached;
}

/**
 * Watches real frame times; calls `onSlow` once if the average over ~1 s of
 * frames stays above `budgetMs` (default ≈ 30 fps). Returns a `tick` function
 * to call every frame.
 */
export function frameGuard(onSlow: () => void, budgetMs = 34) {
  let last = 0;
  let sum = 0;
  let n = 0;
  let fired = false;
  let skip = 20; // ignore warm-up frames (shader compiles, texture uploads)
  return (now: number) => {
    if (fired) return;
    if (last) {
      const dt = now - last;
      if (skip > 0) skip--;
      else if (dt < 500) {
        sum += dt;
        n++;
        if (n >= 45) {
          if (sum / n > budgetMs) {
            fired = true;
            onSlow();
          }
          sum = 0;
          n = 0;
        }
      }
    }
    last = now;
  };
}
