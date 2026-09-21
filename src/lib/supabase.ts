import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://gwjzpcsccgbhaqolpsqi.supabase.co';
const supabaseAnonKey = 'sb_publishable_CdC0dTy1KUMopUSItAu4TQ_BsP0u5F_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);