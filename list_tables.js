require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    // Query information_schema to get a list of tables
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error querying wallets table:', error);
    } else {
      console.log('Wallet table exists and can be queried');
    }

    // Try to query each expected table
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

    console.log('\nChecking tables:');
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists with ${data} rows`);
      }
    }
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

listTables();