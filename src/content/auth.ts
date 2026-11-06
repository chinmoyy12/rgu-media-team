import { supabase, isRecoveryPending, clearRecovery, onRecovery } from '../lib/supabase';

/**
 * Admin sign-in.
 *
 * With Supabase configured (recommended): a real Supabase Auth account. The
 * database only accepts writes from emails listed in `site_admins`
 * (supabase/schema.sql), so this is enforced on the server, not just here.
 *
 * Without Supabase: a static fallback. Only the SHA-256 of "email:password"
 * is in the build (VITE_ADMIN_HASH). That only gates the editor UI; the live
 * site is protected because publishing needs deploy access.
 */

export type AuthMode = 'supabase' | 'hash' | 'none';

const SESSION_KEY = 'rgu-media-admin';
const SESSION_MS = 2 * 60 * 60 * 1000;
const EXPECTED = (import.meta.env.VITE_ADMIN_HASH as string | undefined)?.trim().toLowerCase() || '';

export const authMode = (): AuthMode => (supabase ? 'supabase' : /^[0-9a-f]{64}$/.test(EXPECTED) ? 'hash' : 'none');
export const adminConfigured = () => authMode() !== 'none';

async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const OFFLINE = 'Can’t reach the sign-in server. Check your connection and try again.';
const isNetwork = (m: string) => /failed to fetch|network|load failed|fetch/i.test(m);

let failures = 0;
const backoff = () =>
  failures > 2 ? new Promise((r) => setTimeout(r, Math.min(8000, 600 * 2 ** (failures - 2)))) : Promise.resolve();

export interface SignInResult {
  ok: boolean;
  error?: string;
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const mode = authMode();
  if (mode === 'none') return { ok: false, error: 'Admin sign-in isn’t set up yet.' };
  await backoff();

  if (mode === 'supabase') {
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      failures++;
      const m = error.message || '';
      return {
        ok: false,
        error: /invalid/i.test(m)
          ? 'That email and password don’t match.'
          : /not confirmed/i.test(m)
            ? 'This account’s email isn’t confirmed yet — check the inbox, or confirm the user in Supabase.'
            : /rate|too many|security purposes/i.test(m)
              ? 'Too many attempts. Wait a minute and try again.'
              : isNetwork(m)
                ? OFFLINE
                : m,
      };
    }
    const { data: admin, error: rpcErr } = await supabase!.rpc('is_site_admin');
    if (rpcErr || !admin) {
      await supabase!.auth.signOut();
      return {
        ok: false,
        error: rpcErr ? `Signed in, but the admin check failed: ${rpcErr.message}` : 'This account isn’t on the admin list.',
      };
    }
    failures = 0;
    return { ok: true };
  }

  const h = await sha256(`${email.trim().toLowerCase()}:${password}`);
  let diff = h.length ^ EXPECTED.length;
  for (let i = 0; i < h.length; i++) diff |= h.charCodeAt(i) ^ (EXPECTED.charCodeAt(i) || 0);
  if (diff !== 0) {
    failures++;
    return { ok: false, error: 'That email and password don’t match.' };
  }
  failures = 0;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + SESSION_MS }));
  } catch {
    /* ignore */
  }
  return { ok: true };
}

/** Is there a valid admin session right now? */
export async function checkSession(): Promise<boolean> {
  const mode = authMode();
  if (mode === 'supabase') {
    const { data } = await supabase!.auth.getSession();
    if (!data.session) return false;
    const { data: admin } = await supabase!.rpc('is_site_admin');
    return !!admin;
  }
  if (mode === 'hash') {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return !!s && s.exp > Date.now();
    } catch {
      return false;
    }
  }
  return false;
}

export async function currentEmail(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.email ?? null;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Email a password-reset link (Supabase only). The link brings the admin back here to choose a new one. */
export async function sendPasswordReset(email: string): Promise<SignInResult> {
  if (!supabase) return { ok: false, error: 'Password reset needs Supabase.' };
  await backoff();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    // the page itself (works on localhost and under /rgu-media-team/ on GitHub Pages)
    redirectTo: `${location.origin}${location.pathname}`,
  });
  if (error) {
    failures++;
    return {
      ok: false,
      error: /rate|security purposes|too many/i.test(error.message)
        ? 'A reset email was sent recently. Please wait a few minutes before asking again.'
        : isNetwork(error.message)
          ? OFFLINE
          : error.message,
    };
  }
  return { ok: true };
}

export async function updatePassword(password: string): Promise<SignInResult> {
  if (!supabase) return { ok: false, error: 'Password change needs Supabase.' };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    const m = /expired|invalid|session/i.test(error.message)
      ? 'This reset link has expired. Request a new one from “Forgot password?”.'
      : /same|different/i.test(error.message)
        ? 'Choose a password different from your old one.'
        : isNetwork(error.message)
          ? OFFLINE
          : error.message;
    return { ok: false, error: m };
  }
  finishRecovery();
  const { data: admin } = await supabase.rpc('is_site_admin');
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, error: 'Password changed, but this account isn’t on the admin list.' };
  }
  return { ok: true };
}

/** Calls `f` when the user arrives from a password-reset email (also if that happened before this was called). */
export function onPasswordRecovery(f: () => void) {
  if (!supabase) return () => {};
  if (isRecoveryPending()) queueMicrotask(f);
  const off = onRecovery(f);
  return () => {
    off();
  };
}
export const finishRecovery = () => {
  clearRecovery();
  // drop the token fragment from the address bar
  if (/type=recovery|access_token/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
};
