require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createNewTables() {
  console.log('Creating new tables with the correct structure...');
  
  // Create user_positions2 table
  console.log('\nAttempting to create user_positions2 table...');
  const testPositionData = {
    wallet_address: 'test_wallet',
    pool_address: 'test_pool',
    position_id: 'test_position',
    lower_bin: 100,
    upper_bin: 200,
    liquidity: '1000',
    token_x_amount: '100',
    token_y_amount: '200',
    created_at: new Date().toISOString()
  };
  
  try {
    const { data: posData, error: posError } = await supabase
      .from('user_positions2')
      .insert([testPositionData])
      .select();
      
    if (posError) {
      console.error('Error creating user_positions2 table:', posError.message);
    } else {
      console.log('Successfully created user_positions2 table');
      console.log('Sample data:', posData);
      
      // Now let's clean up the test data
      await supabase
        .from('user_positions2')
        .delete()
        .eq('position_id', 'test_position');
    }
  } catch (error) {
    console.error('Unexpected error creating user_positions2:', error);
  }
  
  // Create user_deposits2 table
  console.log('\nAttempting to create user_deposits2 table...');
  const testDepositData = {
    wallet_address: 'test_wallet',
    pool_address: 'test_pool',
    position_id: 'test_position',
    transaction_hash: 'test_hash',
    token_x_amount: '100',
    token_y_amount: '200',
    timestamp: new Date().toISOString()
  };
  
  try {
    const { data: depData, error: depError } = await supabase
      .from('user_deposits2')
      .insert([testDepositData])
      .select();
      
    if (depError) {
      console.error('Error creating user_deposits2 table:', depError.message);
    } else {
      console.log('Successfully created user_deposits2 table');
      console.log('Sample data:', depData);
      
      // Now let's clean up the test data
      await supabase
        .from('user_deposits2')
        .delete()
        .eq('transaction_hash', 'test_hash');
    }
  } catch (error) {
    console.error('Unexpected error creating user_deposits2:', error);
  }
  
  // Create user_withdrawals2 table
  console.log('\nAttempting to create user_withdrawals2 table...');
  const testWithdrawalData = {
    wallet_address: 'test_wallet',
    pool_address: 'test_pool',
    position_id: 'test_position',
    transaction_hash: 'test_hash',
    token_x_amount: '100',
    token_y_amount: '200',
    timestamp: new Date().toISOString()
  };
  
  try {
    const { data: withData, error: withError } = await supabase
      .from('user_withdrawals2')
      .insert([testWithdrawalData])
      .select();
      
    if (withError) {
      console.error('Error creating user_withdrawals2 table:', withError.message);
    } else {
      console.log('Successfully created user_withdrawals2 table');
      console.log('Sample data:', withData);
      
      // Now let's clean up the test data
      await supabase
        .from('user_withdrawals2')
        .delete()
        .eq('transaction_hash', 'test_hash');
    }
  } catch (error) {
    console.error('Unexpected error creating user_withdrawals2:', error);
  }
  
  // Create user_claims2 table
  console.log('\nAttempting to create user_claims2 table...');
  const testClaimData = {
    wallet_address: 'test_wallet',
    pool_address: 'test_pool',
    position_id: 'test_position',
    transaction_hash: 'test_hash',
    token_x_amount: '100',
    token_y_amount: '200',
    timestamp: new Date().toISOString()
  };
  
  try {
    const { data: claimData, error: claimError } = await supabase
      .from('user_claims2')
      .insert([testClaimData])
      .select();
      
    if (claimError) {
      console.error('Error creating user_claims2 table:', claimError.message);
    } else {
      console.log('Successfully created user_claims2 table');
      console.log('Sample data:', claimData);
      
      // Now let's clean up the test data
      await supabase
        .from('user_claims2')
        .delete()
        .eq('transaction_hash', 'test_hash');
    }
  } catch (error) {
    console.error('Unexpected error creating user_claims2:', error);
  }
  
  console.log('\nFinished creating new tables');
}

createNewTables();