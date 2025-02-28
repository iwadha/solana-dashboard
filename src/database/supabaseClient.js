const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

// Check if Supabase URL and key are defined
if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
    console.error('SUPABASE_URL or SUPABASE_KEY is not defined in environment variables');
    process.exit(1);
}

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
console.log('Supabase client initialized with URL:', config.SUPABASE_URL);

module.exports = supabase;