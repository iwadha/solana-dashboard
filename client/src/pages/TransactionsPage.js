import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import TransactionHistory from '../components/transactions/TransactionHistory';
import TransactionDetails from '../components/transactions/TransactionDetails';
import TransactionStats from '../components/transactions/TransactionStats';

function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchTransactions = async () => {
      try {
        // Sample placeholder data
        const data = [
          {
            id: 'tx1',
            type: 'deposit',
            timestamp: new Date('2025-02-15T10:30:00').toISOString(),
            pool: 'SOL-USDC',
            amount: '$500',
            tokenAmounts: {
              tokenA: '2.15 SOL',
              tokenB: '250 USDC'
            },
            status: 'completed',
            txHash: '5xG8jfnWoT9yEX...JkLmN'
          },
          {
            id: 'tx2',
            type: 'withdrawal',
            timestamp: new Date('2025-02-18T14:45:00').toISOString(),
            pool: 'SOL-USDC',
            amount: '$200',
            tokenAmounts: {
              tokenA: '0.85 SOL',
              tokenB: '100 USDC'
            },
            status: 'completed',
            txHash: '7zY9kTrWbP3qMN...RsT5'
          },
          {
            id: 'tx3',
            type: 'fee_claim',
            timestamp: new Date('2025-02-20T09:15:00').toISOString(),
            pool: 'SOL-USDC',
            amount: '$45',
            tokenAmounts: {
              tokenA: '0.09 SOL',
              tokenB: '22.5 USDC'
            },
            status: 'completed',
            txHash: '3aB7cDeF2gHi...JkL9'
          },
          {
            id: 'tx4',
            type: 'reward_claim',
            timestamp: new Date('2025-02-22T16:20:00').toISOString(),
            pool: 'SOL-USDC',
            amount: '$25',
            tokenAmounts: {
              tokenA: '0.05 SOL',
              tokenB: '12.5 USDC'
            },
            status: 'completed',
            txHash: '9xZyVuTsRqP...NmL7'
          },
          {
            id: 'tx5',
            type: 'deposit',
            timestamp: new Date('2025-02-25T11:10:00').toISOString(),
            pool: 'ETH-USDC',
            amount: '$700',
            tokenAmounts: {
              tokenA: '0.25 ETH',
              tokenB: '450 USDC'
            },
            status: 'completed',
            txHash: '2wX3yZaB7cD...EfG8'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setTransactions(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load transaction data');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading transaction data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="page-title">Transaction History</h1>
      
      <Row>
        <Col lg={8}>
          <TransactionHistory 
            transactions={transactions}
            onTransactionClick={handleTransactionClick}
          />
        </Col>
        <Col lg={4}>
          <TransactionStats transactions={transactions} />
        </Col>
      </Row>

      {/* Transaction Details Modal */}
      <TransactionDetails
        show={showDetails}
        transaction={selectedTransaction}
        onClose={handleCloseDetails}
      />
    </Container>
  );
}

export default TransactionsPage;