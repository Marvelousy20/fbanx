import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { utils } from "@project-serum/anchor";
import { BiCaretDown } from "react-icons/bi";
import { useProgram } from "../../hooks/useProgram";
import {Connection,PublicKey} from '@solana/web3.js';
import * as tk from "@solana/spl-token"
import * as anchor from "@project-serum/anchor";


import Usdt from "cryptocurrency-icons/svg/color/usdt.svg";
import Usdc from "cryptocurrency-icons/svg/color/usdc.svg";
import Sol from "cryptocurrency-icons/svg/color/sol.svg";
import Btc from "cryptocurrency-icons/svg/color/btc.svg";
import { getAccount, getMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;

const utf8 = utils.bytes.utf8

interface TokenProps {
  id: number;
  name: string;
}

const tokens = [
  {
    id: 1,
    name: "FBNX/USDT",
    poolAddress: "",
    subToken: [
      { id: 0, tokenName: "FBNX/USDT", name: "tokens" },
      { id: 1, tokenName: "FBNX", icon: Btc, name: "tokens" },
      { id: 2, tokenName: "USDT", icon: Usdt, name: "tokens" },
    ],
  },

  {
    id: 2,
    name: "FBNX/USDC",
    poolAddress: "",
    subToken: [
      { id: 0, tokenName: "FBNX/USDC", name: "tokens" },
      { id: 1, tokenName: "FBNX", icon: Btc, name: "tokens" },
      { id: 2, tokenName: "USDC", icon: Usdc, name: "tokens" },
    ],
  },
  {
    id: 3,
    name: "FBNX/SOL",
    poolAddress: "",
    subToken: [
      { id: 0, tokenName: "FBNX/SOL", name: "tokens" },
      { id: 1, tokenName: "FBNX", icon: Btc, name: "tokens" },
      { id: 2, tokenName: "SOL", icon: Sol, name: "tokens" },
    ],
  },
];

// const mintPool = [{
//   id:1,
//   name : 'FBNX/USDT',
//   mint1 :
// }]

const Liquidity = () => {
  const [selectedTokens, setSelectedTokens] = useState(tokens[0]);

  const [token, setToken] = useState(selectedTokens.subToken);

  const [selectedTokenName, setSelectedTokenName] = useState(token[0].name);

  const handleTokenName = (e: React.FormEvent) => {
    setSelectedTokenName((e.target as HTMLInputElement).value);
  };

  const { program, wallet, connection } = useProgram();

  const depositAll = async () => {
    if (!wallet){
        return
    }
    if (!program){
        return
    }

    const [amm,ammBump] = await PublicKey.findProgramAddress(
      [utf8.encode("amm"),mint0.toBuffer(),mint1.toBuffer()],
      program.programId
    );

    const [poolAuthority,bump] = await PublicKey.findProgramAddress(
      [utf8.encode("authority"),amm.toBuffer()],
      program.programId
    );

    const [vaultSource,vault0bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault0"),amm.toBuffer()],
      program.programId
    );

    const [vaultDest,vault1bump] =  await PublicKey.findProgramAddress(
      [utf8.encode("vault1"),amm.toBuffer()],
      program.programId
    );

    const [poolMint,poolBump] = await PublicKey.findProgramAddress(
      [utf8.encode("pool_mint"),amm.toBuffer()],
      program.programId
    );

    let sourceTokenAddress = await tk.getAssociatedTokenAddress(
      mint0,
      wallet.publicKey,
    );

    let destTokenAddress = await tk.getAssociatedTokenAddress(
      mint1,
      wallet.publicKey,
    );

    let liqTokenAddress = await tk.getAssociatedTokenAddress(
      poolMint,
      wallet.publicKey,
    );

    const poolTokenAmount = 10000

    const poolMintInfo = await getMint(connection,poolMint);
    const supply = Number(poolMintInfo.supply);
    const swapTokenA = await getAccount(connection,vaultSource);
    const tokenAAmount = Math.floor(
      (Number(swapTokenA.amount) * poolTokenAmount / supply )
    );

    const swapTokenB = await getAccount(connection,vaultDest);
    const tokenBAmount = Math.floor(
      (Number(swapTokenB.amount) * poolTokenAmount )
    )


    await program.rpc.depositAll(
      new anchor.BN(poolTokenAmount),
      new anchor.BN(tokenAAmount),
      new anchor.BN(tokenBAmount),
      {
      accounts : {
          amm : amm,
          poolAuthority :poolAuthority ,
          sourceAInfo : sourceTokenAddress, //user Token account A
          sourceBInfo : destTokenAddress, //user Token account B
          vaultTokenA : vaultSource ,
          vaultTokenB : vaultDest,
          poolMint :poolMint,
          destination : liqTokenAddress ,
          owner : wallet.publicKey ,
          tokenProgram : TOKEN_PROGRAM_ID, 
      }
  })
  //
  const depositSingleA = async() => {

    // Pool token amount to deposit on one side
    const depositAmount = 10000;


    const tradingTokensToPoolTokens = (
      sourceAmount: number,
      swapSourceAmount: number,
      poolAmount: number
    ): number => {
      const tradingFee =
        (sourceAmount / 2) * (TRADING_FEE_NUMERATOR / TRADING_FEE_DENOMINATOR);
      const sourceAmountPostFee = sourceAmount - tradingFee;
      const root = Math.sqrt(sourceAmountPostFee / swapSourceAmount + 1);
      return Math.floor(poolAmount * (root - 1));
    };

    const poolMintInfo = await getMint(connection,poolMint);
    const supply = Number(poolMintInfo.supply);
    const swapTokenA = await getAccount(connection,vaultSource);
    const poolTokenAAmount = tradingTokensToPoolTokens(
      depositAmount,
      Number(swapTokenA.amount),
      supply
    );

    // const swapTokenB = await getAccount(connection,vaultDest);

    // const poolTokenBAmount = tradingTokensToPoolTokens(
    //   depositAmount,
    //   Number(swapTokenB.amount),
    //   supply
    // );

    // Depositing token A into swap
    await program.rpc.depositSingle(
      new anchor.BN(depositAmount),
        new anchor.BN(poolTokenAAmount),
      {
      accounts : {
          amm : amm,
          authority :poolAuthority ,
          owner : wallet.publicKey ,
          source : sourceTokenAddress,
          swapTokenA :vaultSource ,
          swapTokenB : vaultDest,
          poolMint :poolMint,
          destination : liqTokenAddress  ,
          tokenProgram : TOKEN_PROGRAM_ID, 
      }
    })
  }

  const depositSingleB = async() => {

    // Pool token amount to deposit on one side
    const depositAmount = 10000;


    const tradingTokensToPoolTokens = (
      sourceAmount: number,
      swapSourceAmount: number,
      poolAmount: number
    ): number => {
      const tradingFee =
        (sourceAmount / 2) * (TRADING_FEE_NUMERATOR / TRADING_FEE_DENOMINATOR);
      const sourceAmountPostFee = sourceAmount - tradingFee;
      const root = Math.sqrt(sourceAmountPostFee / swapSourceAmount + 1);
      return Math.floor(poolAmount * (root - 1));
    };

    const poolMintInfo = await getMint(connection,poolMint);
    const supply = Number(poolMintInfo.supply);
    // const swapTokenA = await getAccount(connection,vaultSource);
    // const poolTokenAAmount = tradingTokensToPoolTokens(
    //   depositAmount,
    //   Number(swapTokenA.amount),
    //   supply
    // );

    const swapTokenB = await getAccount(connection,vaultDest);

    const poolTokenBAmount = tradingTokensToPoolTokens(
      depositAmount,
      Number(swapTokenB.amount),
      supply
    );

    // Depositing token B into swap
    await program.rpc.depositSingle(
      new anchor.BN(depositAmount),
        new anchor.BN(poolTokenBAmount),
      {
      accounts : {
          amm : amm,
          authority :poolAuthority ,
          owner : wallet.publicKey ,
          source : sourceTokenAddress,
          swapTokenA :vaultSource ,
          swapTokenB : vaultDest,
          poolMint :poolMint,
          destination : liqTokenAddress  ,
          tokenProgram : TOKEN_PROGRAM_ID, 
      }
    })
  }

}

  //   const handleTokenChange = (id: number) => {
  //     const newItem = [...token]

  //     newItem.map((item) => {
  //         newItem[id].id = item.id
  //         newItem[id].icon = item.icon
  //         newItem[id].name = item.name
  //     })

  //     console.log(newItem)
  //     setToken(newItem)
  //   }



  return (
    <div className="fixed inset-0 overflow-y-auto mt-10">
      <div className="min-h-full flex justify-center items-center max-w-md mx-auto relative">
        <div
          style={{
            background:
              "linear-gradient(107.53deg,#02f1ff -7.25%,#4839ff 46.29%,#e902b6 108.39%)",
          }}
          className="w-full rounded-3xl pt-[2.3px] p-[2px]"
        >
          <div
            style={{
              background:
                "linear-gradient(140.14deg, rgba(0, 182, 191, 0.15) 0%, rgba(27, 22, 89, 0.1) 86.61%), linear-gradient(321.82deg, #18134D 0%, #1B1659 100%",
            }}
            className="h-full rounded-3xl p-4"
          >
            <form>
              <p className="font-bold mb-4">Liquidity Pool</p>
              {/* From */}

              <div className="bg-[#141041] relative p-2 w-full rounded-2xl">
                <div className="flex relative w-full justify-between">
                  <div className="w-full">
                    <div className="mb-2">
                      <Listbox
                        value={selectedTokens}
                        onChange={setSelectedTokens}
                      >
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg py-2 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span className="truncate flex items-center justify-between">
                              {selectedTokens.name} <BiCaretDown />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute bg-[#126499] z-[1000] mt-1 max-h-60 w-full overflow-auto rounded-md text-white py-1 text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
                              {tokens.map((token, id) => (
                                <Listbox.Option
                                  key={id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 flex text-left pl-4 ${
                                      active ? "" : ""
                                    }`
                                  }
                                  value={token}
                                >
                                  <div>{token.name}</div>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                </div>
                <div>
                  {selectedTokens.subToken.map((item) => (
                    <div key={item.id} onChange={handleTokenName}>
                      <input
                        type="radio"
                        value={item.tokenName}
                        name={item.name}
                        id={item.id.toString()}
                      />{" "}
                      <label htmlFor={item.id.toString()}>
                        Add {item.tokenName}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="flex justify-between opacity-60 mb-2">
                    <p>Amount</p>
                    <p>
                      Available <b>0</b> {selectedTokenName}
                    </p>
                  </div>

                  <div>
                    <div className="w-full flex mb-2">
                      <input
                        type="number"
                        placeholder="1000"
                        className="bg-transparent border outline-none w-2/3 p-2 "
                      />

                      <div className="border w-1/3 flex items-center justify-center">
                        {}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-[#512DA8] px-3 py-1 rounded hover:bg-opacity-80"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="flex justify-center bg-[#512DA8] w-full mt-6 py-3 font-bold rounded-[20px] hover:bg-opacity-80">
                Add Liquidity
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
