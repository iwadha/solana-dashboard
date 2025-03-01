import React from 'react';
import { Modal, Button, Row, Col, Table, Badge } from 'react-bootstrap';
import { format } from 'date-fns';
import './TransactionDetails.css';

/**
 * TransactionDetails modal component
 * Displays detailed information about a single transaction
 */
const TransactionDetails = ({ transaction, show, onHide }) => {
  if (!transaction) return null;

  // Helper to get badge variant
  const getBadgeVariant = (type) => {
    switch (type) {
      case 'deposit': return 'success';
      case 'withdrawal': return 'warning';
      case 'fee claim': return 'info';
      case 'reward claim': return 'primary';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return format(new Date(timestamp), 'PPpp'); // e.g., "Apr 29, 2022, 3:56:07 PM"
    } catch (err) {
      return timestamp;
    }
  };

  // Format token amounts with proper display
  const formatTokenAmount = (amount, symbol = '') => {
    if (!amount) return 'N/A';
    const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
    return symbol ? `${formattedAmount} ${symbol}` : formattedAmount;
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      centered
      className="transaction-details-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Badge 
            bg={getBadgeVariant(transaction.type)}
            className="text-capitalize me-2"
          >
            {transaction.type}
          </Badge>
          Transaction Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <h6 className="text-muted">Transaction Hash</h6>
            {transaction.tx_hash ? (
              <a 
                href={`https://solscan.io/tx/${transaction.tx_hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transaction-hash"
              >
                {transaction.tx_hash}
                <i className="bi bi-box-arrow-up-right ms-2"></i>
              </a>
            ) : (
              <span className="text-muted">Not available</span>
            )}
          </Col>
          <Col md={6}>
            <h6 className="text-muted">Date & Time</h6>
            <p>{formatDate(transaction.timestamp)}</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <h6 className="text-muted">Pool Address</h6>
            {transaction.pool_address ? (
              <a 
                href={`https://solscan.io/account/${transaction.pool_address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="address"
              >
                {transaction.pool_address}
                <i className="bi bi-box-arrow-up-right ms-2"></i>
              </a>
            ) : (
              <span className="text-muted">Not available</span>
            )}
          </Col>
          <Col md={6}>
            <h6 className="text-muted">Position ID</h6>
            {transaction.position_id ? (
              <a 
                href={`https://solscan.io/account/${transaction.position_id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="position-id"
              >
                {transaction.position_id}
                <i className="bi bi-box-arrow-up-right ms-2"></i>
              </a>
            ) : (
              <span className="text-muted">Not available</span>
            )}
          </Col>
        </Row>

        <h6 className="text-muted mb-3">Details</h6>
        <Table bordered className="transaction-details-table">
          <tbody>
            {(transaction.type === 'deposit' || transaction.type === 'withdrawal' || transaction.type === 'fee claim') && (
              <>
                {transaction.token_x_amount && (
                  <tr>
                    <th>Token X Amount</th>
                    <td className="text-end">{formatTokenAmount(transaction.token_x_amount)}</td>
                  </tr>
                )}
                {transaction.token_y_amount && (
                  <tr>
                    <th>Token Y Amount</th>
                    <td className="text-end">{formatTokenAmount(transaction.token_y_amount)}</td>
                  </tr>
                )}
              </>
            )}

            {transaction.type === 'reward claim' && transaction.amounts && (
              <>
                {transaction.amounts.map((amount, index) => (
                  <tr key={index}>
                    <th>Reward {index + 1} Amount</th>
                    <td className="text-end">{formatTokenAmount(amount)}</td>
                  </tr>
                ))}
              </>
            )}

            {transaction.lower_bin && (
              <tr>
                <th>Lower Bin</th>
                <td>{transaction.lower_bin}</td>
              </tr>
            )}

            {transaction.upper_bin && (
              <tr>
                <th>Upper Bin</th>
                <td>{transaction.upper_bin}</td>
              </tr>
            )}
            
            {transaction.status && (
              <tr>
                <th>Status</th>
                <td>
                  <Badge 
                    bg={transaction.status === 'success' ? 'success' : 'danger'}
                    className="text-capitalize"
                  >
                    {transaction.status}
                  </Badge>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        {transaction.tx_hash && (
          <Button 
            variant="outline-primary" 
            href={`https://solscan.io/tx/${transaction.tx_hash}`}
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on Solscan
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionDetails;