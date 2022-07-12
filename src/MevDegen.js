import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Home from './Home';
import Arbitrage from './Arbitrage';
import Profile from './Profile';
import React, { useEffect, useState } from 'react';

const MevDegen = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get metamask plz");
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  const disconnectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get metamask plz");
        return;
      }
      setCurrentAccount("");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    connectWallet();
  }, [])

  const [currentPage, setCurrentPage] = useState('arbitrage')
  let page = <Home />;
  if (currentPage === 'home') {
    page = <Home />;
  } else if (currentPage === 'arbitrage') {
    page = <Arbitrage address={currentAccount} />;
  } else if (currentPage === 'profile') {
    page = <Profile address={currentAccount} />;
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
              <Nav.Link onClick={setCurrentPageArbitrage}>Arbitrage</Nav.Link>
              <Nav.Link onClick={setCurrentPageProfile}>Profile</Nav.Link>
              <Nav.Link onClick={setCurrentPageHome}>Home</Nav.Link>
            </Nav>
            {currentAccount && (
              <Nav.Link as="button" onClick={disconnectWallet}>
                🦊 Disconnect {currentAccount.substring(0,6)}...
              </Nav.Link>
            )}
            {!currentAccount && (
              <Nav.Link as="button" onClick={connectWallet}>
                🦊 Connect Metamask Wallet
              </Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {page}
    </div>
  );
};

export default MevDegen;
