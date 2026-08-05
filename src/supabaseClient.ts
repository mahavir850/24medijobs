import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhqtwdznkxodwshltowv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocXR3ZHpua3hvZHdzaGx0b3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMTI4NzUsImV4cCI6MjA5OTg4ODg3NX0.e4nYajzxV6DXZYUY0KS4hvK2foYnXQkgz6-TViNfFbM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
