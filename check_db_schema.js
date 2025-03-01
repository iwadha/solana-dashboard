require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchemas() {
  console.log('Checking table schemas...');
  
  try {
    // Use built-in SQL capability to query schema information
    const { data: userPositionsColumns, error: userPositionsError } = await supabase
      .from('user_positions')
      .select('*')
      .limit(0);
      
    if (userPositionsError) {
      console.error('Error querying user_positions table:', userPositionsError);
    } else {
      console.log('User positions table exists');
    }
    
    // Check user_deposits table
    const { data: userDeposits, error: userDepositsError } = await supabase
      .from('user_deposits')
      .select('*')
      .limit(0);
      
    if (userDepositsError) {
      console.error('Error querying user_deposits table:', userDepositsError);
    } else {
      console.log('User deposits table exists');
    }
    
    // Try to run an actual test insert on user_positions
    const testPosition = {
      wallet_address: 'test_wallet_for_schema_check',
      pool_address: 'test_pool_for_schema_check',
      position_id: 'test_position_for_schema_check',
      lower_bin: 100,
      upper_bin: 200,
      liquidity: '1000',
      token_x_amount: '500',
      token_y_amount: '500',
      created_at: new Date().toISOString()
    };
    
    console.log('Attempting test insert into user_positions table...');
    const { data: insertResult, error: insertError } = await supabase
      .from('user_positions')
      .insert([testPosition]);
      
    if (insertError) {
      console.error('Error inserting test data into user_positions:', insertError);
      
      // Let's check what columns the table actually has
      console.log('Checking what columns the user_positions table actually has...');
      // We'll try inserting with just one column at a time to see which works
      const columns = Object.keys(testPosition);
      for (const column of columns) {
        const testData = { [column]: testPosition[column] };
        const { error } = await supabase
          .from('user_positions')
          .insert([testData]);
          
        console.log(`Testing column '${column}': ${error ? '❌ Not found' : '✅ Found'}`);
        if (error) {
          console.log(`  Error: ${error.message}`);
        }
      }
    } else {
      console.log('Successfully inserted test data into user_positions');
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('user_positions')
        .delete()
        .eq('position_id', 'test_position_for_schema_check');
        
      if (deleteError) {
        console.error('Error deleting test data:', deleteError);
      } else {
        console.log('Successfully cleaned up test data');
      }
    }
    
  } catch (error) {
    console.error('Error checking table schemas:', error);
  }
}

checkTableSchemas();