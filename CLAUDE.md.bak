# Solana Dashboard Developer Guide

## Commands
- Install: `npm install`
- Run application: `npm start`
- Run tests: `npm test`
- Run wallet test: `npm run test:wallet`
- Run liquidity test: `npm run test:liquidity`
- Test API integration: `node src/test.js`

## API Keys
- Shyft API Key: `AbxJeco_29wXz_qF`
- This key has access to the GraphQL API and limited REST API endpoints

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

## Shyft API Integration
- REST API available at `https://api.shyft.to/sol/v1`
- GraphQL API available at `https://programs.shyft.to/v0/graphql`
- Working endpoints:
  - `/wallet/balance`: Get wallet SOL balance
  - GraphQL: Get all user positions
- Limited access endpoints (may require premium key):
  - `/wallet/tokens`: Get wallet token balances
  - `/lb/pairs`: Get all liquidity pairs

## Code Style Guidelines
- **Module System**: CommonJS (require/module.exports)
- **Formatting**: Use consistent indentation (4 spaces)
- **Imports**: Group external dependencies first, followed by local imports
- **Error Handling**: Always wrap async operations in try/catch blocks
- **Result Format**: Use consistent `{ success: boolean, data?: any, error?: object }` format
- **Async/Await**: Use async/await pattern for asynchronous operations
- **Documentation**: Add JSDoc comments for functions and classes
- **Naming Conventions**:
  - Functions: camelCase, descriptive verb-noun format
  - Variables: camelCase, clear and descriptive
  - Files: camelCase, descriptive of functionality
  - Services: <Domain>Service (e.g., walletService)
  - Repositories: <Domain>Repository (e.g., walletRepository)

## Architecture Patterns
- **Service Layer**: Handles API communication and business logic
- **Repository Layer**: Handles database operations
- **Data Service**: Orchestrates flow between API and database
- **Error Handling**: Consistent error handling with formatting

## Dependencies
- @shyft-to/js: Solana blockchain data access
- @supabase/supabase-js: Database operations
- axios: HTTP requests for API communication
- dotenv: Environment variable management