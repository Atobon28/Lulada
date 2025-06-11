import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jamzxbrhoaklixbhdcht.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXp4YnJob2FrbGl4YmhkY2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NDMwNjksImV4cCI6MjA2NDQxOTA2OX0.Az2yIB4fumzTa0kkGTd61zuPgIZkQkvSLyJ66GS6EXA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

