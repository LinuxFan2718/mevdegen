import { Card, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import PairShow from './PairShow.js';
import PairRow from './PairRow.js';

function Arbitrage({address}) {
  const [gasResult, setGasResult] = useState({
    "safeLow": 0,
    "standard": 0,
    "fast": 0,
    "fastest": 0,
    "blockTime": 0,
    "blockNumber": 0
  })
  const [grossNumToken0, setGrossNumToken0] = useState(1000);

  useEffect(() => {
    fetch("https://gasstation-mainnet.matic.network")
      .then(res => res.json())
      .then(
        (result) => {
          setGasResult(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error);
        }
      )
  }, [])

  const exchange1 = {
    "pairAddress": '0x2cF7252e74036d1Da831d11089D326296e64a728',
    "token0": 'USDC',
    "token1": 'USDT',
    "baseUrl": "https://info.quickswap.exchange/#/pair/",
    "params": "",
    "name": 'Quickswap'
  };

  const exchange2 = {
    "pairAddress": '0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001',
    "token0": 'USDC',
    "token1": 'USDT',
    "baseUrl": "https://app.sushi.com/analytics/pools/",
    "params": "?chainId=137",
    "name": 'Sushiswap'
  };

  const onChangeNumToken0 = (event) => {
    const localGrossNumToken0string = event.target.value;
    const localGrossNumToken0 = Number(localGrossNumToken0string);
    setGrossNumToken0(localGrossNumToken0);
  };

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
        <Card.Body>
          <Card.Title>Gas Price</Card.Title>
          <Card.Text>
            {gasResult["fast"]} Gwei
          </Card.Text>
        </Card.Body>
      </Card>
      { address ? (
        <>
          <input value={grossNumToken0} onChange={onChangeNumToken0} />
          <Table>
            <tbody>
              <PairRow gasResult={gasResult} exchange1={exchange1} exchange2={exchange2} grossNumToken0={grossNumToken0} />
              <PairRow gasResult={gasResult} exchange1={exchange2} exchange2={exchange1} grossNumToken0={grossNumToken0} />
            </tbody>
          </Table>
        </>
      ) : (
        <>No wallet connected. This page requires a wallet to query the blockchain.</>
      )}
  </>
  )
}

export default Arbitrage
