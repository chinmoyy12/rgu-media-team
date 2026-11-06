import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/experience.css';
import { loadContent } from './content/store';

// Apply published (and admin-draft) content before the first render; never wait more than 1.5s.
Promise.race([loadContent(), new Promise((r) => setTimeout(r, 1500))]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
