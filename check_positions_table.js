require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserPositionsTable() {
  console.log('Checking user_positions table structure...');
  
  // Potential column names to check
  const potentialColumns = [
    'id', 
    'wallet_address', 
    'owner', 
    'user_address',
    'wallet',
    'address',
    'pool_address', 
    'pool_id',
    'pair_address',
    'lb_pair',
    'position_id', 
    'position_index', 
    'position_key',
    'pubkey',
    'lower_bin', 
    'lower_bin_id',
    'lowerBinId',
    'upper_bin', 
    'upper_bin_id',
    'upperBinId',
    'liquidity', 
    'token_x_amount', 
    'x_amount',
    'token_y_amount',
    'y_amount',
    'created_at',
    'timestamp'
  ];
  
  // Check each potential column one by one
  for (const column of potentialColumns) {
    try {
      // Try to select using this column
      const { data, error } = await supabase
        .from('user_positions')
        .select(column)
        .limit(1);
        
      const exists = !error || !error.message.includes('does not exist');
      console.log(`Column '${column}': ${exists ? '✅ Exists' : '❌ Not found'}`);
      
      if (error && !error.message.includes('does not exist')) {
        console.log(`  Other error: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error checking column ${column}:`, error);
    }
  }
  
  // Let's try to get a row with a very simple query
  try {
    console.log('\nTrying to get all columns...');
    const { data, error } = await supabase
      .from('user_positions')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error querying all columns:', error.message);
    } else if (data && data.length > 0) {
      console.log('Found columns:', Object.keys(data[0]).join(', '));
    } else {
      console.log('No data found in user_positions table');
    }
  } catch (error) {
    console.error('Error querying user_positions table:', error);
  }
  
  // Try to insert a minimal row
  try {
    console.log('\nTrying to insert a test row with minimal required fields...');
    const testData = {
      pool_address: 'test_pool_to_be_deleted',
      owner: 'test_owner_to_be_deleted',
      lb_pair: 'test_lb_pair_to_be_deleted',
      lowerBinId: 100,
      upperBinId: 200
    };
    
    const { data, error } = await supabase
      .from('user_positions')
      .insert([testData])
      .select();
      
    if (error) {
      console.error('Error inserting test data:', error.message);
    } else {
      console.log('Successfully inserted test data');
      console.log('Inserted row:', data[0]);
      
      // Delete the test row
      const { error: deleteError } = await supabase
        .from('user_positions')
        .delete()
        .eq('pool_address', 'test_pool_to_be_deleted');
        
      if (deleteError) {
        console.error('Error deleting test data:', deleteError.message);
      } else {
        console.log('Successfully deleted test data');
      }
    }
  } catch (error) {
    console.error('Error testing insertion:', error);
  }
}

// Run the check
checkUserPositionsTable();