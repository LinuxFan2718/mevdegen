import { Button, Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";

function Pair() {
  const [reserves, setReserves] = useState(['loading...', 'loading...', 'loading...', 'loading...']);
  const [loading, setLoading] = useState(0);

  const quickswap_pair_usdc_usdt_address = '0x2cF7252e74036d1Da831d11089D326296e64a728';
  const quickswap_base_url = "https://info.quickswap.exchange/#/pair/"

  const triggerLoading = () => {
    setLoading(loading+1);
  }

  useEffect(() => {
    const quickswap_pair_abi = pairAbi.abi;
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
  
          const getReservesResult = await quickswapPairContract.getReserves();
          const reserve0 = getReservesResult.reserve0;
          const reserve1 = getReservesResult.reserve1;
          const ratio = reserve0.toNumber() / reserve1.toNumber();
          const productK = reserve0.mul(reserve1).toString();

          const kLastResult = await quickswapPairContract.kLast();
          const kLast = kLastResult.toString();

          setReserves([reserve0, reserve1, ratio, kLast, productK]);
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
        <Card.Text>
          k = {reserves[3]}
        </Card.Text>
        <Card.Text>
          x * y = {reserves[4]}
        </Card.Text>
        <Card.Text>
          k - x * y = {reserves[3] - reserves[4]}
        </Card.Text>
        <Button onClick={triggerLoading}>Refresh</Button>
      </Card.Body>
  </Card>
  )
}

export default Pair
