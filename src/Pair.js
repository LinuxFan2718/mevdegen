import { Button, Card, Table } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";

function Pair() {
  const [reservesEx1, setReservesEx1] = useState(['loading...', 'loading...', 'loading...', 'loading...']);
  const [reservesEx2, setReservesEx2] = useState(['loading...', 'loading...', 'loading...', 'loading...']);
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
    const pair_abi = pairAbi.abi;
    const getReserves = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          // exchange 1
          const exchange1PairContract = new ethers.Contract(
            exchange1_pair_address,
            pair_abi,
            signer);
  
          const getReserves1Result = await exchange1PairContract.getReserves();
          const kLastResultEx1 = await exchange1PairContract.kLast();

          const reserve0ex1 = getReserves1Result.reserve0;
          const reserve1ex1 = getReserves1Result.reserve1;
          const ratioEx1 = reserve0ex1.toNumber() / reserve1ex1.toNumber();
          const productKex1 = reserve0ex1.mul(reserve1ex1).toString();
          const kLastEx1 = kLastResultEx1.toString();

          setReservesEx1([reserve0ex1, reserve1ex1, ratioEx1, kLastEx1, productKex1]);

          // exchange 2
          const exchange2PairContract = new ethers.Contract(
            exchange2_pair_address,
            pair_abi,
            signer);
  
          const getReserves2Result = await exchange2PairContract.getReserves();
          const kLastResultEx2 = await exchange2PairContract.kLast();

          const reserve0ex2 = getReserves2Result.reserve0;
          const reserve1ex2 = getReserves2Result.reserve1;
          const ratioEx2 = reserve0ex2.toNumber() / reserve1ex2.toNumber();
          const productKex2 = reserve0ex2.mul(reserve1ex2).toString();
          const kLastEx2 = kLastResultEx2.toString();

          setReservesEx2([reserve0ex2, reserve1ex2, ratioEx2, kLastEx2, productKex2]);          

          
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
      <strong>{token0} / {token1}</strong>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Exchange</th>
            <th>{token0} / {token1}</th>
            <th>{token0}</th>
            <th>{token1}</th>
            <th>x * y</th>
            <th>last k</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href={exchange1_base_url+exchange1_pair_address+exchange1_params}>{exchange1_name}</a></td>
            <td>{reservesEx1[2]}</td>
            <td>{reservesEx1[0].toString()}</td>
            <td>{reservesEx1[1].toString()}</td>
            <td>{reservesEx1[3]}</td>
            <td>{reservesEx1[4]}</td>
          </tr>
          <tr>
            <td><a href={exchange2_base_url+exchange2_pair_address+exchange2_params}>{exchange2_name}</a></td>
            <td>{reservesEx2[2]}</td>
            <td>{reservesEx2[0].toString()}</td>
            <td>{reservesEx2[1].toString()}</td>
            <td>{reservesEx2[3]}</td>
            <td>{reservesEx2[4]}</td>
          </tr>
        </tbody>
      </Table>
      <Button onClick={triggerLoading}>Refresh {token0} / {token1}</Button>
    </>
  )
}

export default Pair
