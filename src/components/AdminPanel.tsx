import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Lock, LogOut, ChevronUp, ChevronDown, Trash2, Copy, Plus, Download, Upload, RotateCcw, Check, ExternalLink, Globe, History, ImageUp } from 'lucide-react';
import { authMode, checkSession, currentEmail, finishRecovery, onPasswordRecovery, sendPasswordReset, signIn, signOut, updatePassword } from '../content/auth';
import {
  DEFAULTS,
  SiteContent,
  HistoryEntry,
  canPublishLive,
  discardDraft,
  exportJSON,
  getContent,
  getHistoryVersion,
  getPublishedAt,
  isDraft,
  listHistory,
  previewContent,
  publishLive,
  refreshPublished,
  revertPreview,
  saveDraft,
  subscribe,
  validateImport,
} from '../content/store';
import { canUpload, uploadImage } from '../content/media';

/* ---------- tiny path helpers for nested fields like "socials.instagram" ---------- */
const getPath = (o: any, p: string) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const setPath = (o: any, p: string, v: any) => {
  const keys = p.split('.');
  const out = Array.isArray(o) ? [...o] : { ...o };
  let cur: any = out;
  keys.slice(0, -1).forEach((k) => {
    cur[k] = { ...(cur[k] || {}) };
    cur = cur[k];
  });
  cur[keys[keys.length - 1]] = v;
  return out;
};
const badUrl = (v: string) => !!v && !/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(v.trim());

type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'email' | 'number' | 'toggle' | 'select' | 'datetime' | 'list' | 'color' | 'heading';
interface Field {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  hint?: string;
  wide?: boolean;
  max?: number;
  /** storage folder for 'image' uploads */
  folder?: string;
}

/** URL box + "Upload" button (Supabase Storage) for image fields. */
const ImageInput: React.FC<{ id: string; value: string; folder: string; onChange: (v: string) => void }> = ({ id, value, folder, onChange }) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await uploadImage(file, folder));
    } catch (e: any) {
      setErr(e?.message || 'Upload failed');
    }
    setBusy(false);
  };
  return (
    <>
      <div
        className={`adm-image ${busy ? 'busy' : ''}`}
        onDragOver={(e) => canUpload() && e.preventDefault()}
        onDrop={(e) => {
          if (!canUpload()) return;
          e.preventDefault();
          pick(e.dataTransfer.files?.[0]);
        }}
      >
        <input id={id} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        {canUpload() && (
          <button type="button" className="adm-btn" onClick={() => ref.current?.click()} disabled={busy}>
            <ImageUp size={14} /> {busy ? 'Uploading…' : 'Upload'}
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            pick(f);
          }}
        />
      </div>
      {err && <em className="adm-warn">{err}</em>}
    </>
  );
};
const SWATCHES = ['#f26a2e', '#e8b04a', '#e2557a', '#8b6cff', '#3fb8a8', '#5b8cff', '#f5efe2'];

const FieldInput: React.FC<{ f: Field; value: any; onChange: (v: any) => void }> = ({ f, value, onChange }) => {
  const t = f.type || 'text';
  const id = `adm-${f.key}`;
  let input: React.ReactNode;
  if (t === 'heading') return <h4 className="adm-section-title">{f.label}</h4>;
  if (t === 'image') input = <ImageInput id={id} value={value} folder={f.folder || 'misc'} onChange={onChange} />;
  else if (t === 'color')
    input = (
      <div className="adm-color">
        <input id={id} type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#f26a2e'} onChange={(e) => onChange(e.target.value)} />
        <div className="adm-swatches">
          {SWATCHES.map((s) => (
            <button
              key={s}
              type="button"
              className={value?.toLowerCase() === s ? 'on' : ''}
              style={{ background: s }}
              onClick={() => onChange(s)}
              aria-label={`Use ${s}`}
            />
          ))}
        </div>
      </div>
    );
  else if (t === 'toggle')
    input = (
      <button type="button" className={`adm-toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)} aria-pressed={!!value} id={id}>
        <span />
        {value ? 'On' : 'Off'}
      </button>
    );
  else if (t === 'textarea')
    input = <textarea id={id} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  else if (t === 'select')
    input = (
      <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {f.options!.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  else if (t === 'list')
    input = (
      <input
        id={id}
        value={(value || []).join(', ')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter((s, i, a) => s || i < a.length - 1)
          )
        }
      />
    );
  else
    input = (
      <input
        id={id}
        type={t === 'number' ? 'number' : t === 'email' ? 'email' : t === 'datetime' ? 'datetime-local' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(t === 'number' ? Number(e.target.value) : e.target.value)}
        spellCheck={t === 'text' || t === 'textarea'}
      />
    );
  return (
    <label className={`adm-field ${f.wide || t === 'textarea' ? 'wide' : ''}`} htmlFor={id}>
      <span>{f.label}</span>
      {input}
      {(t === 'url' || t === 'image') && badUrl(value) && <em className="adm-warn">Links should start with https://</em>}
      {f.max && (
        <em className={`adm-count ${(value || '').length > f.max ? 'over' : ''}`}>
          {(value || '').length} / {f.max}
        </em>
      )}
      {f.hint && <small>{f.hint}</small>}
    </label>
  );
};

const FieldGrid: React.FC<{ fields: Field[]; obj: any; onChange: (o: any) => void }> = ({ fields, obj, onChange }) => (
  <div className="adm-grid">
    {fields.map((f) => (
      <FieldInput key={f.key} f={f} value={getPath(obj, f.key)} onChange={(v) => onChange(setPath(obj, f.key, v))} />
    ))}
  </div>
);

/* ---------- list editor ---------- */
function ListEditor<T extends { id: string }>({
  items,
  fields,
  title,
  thumb,
  onChange,
  make,
  noun,
}: {
  items: T[];
  fields: Field[];
  title: (t: T) => string;
  thumb?: (t: T) => string | undefined;
  onChange: (v: T[]) => void;
  make: () => T;
  noun: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  const shown = items.map((it, i) => ({ it, i })).filter(({ it }) => !q || title(it).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="adm-list">
      <div className="adm-list-bar">
        <input placeholder={`Search ${noun}s…`} value={q} onChange={(e) => setQ(e.target.value)} />
        <button
          className="adm-btn"
          onClick={() => {
            const n = make();
            onChange([...items, n]);
            setOpenId(n.id);
            setQ('');
          }}
        >
          <Plus size={14} /> Add {noun}
        </button>
      </div>
      {shown.map(({ it, i }) => {
        const open = openId === it.id;
        const src = thumb?.(it);
        return (
          <div key={it.id} className={`adm-item ${open ? 'open' : ''}`}>
            <div className="adm-item-head">
              <button className="adm-item-title" onClick={() => setOpenId(open ? null : it.id)}>
                {thumb && <span className="adm-thumb">{src ? <img src={src} alt="" loading="lazy" /> : null}</span>}
                <span>
                  <b>{title(it) || `Untitled ${noun}`}</b>
                  <small>#{i + 1}</small>
                </span>
              </button>
              <div className="adm-item-tools">
                <button onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0}>
                  <ChevronUp size={15} />
                </button>
                <button onClick={() => move(i, 1)} aria-label="Move down" disabled={i === items.length - 1}>
                  <ChevronDown size={15} />
                </button>
                <button
                  onClick={() => {
                    const c = { ...JSON.parse(JSON.stringify(it)), id: `${it.id}-copy-${Date.now().toString(36)}` };
                    const n = [...items];
                    n.splice(i + 1, 0, c);
                    onChange(n);
                  }}
                  aria-label="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    if (confirm(`Remove “${title(it) || noun}”?`)) onChange(items.filter((x) => x.id !== it.id));
                  }}
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {open && (
              <div className="adm-item-body">
                <FieldGrid
                  fields={fields}
                  obj={it}
                  onChange={(o) => onChange(items.map((x) => (x.id === it.id ? (o as T) : x)))}
                />
              </div>
            )}
          </div>
        );
      })}
      {!shown.length && <p className="adm-empty">No {noun}s match.</p>}
    </div>
  );
}

/* ---------- field specs ---------- */
const GENERAL: Field[] = [
  { key: 'general.recruitmentOpen', label: 'Recruitment open', type: 'toggle', hint: 'Turns the announcement ticker and apply prompts on or off.' },
  { key: 'general.academicYear', label: 'Academic year' },
  { key: 'general.googleFormUrl', label: 'Application form link (Google Form)', type: 'url', wide: true },
  { key: 'general.announcementBanner', label: 'Announcement ticker text', wide: true },
  { key: 'general.deadlineDate', label: 'Deadline (as shown)', hint: 'e.g. August 30, 2026' },
  { key: 'general.deadlineISO', label: 'Deadline (for countdown)', type: 'datetime' },
  { key: 'general.contactPhone', label: 'Contact phone' },
  { key: 'general.officeLocation', label: 'Office location' },
  { key: 'general.universityLocation', label: 'University address', wide: true },
  { key: 'general.whatsappAssistGroup', label: 'WhatsApp help group link', type: 'url', wide: true },
];
const LINKS: Field[] = [
  { key: 'socialLinks.instagram', label: 'Instagram', type: 'url', wide: true },
  { key: 'socialLinks.facebook', label: 'Facebook', type: 'url', wide: true },
  { key: 'socialLinks.youtube', label: 'YouTube', type: 'url', wide: true },
  { key: 'socialLinks.linkedin', label: 'LinkedIn', type: 'url', wide: true },
  { key: 'socialLinks.whatsapp', label: 'WhatsApp community', type: 'url', wide: true },
];
const TEXT: Field[] = [
  { key: 'text.heroEyebrow', label: 'Hero — small line above title', wide: true },
  { key: 'text.heroLine1', label: 'Hero title — line 1' },
  { key: 'text.heroLine2', label: 'Hero title — line 2 (gradient)' },
  { key: 'text.heroCaption', label: 'Hero caption', type: 'textarea', hint: 'Line breaks are kept.' },
  { key: 'text.ribbonHeadline1', label: 'Work reel — headline 1' },
  { key: 'text.ribbonHeadline2', label: 'Work reel — headline 2' },
  { key: 'text.ribbonCaption', label: 'Work reel — caption', wide: true },
  { key: 'text.marquee', label: 'Marquee words', type: 'list', wide: true, hint: 'Comma separated.' },
  { key: 'text.manifestoLabel', label: 'Manifesto label' },
  { key: 'text.manifestoAccent', label: 'Manifesto highlighted words', type: 'list', hint: 'Comma separated.' },
  { key: 'text.manifesto', label: 'Manifesto statement', type: 'textarea' },
];
const MEMBER: Field[] = [
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'department', label: 'Department' },
  { key: 'category', label: 'Category', type: 'select', options: ['Head', 'Executive', 'Chief', 'Deputy', 'Coordinator', 'Department Head', 'Core Member'] },
  { key: 'hierarchyOrder', label: 'Order (lower = first)', type: 'number' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'photoUrl', label: 'Photo', type: 'image', folder: 'members', wide: true },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'socials.instagram', label: 'Instagram', type: 'url' },
  { key: 'socials.linkedin', label: 'LinkedIn', type: 'url' },
  { key: 'socials.youtube', label: 'YouTube', type: 'url' },
  { key: 'socials.portfolio', label: 'Portfolio', type: 'url' },
];
const GALLERY: Field[] = [
  { key: 'title', label: 'Title', wide: true },
  {
    key: 'imageUrl',
    label: 'Image',
    type: 'image',
    folder: 'gallery',
    wide: true,
    hint: 'Upload, drop a file here, or paste a link. Linked images must allow cross-origin loading (Unsplash, ImageKit, Cloudinary) to appear in the 3D reel.',
  },
  { key: 'category', label: 'Category', type: 'select', options: ['Photography', 'Videography', 'Events', 'Sports', 'Festivals', 'Campus', 'Workshops', 'Cultural', 'Tech Fest'] },
  { key: 'photographer', label: 'Photographer' },
  { key: 'date', label: 'Date' },
  { key: 'location', label: 'Location' },
  { key: 'featured', label: 'Featured', type: 'toggle' },
];
const FAQ: Field[] = [
  { key: 'question', label: 'Question', wide: true },
  { key: 'answer', label: 'Answer', type: 'textarea' },
  { key: 'category', label: 'Category' },
];

const APPEARANCE: Field[] = [
  { key: 'h1', label: 'Brand', type: 'heading' },
  { key: 'appearance.accent', label: 'Accent colour', type: 'color', wide: true, hint: 'Used by the navigation, ticker, hero, manifesto and buttons of the new design.' },
  { key: 'h2', label: 'Effects', type: 'heading' },
  { key: 'appearance.smoothScroll', label: 'Smooth inertial scrolling', type: 'toggle' },
  { key: 'appearance.cursor', label: 'Custom magnetic cursor', type: 'toggle' },
  { key: 'appearance.grain', label: 'Film grain overlay', type: 'toggle' },
  { key: 'appearance.tilt', label: '3D tilt & glare on cards', type: 'toggle' },
];
const SECTIONS: Field[] = [
  { key: 'h1', label: 'Home page sections', type: 'heading' },
  { key: 'sections.ribbon', label: '3D work reel', type: 'toggle' },
  { key: 'sections.marquee', label: 'Kinetic marquee', type: 'toggle' },
  { key: 'sections.manifesto', label: 'Manifesto', type: 'toggle' },
  { key: 'sections.about', label: 'About & stats', type: 'toggle' },
  { key: 'sections.departments', label: 'Departments', type: 'toggle' },
  { key: 'sections.family', label: 'Media family photo', type: 'toggle' },
  { key: 'sections.whyJoin', label: 'Why join', type: 'toggle' },
  { key: 'sections.joinUs', label: 'Join us', type: 'toggle' },
  { key: 'sections.faq', label: 'FAQ', type: 'toggle' },
  { key: 'sections.contact', label: 'Contact', type: 'toggle' },
];
const SEO: Field[] = [
  { key: 'seo.title', label: 'Page title', wide: true, max: 60 },
  { key: 'seo.description', label: 'Description', type: 'textarea', max: 160 },
  { key: 'seo.ogImage', label: 'Share image (1200×630)', type: 'image', folder: 'seo', wide: true },
];

const TABS = ['General', 'Links', 'Text', 'Members', 'Gallery', 'FAQ', 'Appearance', 'Sections', 'SEO', 'Publish'] as const;
type Tab = (typeof TABS)[number];
const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ---------- login ---------- */
type LoginView = 'signin' | 'forgot' | 'recover';

const Login: React.FC<{ onOk: () => void; recovering: boolean; onRecovered: () => void }> = ({ onOk, recovering, onRecovered }) => {
  const [view, setView] = useState<LoginView>(recovering ? 'recover' : 'signin');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const mode = authMode();
  useEffect(() => {
    if (recovering) setView('recover');
  }, [recovering]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setInfo('');
    if (view === 'signin') {
      const r = await signIn(email, pw);
      if (r.ok) onOk();
      else setErr(r.error || 'Sign-in failed.');
    } else if (view === 'forgot') {
      const r = await sendPasswordReset(email);
      if (r.ok) setInfo('If that address is an admin account, a reset link is on its way. Open it on this device.');
      else setErr(r.error || 'Could not send the email.');
    } else {
      if (pw.length < 10) setErr('Use at least 10 characters.');
      else if (pw !== pw2) setErr('The two passwords don’t match.');
      else {
        const r = await updatePassword(pw);
        if (r.ok) {
          onRecovered();
          onOk();
        } else setErr(r.error || 'Could not change the password.');
      }
    }
    setBusy(false);
  };

  return (
    <form className="adm-login" onSubmit={submit}>
      <span className="adm-lock">
        <Lock size={20} />
      </span>
      <h3>{view === 'recover' ? 'Choose a new password' : view === 'forgot' ? 'Reset your password' : 'Admin access'}</h3>
      <p>
        {view === 'recover'
          ? 'You’re signed in from the reset link. Set a new password to continue.'
          : view === 'forgot'
            ? 'We’ll email you a link to set a new password.'
            : 'Sign in to edit links, members and page content.'}
      </p>
      {mode === 'none' ? (
        <div className="adm-note">
          <b>Admin sign-in isn’t connected yet.</b> The editor stays locked until it is. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code> (see <code>supabase/README.md</code>), then restart /
          redeploy.
        </div>
      ) : (
        <>
          {view !== 'recover' && (
            <label className="adm-field wide">
              <span>Email</span>
              <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </label>
          )}
          {view !== 'forgot' && (
            <label className="adm-field wide">
              <span>{view === 'recover' ? 'New password' : 'Password'}</span>
              <input
                type="password"
                autoComplete={view === 'recover' ? 'new-password' : 'current-password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />
            </label>
          )}
          {view === 'recover' && (
            <label className="adm-field wide">
              <span>Repeat new password</span>
              <input type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
            </label>
          )}
          {err && <em className="adm-warn">{err}</em>}
          {info && <em className="adm-ok">{info}</em>}
          <button className="adm-btn primary" disabled={busy}>
            {busy ? 'Please wait…' : view === 'recover' ? 'Save new password' : view === 'forgot' ? 'Send reset link' : 'Sign in'}
          </button>
          {mode === 'supabase' && (
            <button
              type="button"
              className="adm-link"
              onClick={() => {
                if (view === 'recover') {
                  finishRecovery();
                  onRecovered();
                }
                setView(view === 'forgot' ? 'signin' : 'forgot');
                setErr('');
                setInfo('');
                setPw('');
                setPw2('');
              }}
            >
              {view === 'forgot' ? '← Back to sign in' : view === 'recover' ? 'Request a new reset link' : 'Forgot password?'}
            </button>
          )}
        </>
      )}
    </form>
  );
};

/* ---------- live publish + version history (Supabase) ---------- */
const fmtWhen = (iso: string) => {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} h ago`;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const HistoryList: React.FC<{ stamp: number; onLoad: (c: SiteContent, when: string) => void }> = ({ stamp, onLoad }) => {
  const [rows, setRows] = useState<HistoryEntry[] | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  useEffect(() => {
    let live = true;
    listHistory()
      .then((r) => live && setRows(r))
      .catch((e) => live && setErr(e.message));
    return () => {
      live = false;
    };
  }, [stamp]);
  if (err) return <p className="adm-small">Couldn’t load history: {err}</p>;
  if (!rows) return <p className="adm-small">Loading history…</p>;
  if (!rows.length) return <p className="adm-small">No published versions yet — your first Publish will appear here.</p>;
  return (
    <ul className="adm-history">
      {rows.map((r, i) => (
        <li key={r.id}>
          <span>
            <b>{i === 0 ? 'Live now' : fmtWhen(r.saved_at)}</b>
            <small>
              {i === 0 ? fmtWhen(r.saved_at) + ' · ' : ''}
              {r.saved_by || 'unknown'}
            </small>
          </span>
          {i > 0 && (
            <button
              className="adm-btn"
              disabled={busy !== null}
              onClick={async () => {
                setBusy(r.id);
                try {
                  onLoad(await getHistoryVersion(r.id), fmtWhen(r.saved_at));
                } catch (e: any) {
                  setErr(e.message);
                }
                setBusy(null);
              }}
            >
              <RotateCcw size={13} /> {busy === r.id ? 'Loading…' : 'Load'}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

/* ---------- panel ---------- */
export const AdminPanel: React.FC<{ open: boolean; onClose: () => void; onOpenRequest?: () => void }> = ({ open, onClose, onOpenRequest }) => {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [who, setWho] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('General');
  const [draft, setDraft] = useState<SiteContent>(() => getContent());
  const [saved, setSaved] = useState<SiteContent>(() => getContent());
  const [flash, setFlash] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [histStamp, setHistStamp] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const live = canPublishLive();

  // arriving from a password-reset email → open the panel on "choose a new password"
  useEffect(
    () =>
      onPasswordRecovery(() => {
        setRecovering(true);
        setAuthed(false);
        onOpenRequest?.();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // the live version this editing session started from (for "someone else published" checks)
  const baseAt = useRef<string | null>(null);
  const flashTimer = useRef(0);

  useEffect(() => {
    if (!open) return;
    const c = getContent();
    setDraft(c);
    setSaved(c);
    baseAt.current = getPublishedAt();
    if (recovering) return;
    if (authMode() === 'none') return; // keep dev-preview state as is
    let alive = true;
    setChecking(true);
    checkSession()
      .catch(() => false)
      .then(async (ok) => {
      if (!alive) return;
      setAuthed(ok);
      setChecking(false);
      if (ok) setWho(await currentEmail());
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  // live preview: the page behind the panel follows your edits as you type
  const previewed = useRef(false);
  useEffect(() => {
    if (!open || !authed) return;
    if (!dirty) {
      if (previewed.current) {
        previewed.current = false;
        revertPreview();
      }
      return;
    }
    const id = window.setTimeout(() => {
      previewed.current = true;
      previewContent(draft);
    }, 220);
    return () => clearTimeout(id);
  }, [draft, dirty, open, authed]);

  // someone else published while the editor is open with nothing unsaved → load it
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  useEffect(() => {
    if (!open) return;
    return subscribe(() => {
      if (dirtyRef.current || isDraft() || previewed.current) return;
      const at = getPublishedAt();
      if (at && at !== baseAt.current) {
        const c = getContent();
        setDraft(c);
        setSaved(c);
        baseAt.current = at;
      }
    });
  }, [open]);

  const close = () => {
    if (authed && dirty && !confirm('You have unsaved changes. Close without saving?')) return;
    if (previewed.current) {
      previewed.current = false;
      revertPreview();
    }
    onClose();
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      // Ctrl/⌘ + S saves
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>('.adm-foot [data-save]:not(:disabled)')?.click();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);
  const note = (m: string) => {
    setFlash(m);
    clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(''), 3200);
  };
  const save = () => {
    previewed.current = false;
    saveDraft(draft);
    setSaved(draft);
    note(live ? 'Draft saved — only you can see it. Publish to go live.' : 'Saved — previewing in this browser');
  };
  const publish = async (force = false) => {
    if (!force && !confirm('Publish these changes to the live site for every visitor?')) return;
    setPublishing(true);
    let r: Awaited<ReturnType<typeof publishLive>>;
    try {
      r = await publishLive(draft, { force, base: baseAt.current });
    } catch (er: any) {
      r = { ok: false, error: /fetch|network/i.test(String(er?.message)) ? 'You seem to be offline — check your connection and try again.' : er?.message || 'Publish failed' };
    } finally {
      setPublishing(false);
    }
    if (r.conflict) {
      const by = r.conflict.by ? ` by ${r.conflict.by}` : '';
      if (
        confirm(
          `Someone published a newer version${by} (${fmtWhen(r.conflict.at)}) after you opened the editor.\n\nOK = overwrite it with yours\nCancel = keep theirs and reload it into the editor (your edits are lost)`
        )
      )
        return publish(true);
      await refreshPublished();
      previewed.current = false;
      discardDraft();
      const c = getContent();
      setDraft(c);
      setSaved(c);
      baseAt.current = getPublishedAt();
      note('Loaded the newer live version');
      return;
    }
    if (!r.ok) {
      note(r.error || 'Publish failed');
      return;
    }
    previewed.current = false;
    baseAt.current = getPublishedAt();
    const c = getContent();
    setDraft(c);
    setSaved(c);
    setHistStamp((s) => s + 1);
    note('Published — live for everyone');
  };
  const doSignOut = async () => {
    if (dirty && !confirm('You have unsaved changes. Sign out anyway?')) return;
    await signOut();
    setAuthed(false);
    setWho(null);
  };
  const download = () => {
    const blob = new Blob([exportJSON(draft)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="adm-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="adm-scrim" onClick={close} />
          <motion.aside
            className="adm-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Admin settings"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <header className="adm-head">
              <div>
                <small>Media Team</small>
                <h2>Site settings</h2>
              </div>
              <div className="adm-head-tools">
                {authed && (
                  <span className={`adm-chip ${isDraft() ? 'draft' : ''}`} title={who ? `Signed in as ${who}` : undefined}>
                    {isDraft() ? 'Unpublished draft' : live ? 'Live' : 'Published'}
                  </span>
                )}
                {authed && (
                  <button className="adm-icon" onClick={doSignOut} aria-label="Sign out" title={who ? `Sign out ${who}` : 'Sign out'}>
                    <LogOut size={16} />
                  </button>
                )}
                <button className="adm-icon" onClick={close} aria-label="Close settings">
                  <X size={18} />
                </button>
              </div>
            </header>

            {checking ? (
              <div className="adm-login">
                <p>Checking your session…</p>
              </div>
            ) : !authed ? (
              <Login
                recovering={recovering}
                onRecovered={() => setRecovering(false)}
                onOk={async () => {
                  setAuthed(true);
                  setWho(await currentEmail());
                }}
              />
            ) : (
              <>
                <nav className="adm-tabs" aria-label="Settings sections">
                  {TABS.map((t) => (
                    <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
                      {t}
                      {t === 'Members' && <i>{draft.members.length}</i>}
                    </button>
                  ))}
                </nav>

                <div className="adm-body">
                  {tab === 'General' && <FieldGrid fields={GENERAL} obj={draft} onChange={setDraft} />}
                  {tab === 'Links' && <FieldGrid fields={LINKS} obj={draft} onChange={setDraft} />}
                  {tab === 'Text' && <FieldGrid fields={TEXT} obj={draft} onChange={setDraft} />}
                  {tab === 'Appearance' && <FieldGrid fields={APPEARANCE} obj={draft} onChange={setDraft} />}
                  {tab === 'Sections' && <FieldGrid fields={SECTIONS} obj={draft} onChange={setDraft} />}
                  {tab === 'SEO' && (
                    <div className="adm-grid">
                      <div className="adm-serp" aria-label="Search result preview">
                        <small>{location.host} › media-team</small>
                        <b>{draft.seo.title || 'Untitled page'}</b>
                        <p>{draft.seo.description}</p>
                      </div>
                      {SEO.map((f) => (
                        <FieldInput key={f.key} f={f} value={getPath(draft, f.key)} onChange={(v) => setDraft(setPath(draft, f.key, v))} />
                      ))}
                    </div>
                  )}
                  {tab === 'Members' && (
                    <ListEditor
                      items={draft.members}
                      fields={MEMBER}
                      noun="member"
                      title={(m) => `${m.name}${m.position ? ' — ' + m.position : ''}`}
                      thumb={(m) => m.photoUrl}
                      onChange={(members) => setDraft({ ...draft, members })}
                      make={() => ({
                        id: uid('mem'),
                        name: 'New member',
                        position: 'Core Member',
                        department: 'Media',
                        category: 'Core Member',
                        hierarchyOrder: 99,
                        photoUrl: '',
                        email: '',
                        bio: '',
                        socials: {},
                      })}
                    />
                  )}
                  {tab === 'Gallery' && (
                    <ListEditor
                      items={draft.gallery}
                      fields={GALLERY}
                      noun="photo"
                      title={(g) => g.title}
                      thumb={(g) => g.imageUrl}
                      onChange={(gallery) => setDraft({ ...draft, gallery })}
                      make={() => ({ id: uid('gal'), title: 'New photo', category: 'Events', imageUrl: '', photographer: '', date: '', location: '' })}
                    />
                  )}
                  {tab === 'FAQ' && (
                    <ListEditor
                      items={draft.faq}
                      fields={FAQ}
                      noun="question"
                      title={(f) => f.question}
                      onChange={(faq) => setDraft({ ...draft, faq })}
                      make={() => ({ id: uid('faq'), question: 'New question', answer: '' })}
                    />
                  )}
                  {tab === 'Publish' && (
                    <div className="adm-publish">
                      {live && (
                        <>
                          <div className="adm-steps adm-live">
                            <h3>
                              <Globe size={16} /> Publish to the live site
                            </h3>
                            <p>
                              Changes go straight to the database — every visitor sees them on their next page load. No redeploy
                              needed. <b>Save draft</b> first if you only want to preview privately.
                            </p>
                            <button className="adm-btn primary" onClick={() => publish()} disabled={publishing}>
                              <Globe size={15} /> {publishing ? 'Publishing…' : 'Publish now'}
                            </button>
                          </div>
                          <div className="adm-steps">
                            <h3>
                              <History size={16} /> Version history
                            </h3>
                            <p className="adm-small">Every publish is kept (latest 50). Load an older one into the editor, check it, then Publish to restore it.</p>
                            <HistoryList
                              stamp={histStamp}
                              onLoad={(c, when) => {
                                setDraft(c);
                                note(`Loaded the version from ${when} — Publish to restore it`);
                              }}
                            />
                          </div>
                          <h4 className="adm-section-title">Backup &amp; tools</h4>
                        </>
                      )}
                      {!live && (
                      <div className="adm-steps">
                        <h3>Make your changes live for everyone</h3>
                        <ol>
                          <li>
                            <b>Save</b> — your edits preview instantly, but only in this browser.
                          </li>
                          <li>
                            <b>Download content.json</b> below.
                          </li>
                          <li>
                            Put it in the project’s <code>public/</code> folder (replace the old one) and redeploy. Every visitor then loads
                            it automatically.
                          </li>
                        </ol>
                      </div>
                      )}
                      <div className="adm-actions-grid">
                        <button className={`adm-btn ${live ? '' : 'primary'}`} onClick={download}>
                          <Download size={15} /> {live ? 'Download backup' : 'Download content.json'}
                        </button>
                        <button
                          className="adm-btn"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(exportJSON(draft));
                              note('Copied JSON');
                            } catch {
                              note('Copy blocked — use Download');
                            }
                          }}
                        >
                          <Copy size={15} /> Copy JSON
                        </button>
                        <button className="adm-btn" onClick={() => fileRef.current?.click()}>
                          <Upload size={15} /> Import a file
                        </button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="application/json,.json"
                          hidden
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            e.target.value = '';
                            if (!f) return;
                            try {
                              setDraft(validateImport(await f.text()));
                              note('Imported — review, then Save');
                            } catch (er: any) {
                              note(er?.message || 'Could not read that file');
                            }
                          }}
                        />
                        <button
                          className="adm-btn"
                          onClick={() => {
                            if (!confirm('Discard this browser’s draft and go back to the published content?')) return;
                            previewed.current = false;
                            discardDraft();
                            const c = getContent();
                            setDraft(c);
                            setSaved(c);
                            note('Back to published content');
                          }}
                        >
                          <RotateCcw size={15} /> {live ? 'Discard draft' : 'Discard local draft'}
                        </button>
                        <button
                          className="adm-btn danger"
                          onClick={() => {
                            if (confirm('Load the original built-in content into the editor? (Nothing changes until you Save.)'))
                              setDraft(JSON.parse(JSON.stringify(DEFAULTS)));
                          }}
                        >
                          Load factory defaults
                        </button>
                      </div>
                      {!live && (
                        <p className="adm-small">
                          Want edits to go live instantly instead? Connect Supabase — see <code>supabase/README.md</code>.
                          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
                            Supabase dashboard <ExternalLink size={11} />
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <footer className="adm-foot">
                  <span className={`adm-flash ${flash ? 'on' : ''}`}>
                    <Check size={14} /> {flash}
                  </span>
                  <span className="adm-dirty">{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
                  <button className="adm-btn" disabled={!dirty} onClick={() => setDraft(saved)}>
                    Undo
                  </button>
                  <button data-save className={`adm-btn ${live ? '' : 'primary'}`} disabled={!dirty} onClick={save} title="Ctrl/⌘ + S">
                    {live ? 'Save draft' : 'Save & preview'}
                  </button>
                  {live && (
                    <button
                      className="adm-btn primary"
                      onClick={() => publish()}
                      disabled={publishing || (!dirty && !isDraft())}
                      title="Make it live for everyone"
                    >
                      <Globe size={14} /> {publishing ? 'Publishing…' : 'Publish'}
                    </button>
                  )}
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
