import { Button, Table, Placeholder } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";

function Pair() {
  const digits = 4;
  function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }

  // X = ex1. Y = ex2
  function dyAnswer(dx, reservesEx) {
    const xbignum = reservesEx["x"];
    const ybignum = reservesEx["y"];
    if (!xbignum || !ybignum) {
      return null;
    }
    const x = xbignum.toNumber();
    const y = ybignum.toNumber();
    const dy = (y * dx) / (x + dx);
    return dy;
  }

  const [reservesEx1, setReservesEx1] = useState({});
  const [reservesEx2, setReservesEx2] = useState([null]);
  const [numToken0, setNumToken0] = useState(1000);
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

          const xex1 = getReserves1Result.reserve0;
          const yex1 = getReserves1Result.reserve1;
          const xoveryex1 = xex1.toNumber() / yex1.toNumber();

          setReservesEx1(
            {
              "x": xex1,
              "y": yex1,
              "xovery": xoveryex1
            }
          );

          // exchange 2
          const exchange2PairContract = new ethers.Contract(
            exchange2_pair_address,
            pair_abi,
            signer);
  
          const getReserves2Result = await exchange2PairContract.getReserves();

          const reserve0ex2 = getReserves2Result.reserve0;
          const reserve1ex2 = getReserves2Result.reserve1;
          const ratio01Ex2 = reserve0ex2.toNumber() / reserve1ex2.toNumber();

          setReservesEx2([ratio01Ex2]);          

          
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
      <Table bordered>
        <thead>
          <tr>
            <th>Exchange</th>
            <th>{token0} / {token1}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href={exchange1_base_url+exchange1_pair_address+exchange1_params}>{exchange1_name}</a></td>
            <td>
              {reservesEx1["xovery"] && roundUp(reservesEx1["xovery"], digits)}
              {!reservesEx1["xovery"] && <Placeholder animation="glow"><Placeholder xs={12} /></Placeholder>}
            </td>

          </tr>
          <tr>
            <td><a href={exchange2_base_url+exchange2_pair_address+exchange2_params}>{exchange2_name}</a></td>
            <td>
              {reservesEx2[0] && roundUp(reservesEx2[0], digits)}
              {!reservesEx2[0] && <Placeholder animation="glow"><Placeholder xs={12} /></Placeholder>}
              </td>

          </tr>
          <tr style={{backgroundColor: 'antiquewhite'}}>
            <td><strong>Gross Spread (before fees)</strong></td>
            <td>
              ${reservesEx1["xovery"] && reservesEx2[0] && roundUp(Math.abs(reservesEx1["xovery"] - reservesEx2[0])/reservesEx1["xovery"], digits)}
              {(!reservesEx1["xovery"] || !reservesEx2[0]) && <Placeholder animation="glow"><Placeholder xs={12} /></Placeholder>}
            </td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td><strong>{numToken0} {token1} nets (before fees)</strong></td>
            <td>{roundUp(dyAnswer(numToken0, reservesEx1), digits)} {token0}</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td><strong>Fees to trade $1000</strong></td>
            <td>👨‍💻 coming soon.</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td><strong>Flash loan fee for $1000</strong></td>
            <td>👨‍💻 coming soon.</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td><strong>Max Profit (after fees and gas)</strong></td>
            <td>👨‍💻 coming soon</td>
          </tr>
        </tbody>
      </Table>
      <Button onClick={triggerLoading}>Refresh {token0} / {token1}</Button>
    </>
  )
}

export default Pair
