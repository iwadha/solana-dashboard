import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchDashboardData = async () => {
      try {
        // Sample placeholder data
        const data = {
          sol_balance: 12.45,
          total_positions: 5,
          total_deposits: '$2,500',
          total_withdrawals: '$950',
          total_fees_earned: '$175',
          total_rewards_earned: '$85'
        };
        
        // Simulate API delay
        setTimeout(() => {
          setDashboardData(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard data...</p>
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
      <h1 className="page-title">Dashboard</h1>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <div className="card-header">SOL Balance</div>
            <div className="stat-value">{dashboardData.sol_balance} SOL</div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <div className="card-header">Total Positions</div>
            <div className="stat-value">{dashboardData.total_positions}</div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <div className="card-header">Total Deposits</div>
            <div className="stat-value">{dashboardData.total_deposits}</div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <div className="card-header">Total Withdrawals</div>
            <div className="stat-value">{dashboardData.total_withdrawals}</div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <div className="card-header">Fees Earned</div>
            <div className="stat-value">{dashboardData.total_fees_earned}</div>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="dashboard-card">
            <div className="card-header">Rewards Earned</div>
            <div className="stat-value">{dashboardData.total_rewards_earned}</div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage;