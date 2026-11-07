import { config } from '../config';
import { teamMembers, galleryItems, faqData } from '../data/mockData';
import type { TeamMember, GalleryItem, FAQItem } from '../types';
import { supabase, hasSupabase } from '../lib/supabase';

/**
 * Editable site content.
 *
 * Components keep importing `config`, `teamMembers`, etc. directly; this store
 * patches those objects in place and then bumps a version so React re-renders.
 *
 * Where content comes from (later wins):
 *   1. defaults compiled into the bundle
 *   2. /content.json — the PUBLISHED file, served to every visitor
 *   3. a local draft in this browser (admin preview only, never seen by others)
 */

export const siteText = {
  heroLine1: 'Capturing',
  heroLine2: 'moments.',
  heroEyebrow: 'The Assam Royal Global University · Media Team',
  heroCaption: 'Creating stories. Preserving memories.\nBuilding the university’s digital identity.',
  marquee: ['Photography', 'Videography', 'Podcasts', 'Design', 'Social', 'Storytelling'],
  manifestoLabel: 'Our manifesto',
  manifesto:
    'We are the eyes of Royal Global — documenting every stage, every festival and every quiet moment in between, and turning them into stories that outlive the day they happened.',
  manifestoAccent: ['eyes', 'stories'],
  ribbonHeadline1: 'FRAMES IN',
  ribbonHeadline2: 'MOTION',
  ribbonCaption: 'Every frame, a story told by the Royalites.',
};

export type SiteText = typeof siteText;

/** Look, motion and layout switches (editable in Admin → Appearance / Sections / SEO). */
export const siteSettings = {
  appearance: {
    accent: '#f26a2e',
    grain: true,
    cursor: true,
    smoothScroll: true,
    tilt: true,
  },
  sections: {
    ribbon: true,
    marquee: true,
    manifesto: true,
    about: true,
    departments: true,
    family: true,
    whyJoin: true,
    joinUs: true,
    faq: true,
    contact: true,
  },
  seo: {
    title: 'Media Team | The Assam Royal Global University, Guwahati',
    description:
      'Official website of the Media Team at The Assam Royal Global University (RGU), Guwahati. Capturing moments, creating stories, preserving memories, and building the university’s digital identity.',
    ogImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  },
};
export type SiteSettings = typeof siteSettings;

function setMeta(sel: string, attr: 'name' | 'property', key: string, value: string) {
  let m = document.head.querySelector<HTMLMetaElement>(sel);
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute(attr, key);
    document.head.appendChild(m);
  }
  m.content = value;
}

/** Push settings into the document: accent colour, effect switches, head tags. */
function applySettings() {
  const { appearance: a, seo } = siteSettings;
  const root = document.documentElement;
  if (/^#[0-9a-f]{6}$/i.test(a.accent)) root.style.setProperty('--brand', a.accent);
  root.classList.toggle('fx-no-grain', !a.grain);
  root.classList.toggle('fx-no-tilt', !a.tilt);
  if (seo.title) document.title = seo.title;
  setMeta('meta[name="description"]', 'name', 'description', seo.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  if (seo.ogImage) setMeta('meta[property="og:image"]', 'property', 'og:image', seo.ogImage);
}

export interface SiteContent {
  version: 1;
  updatedAt?: string;
  general: {
    googleFormUrl: string;
    universityLocation: string;
    recruitmentOpen: boolean;
    academicYear: string;
    deadlineDate: string;
    deadlineISO: string;
    announcementBanner: string;
    contactPhone: string;
    officeLocation: string;
    whatsappAssistGroup: string;
  };
  socialLinks: { instagram: string; facebook: string; youtube: string; linkedin: string; whatsapp: string };
  text: SiteText;
  appearance: SiteSettings['appearance'];
  sections: SiteSettings['sections'];
  seo: SiteSettings['seo'];
  members: TeamMember[];
  gallery: GalleryItem[];
  faq: FAQItem[];
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function snapshot(): SiteContent {
  const r = config.recruitment as typeof config.recruitment & { whatsappAssistGroup?: string };
  return {
    version: 1,
    general: {
      googleFormUrl: config.googleFormUrl,
      universityLocation: config.universityLocation,
      recruitmentOpen: r.isOpen,
      academicYear: r.academicYear,
      deadlineDate: r.deadlineDate,
      // datetime-local wants local wall-clock time, not UTC
      deadlineISO: new Date(r.targetDeadlineMs - new Date(r.targetDeadlineMs).getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      announcementBanner: r.announcementBanner,
      contactPhone: r.contactPhone,
      officeLocation: r.officeLocation,
      whatsappAssistGroup: r.whatsappAssistGroup ?? '',
    },
    socialLinks: { ...config.socialLinks },
    text: clone(siteText),
    appearance: clone(siteSettings.appearance),
    sections: clone(siteSettings.sections),
    seo: clone(siteSettings.seo),
    members: clone(teamMembers),
    gallery: clone(galleryItems),
    faq: clone(faqData),
  };
}

export const DEFAULTS: SiteContent = snapshot();

const DRAFT_KEY = 'rgu-media-content-draft';
let published: SiteContent | null = null;
let hasDraft = false;
let version = 0;
const listeners = new Set<() => void>();

function replaceArray<T>(target: T[], next: T[] | undefined) {
  if (!Array.isArray(next)) return;
  target.splice(0, target.length, ...clone(next));
}

/** Merge a (possibly partial) content object over the defaults and patch the live objects. */
function apply(c: Partial<SiteContent>) {
  const base = clone(DEFAULTS);
  const g = { ...base.general, ...(c.general || {}) };
  const r = config.recruitment as typeof config.recruitment & { whatsappAssistGroup?: string };
  config.googleFormUrl = g.googleFormUrl;
  config.universityLocation = g.universityLocation;
  r.isOpen = !!g.recruitmentOpen;
  r.academicYear = g.academicYear;
  r.deadlineDate = g.deadlineDate;
  const t = Date.parse(g.deadlineISO);
  if (!Number.isNaN(t)) r.targetDeadlineMs = t;
  r.announcementBanner = g.announcementBanner;
  r.contactPhone = g.contactPhone;
  r.officeLocation = g.officeLocation;
  r.whatsappAssistGroup = g.whatsappAssistGroup;
  Object.assign(config.socialLinks, base.socialLinks, c.socialLinks || {});
  Object.assign(siteText, base.text, c.text || {});
  Object.assign(siteSettings.appearance, base.appearance, c.appearance || {});
  Object.assign(siteSettings.sections, base.sections, c.sections || {});
  Object.assign(siteSettings.seo, base.seo, c.seo || {});
  applySettings();
  replaceArray(teamMembers, c.members ?? base.members);
  replaceArray(galleryItems, c.gallery ?? base.gallery);
  replaceArray(faqData, c.faq ?? base.faq);
  version++;
  listeners.forEach((f) => f());
}

function readDraft(): SiteContent | null {
  try {
    const s = localStorage.getItem(DRAFT_KEY);
    return s ? (JSON.parse(s) as SiteContent) : null;
  } catch {
    return null;
  }
}

/** When the live row was last written — used to warn about overwriting someone else's publish. */
let publishedAt: string | null = null;

async function fetchFromSupabase(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.from('site_content').select('content, updated_at').eq('id', 1).maybeSingle();
  if (error || !data?.content) return false;
  published = data.content as SiteContent;
  publishedAt = data.updated_at;
  return true;
}

async function fetchFile() {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}content.json`, { cache: 'no-store' });
    if (res.ok && (res.headers.get('content-type') || '').includes('json')) published = await res.json();
  } catch {
    /* no published file — defaults stay */
  }
}

/** Load the published content (Supabase, else content.json) and this browser's draft, if any. */
export async function loadContent() {
  let ok = false;
  try {
    ok = await fetchFromSupabase();
  } catch {
    ok = false;
  }
  if (!ok) await fetchFile();
  const draft = readDraft();
  hasDraft = !!draft;
  apply(draft || published || {});
  startLiveSync();
}

/* ---------- live sync: every open page picks up a publish within seconds ---------- */

let syncStarted = false;
let lastSyncCheck = 0;

/** Apply a newly published row unless this browser is previewing its own draft. */
function receivePublished(content: SiteContent, updatedAt: string) {
  if (publishedAt && updatedAt && Date.parse(updatedAt) <= Date.parse(publishedAt)) return; // already have it
  published = content;
  publishedAt = updatedAt;
  if (!hasDraft) apply(published);
  else {
    // keep the admin's draft on screen, but tell the panel the live copy moved on
    listeners.forEach((f) => f());
  }
}

async function checkForUpdate() {
  if (!supabase || document.visibilityState === 'hidden') return;
  const now = Date.now();
  if (now - lastSyncCheck < 4000) return; // throttle bursts of focus events
  lastSyncCheck = now;
  try {
    const { data, error } = await supabase.from('site_content').select('content, updated_at').eq('id', 1).maybeSingle();
    if (!error && data?.content) receivePublished(data.content as SiteContent, data.updated_at);
  } catch {
    /* offline — try again later */
  }
}

function startLiveSync() {
  if (syncStarted || !supabase) return;
  syncStarted = true;
  // 1. instant push over a websocket (needs site_content in the supabase_realtime publication)
  try {
    supabase
      .channel('site-content-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content', filter: 'id=eq.1' }, (p) => {
        const row = p.new as { content?: SiteContent; updated_at?: string } | undefined;
        if (row?.content) receivePublished(row.content, row.updated_at || new Date().toISOString());
        else void checkForUpdate();
      })
      .subscribe();
  } catch {
    /* realtime unavailable — the checks below still keep pages fresh */
  }
  // 2. re-check when the visitor comes back to the tab, and every 30 s as a fallback
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && void checkForUpdate());
  window.addEventListener('focus', () => void checkForUpdate());
  window.addEventListener('online', () => void checkForUpdate());
  window.setInterval(() => void checkForUpdate(), 30000);
  // 3. keep several admin tabs in this browser in step with each other's drafts
  window.addEventListener('storage', (e) => {
    if (e.key !== DRAFT_KEY) return;
    const d = readDraft();
    hasDraft = !!d;
    apply(d || published || {});
  });
}

/** True when someone published after this browser last loaded the live copy. */
export const getPublishedAt = () => publishedAt;

export const getContent = (): SiteContent => snapshot();
export const getPublished = (): SiteContent => clone(published ? { ...DEFAULTS, ...published } : DEFAULTS);
export const isDraft = () => hasDraft;
export const getVersion = () => version;
export const subscribe = (f: () => void) => {
  listeners.add(f);
  return () => listeners.delete(f);
};

/** Save as a local draft and apply it immediately (visible in this browser only). */
export function saveDraft(c: SiteContent) {
  const out = { ...c, version: 1 as const, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(out));
    hasDraft = true;
  } catch {
    /* storage blocked — still apply for this session */
  }
  apply(out);
}

/** Show unsaved editor content on the page right away (this browser only, nothing stored). */
export function previewContent(c: SiteContent) {
  apply(c);
}

/** Undo a preview: back to this browser's saved draft, or the live content. */
export function revertPreview() {
  apply(readDraft() || published || {});
}

/** Throw away the local draft and go back to the published content. */
export function discardDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
  hasDraft = false;
  apply(published || {});
}

/* ---------- live publishing (Supabase) ---------- */

export const canPublishLive = () => hasSupabase();

export interface PublishResult {
  ok: boolean;
  /** someone published after this editor loaded */
  conflict?: { at: string; by?: string };
  error?: string;
}

/** Push content to the database so every visitor gets it on their next page load. */
export async function publishLive(c: SiteContent, opts: { force?: boolean; base?: string | null } = {}): Promise<PublishResult> {
  if (!supabase) return { ok: false, error: 'Supabase is not configured.' };
  // `base` = the live version the editor started from (live sync may have moved publishedAt since)
  const base = opts.base !== undefined ? opts.base : publishedAt;
  if (!opts.force) {
    const { data } = await supabase.from('site_content').select('updated_at, updated_by').eq('id', 1).maybeSingle();
    if (data && base && Date.parse(data.updated_at) !== Date.parse(base))
      return { ok: false, conflict: { at: data.updated_at, by: data.updated_by ?? undefined } };
  }
  const out = { ...clone(c), version: 1 as const, updatedAt: new Date().toISOString() };
  const { data, error } = await supabase
    .from('site_content')
    .upsert({ id: 1, content: out })
    .select('updated_at')
    .single();
  if (error) {
    const denied = /row-level security|permission|42501/i.test(`${error.message} ${error.code}`);
    return { ok: false, error: denied ? 'Your account isn’t on the admin list (site_admins).' : error.message };
  }
  published = out;
  publishedAt = data.updated_at;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
  hasDraft = false;
  apply(out);
  return { ok: true };
}

export interface HistoryEntry {
  id: number;
  saved_at: string;
  saved_by: string | null;
}

export async function listHistory(): Promise<HistoryEntry[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('site_content_history')
    .select('id, saved_at, saved_by')
    .order('id', { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);
  return data as HistoryEntry[];
}

export async function getHistoryVersion(id: number): Promise<SiteContent> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.from('site_content_history').select('content').eq('id', id).single();
  if (error) throw new Error(error.message);
  return { ...clone(DEFAULTS), ...(data.content as SiteContent) };
}

/** Re-read the live row (e.g. after a conflict) and apply it. */
export async function refreshPublished() {
  if (await fetchFromSupabase()) {
    if (!hasDraft) apply(published || {});
  }
}

/** The JSON to publish as public/content.json. */
export function exportJSON(c: SiteContent) {
  return JSON.stringify({ ...c, version: 1, updatedAt: new Date().toISOString() }, null, 2);
}

export function validateImport(raw: string): SiteContent {
  const v = JSON.parse(raw);
  if (!v || typeof v !== 'object' || !Array.isArray(v.members)) throw new Error('This file is not a site content export.');
  return { ...clone(DEFAULTS), ...v };
}
