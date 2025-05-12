
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single client instance
// If service key is available, use it for admin operations
const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL as string,
  key as string,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// For backward compatibility, adminSupabase points to the same instance
export const adminSupabase = supabase;
