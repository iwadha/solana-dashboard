import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import './TransactionStats.css';

/**
 * TransactionStats component to show statistics and charts for wallet transactions
 */
const TransactionStats = ({ transactions }) => {
  // Early return if no transactions
  if (!transactions || 
      (!transactions.deposits.length && 
       !transactions.withdrawals.length && 
       !transactions.feeClaims.length && 
       !transactions.rewardClaims.length)) {
    return (
      <Card className="transaction-stats-card">
        <Card.Header>
          <h5>Transaction Statistics</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <p className="text-muted">No transaction data available</p>
        </Card.Body>
      </Card>
    );
  }

  // Calculate transaction counts by type
  const transactionCounts = [
    { 
      name: 'Deposits', 
      count: transactions.deposits.length,
      color: '#28a745'
    },
    { 
      name: 'Withdrawals', 
      count: transactions.withdrawals.length,
      color: '#ffc107'
    },
    { 
      name: 'Fee Claims', 
      count: transactions.feeClaims.length,
      color: '#17a2b8'
    },
    { 
      name: 'Reward Claims', 
      count: transactions.rewardClaims.length,
      color: '#0d6efd'
    }
  ];

  // Get transaction totals (simplified version - in a real app we would use token values)
  const getTransactionTypeTotals = () => {
    // Calculate deposit totals
    let depositTotal = 0;
    transactions.deposits.forEach(deposit => {
      if (deposit.token_x_amount) depositTotal += parseFloat(deposit.token_x_amount);
      if (deposit.token_y_amount) depositTotal += parseFloat(deposit.token_y_amount);
    });

    // Calculate withdrawal totals
    let withdrawalTotal = 0;
    transactions.withdrawals.forEach(withdrawal => {
      if (withdrawal.token_x_amount) withdrawalTotal += parseFloat(withdrawal.token_x_amount);
      if (withdrawal.token_y_amount) withdrawalTotal += parseFloat(withdrawal.token_y_amount);
    });

    // Calculate fee claim totals
    let feeClaimTotal = 0;
    transactions.feeClaims.forEach(claim => {
      if (claim.token_x_amount) feeClaimTotal += parseFloat(claim.token_x_amount);
      if (claim.token_y_amount) feeClaimTotal += parseFloat(claim.token_y_amount);
    });

    // Calculate reward claim totals
    let rewardClaimTotal = 0;
    transactions.rewardClaims.forEach(claim => {
      if (claim.amounts && Array.isArray(claim.amounts)) {
        claim.amounts.forEach(amount => {
          rewardClaimTotal += parseFloat(amount || 0);
        });
      }
    });

    return [
      { 
        name: 'Deposits', 
        value: depositTotal,
        color: '#28a745'
      },
      { 
        name: 'Withdrawals', 
        value: withdrawalTotal,
        color: '#ffc107'
      },
      { 
        name: 'Fee Claims', 
        value: feeClaimTotal,
        color: '#17a2b8'
      },
      { 
        name: 'Reward Claims', 
        value: rewardClaimTotal,
        color: '#0d6efd'
      }
    ];
  };

  const transactionTotals = getTransactionTypeTotals();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="transaction-stats-card">
      <Card.Header>
        <h5>Transaction Statistics</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={6}>
            <h6 className="stats-title">Transaction Counts</h6>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={transactionCounts}
                margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count">
                  {transactionCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
          <Col md={6}>
            <h6 className="stats-title">Transaction Volume by Type</h6>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={transactionTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {transactionTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toFixed(4)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Col>
        </Row>

        <Row className="transaction-summary">
          <Col md={3} sm={6}>
            <div className="stat-card deposits">
              <div className="stat-value">{transactions.deposits.length}</div>
              <div className="stat-label">Deposits</div>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="stat-card withdrawals">
              <div className="stat-value">{transactions.withdrawals.length}</div>
              <div className="stat-label">Withdrawals</div>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="stat-card fee-claims">
              <div className="stat-value">{transactions.feeClaims.length}</div>
              <div className="stat-label">Fee Claims</div>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="stat-card reward-claims">
              <div className="stat-value">{transactions.rewardClaims.length}</div>
              <div className="stat-label">Reward Claims</div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TransactionStats;