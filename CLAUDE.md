# Solana Dashboard Developer Guide

## Commands
- Install: `npm install`
- Run files: `node <filename.js>`
- Test: No formal test setup currently

## Code Style Guidelines
- **Module System**: CommonJS (require/module.exports)
- **Formatting**: Use consistent indentation (4 spaces)
- **Imports**: Group external dependencies first, followed by local imports
- **Error Handling**: Use try/catch blocks for async operations with console.error
- **Async/Await**: Use async/await pattern for asynchronous operations
- **Documentation**: Add comments for complex logic and function descriptions
- **Naming Conventions**:
  - Functions: camelCase, descriptive verb-noun format
  - Variables: camelCase, clear and descriptive
  - Files: camelCase, descriptive of functionality

## Project Structure
- Backend JavaScript application using Solana APIs (via Shyft)
- Data storage in Supabase
- Separate files for fetch and store operations
- Environment variables stored in .env file

## Dependencies
- @shyft-to/js: Solana blockchain data access
- @supabase/supabase-js: Database operations
- axios: HTTP requests
- dotenv: Environment variable management