import { Button, Table, Placeholder } from 'react-bootstrap';
import React, { useEffect, useMemo, useState } from 'react';
import pairAbi from './utils/IUniswapV2Pair.json'
import { ethers } from "ethers";
import { digits, gasPerSwap, gweiFactor, dxAnswer, dyAnswer, roundUp } from './math.js'

function PairRow(props) {
  // quickswap MATIC USDC pair to get US$ price for MATIC
  const quickswap_matic_usdc_address = '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827';

  const [reservesEx1, setReservesEx1] = useState({});
  const [reservesEx2, setReservesEx2] = useState([null]);
  
  const [netNumToken0, setNetNumToken0] = useState(997);
  const [liquidityProviderFee1, setLiquidityProviderFee1] = useState(3);
  const [liquidityProviderFee2, setLiquidityProviderFee2] = useState(2.99);
  const [loading, setLoading] = useState(0);
  const [stepOne, setStepOne] = useState(0);
  const [stepOneNetFee, setStepOneNetFee] = useState(0);
  const [stepTwo, setStepTwo] = useState(0);
  const [profit, setProfit] = useState(0);
  const [reservesMatic, setReservesMatic] = useState(
    {
      "matic": 0,
      "usdc": 0,
      "maticPrice": 0
    }
  );

  const myComponentStyle = {
    backgroundColor: (profit > 0) ? "lightgreen" : "lightcoral",
  }


  
  const triggerLoading = () => {
    setLoading(loading+1);
  }

  const transactionFee = useMemo(() => {
    return props.gasResult["fast"] * gweiFactor * gasPerSwap;
  }, [props.gasResult])

  useMemo(() => {
    const localLiquidityProviderFee1 = props.grossNumToken0 * 0.003;
    setLiquidityProviderFee1(localLiquidityProviderFee1);

    const localNetNumToken0 = props.grossNumToken0 - localLiquidityProviderFee1;
    setNetNumToken0(localNetNumToken0);

    const localStepOne = dyAnswer(localNetNumToken0, reservesEx1);
    setStepOne(localStepOne);

    const localLiquidityProviderFee2 = localStepOne * 0.003;
    setLiquidityProviderFee2(localLiquidityProviderFee2);

    const localStepOneNetFee = localStepOne - localLiquidityProviderFee2;
    setStepOneNetFee(localStepOneNetFee);

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
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();

          // exchange 1
          const exchange1PairContract = new ethers.Contract(
            props.exchange1["pairAddress"],
            pair_abi,
            signer);
  
          const getReserves1Result = await exchange1PairContract.getReserves();

          const xex1 = getReserves1Result.reserve0;
          const yex1 = getReserves1Result.reserve1;
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
            props.exchange2["pairAddress"],
            pair_abi,
            signer);
  
          const getReserves2Result = await exchange2PairContract.getReserves();

          const xex2 = getReserves2Result.reserve0;
          const yex2 = getReserves2Result.reserve1;
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

          // get MATIC price
          const quickswapMaticPairContract = new ethers.Contract(
            quickswap_matic_usdc_address,
            pair_abi,
            signer);

          const getReservesMaticResult = await quickswapMaticPairContract.getReserves();

          // don't know why matic is 10**12 larger than usdc
          const maticReserves = getReservesMaticResult.reserve0.div(10**12);
          const usdcReserves = getReservesMaticResult.reserve1;
          const maticPrice = usdcReserves.toNumber() / maticReserves.toNumber()

          setReservesMatic(
            {
              "matic": maticReserves,
              "usdc": usdcReserves,
              "maticPrice": maticPrice
            }
          )

        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
        console.log(error);
      }
    }

    getReserves();
  }, [loading, props.exchange1, props.exchange2])

  return(
    <tr>
      <td>
        {props.exchange1["name"]}  ➡️ {props.exchange2["name"]}
      </td>
      <td>
        {props.exchange2["token0"]} ➡️ {props.exchange2["token1"]} ➡️
      </td>
      <td style={myComponentStyle}>
        {roundUp(profit - 2 * transactionFee * reservesMatic["maticPrice"], digits)} {props.exchange2["token0"]}
      </td>
    </tr>
  )
}

export default PairRow
