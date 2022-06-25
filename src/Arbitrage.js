import { Card } from 'react-bootstrap';
import React from 'react';
import Pair from './Pair.js';

function Arbitrage({address}) {
  return(
    <>
      <Card>
        <Card.Header as="h5">Arbitrage</Card.Header>
        <Card.Body>
          <Card.Title> Price comparison between Uniswap V2 clones</Card.Title>
          <Card.Text>
            Use this page to search for arbitrage opportunities between Uniswap V2 clones on Polygon.
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
