import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Home from './Home';
import Arbitrage from './Arbitrage';
import Profile from './Profile';
import React from 'react';
import { ConnectMetamaskButtonComponent } from './ConnectMetamaskButtonComponent';

class MevDegen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {current_page: 'home'};
    this.setHome = this.setHome.bind(this);
    this.setArbitrage = this.setArbitrage.bind(this);
    this.setProfile = this.setProfile.bind(this);
  }

  setHome() {
    this.setState({
      current_page: 'home'
    })
  }

  setArbitrage() {
    this.setState({
      current_page: 'arbitrage'
    })
  }

  setProfile() {
    this.setState({
      current_page: 'profile'
    })
  }

  render() {
    const current_page = this.state.current_page;
    let page;
    if (current_page === 'home') {
      page = <Home />
    } else if (current_page === 'arbitrage') {
      page = <Arbitrage />
    } else if (current_page === 'profile') {
      page = <Profile />
    } else {
      page = <div>unknown page</div>
    }

    return (
      <div className="App">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand onClick={this.setHome}>🤖 MEV Degen</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={this.setHome}>Home</Nav.Link>
                <Nav.Link onClick={this.setArbitrage}>Arbitrage</Nav.Link>
                <Nav.Link onClick={this.setProfile}>Profile</Nav.Link>
              </Nav>
              <ConnectMetamaskButtonComponent />
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {page}
      </div>
    );
  }
}

export default MevDegen;
