import { createClient } from '@supabase/supabase-js';

/**
 * Aggressive environment variable resolver.
 * Checks multiple namespaces to ensure keys are found regardless of bundler or environment.
 */
const getSafeEnv = (key: string): string => {
  const prefixes = ['VITE_', ''];
  const targets = [
    (typeof process !== 'undefined' ? process.env : {}),
    (import.meta as any).env || {},
    (typeof window !== 'undefined' ? window : {}),
    (typeof window !== 'undefined' ? (window as any).env : {})
  ];

  for (const prefix of prefixes) {
    const fullKey = `${prefix}${key}`;
    for (const target of targets) {
      if (target && target[fullKey]) {
        const val = target[fullKey];
        if (typeof val === 'string') return val.trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
  return '';
};

export const SUPABASE_URL_VAL = getSafeEnv('SUPABASE_URL').replace(/\/$/, '');
export const SUPABASE_KEY_VAL = getSafeEnv('SUPABASE_ANON_KEY');
export const API_KEY_VAL = process.env.API_KEY || getSafeEnv('API_KEY');

export const isConfigured = 
  SUPABASE_URL_VAL.startsWith('https://') && 
  SUPABASE_KEY_VAL.length > 10;

/**
 * Diagnostics Logger
 */
if (typeof window !== 'undefined') {
  console.group("%c🛡️ Shop Shielder: Live Vault Handshake", "color: #10b981; font-weight: bold; font-size: 14px;");
  console.log("Registry Status:", isConfigured ? "✅ LIVE" : "❌ PREVIEW MODE");
  console.log("Supabase URL:", SUPABASE_URL_VAL ? "✅ CONNECTED" : "❌ MISSING (Check VITE_SUPABASE_URL)");
  console.log("Supabase Key:", SUPABASE_KEY_VAL ? "✅ CONNECTED" : "❌ MISSING (Check VITE_SUPABASE_ANON_KEY)");
  console.log("Gemini Engine:", API_KEY_VAL ? "✅ INITIALIZED" : "❌ MISSING");
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