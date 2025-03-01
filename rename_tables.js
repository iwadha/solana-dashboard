require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function renameTablesAndCreateIndexes() {
  try {
    console.log('Starting database table updates...');
    
    // Rename pool_positions to user_positions
    console.log('Renaming pool_positions to user_positions...');
    const { error: error1 } = await supabase.rpc('rename_table', { 
      table_from: 'pool_positions', 
      table_to: 'user_positions' 
    });
    if (error1) throw error1;
    
    // Rename pool_withdrawals to user_withdrawals
    console.log('Renaming pool_withdrawals to user_withdrawals...');
    const { error: error2 } = await supabase.rpc('rename_table', { 
      table_from: 'pool_withdrawals', 
      table_to: 'user_withdrawals' 
    });
    if (error2) throw error2;
    
    // Rename user_claimed_fees to user_claims
    console.log('Renaming user_claimed_fees to user_claims...');
    const { error: error3 } = await supabase.rpc('rename_table', { 
      table_from: 'user_claimed_fees', 
      table_to: 'user_claims' 
    });
    if (error3) throw error3;
    
    // Create user_rewards table with SQL query
    console.log('Creating user_rewards table...');
    const { error: error4 } = await supabase.rpc('run_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS user_rewards (
          id BIGSERIAL PRIMARY KEY,
          wallet_address TEXT NOT NULL,
          pool_address TEXT NOT NULL,
          position_id TEXT NOT NULL,
          transaction_hash TEXT NOT NULL,
          amounts JSONB NOT NULL,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_user_positions_wallet ON user_positions(wallet_address);
        CREATE INDEX IF NOT EXISTS idx_user_withdrawals_wallet ON user_withdrawals(wallet_address);
        CREATE INDEX IF NOT EXISTS idx_user_claims_wallet ON user_claims(wallet_address);
        CREATE INDEX IF NOT EXISTS idx_user_rewards_wallet ON user_rewards(wallet_address);
        CREATE INDEX IF NOT EXISTS idx_user_deposits_wallet ON user_deposits(wallet_address);
      `
    });
    if (error4) throw error4;
    
    console.log('All database operations completed successfully!');
  } catch (error) {
    console.error('Error updating database tables:', error);
  }
}

renameTablesAndCreateIndexes();