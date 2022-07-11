import { Card, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
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

  const pair1 = {
    "token0": 'USDC',
    "token1": 'USDT',
    "reserveFactor": 1,
    "exchanges": [
      {
        "pairAddress": '0x2cF7252e74036d1Da831d11089D326296e64a728',
        "baseUrl": "https://info.quickswap.exchange/#/pair/",
        "params": "",
        "name": 'Quickswap'
      },
      {
        "pairAddress": '0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001',
        "baseUrl": "https://app.sushi.com/analytics/pools/",
        "params": "?chainId=137",
        "name": 'Sushiswap'
      }
    ]
  }

  const pair2 = {
    "token0": 'WMATIC',
    "token1": 'USDC',
    "reserveFactor": 10**12,
    "exchanges": [
      {
        "pairAddress": '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827',
        "baseUrl": "https://info.quickswap.exchange/#/pair/",
        "params": "",
        "name": 'Quickswap'
      },
      {
        "pairAddress": '0xcd353f79d9fade311fc3119b841e1f456b54e858',
        "baseUrl": "https://app.sushi.com/analytics/pools/",
        "params": "?chainId=137",
        "name": 'Sushiswap'
      }
    ]
  }

  const pairs = [pair1, pair2]

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
            Use this page to search for arbitrage opportunities between Uniswap V2 
            clones on Polygon.
          </Card.Text>
        </Card.Body>
        <Card.Body>
          <Card.Title>Gas Price</Card.Title>
          <Card.Text>
            {gasResult["fast"]} Gwei
          </Card.Text>
          <Card.Title>Number of tokens to buy</Card.Title>
          <Card.Text>
            <input value={grossNumToken0} onChange={onChangeNumToken0} />
          </Card.Text>
        </Card.Body>
      </Card>
      { address ? (
        <>
          <Table>
            <tbody>
              {pairs.map(function(pair, index){
                return <PairRow
                          key={index}
                          gasResult={gasResult}
                          grossNumToken0={grossNumToken0}
                          pair={pair}
                        />;
              })}
              
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
