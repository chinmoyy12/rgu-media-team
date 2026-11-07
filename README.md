<div align="center">

# 🎬 RGU Media Team — Official Website

### *Capturing moments · Creating stories · Preserving memories*

The official website of the **Media Team of The Assam Royal Global University, Guwahati** —
a cinematic, 3D, fully animated portfolio and recruitment site with a secure admin panel.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![three.js](https://img.shields.io/badge/three.js-r170-000000?logo=threedotjs&logoColor=white)](https://threejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Netlify](https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com)

<br>

## 🌐 [**Visit the live website →**](https://rgu-media-team-1.netlify.app)

[![Live on Netlify](https://img.shields.io/badge/LIVE-rgu--media--team--1.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://rgu-media-team-1.netlify.app)

**https://rgu-media-team-1.netlify.app**

</div>

---

## 📖 Table of contents

- [Highlights](#-highlights)
- [Experience walkthrough](#-experience-walkthrough)
- [Admin panel](#-admin-panel)
- [Tech stack](#-tech-stack)
- [Getting started](#-getting-started)
- [Environment variables](#-environment-variables)
- [Supabase setup](#-supabase-setup)
- [Deployment](#-deployment)
- [Project structure](#-project-structure)
- [Keyboard shortcuts](#-keyboard-shortcuts)
- [Performance & accessibility](#-performance--accessibility)
- [Contributing](#-contributing)
- [Credits](#-credits)

---

## ✨ Highlights

| | |
|---|---|
| 🎥 **3D cinema intro** | A film camera assembles on a tripod, its reels unspool a strip of team photos, a clapperboard snaps and polaroids orbit — then the view dives into the lens and an iris opens onto the site. |
| 🌌 **Night-valley hero** | A three.js valley of glowing flowers with bloom, click shockwaves, a cursor ember trail, shooting stars, depth-of-field bokeh and an optional generative ambient soundtrack. |
| 🎞️ **3D work reel** | A scroll-driven ribbon of the team's photos and reels that bends with scroll speed and lands in a grid with liquid hover ripples. |
| 🐝 **Swarm rebuild** | The Members page is rebuilt from thousands of particles on first visit, then the swarm follows the cursor and fades. |
| ✍️ **Kinetic typography** | Velocity marquee, scroll-lit manifesto, masked heading reveals, 3D card tilt with glare and smooth inertial scrolling. |
| 🔐 **Admin panel** | Secure sign-in with password reset. Edit links, members, gallery, FAQ, page text, colours, sections and SEO — publish live with version history. |

---

## 🧭 Experience walkthrough

1. **Intro** — viewfinder HUD (REC, timecode, focus box) over the 3D film set; dives into the lens at 100%.
2. **Home** — night-valley hero → 3D work reel → kinetic marquee → manifesto → about, departments, why join, join us, FAQ, contact.
3. **Members** — leadership roster with filters and profile cards, introduced by the swarm rebuild.
4. **Works** — the team's photography and video portfolio.
5. **Apply** — recruitment form modal, countdown and WhatsApp help links.

---

## 🛠️ Admin panel

Open it with the **lock button** in the top bar or **Ctrl + Shift + A**.

| Tab | What you can change |
|---|---|
| General | Application form link, recruitment on/off, ticker text, deadline & countdown, contact details |
| Links | Instagram, Facebook, YouTube, LinkedIn, WhatsApp |
| Text | Hero lines, work-reel headlines, marquee words, manifesto |
| Members / Gallery / FAQ | Add, edit, reorder, duplicate, delete — with photo **upload** (auto-resized) |
| Appearance | Accent colour, smooth scroll, cursor, film grain, card tilt |
| Sections | Show or hide each home-page section |
| SEO | Page title, description and share image, with a Google-style preview |
| Publish | **Publish live**, version history & rollback, JSON backup / import |

**Security model**

- Sign-in uses **Supabase Auth** — passwords are verified on Supabase's servers, never stored in this repo.
- The database uses **row-level security**: anyone may read the published content, but only emails listed in `site_admins` can write or upload.
- Public sign-ups are disabled; admins are added in the Supabase dashboard.
- The Supabase URL and publishable (anon) key are public by design.

---

## 🧰 Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 + custom CSS (`src/styles/experience.css`) |
| 3D / WebGL | three.js r170 — custom shaders, `EffectComposer`, Unreal bloom |
| Motion | motion/react, Lenis smooth scroll, 2D canvas particle systems |
| Backend | Supabase — Auth, Postgres (RLS), Storage |
| Icons & fonts | Lucide · Antonio, Manrope, Inter Tight, IBM Plex Mono |
| Hosting | Netlify (also GitHub Pages compatible) |

---

## 🚀 Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone https://github.com/chinmoyy12/media-team-1.git
cd media-team-1
npm install
npm run dev
```

The site runs at **http://localhost:3000**.

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc` |

---

## 🔑 Environment variables

Create `.env.local` in the project root (it is git-ignored):

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

Without them the site still runs with its built-in content; the admin panel stays locked.
On Netlify, add the same two variables under **Site configuration → Environment variables**.

---

## 🗄️ Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) — it creates the content table, version history, the photo bucket and all security rules. Put your admin email(s) in the last block.
3. **Authentication → Users → Add user** with the same email (tick *Auto Confirm User*).
4. **Authentication → Sign In / Providers** — turn off *Allow new users to sign up*.
5. **Authentication → URL Configuration** — add your site URL(s) to *Redirect URLs* so password-reset links work.

Full guide: [`supabase/README.md`](supabase/README.md).

---

## 🌐 Deployment

### Netlify (recommended)

The repo includes [`netlify.toml`](netlify.toml) (build `npm run build`, publish `dist`, SPA redirect, long-term asset caching).

1. **Add new site → Import from GitHub** and pick this repo.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
3. Deploy. Every push to `main` redeploys automatically.

### GitHub Pages

The build uses relative paths (`base: './'`), so `dist/` can be pushed to a `gh-pages` branch as-is.

> Content edits made in the admin panel go live instantly from Supabase — no redeploy needed. Redeploy only for code or design changes.

---

## 📂 Project structure

```
├── public/                 static files (manifest, .nojekyll)
├── scripts/                helper scripts
├── supabase/
│   ├── schema.sql          database, security rules, storage
│   └── README.md           backend setup guide
├── src/
│   ├── components/         page sections, Navbar, AdminPanel, LoadingScreen, SwarmCursor …
│   ├── content/            content store, auth, image uploads
│   ├── data/               default members, gallery and FAQ
│   ├── lib/                Supabase client, smooth scroll, global FX
│   ├── styles/             experience.css (design system & effects)
│   ├── three/              valley.ts (hero), ribbon.ts (work reel), intro.ts (3D intro)
│   ├── App.tsx
│   └── main.tsx
├── netlify.toml
└── vite.config.ts
```

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` | Search the site |
| `?` | Show shortcuts |
| `Ctrl + Shift + A` | Open the admin panel |
| `Ctrl + S` | Save draft (in the admin panel) |
| `Esc` | Close dialogs |

---

## ⚡ Performance & accessibility

- 3D scenes pause when off-screen or in a background tab and are disposed when finished.
- The intro is code-split; phones get lighter particle counts and no post-processing.
- `prefers-reduced-motion` turns off the intro, swarm and heavy effects.
- Devices without WebGL fall back to a simple text loader.
- Content and links stay keyboard-accessible; decorative canvases are `aria-hidden`.

---

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/your-change`
2. Run `npm run lint` and `npm run build` before committing.
3. Open a pull request describing the change (screenshots welcome).

Never commit `.env.local`, passwords or Supabase **service_role** keys.

---

## 🙌 Credits

Built for and by the **Media Team, The Assam Royal Global University**, Guwahati.
Photography © the Media Team and the respective photographers.

<div align="center">

**📍 C Block, 4th Floor · The Assam Royal Global University, Guwahati**

*Made with 🧡 by the Royalites*

</div>
