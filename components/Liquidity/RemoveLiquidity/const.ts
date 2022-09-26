import * as Web3 from "@solana/web3.js";

import Usdt from "cryptocurrency-icons/svg/color/usdt.svg";
import Usdc from "cryptocurrency-icons/svg/color/usdc.svg";
import Sol from "cryptocurrency-icons/svg/color/sol.svg";
import Btc from "cryptocurrency-icons/svg/color/btc.svg";
import logo from "../../../public/logo.png";

// FBNX/USDT
export const fbanxUsdt = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);

export const fbnx = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);

export const usdt = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);

// FBNX/USDC
export const fbanxUsdc = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);
export const usdc = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);

// FBNX/SOL
export const fbanxSol = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);
export const sol = new Web3.PublicKey(
  "5esbBc5dPwN3EXtq1VN7MfeM6idJTXCU3CUTphCWURi4"
);

export const tokens = [
  {
    id: 1,
    name: "FBNX/USDT",
    poolAddress: "",
    subToken: [
      {
        id: 0,
        tokenName: "FBNX/USDT",
        // icon: Btc,
        name: "tokens",
        tokenAddress: fbanxUsdt,
      },
      {
        id: 1,
        tokenName: "FBNX",
        icon: logo,
        name: "tokens",
        tokenAddress: fbnx,
      },
      {
        id: 2,
        tokenName: "USDT",
        icon: Usdt,
        name: "tokens",
        tokenAddress: usdt,
      },
    ],
  },

  {
    id: 2,
    name: "FBNX/USDC",
    poolAddress: "",
    subToken: [
      {
        id: 0,
        tokenName: "FBNX/USDC",
        // icon: Btc,
        name: "tokens",
        tokenAddress: fbanxUsdc,
      },
      {
        id: 1,
        tokenName: "FBNX",
        icon: logo,
        name: "tokens",
        tokenAddress: fbnx,
      },
      {
        id: 2,
        tokenName: "USDC",
        icon: Usdc,
        name: "tokens",
        tokenAddress: usdc,
      },
    ],
  },
  {
    id: 3,
    name: "FBNX/SOL",
    poolAddress: "",
    subToken: [
      {
        id: 0,
        tokenName: "FBNX/SOL",
        // icon: Btc,
        name: "tokens",
        tokenAddress: fbanxSol,
      },
      {
        id: 1,
        tokenName: "FBNX",
        icon: logo,
        name: "tokens",
        tokenAddress: fbnx,
      },
      {
        id: 2,
        tokenName: "SOL",
        icon: Sol,
        name: "tokens",
        tokenAddress: sol,
      },
    ],
  },
];
