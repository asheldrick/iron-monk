import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://apnavcjdugxjtuijhxes.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmF2Y2pkdWd4anR1aWpoeGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTczMTIsImV4cCI6MjA4NzUzMzMxMn0.mA5oabMryU0E2ImAm5mkrZoWmCCrFJQIKvPdyVLM8pA';
export const supabase = createClient(supabaseUrl, supabaseKey);