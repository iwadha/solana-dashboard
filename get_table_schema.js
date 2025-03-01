require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  try {
    // Test tables with standard queries
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
      console.log(`\nChecking table: ${table}`);
      
      // Try to get one row to see columns
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.error(`Error querying ${table}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`Columns in ${table}:`, Object.keys(data[0]).join(', '));
      } else {
        console.log(`No rows found in ${table}, trying a different approach...`);
        
        // Try to insert a dummy row with a very limited set of columns
        const dummyRow = { id: -999 }; // Most tables should have an id column
        
        const { error: insertError } = await supabase
          .from(table)
          .insert([dummyRow]);
          
        if (insertError) {
          console.log(`Insert error (expected): ${insertError.message}`);
          
          // Extract column names from the error message if possible
          if (insertError.message.includes('violates not-null constraint')) {
            const columnMatch = insertError.message.match(/column "([^"]+)" of relation/);
            if (columnMatch && columnMatch[1]) {
              console.log(`Required column found: ${columnMatch[1]}`);
            }
          }
        }
      }
    }
    
    console.log('\nFinished checking tables.');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

runTest();