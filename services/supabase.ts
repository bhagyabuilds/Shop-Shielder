
import { createClient } from '@supabase/supabase-js';

/**
 * Strict environment variable resolver for Vite.
 * Variables MUST start with VITE_ to be accessible in the client-side bundle.
 */
const getSafeEnv = (key: string): string => {
  if (typeof window === 'undefined') return '';

  const meta = (import.meta as any).env || {};
  const viteKey = `VITE_${key}`;
  
  if (meta[viteKey]) return meta[viteKey].trim().replace(/^['"]|['"]$/g, '');
  if (meta[key]) return meta[meta[key] ? key : ''].trim().replace(/^['"]|['"]$/g, '');

  try {
    const proc = (globalThis as any).process?.env || {};
    if (proc[viteKey]) return proc[viteKey].trim().replace(/^['"]|['"]$/g, '');
    if (proc[key]) return proc[key].trim().replace(/^['"]|['"]$/g, '');
  } catch (e) {}

  return '';
};

export const SUPABASE_URL_VAL = getSafeEnv('SUPABASE_URL').replace(/\/$/, '');
export const SUPABASE_KEY_VAL = getSafeEnv('SUPABASE_ANON_KEY');
export const API_KEY_VAL = getSafeEnv('API_KEY');

// Verification logic for the Handshake
export const isConfigured = 
  SUPABASE_URL_VAL.startsWith('https://') && 
  SUPABASE_KEY_VAL.length > 10 &&
  API_KEY_VAL.startsWith('AIza');

// Initializing with generic safety strings to prevent build-time blocks
export const supabase = createClient(
  SUPABASE_URL_VAL || 'https://placeholder-vault.supabase.co',
  SUPABASE_KEY_VAL || 'placeholder-handshake-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
