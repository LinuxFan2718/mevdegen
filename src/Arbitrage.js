import { Card } from 'react-bootstrap';

function Arbitrage() {
  return(
    <Card>
      <Card.Header as="h5">Arbitrage</Card.Header>
      <Card.Body>
        <Card.Title>What is arbitrage?</Card.Title>
        <Card.Text>
          Arbitrage in MEV is taking advantage of price mismatches between decentralized exchanges to make riskless profit.
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Arbitrage