
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  try {
    return (typeof process !== 'undefined' && process.env && process.env[key]) ? process.env[key] : '';
  } catch {
    return '';
  }
};

const SUPABASE_URL = getEnv('SUPABASE_URL') || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY') || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
