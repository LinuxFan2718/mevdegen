import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Home from './Home';
import Arbitrage from './Arbitrage';
import Profile from './Profile';
import { ConnectMetamaskButtonComponent } from './ConnectMetamaskButtonComponent';
import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";

const MevDegen = () => {
  const [currentPage, setCurrentPage] = useState('home')
  let page = <Home />;
  if (currentPage === 'home') {
    page = <Home />;
  } else if (currentPage === 'arbitrage') {
    page = <Arbitrage />;
  } else if (currentPage === 'profile') {
    page = <Profile />;
  } else {
    page = <>invalid page</>;
  }

  const setCurrentPageHome = () => {
    setCurrentPage('home');
  }
  const setCurrentPageArbitrage = () => {
    setCurrentPage('arbitrage');
  }
  const setCurrentPageProfile = () => {
    setCurrentPage('profile');
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={setCurrentPageHome}>🤖 MEV Degen</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={setCurrentPageHome}>Home</Nav.Link>
              <Nav.Link onClick={setCurrentPageArbitrage}>Arbitrage</Nav.Link>
              <Nav.Link onClick={setCurrentPageProfile}>Profile</Nav.Link>
            </Nav>
            <ConnectMetamaskButtonComponent />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {page}
    </div>
  );
};

export default MevDegen;
