import { Card } from 'react-bootstrap';
import { useAddress } from "@thirdweb-dev/react";

function Arbitrage() {
  const address = useAddress();

  return(
    <>
      <Card>
        <Card.Header as="h5">Arbitrage</Card.Header>
        <Card.Body>
          <Card.Title>Uniswap V2 DEX's</Card.Title>
          <Card.Text>
            Arbitrage in MEV is taking advantage of price mismatches between decentralized exchanges to make riskless profit.
          </Card.Text>
        </Card.Body>
      </Card>
      { address ? (
        <Card>
          <Card.Header as="h5">USDC-USDT</Card.Header>
          <Card.Body>
          <Card.Title>Quickswap</Card.Title>
            <Card.Text>
              price here
            </Card.Text>
            <Card.Title>Uniswap V2</Card.Title>
            <Card.Text>
              price2 here
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <>No wallet connected. This page requires a wallet to query the blockchain.</>
      )}

  </>
  )
}

export default Arbitrage