import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for general use, defaulting to the 'tapconnect' schema
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'tapconnect'
  }
})
