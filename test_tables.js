require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  const tables = [
    'wallets',
    'pools',
    'user_positions',
    'user_deposits',
    'user_withdrawals',
    'user_claims',
    'user_rewards'
  ];
  
  for (const table of tables) {
    try {
      console.log(`Testing table: ${table}`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Error accessing ${table}:`, error.message);
      } else {
        console.log(`✅ Successfully connected to ${table} table`);
        console.log(`   Number of records: ${data ? data.length : 0}`);
        if (data && data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
        }
      }
      console.log('-----------------------------------');
    } catch (error) {
      console.error(`❌ Error testing ${table}:`, error);
    }
  }
}

testTables();