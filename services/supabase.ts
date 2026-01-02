
import { createClient } from '@supabase/supabase-js';

/**
 * Shop Shielder Supabase Configuration
 * 
 * Accessing environment variables directly from process.env.
 * These must be set in your Netlify dashboard for the production app to work.
 */

// Fallbacks are provided to prevent the library from throwing an 'required' error 
// during the initialization phase if variables are missing.
const SUPABASE_URL = (typeof process !== 'undefined' ? process.env.SUPABASE_URL : '') || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : '') || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
