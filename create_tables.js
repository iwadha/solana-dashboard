require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Starting database table setup...');
    
    // Create user_positions table
    console.log('Creating user_positions table...');
    const { error: error1 } = await supabase
      .from('user_positions')
      .insert([{
        wallet_address: 'test_wallet',
        pool_address: 'test_pool',
        position_id: 'test_position',
        lower_bin: 0,
        upper_bin: 0,
        liquidity: '0',
        token_x_amount: '0',
        token_y_amount: '0'
      }])
      .select();
      
    console.log(error1 ? `Error creating user_positions: ${error1.message}` : 'user_positions table looks good or already exists');
    
    // Create user_withdrawals table
    console.log('Creating user_withdrawals table...');
    const { error: error2 } = await supabase
      .from('user_withdrawals')
      .insert([{
        wallet_address: 'test_wallet',
        pool_address: 'test_pool',
        position_id: 'test_position',
        transaction_hash: 'test_tx',
        token_x_amount: '0',
        token_y_amount: '0'
      }])
      .select();
      
    console.log(error2 ? `Error creating user_withdrawals: ${error2.message}` : 'user_withdrawals table looks good or already exists');
    
    // Create user_claims table
    console.log('Creating user_claims table...');
    const { error: error3 } = await supabase
      .from('user_claims')
      .insert([{
        wallet_address: 'test_wallet',
        pool_address: 'test_pool',
        position_id: 'test_position',
        transaction_hash: 'test_tx',
        token_x_amount: '0',
        token_y_amount: '0'
      }])
      .select();
      
    console.log(error3 ? `Error creating user_claims: ${error3.message}` : 'user_claims table looks good or already exists');
    
    // Create user_rewards table
    console.log('Creating user_rewards table...');
    const { error: error4 } = await supabase
      .from('user_rewards')
      .insert([{
        wallet_address: 'test_wallet',
        pool_address: 'test_pool',
        position_id: 'test_position',
        transaction_hash: 'test_tx',
        amounts: {rewards: []}
      }])
      .select();
      
    console.log(error4 ? `Error creating user_rewards: ${error4.message}` : 'user_rewards table looks good or already exists');
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database tables:', error);
  }
}

createTables();