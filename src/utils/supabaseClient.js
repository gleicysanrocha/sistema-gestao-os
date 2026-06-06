import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback to empty client if credentials are not configured to avoid app crash during setup
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('seu-projeto-id'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
