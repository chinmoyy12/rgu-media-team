import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/experience.css';
import { loadContent } from './content/store';

// Any image that fails to load (e.g. a bad link pasted in the admin panel) gets a
// neutral placeholder instead of the browser's broken-image icon.
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c1410"/><stop offset="1" stop-color="#0b0b0d"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><g fill="none" stroke="#F26A2E" stroke-opacity=".55" stroke-width="6"><rect x="150" y="112" width="100" height="76" rx="12"/><circle cx="200" cy="150" r="20"/></g></svg>`
  );
window.addEventListener(
  'error',
  (e) => {
    const img = e.target as HTMLImageElement | null;
    if (!img || img.tagName !== 'IMG' || img.dataset.fallback) return;
    img.dataset.fallback = '1';
    img.removeAttribute('srcset');
    img.src = PLACEHOLDER;
  },
  true
);

// Apply published (and admin-draft) content before the first render; never wait more than 1.5s.
Promise.race([loadContent(), new Promise((r) => setTimeout(r, 1500))]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
