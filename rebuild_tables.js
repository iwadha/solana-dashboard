require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function rebuildTables() {
  console.log('Starting database table rebuild...');
  
  try {
    // Create new position JSON schema table
    console.log('\nRebuilding user_positions_new table...');
    
    // First, check if the table exists
    const { error: checkError } = await supabase
      .from('user_positions_new')
      .select('id')
      .limit(1);
      
    // If the table doesn't exist, create it
    if (checkError && checkError.message.includes('relation "user_positions_new" does not exist')) {
      // Use execute SQL to create the table
      console.log('Creating user_positions_new table...');
      
      const { error: createError } = await supabase.rpc('create_user_positions_table');
      
      if (createError) {
        console.error('Error creating user_positions_new table:', createError);
        console.log('Attempting to create user_positions_new table with direct insert...');
        
        // Try to create via insert
        const { error: insertError } = await supabase
          .from('user_positions_new')
          .insert([{
            wallet_address: 'test_wallet',
            pool_address: 'test_pool',
            position_id: 'test_position',
            lower_bin: 0,
            upper_bin: 0,
            liquidity: '0',
            token_x_amount: '0',
            token_y_amount: '0'
          }]);
          
        if (insertError) {
          console.error('Could not create user_positions_new table:', insertError.message);
        } else {
          console.log('Successfully created user_positions_new table');
        }
      } else {
        console.log('Successfully created user_positions_new table with SQL');
      }
    } else {
      console.log('user_positions_new table already exists');
    }
    
    // Do the same for user_deposits
    console.log('\nRebuilding user_deposits_new table...');
    
    // First, check if the table exists
    const { error: checkDepositsError } = await supabase
      .from('user_deposits_new')
      .select('id')
      .limit(1);
      
    // If the table doesn't exist, create it
    if (checkDepositsError && checkDepositsError.message.includes('relation "user_deposits_new" does not exist')) {
      // Try to create via insert
      const { error: insertError } = await supabase
        .from('user_deposits_new')
        .insert([{
          wallet_address: 'test_wallet',
          pool_address: 'test_pool',
          position_id: 'test_position',
          transaction_hash: 'test_hash',
          token_x_amount: '0',
          token_y_amount: '0',
          timestamp: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Could not create user_deposits_new table:', insertError.message);
      } else {
        console.log('Successfully created user_deposits_new table');
      }
    } else {
      console.log('user_deposits_new table already exists');
    }
    
    // Do the same for user_withdrawals
    console.log('\nRebuilding user_withdrawals_new table...');
    
    // First, check if the table exists
    const { error: checkWithdrawalsError } = await supabase
      .from('user_withdrawals_new')
      .select('id')
      .limit(1);
      
    // If the table doesn't exist, create it
    if (checkWithdrawalsError && checkWithdrawalsError.message.includes('relation "user_withdrawals_new" does not exist')) {
      // Try to create via insert
      const { error: insertError } = await supabase
        .from('user_withdrawals_new')
        .insert([{
          wallet_address: 'test_wallet',
          pool_address: 'test_pool',
          position_id: 'test_position',
          transaction_hash: 'test_hash',
          token_x_amount: '0',
          token_y_amount: '0',
          timestamp: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Could not create user_withdrawals_new table:', insertError.message);
      } else {
        console.log('Successfully created user_withdrawals_new table');
      }
    } else {
      console.log('user_withdrawals_new table already exists');
    }
    
    // Do the same for user_claims
    console.log('\nRebuilding user_claims_new table...');
    
    // First, check if the table exists
    const { error: checkClaimsError } = await supabase
      .from('user_claims_new')
      .select('id')
      .limit(1);
      
    // If the table doesn't exist, create it
    if (checkClaimsError && checkClaimsError.message.includes('relation "user_claims_new" does not exist')) {
      // Try to create via insert
      const { error: insertError } = await supabase
        .from('user_claims_new')
        .insert([{
          wallet_address: 'test_wallet',
          pool_address: 'test_pool',
          position_id: 'test_position',
          transaction_hash: 'test_hash',
          token_x_amount: '0',
          token_y_amount: '0',
          timestamp: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Could not create user_claims_new table:', insertError.message);
      } else {
        console.log('Successfully created user_claims_new table');
      }
    } else {
      console.log('user_claims_new table already exists');
    }
    
    console.log('\nDatabase rebuild process completed.');
  } catch (error) {
    console.error('Error rebuilding tables:', error);
  }
}

rebuildTables();