import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://oredidvrsdpdjmnzngor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZWRpZHZyc2RwZGptbnpuZ29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1ODA5MDIsImV4cCI6MjA1MTE1NjkwMn0.UiUNeAiaw8kEJ3eRnFevJxA0Fn3VMlPgpUUd9i63WvI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 