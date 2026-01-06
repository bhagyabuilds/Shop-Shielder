import { createClient } from '@supabase/supabase-js';

/**
 * Advanced environment variable resolver for static/Vite deployments.
 * This function is designed to be extremely aggressive in finding keys.
 */
const getSafeEnv = (key: string): string => {
  try {
    const prefixes = ['VITE_', 'REACT_APP_', ''];
    
    // Check all potential sources for each prefix
    for (const prefix of prefixes) {
      const fullKey = `${prefix}${key}`;
      
      // 1. Vite / Modern ESM (Standard for Netlify + modern JS)
      if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        const val = (import.meta as any).env[fullKey];
        if (val) return val.trim().replace(/^['"]|['"]$/g, '');
      }

      // 2. process.env (Standard for Webpack/Node environments)
      if (typeof process !== 'undefined' && process.env) {
        const val = process.env[fullKey];
        if (val) return val.trim().replace(/^['"]|['"]$/g, '');
      }

      // 3. window.env (Custom runtime injection)
      if (typeof window !== 'undefined' && (window as any).env) {
        const val = (window as any).env[fullKey];
        if (val) return val.trim().replace(/^['"]|['"]$/g, '');
      }

      // 4. Direct window access (Fallback for raw script injection)
      if (typeof window !== 'undefined' && (window as any)[fullKey]) {
        const val = (window as any)[fullKey];
        if (val) return val.trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) {
    console.warn(`Environment access error for ${key}:`, e);
  }
  return '';
};

export const SUPABASE_URL_VAL = getSafeEnv('SUPABASE_URL').replace(/\/$/, '');
export const SUPABASE_KEY_VAL = getSafeEnv('SUPABASE_ANON_KEY');
export const API_KEY_VAL = getSafeEnv('API_KEY');

// Lenient check: If we have values that look like URLs and Keys, we proceed to attempt the connection
export const isConfigured = 
  SUPABASE_URL_VAL.startsWith('https://') && 
  SUPABASE_KEY_VAL.length > 10 &&
  API_KEY_VAL.length > 5;

/**
 * Detailed Diagnostics Logger
 */
if (typeof window !== 'undefined') {
  console.group("%c🛡️ Shop Shielder: Vault Connectivity Diagnostics", "color: #10b981; font-weight: bold; font-size: 14px;");
  console.log("Registry Configured:", isConfigured ? "✅ YES" : "❌ NO");
  console.log("Supabase URL:", SUPABASE_URL_VAL ? `DETECTED (${SUPABASE_URL_VAL.substring(0, 15)}...)` : "❌ MISSING (Check VITE_SUPABASE_URL in Netlify)");
  console.log("Supabase Key:", SUPABASE_KEY_VAL ? `DETECTED (${SUPABASE_KEY_VAL.substring(0, 5)}...)` : "❌ MISSING (Check VITE_SUPABASE_ANON_KEY in Netlify)");
  console.log("Gemini Engine:", API_KEY_VAL ? "✅ DETECTED" : "❌ MISSING (Check VITE_API_KEY in Netlify)");
  
  if (!isConfigured) {
    console.info("%cACTION REQUIRED: If you see 'MISSING' above but have set variables in Netlify, you MUST trigger a NEW DEPLOY with 'Clear Cache' for the keys to be injected into the browser.", "color: #3b82f6; font-style: italic; font-weight: bold;");
  }
  console.groupEnd();
}

// Initialize Supabase Client
export const supabase = createClient(
  SUPABASE_URL_VAL || 'https://placeholder.supabase.co',
  SUPABASE_KEY_VAL || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
