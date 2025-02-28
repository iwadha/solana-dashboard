const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://ggjkqmdwctovbblgzgyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnamtxbWR3Y3RvdmJibGd6Z3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMDE4NjQsImV4cCI6MjA1Mzg3Nzg2NH0.9WqKxkLRwQJ7io9v45xnzaOSH1fg2k-RHkmSIce9KnE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
module.exports = supabase;