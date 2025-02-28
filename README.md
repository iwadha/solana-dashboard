# Solana Dashboard

A backend service for retrieving, processing, and presenting Solana wallet data with a focus on token balances, SOL balance, and detailed liquidity pool positions.

## Features

- Fetch wallet balances and token data from Solana blockchain
- Track liquidity pool positions, deposits, withdrawals, and fee claims
- Store historical data in Supabase database
- Provide clean API endpoints for dashboard UI consumption

## Project Structure

```
solana-dashboard/
├── src/                    # Source code
│   ├── api/                # API modules
│   │   ├── shyft/          # Shyft API clients
│   │   │   ├── shyftClient.js
│   │   │   ├── walletService.js
│   │   │   └── liquidityService.js
│   │   └── dashboardApi.js # API for UI consumption
│   ├── database/           # Database operations
│   │   ├── supabaseClient.js
│   │   ├── walletRepository.js
│   │   └── liquidityRepository.js
│   ├── services/           # Business logic
│   │   └── dataService.js
│   ├── utils/              # Utility functions
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── tests/              # Test scripts
│   │   ├── testWalletFetch.js
│   │   └── testLiquidityFetch.js
│   ├── config.js           # Configuration settings
│   └── index.js            # Main entry point
```

## Architecture Overview

This project uses a layered architecture:

1. **API Layer** - Communicates with external services (Shyft API)
2. **Service Layer** - Handles business logic and orchestrates operations
3. **Repository Layer** - Manages data storage and retrieval from Supabase
4. **Utility Layer** - Provides common functionality like error handling and validation

## Shyft API Integration

- REST API for simple queries (wallet balance)
- GraphQL API for complex data (position queries)
- Key features:
  - Wallet balance and token data
  - Liquidity pool information
  - Position details and history

## Getting Started

### Prerequisites

- Node.js 16+
- Supabase account (for data storage)
- Shyft API key (provided in configuration)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/solana-dashboard.git
cd solana-dashboard
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
SHYFT_API_KEY=AbxJeco_29wXz_qF
SUPABASE_URL=https://ggjkqmdwctovbblgzgyg.supabase.co
SUPABASE_KEY=your_supabase_key_here
```

### Running the Application

Start the application:
```
npm start
```

### Testing

Run tests for wallet data retrieval:
```
npm run test:wallet
```

Run tests for liquidity data retrieval:
```
npm run test:liquidity
```

Run all tests:
```
npm test
```

Test API integration directly:
```
node src/test.js
```

## Database Schema

The application uses the following tables in Supabase:

- `wallets`: Stores wallet balances and token holdings
- `pools`: Stores liquidity pool information
- `user_positions`: Stores user's liquidity positions
- `user_deposits`: Stores user's deposit history
- `user_withdrawals`: Stores user's withdrawal history
- `user_claims`: Stores user's fee claim history

## Key Components

- **shyftClient.js**: Base client for communicating with Shyft API
- **walletService.js**: Service for wallet-related operations
- **liquidityService.js**: Service for liquidity pool operations
- **dataService.js**: Orchestrates data flow between API and database
- **dashboardApi.js**: Provides API endpoints for the UI

## License

ISC

## Acknowledgements

- [Shyft API](https://shyft.to/) for Solana blockchain data
- [Supabase](https://supabase.io/) for database services