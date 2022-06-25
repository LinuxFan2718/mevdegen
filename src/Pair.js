import { Button, Card } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";

function Pair() {
  const [reservesEx1, setReservesEx1] = useState(['loading...', 'loading...', 'loading...', 'loading...']);
  const [loading, setLoading] = useState(0);
  // exchange1 = quickswap
  const exchange1_pair_address = '0x2cF7252e74036d1Da831d11089D326296e64a728';
  const exchange1_base_url = "https://info.quickswap.exchange/#/pair/";
  const exchange1_params = "";
  const exchange1_name = 'Quickswap';
  // exchange2 = sushiswap
  const exchange2_pair_address = '0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001';
  const exchange2_base_url = "https://app.sushi.com/analytics/pools/"
  const exchange2_params = "?chainId=137";
  const exchange2_name = 'Sushiswap';
  // shared between exchange 1 and 2
  const token0 = 'USDC';
  const token1 = 'USDT';
  const pair_name = token0 + '-' + token1;
  
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
            exchange1_pair_address,
            quickswap_pair_abi,
            signer);
  
          const getReservesResult = await quickswapPairContract.getReserves();
          const reserve0 = getReservesResult.reserve0;
          const reserve1 = getReservesResult.reserve1;
          const ratio = reserve0.toNumber() / reserve1.toNumber();
          const productK = reserve0.mul(reserve1).toString();

          const kLastResult = await quickswapPairContract.kLast();
          const kLast = kLastResult.toString();

          setReservesEx1([reserve0, reserve1, ratio, kLast, productK]);
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
      <Card.Header as="h5">{pair_name}</Card.Header>
      <Card.Body>
      <Card.Title><Button href={exchange1_base_url+exchange1_pair_address+exchange1_params}>{exchange1_name}</Button></Card.Title>
        <Card.Text>
         {token0} {reservesEx1[0].toString()}
        </Card.Text>
        <Card.Text>
          {token1} {reservesEx1[1].toString()}
        </Card.Text>
        <Card.Text>
          {token0} / {token1} = {reservesEx1[2]}
        </Card.Text>
        <Card.Text>
          x * y= {reservesEx1[3]}
        </Card.Text>
        <Card.Text>
          last k = {reservesEx1[4]}
        </Card.Text>
        <Card.Text>
          x * y - last k = {reservesEx1[3] - reservesEx1[4]}
        </Card.Text>
        <Button onClick={triggerLoading}>Refresh</Button>
      </Card.Body>
  </Card>
  )
}

export default Pair
