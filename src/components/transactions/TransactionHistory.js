import React, { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import dashboardApi from '../../api/dashboardApi';
import './TransactionHistory.css';

/**
 * TransactionHistory component displays all user transactions
 * including deposits, withdrawals, fee claims, and reward claims
 */
const TransactionHistory = ({ walletAddress }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState({
    deposits: [],
    withdrawals: [],
    feeClaims: [],
    rewardClaims: []
  });
  const [activeTab, setActiveTab] = useState('all');

  // Fetch transaction data when wallet address changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      try {
        // Using dashboardApi to get wallet overview which contains transactions
        const result = await dashboardApi.getWalletOverview(walletAddress);
        
        if (result.success && result.data) {
          setTransactions(result.data.transactions);
          setError(null);
        } else {
          setError(result.error?.message || 'Failed to load transactions');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress]);

  // Combine all transaction types into one array for "All" tab
  const allTransactions = [
    ...transactions.deposits.map(tx => ({ ...tx, type: 'deposit' })),
    ...transactions.withdrawals.map(tx => ({ ...tx, type: 'withdrawal' })),
    ...transactions.feeClaims.map(tx => ({ ...tx, type: 'fee claim' })),
    ...transactions.rewardClaims.map(tx => ({ ...tx, type: 'reward claim' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Function to get the filtered transactions based on active tab
  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'deposits':
        return transactions.deposits.map(tx => ({ ...tx, type: 'deposit' }));
      case 'withdrawals':
        return transactions.withdrawals.map(tx => ({ ...tx, type: 'withdrawal' }));
      case 'feeClaims':
        return transactions.feeClaims.map(tx => ({ ...tx, type: 'fee claim' }));
      case 'rewardClaims':
        return transactions.rewardClaims.map(tx => ({ ...tx, type: 'reward claim' }));
      case 'all':
      default:
        return allTransactions;
    }
  };

  // Get transaction type badge color
  const getTransactionBadgeVariant = (type) => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'withdrawal':
        return 'warning';
      case 'fee claim':
        return 'info';
      case 'reward claim':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  // Get transaction amount display text
  const getTransactionAmount = (transaction) => {
    if (transaction.type === 'deposit' || transaction.type === 'withdrawal') {
      return (
        <>
          {transaction.token_x_amount && (
            <div>{parseFloat(transaction.token_x_amount).toFixed(6)} Token X</div>
          )}
          {transaction.token_y_amount && (
            <div>{parseFloat(transaction.token_y_amount).toFixed(6)} Token Y</div>
          )}
        </>
      );
    } else if (transaction.type === 'fee claim') {
      return (
        <>
          {transaction.token_x_amount && (
            <div>{parseFloat(transaction.token_x_amount).toFixed(6)} Token X</div>
          )}
          {transaction.token_y_amount && (
            <div>{parseFloat(transaction.token_y_amount).toFixed(6)} Token Y</div>
          )}
        </>
      );
    } else if (transaction.type === 'reward claim') {
      if (transaction.amounts && transaction.amounts.length > 0) {
        return transaction.amounts.map((amount, index) => (
          <div key={index}>{parseFloat(amount).toFixed(6)} Reward {index + 1}</div>
        ));
      }
      return 'Rewards claimed';
    }
    
    return '-';
  };

  // Function to format a tx hash for display (truncate)
  const formatTxHash = (hash) => {
    if (!hash) return '-';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return timestamp;
    }
  };

  return (
    <Card className="transaction-history-card">
      <Card.Header>
        <h5>Transaction History</h5>
      </Card.Header>
      <Card.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3 transaction-tabs"
        >
          <Tab eventKey="all" title={<span>All <Badge bg="secondary">{allTransactions.length}</Badge></span>} />
          <Tab eventKey="deposits" title={<span>Deposits <Badge bg="success">{transactions.deposits.length}</Badge></span>} />
          <Tab eventKey="withdrawals" title={<span>Withdrawals <Badge bg="warning">{transactions.withdrawals.length}</Badge></span>} />
          <Tab eventKey="feeClaims" title={<span>Fee Claims <Badge bg="info">{transactions.feeClaims.length}</Badge></span>} />
          <Tab eventKey="rewardClaims" title={<span>Reward Claims <Badge bg="primary">{transactions.rewardClaims.length}</Badge></span>} />
        </Tabs>

        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div className="table-responsive">
            <Table hover className="transaction-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Pool</th>
                  <th>Position ID</th>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredTransactions().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No transactions found</td>
                  </tr>
                ) : (
                  getFilteredTransactions().map((transaction, index) => (
                    <tr key={`${transaction.tx_hash || transaction.position_id}-${index}`}>
                      <td>
                        <Badge 
                          bg={getTransactionBadgeVariant(transaction.type)}
                          className="text-capitalize"
                        >
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="pool-address">{formatTxHash(transaction.pool_address)}</td>
                      <td className="position-id">{formatTxHash(transaction.position_id)}</td>
                      <td className="tx-hash">
                        {transaction.tx_hash ? (
                          <a 
                            href={`https://solscan.io/tx/${transaction.tx_hash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {formatTxHash(transaction.tx_hash)}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="amount">{getTransactionAmount(transaction)}</td>
                      <td className="timestamp">{formatTimestamp(transaction.timestamp)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TransactionHistory;