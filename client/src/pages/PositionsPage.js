import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Spinner, Badge } from 'react-bootstrap';

function PositionsPage() {
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This will be replaced with actual API call
    const fetchPositions = async () => {
      try {
        // Sample placeholder data
        const data = [
          {
            id: '1',
            pool: 'SOL-USDC',
            lowerTick: '120.5',
            upperTick: '130.2',
            liquidity: '2500',
            depositValue: '$1,200',
            feesEarned: '$45',
            rewardsEarned: '$25',
            status: 'active'
          },
          {
            id: '2',
            pool: 'ETH-USDC',
            lowerTick: '1800.75',
            upperTick: '1950.25',
            liquidity: '1800',
            depositValue: '$950',
            feesEarned: '$32',
            rewardsEarned: '$18',
            status: 'active'
          },
          {
            id: '3',
            pool: 'BTC-USDC',
            lowerTick: '28500.00',
            upperTick: '31000.00',
            liquidity: '3200',
            depositValue: '$1,500',
            feesEarned: '$65',
            rewardsEarned: '$30',
            status: 'closed'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setPositions(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load positions data');
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading positions data...</p>
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
      <h1 className="page-title">Liquidity Positions</h1>
      
      <Card className="table-container">
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pool</th>
              <th>Price Range</th>
              <th>Liquidity</th>
              <th>Value</th>
              <th>Fees Earned</th>
              <th>Rewards</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(position => (
              <tr key={position.id} className="transaction-row">
                <td>{position.id}</td>
                <td>{position.pool}</td>
                <td>{position.lowerTick} - {position.upperTick}</td>
                <td>{position.liquidity}</td>
                <td>{position.depositValue}</td>
                <td>{position.feesEarned}</td>
                <td>{position.rewardsEarned}</td>
                <td>
                  <Badge bg={position.status === 'active' ? 'success' : 'secondary'}>
                    {position.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default PositionsPage;