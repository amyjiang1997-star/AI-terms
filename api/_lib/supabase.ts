
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Note: In local development, you need to ensure these env vars are set.
// In Vercel, set them in the Project Settings.

export const supabase = createClient(supabaseUrl, supabaseKey);
