-- Rename tables to match the application code
ALTER TABLE IF EXISTS pool_positions RENAME TO user_positions;
ALTER TABLE IF EXISTS pool_withdrawals RENAME TO user_withdrawals;
ALTER TABLE IF EXISTS user_claimed_fees RENAME TO user_claims;

-- Create the user_rewards table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_rewards (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    pool_address TEXT NOT NULL,
    position_id TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    amounts JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_positions_wallet ON user_positions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_withdrawals_wallet ON user_withdrawals(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_claims_wallet ON user_claims(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_rewards_wallet ON user_rewards(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_deposits_wallet ON user_deposits(wallet_address);