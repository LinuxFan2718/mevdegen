import { Card } from 'react-bootstrap';
import React from 'react';
import Pair from './Pair.js';

function Arbitrage({address}) {
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
        <Pair />
      ) : (
        <>No wallet connected. This page requires a wallet to query the blockchain.</>
      )}
  </>
  )
}

export default Arbitrage
