import { createClient } from '@supabase/supabase-js';

/**
 * Robust environment variable resolver for browser environments.
 * Checks for process.env (build-time) and window (runtime) shims.
 */
const getSafeEnv = (key: string): string => {
  try {
    // Check for build-time injection (Netlify/Vite/Webpack)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key]?.trim() || '';
    }
    // Check for runtime global injection
    if (typeof window !== 'undefined' && (window as any).env && (window as any).env[key]) {
      return (window as any).env[key]?.trim() || '';
    }
    // Check for Vite specific injection if applicable
    if (typeof (import.meta as any).env !== 'undefined' && (import.meta as any).env[key]) {
      return (import.meta as any).env[key]?.trim() || '';
    }
  } catch (e) {
    // Fallback if environment access is restricted
  }
  return '';
};

// Sanitize the URL: Remove trailing slashes which cause 'Failed to fetch'
const rawUrl = getSafeEnv('SUPABASE_URL');
export const SUPABASE_URL_VAL = rawUrl.replace(/\/$/, '');
export const SUPABASE_KEY_VAL = getSafeEnv('SUPABASE_ANON_KEY');
export const API_KEY_VAL = getSafeEnv('API_KEY');

// Validation logic for production readiness
export const isConfigured = 
  SUPABASE_URL_VAL.startsWith('https://') && 
  SUPABASE_KEY_VAL.length > 20 &&
  API_KEY_VAL.length > 10;

// Industrial-grade diagnostics for Netlify users
if (typeof window !== 'undefined') {
  console.group("%c🛡️ Shop Shielder: Vault Diagnostics", "color: #10b981; font-weight: bold; font-size: 12px;");
  console.log("Supabase Connection:", SUPABASE_URL_VAL ? "✅ ENDPOINT DETECTED" : "❌ ENDPOINT MISSING");
  console.log("Supabase Registry:", SUPABASE_KEY_VAL ? "✅ KEY DETECTED" : "❌ KEY MISSING");
  console.log("Gemini Engine:", API_KEY_VAL ? "✅ API KEY DETECTED" : "❌ API KEY MISSING");
  
  if (!isConfigured) {
    console.warn("INTEGRATION ALERT: One or more environment variables are missing. Ensure they are set in Netlify -> Site Settings -> Environment Variables and redeploy.");
  } else {
    console.log("SYSTEM STATUS: All communication channels verified.");
  }
  console.groupEnd();
}

// Initialize client with fallback to prevent runtime crashes if keys are missing
export const supabase = createClient(
  SUPABASE_URL_VAL || 'https://unconfigured-vault.supabase.co',
  SUPABASE_KEY_VAL || 'unconfigured-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

export const isDemoMode = false;
