import React, { useEffect, useMemo, useState } from 'react';
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";
import { digits, gasPerSwap, gweiFactor, dxAnswer, dyAnswer, roundUp } from './math.js'

function PairRow(props) {
  const reservesEth = props.reservesEth;
  const token0 = props.pair['token0'];
  const token1 = props.pair['token1'];
  const exchange1 = props.pair["exchanges"][0];
  const exchange2 = props.pair["exchanges"][1];
  const reserveFactor0 = props.pair["reserveFactor0"];
  const reserveFactor1 = props.pair["reserveFactor1"];

  const [reservesEx1, setReservesEx1] = useState({});
  const [reservesEx2, setReservesEx2] = useState([null]);
  const [stepTwo, setStepTwo] = useState(0);
  const [profit, setProfit] = useState(0);

  const myComponentStyle = {
    backgroundColor: (profit > 0) ? "lightgreen" : "lightcoral",
  }
  const transactionFee = useMemo(() => {
    return props.gasResult["fast"] * gweiFactor * gasPerSwap;
  }, [props.gasResult])

  useMemo(() => {
    const localLiquidityProviderFee1 = props.grossNumToken0 * 0.003;
    const localNetNumToken0 = props.grossNumToken0 - localLiquidityProviderFee1;
    const localStepOne = dyAnswer(localNetNumToken0, reservesEx1);
    const localLiquidityProviderFee2 = localStepOne * 0.003;
    const localStepOneNetFee = localStepOne - localLiquidityProviderFee2;
    const localStepTwo = dxAnswer(localStepOneNetFee, reservesEx2);
    setStepTwo(localStepTwo);
  }, [props.grossNumToken0, reservesEx1, reservesEx2]);

  useMemo(() => {
    setProfit(stepTwo - props.grossNumToken0);
  }, [stepTwo, props.grossNumToken0]);

  useEffect(() => {
    const pair_abi = pairAbi.abi;
    const getReserves = async () => {
      try {
        let url = "https://ethereum.mevdegen.com/v1/mainnet";
        let provider = new ethers.providers.JsonRpcProvider(url);

        // exchange 1
        const exchange1PairContract = new ethers.Contract(
          exchange1["pairAddress"],
          pair_abi,
          provider);

        const getReserves1Result = await exchange1PairContract.getReserves();

        const xex1 = getReserves1Result.reserve0.div(reserveFactor0);
        const yex1 = getReserves1Result.reserve1.div(reserveFactor1);
        const xoveryex1 = xex1.toNumber() / yex1.toNumber();
        const yoverxex1 = yex1.toNumber() / xex1.toNumber();

        setReservesEx1(
          {
            "x": xex1,
            "y": yex1,
            "xovery": xoveryex1,
            "yoverx": yoverxex1
          }
        );

        // exchange 2
        const exchange2PairContract = new ethers.Contract(
          exchange2["pairAddress"],
          pair_abi,
          provider);

        const getReserves2Result = await exchange2PairContract.getReserves();

        const xex2 = getReserves2Result.reserve0.div(reserveFactor0);
        const yex2 = getReserves2Result.reserve1.div(reserveFactor1);
        const xoveryex2 = xex2.toNumber() / yex2.toNumber();
        const yoverxex2 = yex2.toNumber() / xex2.toNumber();

        setReservesEx2(
          {
            "x": xex2,
            "y": yex2,
            "xovery": xoveryex2,
            "yoverx": yoverxex2
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    getReserves();
  }, [exchange1, exchange2, reserveFactor0, reserveFactor1])

  return(
    <tr>
      <td>
        {exchange1["name"]}  ➡️ {exchange2["name"]}
      </td>
      <td>
        {token0} ➡️ {token1} ➡️
      </td>
      <td style={myComponentStyle}>
        {roundUp(profit - 2 * transactionFee * reservesEth["ethPrice"], digits)} {token0}
      </td>
      <td style={myComponentStyle}>
        {roundUp(100 * (profit - 2 * transactionFee * reservesEth["ethPrice"]) / props.grossNumToken0, digits)} %
      </td>
    </tr>
  )
}

export default PairRow
