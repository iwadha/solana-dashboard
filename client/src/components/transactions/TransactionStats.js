import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function TransactionStats({ transactions }) {
  // Count transactions by type
  const transactionCounts = useMemo(() => {
    const counts = {
      deposit: 0,
      withdrawal: 0,
      fee_claim: 0,
      reward_claim: 0
    };
    
    transactions.forEach(transaction => {
      if (counts[transaction.type] !== undefined) {
        counts[transaction.type]++;
      }
    });
    
    return [
      { name: 'Deposits', value: counts.deposit, color: '#28a745' },
      { name: 'Withdrawals', value: counts.withdrawal, color: '#dc3545' },
      { name: 'Fee Claims', value: counts.fee_claim, color: '#007bff' },
      { name: 'Reward Claims', value: counts.reward_claim, color: '#ffc107' }
    ].filter(item => item.value > 0); // Only show types that have transactions
  }, [transactions]);
  
  // Calculate transaction stats
  const stats = useMemo(() => {
    // Total transactions
    const total = transactions.length;
    
    // Last transaction date
    let lastTransaction = null;
    if (total > 0) {
      const sorted = [...transactions].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      lastTransaction = sorted[0];
    }
    
    // Transaction distribution by pool
    const poolCounts = {};
    transactions.forEach(tx => {
      const pool = tx.pool || 'Unknown';
      poolCounts[pool] = (poolCounts[pool] || 0) + 1;
    });
    
    const topPool = Object.entries(poolCounts)
      .sort((a, b) => b[1] - a[1])
      .shift();
    
    return {
      total,
      lastTransaction,
      topPool
    };
  }, [transactions]);
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff', 
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="intro">{`${((payload[0].value / stats.total) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="transaction-stats-card">
      <Card.Header>Transaction Statistics</Card.Header>
      <Card.Body>
        <div className="stats-summary mb-4">
          <div className="stat-item">
            <h6 className="stat-label">Total Transactions</h6>
            <div className="stat-value">{stats.total}</div>
          </div>
          {stats.topPool && (
            <div className="stat-item">
              <h6 className="stat-label">Most Active Pool</h6>
              <div className="stat-value">{stats.topPool[0]}</div>
              <div className="stat-subtext">{stats.topPool[1]} transactions</div>
            </div>
          )}
        </div>
        
        {transactionCounts.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={transactionCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {transactionCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No transaction data available for chart</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default TransactionStats;