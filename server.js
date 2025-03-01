const express = require('express');
const cors = require('cors');
const path = require('path');
const dataService = require('./src/services/dataService');
const config = require('./src/config');
const { isValidSolanaAddress } = require('./src/utils/validator');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// API Routes
const apiRouter = express.Router();

// Get wallet dashboard data
apiRouter.get('/wallet/:walletAddress/dashboard', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!isValidSolanaAddress(walletAddress)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid wallet address' 
      });
    }
    
    const result = await dataService.getWalletDashboardData(walletAddress);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard data' 
    });
  }
});

// Get wallet positions
apiRouter.get('/wallet/:walletAddress/positions', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!isValidSolanaAddress(walletAddress)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid wallet address' 
      });
    }
    
    const result = await dataService.getWalletPositions(walletAddress);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch positions' 
    });
  }
});

// Get wallet transactions
apiRouter.get('/wallet/:walletAddress/transactions', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { type, startDate, endDate, pool, limit, offset } = req.query;
    
    if (!isValidSolanaAddress(walletAddress)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid wallet address' 
      });
    }
    
    const filters = {
      type,
      startDate,
      endDate,
      pool,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 0
    };
    
    const result = await dataService.getWalletTransactions(walletAddress, filters);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch transactions' 
    });
  }
});

// Get transaction details
apiRouter.get('/wallet/:walletAddress/transactions/:transactionId', async (req, res) => {
  try {
    const { walletAddress, transactionId } = req.params;
    
    if (!isValidSolanaAddress(walletAddress)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid wallet address' 
      });
    }
    
    const result = await dataService.getTransactionDetails(walletAddress, transactionId);
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch transaction details' 
    });
  }
});

// Use API router
app.use('/api', apiRouter);

// In production, any requests not handled by the above will serve the React app
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;