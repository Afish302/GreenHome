import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.SUP_PUBLISH_KEY

export const supabase = createClient(supabaseUrl, supabasePublishableKey)