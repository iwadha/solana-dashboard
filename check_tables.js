require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking Supabase tables...');
  
  const tables = [
    'wallets',
    'pools',
    'user_positions',
    'user_deposits',
    'user_withdrawals',
    'user_claims',
    'user_rewards',
    'pool_positions',
    'pool_withdrawals'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists with sample data:`, data);
        
        // Let's also check the columns in this table
        const { data: record } = await supabase
          .from(table)
          .select('*')
          .limit(1);
          
        if (record && record.length > 0) {
          console.log(`   Columns in ${table}:`, Object.keys(record[0]).join(', '));
        } else {
          console.log(`   No records found in ${table}`);
        }
      }
    } catch (error) {
      console.error(`Error checking table ${table}:`, error);
    }
  }
}

checkTables();