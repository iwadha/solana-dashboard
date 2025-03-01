require('dotenv').config();
const supabase = require('./src/database/supabaseClient');

async function addWalletColumns() {
  console.log('Adding transaction columns to wallets table...');
  
  try {
    // Get the current schema of the wallets table
    const { data, error } = await supabase.from('wallets').select('*').limit(1);
    if (error) {
      console.error('Error fetching schema:', error);
      return;
    }
    
    console.log('Current columns in wallets table:', Object.keys(data[0]).join(', '));
    
    // Add deposits column if it doesn't exist
    if (!data[0].hasOwnProperty('deposits')) {
      console.log('Adding deposits column...');
      const { error: alterError1 } = await supabase.rpc('add_json_column', {
        table_name: 'wallets',
        column_name: 'deposits',
        default_value: '[]'
      });
      
      if (alterError1) {
        console.error('Error adding deposits column:', alterError1);
      } else {
        console.log('deposits column added successfully');
      }
    }
    
    // Add withdrawals column if it doesn't exist
    if (!data[0].hasOwnProperty('withdrawals')) {
      console.log('Adding withdrawals column...');
      const { error: alterError2 } = await supabase.rpc('add_json_column', {
        table_name: 'wallets',
        column_name: 'withdrawals',
        default_value: '[]'
      });
      
      if (alterError2) {
        console.error('Error adding withdrawals column:', alterError2);
      } else {
        console.log('withdrawals column added successfully');
      }
    }
    
    // Add fee_claims column if it doesn't exist
    if (!data[0].hasOwnProperty('fee_claims')) {
      console.log('Adding fee_claims column...');
      const { error: alterError3 } = await supabase.rpc('add_json_column', {
        table_name: 'wallets',
        column_name: 'fee_claims',
        default_value: '[]'
      });
      
      if (alterError3) {
        console.error('Error adding fee_claims column:', alterError3);
      } else {
        console.log('fee_claims column added successfully');
      }
    }
    
    // Add reward_claims column if it doesn't exist
    if (!data[0].hasOwnProperty('reward_claims')) {
      console.log('Adding reward_claims column...');
      const { error: alterError4 } = await supabase.rpc('add_json_column', {
        table_name: 'wallets',
        column_name: 'reward_claims',
        default_value: '[]'
      });
      
      if (alterError4) {
        console.error('Error adding reward_claims column:', alterError4);
      } else {
        console.log('reward_claims column added successfully');
      }
    }
    
    // Verify columns were added
    const { data: verifyData, error: verifyError } = await supabase.from('wallets').select('*').limit(1);
    if (verifyError) {
      console.error('Error verifying schema:', verifyError);
      return;
    }
    
    console.log('Updated columns in wallets table:', Object.keys(verifyData[0]).join(', '));
    console.log('Schema update completed');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Alternative approach: Execute raw SQL if the RPC doesn't exist
async function alterTableWithRawSQL() {
  console.log('Adding transaction columns using raw SQL...');
  
  try {
    // Create function to add JSON columns if it doesn't exist
    const { error: functionError } = await supabase.rpc('execute_sql', {
      sql_statement: `
        CREATE OR REPLACE FUNCTION add_column_if_not_exists(
          _table text, _column text, _type text, _default text DEFAULT NULL
        ) RETURNS VOID AS $$
        BEGIN
          IF NOT EXISTS(
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = _table AND column_name = _column
          ) THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s DEFAULT %L', 
                          _table, _column, _type, _default);
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (functionError) {
      console.error('Error creating helper function:', functionError);
      return;
    }
    
    // Add the columns
    const { error: alterError } = await supabase.rpc('execute_sql', {
      sql_statement: `
        SELECT add_column_if_not_exists('wallets', 'deposits', 'jsonb', '[]');
        SELECT add_column_if_not_exists('wallets', 'withdrawals', 'jsonb', '[]');
        SELECT add_column_if_not_exists('wallets', 'fee_claims', 'jsonb', '[]');
        SELECT add_column_if_not_exists('wallets', 'reward_claims', 'jsonb', '[]');
      `
    });
    
    if (alterError) {
      console.error('Error adding columns:', alterError);
      return;
    }
    
    console.log('Columns added with raw SQL successfully');
    
    // Verify columns were added
    const { data: verifyData, error: verifyError } = await supabase.from('wallets').select('*').limit(1);
    if (verifyError) {
      console.error('Error verifying schema:', verifyError);
      return;
    }
    
    console.log('Updated columns in wallets table:', Object.keys(verifyData[0]).join(', '));
    console.log('Schema update completed');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Try both methods
addWalletColumns().then(() => {
  console.log('Attempting alternative method if needed...');
  alterTableWithRawSQL().then(() => {
    console.log('Schema update process completed');
    process.exit(0);
  });
});