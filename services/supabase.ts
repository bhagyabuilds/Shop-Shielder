import { createClient } from '@supabase/supabase-js';

/**
 * Strict environment variable resolver for Vite/Netlify.
 * Vite requires the VITE_ prefix for variables to be bundled into the client.
 */
const getSafeEnv = (key: string): string => {
  if (typeof window === 'undefined') return '';

  // 1. Check Vite's import.meta.env (Standard for production builds)
  const meta = (import.meta as any).env || {};
  const viteKey = `VITE_${key}`;
  
  if (meta[viteKey]) return meta[viteKey].trim().replace(/^['"]|['"]$/g, '');
  if (meta[key]) return meta[key].trim().replace(/^['"]|['"]$/g, '');

  // 2. Fallback for process.env (Standard for some CI/CD environments)
  try {
    const proc = (globalThis as any).process?.env || {};
    if (proc[viteKey]) return proc[viteKey].trim().replace(/^['"]|['"]$/g, '');
    if (proc[key]) return proc[key].trim().replace(/^['"]|['"]$/g, '');
  } catch (e) {
    // process is not defined in browser
  }

  return '';
};

// Strictly derived from Netlify UI Environment Variables
export const SUPABASE_URL_VAL = getSafeEnv('SUPABASE_URL').replace(/\/$/, '');
export const SUPABASE_KEY_VAL = getSafeEnv('SUPABASE_ANON_KEY');
export const API_KEY_VAL = getSafeEnv('API_KEY');

export const isConfigured = 
  SUPABASE_URL_VAL.startsWith('https://') && 
  SUPABASE_KEY_VAL.length > 10;

/**
 * Enhanced Diagnostics Logger
 */
if (typeof window !== 'undefined') {
  console.group("%c🛡️ Shop Shielder: Vault Handshake", "color: #10b981; font-weight: bold;");
  console.log("Status:", isConfigured ? "✅ LIVE" : "❌ PENDING CONFIGURATION");
  
  if (!isConfigured) {
    console.warn("BUILD NOTICE: Keys missing. Ensure VITE_API_KEY, VITE_SUPABASE_URL, and VITE_SUPABASE_ANON_KEY are set in Netlify Environment Variables.");
  }
  console.groupEnd();
}

// Initialize Client with non-sensitive placeholders
export const supabase = createClient(
  SUPABASE_URL_VAL || 'https://vault-pending.supabase.co',
  SUPABASE_KEY_VAL || 'handshake-key-not-set',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);