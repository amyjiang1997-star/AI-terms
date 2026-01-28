
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL env var');
if (!supabaseKey) throw new Error('Missing SUPABASE_ANON_KEY (or SUPABASE_KEY) env var');

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
