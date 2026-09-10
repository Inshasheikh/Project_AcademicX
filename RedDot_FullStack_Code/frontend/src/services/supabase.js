import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hznhvqxwzswxwzusonsz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bmh2cXh3enN3eHd6dXNvbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MDczNjcsImV4cCI6MjEwNDM4MzM2N30.Xy8uOTqfCe7mbwDEUtTb_70hYi_l3wvQ7lT-krA3jqQ';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_jnJUFYebaunUOoxwtQQiMQ_MM47qvDU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
