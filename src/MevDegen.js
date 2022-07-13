import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Home from './Home';
import Arbitrage from './Arbitrage';
import React, { useState } from 'react';

const MevDegen = () => {
  const [currentPage, setCurrentPage] = useState('arbitrage')
  let page = <Home />;
  if (currentPage === 'home') {
    page = <Home />;
  } else if (currentPage === 'arbitrage') {
    page = <Arbitrage />;
  } else {
    page = <>invalid page</>;
  }

  const setCurrentPageHome = () => {
    setCurrentPage('home');
  }
  const setCurrentPageArbitrage = () => {
    setCurrentPage('arbitrage');
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={setCurrentPageHome}>🤖 MEV Degen</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={setCurrentPageArbitrage}>Arbitrage</Nav.Link>
              <Nav.Link onClick={setCurrentPageHome}>Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {page}
    </div>
  );
};

export default MevDegen;
