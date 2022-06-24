import { Button, Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
// import factoryAbi from './utils/IUniswapV2Factory.json'
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";

function Arbitrage({address}) {
  //   const quickswap_factory_contract_address = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32';
  //   const quickswap_factory_contract_abi = factoryAbi.abi;
  const [reserves, setReserves] = useState(['loading...', 'loading...', 'loading...']);
  const [loading, setLoading] = useState(false);

  const quickswap_pair_usdc_usdt_address = '0x2cF7252e74036d1Da831d11089D326296e64a728';
  const quickswap_base_url = "https://info.quickswap.exchange/#/pair/"

  const triggerLoading = () => {
    setLoading(true);
  }

  useEffect(() => {
    const quickswap_pair_abi = pairAbi.abi;
    setLoading(false);
    const getReserves = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const quickswapPairContract = new ethers.Contract(
            quickswap_pair_usdc_usdt_address,
            quickswap_pair_abi,
            signer);
  
          const result = await quickswapPairContract.getReserves();
          const reserve0 = result.reserve0;
          const reserve1 = result.reserve1;
          const ratio = reserve0.toNumber() / reserve1.toNumber();
          console.log("ratio", ratio)
  
          setReserves([reserve0, reserve1, ratio]);
        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
        console.log(error);
      }
    }

    getReserves();
  }, [loading])
  
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
          <Card.Title><Button href={quickswap_base_url+quickswap_pair_usdc_usdt_address}>Quickswap</Button></Card.Title>
            <Card.Text>
              USDC reserves {reserves[0].toString()}
            </Card.Text>
            <Card.Text>
              USDT reserves {reserves[1].toString()}
            </Card.Text>
            <Card.Text>
              USDC / USDT = {reserves[2]}
            </Card.Text>
            <Button onClick={triggerLoading}>Refresh</Button>
          </Card.Body>
        </Card>
      ) : (
        <>No wallet connected. This page requires a wallet to query the blockchain.</>
      )}

  </>
  )
}

export default Arbitrage