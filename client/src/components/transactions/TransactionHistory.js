import React, { useState } from 'react';
import { Table, Card, Tabs, Tab, Badge, Button } from 'react-bootstrap';
import { format } from 'date-fns';

function TransactionHistory({ transactions, onTransactionClick }) {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });
  
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
  
  // Helper function to format transaction type for display
  const formatTransactionType = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'fee_claim': return 'Fee Claim';
      case 'reward_claim': return 'Reward Claim';
      default: return type;
    }
  };
  
  return (
    <Card className="transaction-history-card">
      <Card.Header>
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-3"
        >
          <Tab eventKey="all" title="All Transactions" />
          <Tab eventKey="deposit" title="Deposits" />
          <Tab eventKey="withdrawal" title="Withdrawals" />
          <Tab eventKey="fee_claim" title="Fee Claims" />
          <Tab eventKey="reward_claim" title="Reward Claims" />
        </Tabs>
      </Card.Header>
      <Card.Body className="p-0">
        <Table hover responsive className="transaction-table mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Pool</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5">
                  No transactions found for this category
                </td>
              </tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="transaction-row">
                  <td>
                    {transaction.timestamp ? format(new Date(transaction.timestamp), 'MMM dd, yyyy h:mm a') : 'N/A'}
                  </td>
                  <td>
                    <Badge bg={getTypeBadgeVariant(transaction.type)}>
                      {formatTransactionType(transaction.type)}
                    </Badge>
                  </td>
                  <td>{transaction.pool}</td>
                  <td>{transaction.amount}</td>
                  <td>
                    <Badge bg={transaction.status === 'completed' ? 'success' : 'warning'}>
                      {transaction.status}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onTransactionClick(transaction)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default TransactionHistory;