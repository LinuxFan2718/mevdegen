import { Card, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import PairRow from './PairRow.js';
import { roundUp } from './math.js';
import { ethers } from "ethers";
import pairAbi from './utils/IUniswapV2Pair.json'
const pairs = require('./utils/pairs.json')

function Arbitrage() {

  const [gasResult, setGasResult] = useState({
    "safeLow": 0,
    "standard": 0,
    "fast": 0,
    "fastest": 0,
    "blockTime": 0,
    "blockNumber": 0
  })
  // uniswap ETH USDC pair to get US$ price for ETH
  const uniswap_eth_usdc_address = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';

  const [reservesEth, setReservesEth] = useState(
    {
      "eth": 0,
      "usdc": 0,
      "ethPrice": 0
    }
  );
  const [grossNumToken0, setGrossNumToken0] = useState(1000);

  // migrate this to ethereum mainnet
  useEffect(() => {
    const pair_abi = pairAbi.abi;
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
      // get ETH price
      const getEthPrice = async () => {
        let url = "https://ethereum.mevdegen.com/v1/mainnet";
        let provider = new ethers.providers.JsonRpcProvider(url);

        const uniswapEthPairContract = new ethers.Contract(
          uniswap_eth_usdc_address,
          pair_abi,
          provider);
  
        const getReservesEthResult = await uniswapEthPairContract.getReserves();
  
        const usdcReserves = getReservesEthResult.reserve0;
        const ethReserves = getReservesEthResult.reserve1.div(10**12);
        const ethPrice = usdcReserves.toNumber() / ethReserves.toNumber()
  
        setReservesEth(
          {
            "eth": ethReserves,
            "usdc": usdcReserves,
            "ethPrice": ethPrice
          }
        )
      }
    getEthPrice();
  }, [])



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
          <Card.Title>Ether Price</Card.Title>
          <Card.Text>
            ${roundUp(reservesEth["ethPrice"], 2)}
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
                        reservesEth={reservesEth}
                      />;
            })}
            
          </tbody>
        </Table>
      </>
    </>
  )
}

export default Arbitrage
