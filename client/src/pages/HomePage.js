import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 mb-4">Welcome to Solana Dashboard</h1>
          <p className="lead">
            Track your Solana liquidity positions, monitor transactions, and analyze your performance.
          </p>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Dashboard</Card.Title>
              <Card.Text>
                View your overall portfolio statistics and key metrics at a glance.
              </Card.Text>
              <Button as={Link} to="/dashboard" variant="primary">Go to Dashboard</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Positions</Card.Title>
              <Card.Text>
                Monitor all your active liquidity positions across different pools.
              </Card.Text>
              <Button as={Link} to="/positions" variant="primary">View Positions</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Transactions</Card.Title>
              <Card.Text>
                Track your transaction history including deposits, withdrawals, and fee claims.
              </Card.Text>
              <Button as={Link} to="/transactions" variant="primary">View Transactions</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;