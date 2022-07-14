import { Card, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import PairRow from './PairRow.js';

function Arbitrage() {
  const [gasResult, setGasResult] = useState({
    "safeLow": 0,
    "standard": 0,
    "fast": 0,
    "fastest": 0,
    "blockTime": 0,
    "blockNumber": 0
  })
  const [grossNumToken0, setGrossNumToken0] = useState(1000);

  // migrate this to ethereum mainnet
  useEffect(() => {
    fetch("https://gasstation-mainnet.matic.network")
      .then(res => res.json())
      .then(
        (result) => {
          setGasResult(result);
        },
        (error) => {
          console.error(error);
        }
      )
  }, [])

  // https://v2.info.uniswap.org/pair/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc
  const pair1 = {
    "token0": 'USDC',
    "token1": 'WETH',
    "reserveFactor": 10**12,
    "exchanges": [
      {
        "pairAddress": '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
        "baseUrl": "https://v2.info.uniswap.org/pair/",
        "params": "",
        "name": 'Uniswap'
      },
      {
        // https://app.sushi.com/analytics/pools/0x397ff1542f962076d0bfe58ea045ffa2d347aca0?chainId=1
        "pairAddress": '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
        "baseUrl": "https://app.sushi.com/analytics/pools/",
        "params": "?chainId=1",
        "name": 'Sushiswap'
      }
    ]
  }

  const pairs = [pair1]

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
            clones on Ethereum Mainnet.
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
    </>
  )
}

export default Arbitrage
