import { createClient } from '@supabase/supabase-js';

export const useSupabase = () => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseAnonKey = config.public.supabaseKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Could not load supabase variables!')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
