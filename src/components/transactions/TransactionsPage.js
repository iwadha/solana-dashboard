import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import TransactionHistory from './TransactionHistory';
import TransactionDetails from './TransactionDetails';
import TransactionStats from './TransactionStats';
import dashboardApi from '../../api/dashboardApi';
import './TransactionsPage.css';

/**
 * TransactionsPage is the main container for all transaction-related components
 */
const TransactionsPage = ({ walletAddress }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState({
    deposits: [],
    withdrawals: [],
    feeClaims: [],
    rewardClaims: []
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch transaction data when wallet address changes
  useEffect(() => {
    fetchTransactionData();
  }, [walletAddress]);

  // Function to fetch transaction data from API
  const fetchTransactionData = async () => {
    if (!walletAddress) {
      setError('Wallet address is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await dashboardApi.getWalletOverview(walletAddress);
      
      if (result.success && result.data) {
        setTransactionData(result.data.transactions);
      } else {
        setError(result.error?.message || 'Failed to load transaction data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching transaction data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      const result = await dashboardApi.refreshWalletData(walletAddress);
      
      if (result.success) {
        // After refreshing data, fetch updated data
        await fetchTransactionData();
      } else {
        setError('Failed to refresh data');
      }
    } catch (err) {
      setError('An error occurred while refreshing data');
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Function to open transaction details modal
  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  // Function to close transaction details modal
  const closeTransactionDetails = () => {
    setShowDetails(false);
    setTimeout(() => setSelectedTransaction(null), 300); // Clear after animation
  };

  if (loading) {
    return (
      <Container className="transactions-page">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading transaction data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="transactions-page">
        <Alert variant="danger" className="my-4">
          <Alert.Heading>Error Loading Transactions</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-danger" 
              onClick={fetchTransactionData}
              disabled={loading}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="transactions-page">
      <div className="page-header">
        <h2>Transaction History</h2>
        <Button 
          variant="primary" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="refresh-button"
        >
          {refreshing ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Refreshing...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </>
          )}
        </Button>
      </div>

      <Row>
        <Col lg={12}>
          <TransactionStats transactions={transactionData} />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <TransactionHistory 
            walletAddress={walletAddress}
            onViewDetails={openTransactionDetails}
          />
        </Col>
      </Row>

      {/* Transaction Details Modal */}
      <TransactionDetails 
        transaction={selectedTransaction}
        show={showDetails}
        onHide={closeTransactionDetails}
      />
    </Container>
  );
};

export default TransactionsPage;