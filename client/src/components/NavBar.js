import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Solana Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              active={location.pathname === '/dashboard'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/positions" 
              active={location.pathname === '/positions'}
            >
              Positions
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/transactions" 
              active={location.pathname === '/transactions'}
            >
              Transactions
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;