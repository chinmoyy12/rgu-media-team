import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase powers the admin login (Supabase Auth — passwords are checked on
 * Supabase's servers, with forgot-password emails) and live publishing.
 *
 * VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY come from .env.local. The anon key
 * is meant to be public — the database rules in supabase/schema.sql are what
 * limit writes to the emails listed in `site_admins`.
 */
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

// A password-reset link lands here with "#...type=recovery" — note it before the client consumes the URL.
let recovery = typeof location !== 'undefined' && /[#&?]type=recovery\b/.test(location.hash + location.search);

export const supabase: SupabaseClient | null =
  url && key && /^https:\/\//.test(url)
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'implicit',
          storageKey: 'rgu-media-auth',
        },
      })
    : null;

const recoveryListeners = new Set<() => void>();
supabase?.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    recovery = true;
    recoveryListeners.forEach((f) => f());
  }
});

/** True when the visitor arrived from a password-reset email and hasn't set the new password yet. */
export const isRecoveryPending = () => recovery;
export const clearRecovery = () => {
  recovery = false;
};
export const onRecovery = (f: () => void) => {
  recoveryListeners.add(f);
  return () => recoveryListeners.delete(f);
};

export const hasSupabase = () => !!supabase;
export const MEDIA_BUCKET = 'site-media';
