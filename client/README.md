# Solana Dashboard React Client

This is the React frontend for the Solana Dashboard application, designed to display liquidity positions, transaction history, and wallet information for Solana users.

## Features

- Dashboard overview with key metrics
- Detailed transaction history with filtering
- Liquidity position monitoring
- Transaction details modal
- Analytics with charts and graphs

## Tech Stack

- React 18
- React Router DOM for navigation
- React Bootstrap for UI components
- Recharts for data visualization
- Date-fns for date formatting

## Project Structure

```
client/
├── public/                 # Public assets and HTML template
├── src/                    # Source code
│   ├── api/                # API client for backend communication
│   ├── components/         # Reusable UI components
│   │   ├── NavBar.js       # Navigation bar component
│   │   └── transactions/   # Transaction-related components
│   │       ├── TransactionHistory.js # Transaction table with filters
│   │       ├── TransactionDetails.js # Transaction details modal
│   │       └── TransactionStats.js   # Charts and statistics
│   ├── pages/              # Page components
│   │   ├── HomePage.js     # Landing page
│   │   ├── DashboardPage.js # Dashboard with metrics
│   │   ├── TransactionsPage.js # Transaction history page
│   │   └── PositionsPage.js   # Liquidity positions page
│   ├── utils/              # Utility functions
│   ├── App.js              # Main application component
│   ├── App.css             # App-specific styles
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Backend API server running

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_SOLSCAN_URL=https://solscan.io
   REACT_APP_DEFAULT_WALLET=<default_wallet_address>
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at http://localhost:3000

## Connection to Backend

The React client communicates with the backend API through the `api/dashboardApi.js` client, which provides methods for:

- Fetching wallet dashboard data
- Getting liquidity positions
- Retrieving transaction history with filtering
- Getting detailed transaction information

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## Deployment

To build for production:

```
npm run build
```

The production-ready files will be in the `build` directory, which can be served by the Express backend or any static file server.