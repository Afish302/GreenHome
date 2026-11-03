import { createClient } from '@supabase/supabase-js'
// Get enviroment variables to connect to supabase
const supabaseUrl = import.meta.env.VITE_SUP_PROJECT_URL
const supabasePublishableKey = import.meta.env.VITE_SUP_PUBLISH_KEY
// establish supabase connection
export const supabase = createClient(supabaseUrl, supabasePublishableKey)