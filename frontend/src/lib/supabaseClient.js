import { createClient } from '@supabase/supabase-js';

// Get environment variables to connect to Supabase (matching .env variable names)
const supabaseUrl = import.meta.env.VITE_SUP_PROJECT_URL || 'https://placeholder.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUP_PUBLISH_KEY || 'placeholder-key';

// Establish Supabase connection
export const supabase = createClient(supabaseUrl, supabasePublishableKey);