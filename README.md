# Solana Dashboard

A full-stack application for retrieving, processing, and presenting Solana wallet data with a focus on token balances, SOL balance, and detailed liquidity pool positions. Includes both a backend API and a React frontend.

## Features

- Fetch wallet balances and token data from Solana blockchain
- Track liquidity pool positions, deposits, withdrawals, fee claims, and reward claims
- Store comprehensive transaction history in Supabase database
- Provide clean API endpoints for dashboard UI consumption
- Interactive React frontend for visualizing wallet data and transactions
- Transaction history with filtering capability
- Detailed position monitoring

## Project Structure

```
solana-dashboard/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── api/            # API client for backend communication
│   │   ├── components/     # React components
│   │   │   └── transactions/ # Transaction-specific components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Frontend utilities
├── src/                    # Backend source code
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
│   │   ├── testLiquidityFetch.js
│   │   ├── test_transactions.js
│   │   └── test_dashboard_data.js
│   ├── config.js           # Configuration settings
│   └── index.js            # Backend entry point
├── server.js               # Express API server for frontend
```

## Architecture Overview

This project uses a layered architecture:

### Backend
1. **API Layer** - Communicates with external services (Shyft API)
2. **Service Layer** - Handles business logic and orchestrates operations
3. **Repository Layer** - Manages data storage and retrieval from Supabase
4. **Utility Layer** - Provides common functionality like error handling and validation
5. **Express Server** - Provides REST API endpoints for the frontend

### Frontend
1. **API Client** - Communicates with the backend REST API
2. **Component Layer** - Reusable React components
3. **Page Layer** - Route-specific page components
4. **Routing** - React Router for navigation between pages

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

2. Install all dependencies (backend and frontend)
```
npm run install:all
```

Or install them separately:
```
npm install  # Install backend dependencies
cd client && npm install  # Install frontend dependencies
```

3. Create a `.env` file in the root directory with the following content:
```
SHYFT_API_KEY=AbxJeco_29wXz_qF
SUPABASE_URL=https://ggjkqmdwctovbblgzgyg.supabase.co
SUPABASE_KEY=your_supabase_key_here
```

4. Create a `.env` file in the `client` directory with:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOLSCAN_URL=https://solscan.io
REACT_APP_DEFAULT_WALLET=8W6QcMF91YYUDf1J8tCLbLyvkbYaAcDUzSLh5Zke7Kzi
```

### Running the Application

There are several ways to run the application:

Run both backend and frontend together:
```
npm run dev
```

Run the backend API server only:
```
npm run start:backend
```

Run the React frontend only:
```
npm run start:client
```

Run the original data collection script:
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

Test transaction data retrieval:
```
node test_transactions.js
```

Test dashboard data with transactions:
```
node test_dashboard_data.js
```

## Database Schema

The application uses the following tables in Supabase:

- `wallets`: Stores wallet balances, token holdings, and transaction history
  - Contains a JSON column `lp_positions` that stores all transaction data
  - Transaction types include: positions, deposits, withdrawals, fee claims, and reward claims
- `pools`: Stores liquidity pool information

All transaction data is stored in the `lp_positions` JSON column of the `wallets` table, which provides flexibility and avoids the need for separate tables for each transaction type.

## Key Components

### Backend Components
- **shyftClient.js**: Base client for communicating with Shyft API
- **walletService.js**: Service for wallet-related operations
- **liquidityService.js**: Service for liquidity pool operations
- **dataService.js**: Orchestrates data flow between API and database, handles transaction data
- **walletRepository.js**: Manages wallet data storage with JSON field handling for transactions
- **server.js**: Express server that provides REST API endpoints for the frontend

### Frontend Components
- **dashboardApi.js**: Client for communicating with the backend API
- **TransactionHistory.js**: Component for displaying transaction history with filtering
- **TransactionDetails.js**: Component for showing detailed transaction information
- **TransactionStats.js**: Component for displaying transaction statistics and charts
- **TransactionsPage.js**: Container page that coordinates transaction components

## REST API Endpoints

The Express server provides the following API endpoints:

- **GET /api/wallet/:walletAddress/dashboard**
  - Description: Get dashboard data for a wallet
  - Parameters: walletAddress (Solana address)
  - Returns: Wallet info, positions, and transaction summary

- **GET /api/wallet/:walletAddress/positions**
  - Description: Get all positions for a wallet
  - Parameters: walletAddress (Solana address)
  - Returns: Array of liquidity positions

- **GET /api/wallet/:walletAddress/transactions**
  - Description: Get filtered transactions for a wallet
  - Parameters: 
    - walletAddress (Solana address)
    - type (optional): Filter by transaction type (deposit, withdrawal, fee_claim, reward_claim)
    - startDate (optional): Filter by start date
    - endDate (optional): Filter by end date
    - pool (optional): Filter by pool address
    - limit (optional): Number of results to return (default: 100)
    - offset (optional): Pagination offset (default: 0)
  - Returns: Array of transactions and total count

- **GET /api/wallet/:walletAddress/transactions/:transactionId**
  - Description: Get details for a specific transaction
  - Parameters:
    - walletAddress (Solana address)
    - transactionId (transaction ID)
  - Returns: Detailed transaction data

## License

ISC

## Acknowledgements

- [Shyft API](https://shyft.to/) for Solana blockchain data
- [Supabase](https://supabase.io/) for database services