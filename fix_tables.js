require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createUserPositionsTable() {
  console.log('Creating or updating tables to match our code structure...');
  
  // First, try to map existing table columns
  console.log('\nChecking if user_positions table exists...');
  let { data: existingData, error: existingError } = await supabase
    .from('user_positions')
    .select('*')
    .limit(1);
    
  if (existingError) {
    console.log('user_positions table likely does not exist or has incompatible structure');
    
    // Let's try to recreate it with a direct insert
    console.log('Attempting to create user_positions table with first row...');
    
    // First make sure pools table has data
    console.log('Making sure pools table has at least one row...');
    const { error: poolsError } = await supabase
      .from('pools')
      .upsert([{
        pool_address: 'initial_test_pool',
        token_x: 'token_x_mint_address',
        token_y: 'token_y_mint_address',
        token_x_symbol: 'X',
        token_y_symbol: 'Y',
        bin_step: 10
      }], { onConflict: 'pool_address' });
      
    if (poolsError) {
      console.error('Error creating pool record:', poolsError);
    }
    
    // Now modify our user_positions table to match our needs
    console.log('Altering user_positions table if it exists...');
    
    // Try direct insert approach to create the table
    const testPositionData = {
      wallet_address: 'test_user',
      pool_address: 'initial_test_pool',
      position_id: 'test_position_id',
      lower_bin: 100,
      upper_bin: 200,
      liquidity: '1000',
      token_x_amount: '100',
      token_y_amount: '200',
      created_at: new Date().toISOString()
    };
    
    const { error: insertError } = await supabase
      .from('user_positions')
      .upsert([testPositionData], { ignoreDuplicates: false });
    
    if (insertError) {
      console.error('Error creating user_positions table:', insertError);
      
      if (insertError.message.includes('does not exist')) {
        // Try to create a table with a different name
        console.log('Attempting to create user_positions2 table...');
        
        const { error: insert2Error } = await supabase
          .from('user_positions2')
          .insert([testPositionData]);
          
        if (insert2Error) {
          console.error('Error creating user_positions2 table:', insert2Error);
        } else {
          console.log('Successfully created user_positions2 table');
          
          // Now update our code to use this table
          console.log('Please update your code to use "user_positions2" table instead');
        }
      }
    } else {
      console.log('Successfully created or updated user_positions table');
    }
  } else {
    console.log('user_positions table exists, checking if it has the columns we need');
    
    // If it exists, check if it has the wallet_address column
    if (existingData && existingData.length > 0) {
      const columns = Object.keys(existingData[0]);
      console.log('Columns in existing user_positions table:', columns.join(', '));
      
      // Check for key columns
      const hasWalletAddress = columns.includes('wallet_address');
      const hasPoolAddress = columns.includes('pool_address');
      const hasPositionId = columns.includes('position_id');
      
      if (!hasWalletAddress || !hasPoolAddress || !hasPositionId) {
        console.log('Missing required columns in user_positions table');
        
        // Try to create a different table
        console.log('Attempting to create user_positions2 table with correct structure...');
        
        const testData = {
          wallet_address: 'test_user',
          pool_address: 'initial_test_pool',
          position_id: 'test_position_id',
          lower_bin: 100,
          upper_bin: 200,
          liquidity: '1000',
          token_x_amount: '100',
          token_y_amount: '200',
          created_at: new Date().toISOString()
        };
        
        const { error: createError } = await supabase
          .from('user_positions2')
          .insert([testData]);
          
        if (createError) {
          console.error('Error creating user_positions2 table:', createError);
        } else {
          console.log('Successfully created user_positions2 table with correct structure');
          console.log('Please update your code to use "user_positions2" table');
        }
      } else {
        console.log('user_positions table has all required columns');
      }
    }
  }
  
  // Now check the deposits table
  console.log('\nChecking user_deposits table...');
  
  let { data: depositsData, error: depositsError } = await supabase
    .from('user_deposits')
    .select('*')
    .limit(1);
    
  if (depositsError) {
    console.log('user_deposits table likely does not exist or has incompatible structure');
    
    // Let's try to create it with a direct insert
    console.log('Attempting to create user_deposits2 table...');
    
    const testDepositData = {
      wallet_address: 'test_user',
      pool_address: 'initial_test_pool',
      position_id: 'test_position_id',
      transaction_hash: 'test_tx_hash',
      token_x_amount: '100',
      token_y_amount: '200',
      timestamp: new Date().toISOString()
    };
    
    const { error: createError } = await supabase
      .from('user_deposits2')
      .insert([testDepositData]);
      
    if (createError) {
      console.error('Error creating user_deposits2 table:', createError);
    } else {
      console.log('Successfully created user_deposits2 table');
      console.log('Please update your code to use "user_deposits2" table');
    }
  } else {
    console.log('user_deposits table exists, checking if it has the columns we need');
    
    // If it exists, check if it has the required columns
    if (depositsData && depositsData.length > 0) {
      const columns = Object.keys(depositsData[0]);
      console.log('Columns in existing user_deposits table:', columns.join(', '));
      
      // Check for key columns
      const hasWalletAddress = columns.includes('wallet_address');
      const hasPoolAddress = columns.includes('pool_address');
      const hasTransactionHash = columns.includes('transaction_hash');
      
      if (!hasWalletAddress || !hasPoolAddress || !hasTransactionHash) {
        console.log('Missing required columns in user_deposits table');
        
        // Try to create a different table
        console.log('Attempting to create user_deposits2 table with correct structure...');
        
        const testData = {
          wallet_address: 'test_user',
          pool_address: 'initial_test_pool',
          position_id: 'test_position_id',
          transaction_hash: 'test_tx_hash',
          token_x_amount: '100',
          token_y_amount: '200',
          timestamp: new Date().toISOString()
        };
        
        const { error: createError } = await supabase
          .from('user_deposits2')
          .insert([testData]);
          
        if (createError) {
          console.error('Error creating user_deposits2 table:', createError);
        } else {
          console.log('Successfully created user_deposits2 table with correct structure');
          console.log('Please update your code to use "user_deposits2" table');
        }
      } else {
        console.log('user_deposits table has all required columns');
      }
    }
  }
  
  console.log('\nTable verification/creation process completed');
}

createUserPositionsTable();