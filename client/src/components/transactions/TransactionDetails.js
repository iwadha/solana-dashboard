import React from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

function TransactionDetails({ show, transaction, onClose }) {
  if (!transaction) {
    return null;
  }
  
  // Helper function to format transaction type
  const formatTransactionType = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'fee_claim': return 'Fee Claim';
      case 'reward_claim': return 'Reward Claim';
      default: return type;
    }
  };
  
  // Helper function to get transaction type badge colors
  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'deposit': return 'success';
      case 'withdrawal': return 'danger';
      case 'fee_claim': return 'primary';
      case 'reward_claim': return 'warning';
      default: return 'secondary';
    }
  };
  
  // Build Solscan link
  const solscanLink = transaction.txHash 
    ? `https://solscan.io/tx/${transaction.txHash}` 
    : null;
  
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Badge bg={getTypeBadgeVariant(transaction.type)} className="me-2">
            {formatTransactionType(transaction.type)}
          </Badge>
          Transaction Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between">
            <strong>Transaction ID:</strong>
            <span>{transaction.id}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <strong>Date:</strong>
            <span>
              {transaction.timestamp 
                ? format(new Date(transaction.timestamp), 'MMM dd, yyyy h:mm:ss a') 
                : 'N/A'}
            </span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <strong>Pool:</strong>
            <span>{transaction.pool}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <strong>Status:</strong>
            <Badge bg={transaction.status === 'completed' ? 'success' : 'warning'}>
              {transaction.status}
            </Badge>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between">
            <strong>Amount:</strong>
            <span>{transaction.amount}</span>
          </ListGroup.Item>
          
          {transaction.type !== 'reward_claim' && (
            <>
              <ListGroup.Item className="d-flex justify-content-between">
                <strong>Token A Amount:</strong>
                <span>{transaction.tokenAmounts?.tokenA || '0'}</span>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex justify-content-between">
                <strong>Token B Amount:</strong>
                <span>{transaction.tokenAmounts?.tokenB || '0'}</span>
              </ListGroup.Item>
            </>
          )}
          
          {transaction.type === 'reward_claim' && (
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Reward Amount:</strong>
              <span>{transaction.tokenAmounts?.rewards?.[0] || '0'}</span>
            </ListGroup.Item>
          )}
          
          {transaction.txHash && (
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Transaction Hash:</strong>
              <span className="text-truncate" style={{ maxWidth: '60%' }}>
                {transaction.txHash}
              </span>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        {solscanLink && (
          <Button 
            variant="outline-primary" 
            href={solscanLink} 
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Solscan
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransactionDetails;