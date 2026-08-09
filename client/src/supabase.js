import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const hasSupabaseConfig = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE') && !supabaseAnonKey.includes('YOUR_SUPABASE')
);

if (!hasSupabaseConfig) {
  console.warn('⚠️ Warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.');
}

// Do not create an invalid client when local environment variables have not yet
// been supplied. This lets the rest of the storefront continue to work and gives
// Google sign-in a clear setup message instead of a browser error.
export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;
