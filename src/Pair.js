import { Button, Table, Placeholder } from 'react-bootstrap';
import React, { useEffect, useMemo, useState } from 'react';
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

  function dxAnswer(dy, reservesEx) {
    const xbignum = reservesEx["x"];
    const ybignum = reservesEx["y"];
    if (!xbignum || !ybignum) {
      return null;
    }
    const x = xbignum.toNumber();
    const y = ybignum.toNumber();
    const dx = (x * dy) / (y + dy);
    return dx;
  }

  const [reservesEx1, setReservesEx1] = useState({});
  const [reservesEx2, setReservesEx2] = useState([null]);
  const [grossNumToken0, setGrossNumToken0] = useState(1000);
  const [netNumToken0, setNetNumToken0] = useState(997);
  const [liquidityProviderFee1, setLiquidityProviderFee1] = useState(3);
  const [liquidityProviderFee2, setLiquidityProviderFee2] = useState(2.99);
  const [loading, setLoading] = useState(0);
  const [stepOne, setStepOne] = useState(0);
  const [stepOneNetFee, setStepOneNetFee] = useState(0);
  const [stepTwo, setStepTwo] = useState(0);

  const onChangeNumToken0 = (event) => {
    const localGrossNumToken0string = event.target.value;
    const localGrossNumToken0 = Number(localGrossNumToken0string);
    setGrossNumToken0(localGrossNumToken0);
  };



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

  useMemo(() => {
    const localLiquidityProviderFee1 = grossNumToken0 * 0.003;
    setLiquidityProviderFee1(localLiquidityProviderFee1);

    const localNetNumToken0 = grossNumToken0 - localLiquidityProviderFee1;
    setNetNumToken0(localNetNumToken0);

    const localStepOne = dyAnswer(localNetNumToken0, reservesEx1);
    setStepOne(localStepOne);

    const localLiquidityProviderFee2 = localStepOne * 0.003;
    setLiquidityProviderFee2(localLiquidityProviderFee2);

    const localStepOneNetFee = localStepOne - localLiquidityProviderFee2;
    setStepOneNetFee(localStepOneNetFee);

    const localStepTwo = dxAnswer(localStepOneNetFee, reservesEx2);
    setStepTwo(localStepTwo);
  }, [grossNumToken0, reservesEx1, reservesEx2]);

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

          const xex2 = getReserves2Result.reserve0;
          const yex2 = getReserves2Result.reserve1;
          const xoveryex2 = xex2.toNumber() / yex2.toNumber();

          setReservesEx2(
            {
              "x": xex2,
              "y": yex2,
              "xovery": xoveryex2
            }
          );   
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
              {reservesEx2["xovery"] && roundUp(reservesEx2["xovery"], digits)}
              {!reservesEx2["xovery"] && <Placeholder animation="glow"><Placeholder xs={12} /></Placeholder>}
            </td>
          </tr>

          <tr style={{backgroundColor: 'antiquewhite'}}>
            <td>Spread</td>
            <td>
              {reservesEx1["xovery"] && reservesEx2["xovery"] && roundUp(Math.abs(reservesEx1["xovery"] - reservesEx2["xovery"])/reservesEx1["xovery"], digits)}
              {(!reservesEx1["xovery"] || !reservesEx2["xovery"]) && <Placeholder animation="glow"><Placeholder xs={12} /></Placeholder>}
            </td>
          </tr>

          <tr>
            <td colSpan={2}><strong>Arbitrage calculator</strong></td>
          </tr>

          <tr>
            <td>Number of {token0} to buy</td>
            <td>
              <input value={grossNumToken0} onChange={onChangeNumToken0} />
            </td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td>Liquidity Provider Fee 1</td>
            <td>{roundUp(liquidityProviderFee1, digits)} {token0}</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td>Net {token0} swaped</td>
            <td>{roundUp(netNumToken0, digits)} {token0}</td>
          </tr>


          <tr style={{backgroundColor: 'honeydew'}}>
            <td>swap <strong>{netNumToken0} {token0}</strong> for</td>
            <td>{roundUp(stepOne, digits)} {token1}</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td>Liquidity Provider Fee 2</td>
            <td>{roundUp(liquidityProviderFee2, digits)} {token1}</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td>swap <strong>{roundUp(stepOneNetFee, digits)} {token1}</strong> for</td>
            <td>{roundUp(stepTwo, digits)} {token0}</td>
          </tr>

          <tr style={{backgroundColor: 'honeydew'}}>
            <td>Trade profit/loss (before gas fee)</td>
            <td>{roundUp(stepTwo - grossNumToken0, digits)} {token0}</td>
          </tr>


        </tbody>
      </Table>
      <Button onClick={triggerLoading}>Refresh {token0} / {token1}</Button>
    </>
  )
}

export default Pair
