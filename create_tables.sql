-- Create user_positions table
CREATE TABLE IF NOT EXISTS user_positions (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    pool_address TEXT NOT NULL,
    position_id TEXT NOT NULL,
    lower_bin INTEGER NOT NULL,
    upper_bin INTEGER NOT NULL,
    liquidity TEXT NOT NULL,
    token_x_amount TEXT NOT NULL,
    token_y_amount TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_withdrawals table
CREATE TABLE IF NOT EXISTS user_withdrawals (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    pool_address TEXT NOT NULL,
    position_id TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    token_x_amount TEXT NOT NULL,
    token_y_amount TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_claims table
CREATE TABLE IF NOT EXISTS user_claims (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    pool_address TEXT NOT NULL,
    position_id TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    token_x_amount TEXT NOT NULL,
    token_y_amount TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
    id BIGSERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    pool_address TEXT NOT NULL,
    position_id TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    amounts JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_positions_wallet ON user_positions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_withdrawals_wallet ON user_withdrawals(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_claims_wallet ON user_claims(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_rewards_wallet ON user_rewards(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_deposits_wallet ON user_deposits(wallet_address);