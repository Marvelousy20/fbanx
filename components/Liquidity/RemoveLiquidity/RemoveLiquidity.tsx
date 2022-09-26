import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BiCaretDown } from "react-icons/bi";
import Image from "next/image";
import * as anchor from "@project-serum/anchor";
import { utils, web3 } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAccount,
  getMint,
  getAccount,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "../../../hooks/useProgram";
import * as tk from "@solana/spl-token";
import { feeAccount } from "../../../utils/constant";
import { tokens } from "./const";
const utf8 = utils.bytes.utf8;

const OWNER_WITHDRAW_FEE_NUMERATOR = 1;
const OWNER_WITHDRAW_FEE_DENOMINATOR = 6;
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;

interface TokenProps {
  id: number;
  tokenName: string;
  icon: any;
  name: string;
  tokenAddress: PublicKey;
}

const RemoveLiquidity = () => {
  const [selectedTokens, setSelectedTokens] = useState(tokens[0]);
  const [selectedSubTokens, setSelectedSubTokens] = useState(
    selectedTokens.subToken
  );
  const [selectedRadio, setSelectedRadio] = useState(
    selectedSubTokens[0].tokenName
  );

  const [token, setToken] = useState(selectedSubTokens[0]);
  const { program, wallet, connection } = useProgram();

  const [userAmount, setUserAmount] = useState(0);

  const handleValue = (e: React.FormEvent) => {
    setUserAmount(Number((e.target as HTMLInputElement).value));
  };

  const handleTokenName = (
    e: React.ChangeEvent<HTMLInputElement> | null,
    id: number
  ) => {
    if (e) {
      setSelectedRadio((e.target as HTMLInputElement).value);
    }

    let newToken = [...selectedSubTokens];
    let token = newToken.find((token) => token.id === id) as TokenProps;
    setToken(token);
  };

  // console.log("outside", selectedSubTokens);

  const handlePairChange = (value: any) => {
    setSelectedTokens(value);
    setSelectedSubTokens(value.subToken);
    // console.log("inside function", selectedSubTokens);
  };

  useEffect(() => {
    handleTokenName(null, 0);
    setSelectedRadio(selectedTokens.subToken[0].tokenName);
  }, [selectedTokens]);

  //withdraw A

  let mint0 = selectedSubTokens[1].tokenAddress;
  let mint1 = selectedSubTokens[2].tokenAddress;

  const withdrawA = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Remove A")

    if (!wallet) {
      return;
    }
    if (!program) {
      return;
    }

    const [amm, ammBump] = await PublicKey.findProgramAddress(
      [utf8.encode("amm"), mint0.toBuffer(), mint1.toBuffer()],
      program.programId
    );
    const [poolAuthority, bump] = await PublicKey.findProgramAddress(
      [utf8.encode("authority"), amm.toBuffer()],
      program.programId
    );
    const [vaultSource, vault0bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault0"), amm.toBuffer()],
      program.programId
    );
    const [vaultDest, vault1bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault1"), amm.toBuffer()],
      program.programId
    );
    const [poolMint, poolBump] = await PublicKey.findProgramAddress(
      [utf8.encode("pool_mint"), amm.toBuffer()],
      program.programId
    );
    let sourceTokenAddress = await tk.getAssociatedTokenAddress(
      mint0,
      wallet.publicKey
    );
    let destTokenAddress = await tk.getAssociatedTokenAddress(
      mint1,
      wallet.publicKey
    );
    let sourcePoolTokenAddress = await tk.getAssociatedTokenAddress(
      poolMint,
      wallet.publicKey
    );
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

    // Pool token amount to withdraw on one side
    const withdrawAmount = 50000;
    const roundingAmount = 1.0001; // make math a little easier

    const poolMintInfo = await getMint(connection, poolMint);
    const supply = Number(poolMintInfo.supply);
    const swapTokenA = await getAccount(connection, vaultSource);
    const swapTokenAPost = Number(swapTokenA.amount) - withdrawAmount;
    const poolTokenA = tradingTokensToPoolTokens(
      withdrawAmount,
      swapTokenAPost,
      supply
    );

    let adjustedPoolTokenA = poolTokenA * roundingAmount;

    adjustedPoolTokenA *=
      1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;

    const swapTokenB = await getAccount(connection, vaultDest);
    const swapTokenBPost = Number(swapTokenB.amount) - withdrawAmount;
    const poolTokenB = tradingTokensToPoolTokens(
      withdrawAmount,
      swapTokenBPost,
      supply
    );

    let adjustedPoolTokenB = poolTokenB * roundingAmount;

    adjustedPoolTokenB *=
      1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;

    await program.rpc.withdrawSingle({
      accounts: {
        amm: amm,
        authority: poolAuthority,
        owner: wallet.publicKey,
        source: sourcePoolTokenAddress,
        swapTokenA: vaultSource, //vault address 1
        swapTokenB: vaultDest, //vault address 2
        poolMint: poolMint,
        destination: destTokenAddress,
        feeAccount: feeAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  };

  //withdraw

  const withdrawB = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Remove B")

    if (!wallet) {
      return;
    }
    if (!program) {
      return;
    }

    const [amm, ammBump] = await PublicKey.findProgramAddress(
      [utf8.encode("amm"), mint0.toBuffer(), mint1.toBuffer()],
      program.programId
    );
    const [poolAuthority, bump] = await PublicKey.findProgramAddress(
      [utf8.encode("authority"), amm.toBuffer()],
      program.programId
    );
    const [vaultSource, vault0bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault0"), amm.toBuffer()],
      program.programId
    );
    const [vaultDest, vault1bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault1"), amm.toBuffer()],
      program.programId
    );
    const [poolMint, poolBump] = await PublicKey.findProgramAddress(
      [utf8.encode("pool_mint"), amm.toBuffer()],
      program.programId
    );
    let sourceTokenAddress = await tk.getAssociatedTokenAddress(
      mint0,
      wallet.publicKey
    );
    let destTokenAddress = await tk.getAssociatedTokenAddress(
      mint1,
      wallet.publicKey
    );
    let sourcePoolTokenAddress = await tk.getAssociatedTokenAddress(
      poolMint,
      wallet.publicKey
    );

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

    // Pool token amount to withdraw on one side
    const withdrawAmount = 50000;
    const roundingAmount = 1.0001; // make math a little easier

    const poolMintInfo = await getMint(connection, poolMint);
    const supply = Number(poolMintInfo.supply);
    const swapTokenA = await getAccount(connection, vaultSource);
    const swapTokenAPost = Number(swapTokenA.amount) - withdrawAmount;
    const poolTokenA = tradingTokensToPoolTokens(
      withdrawAmount,
      swapTokenAPost,
      supply
    );

    let adjustedPoolTokenA = poolTokenA * roundingAmount;

    adjustedPoolTokenA *=
      1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;

    const swapTokenB = await getAccount(connection, vaultDest);
    const swapTokenBPost = Number(swapTokenB.amount) - withdrawAmount;
    const poolTokenB = tradingTokensToPoolTokens(
      withdrawAmount,
      swapTokenBPost,
      supply
    );

    let adjustedPoolTokenB = poolTokenB * roundingAmount;

    adjustedPoolTokenB *=
      1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;

    await program.rpc.withdrawSingle(
      new anchor.BN(withdrawAmount),
      new anchor.BN(adjustedPoolTokenA),
      {
        accounts: {
          amm: amm,
          authority: poolAuthority,
          owner: wallet.publicKey,
          source: sourcePoolTokenAddress,
          swapTokenA: vaultSource, //vault address 1
          swapTokenB: vaultDest, //vault address 2
          poolMint: poolMint,
          destination: destTokenAddress,
          feeAccount: feeAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    );
  };

  // withdraw all sc
  const withdrawAll = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Remove All")

    if (!wallet) {
      return;
    }
    if (!program) {
      return;
    }

    const [amm, ammBump] = await PublicKey.findProgramAddress(
      [utf8.encode("amm"), mint0.toBuffer(), mint1.toBuffer()],
      program.programId
    );
    const [poolAuthority, bump] = await PublicKey.findProgramAddress(
      [utf8.encode("authority"), amm.toBuffer()],
      program.programId
    );
    const [vaultSource, vault0bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault0"), amm.toBuffer()],
      program.programId
    );
    const [vaultDest, vault1bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault1"), amm.toBuffer()],
      program.programId
    );
    const [poolMint, poolBump] = await PublicKey.findProgramAddress(
      [utf8.encode("pool_mint"), amm.toBuffer()],
      program.programId
    );
    let sourceTokenAddress = await tk.getAssociatedTokenAddress(
      mint0,
      wallet.publicKey
    );
    let destTokenAddress = await tk.getAssociatedTokenAddress(
      mint1,
      wallet.publicKey
    );

    let sourcePoolTokenAddress = await tk.getAssociatedTokenAddress(
      poolMint,
      wallet.publicKey
    );

    const poolMintInfo = await getMint(connection, poolMint);
    const supply = Number(poolMintInfo.supply);
    const swapTokenA = await getAccount(connection, vaultSource);
    const swapTokenB = await getAccount(connection, vaultDest);
    let feeAmount = 0;
    const POOL_TOKEN_AMOUNT = 10000;

    const poolTokenAmount = POOL_TOKEN_AMOUNT - feeAmount;

    feeAmount = Math.floor(
      (poolTokenAmount * OWNER_WITHDRAW_FEE_NUMERATOR) /
        OWNER_WITHDRAW_FEE_DENOMINATOR
    );

    const tokenAAmount = Math.floor(
      (Number(swapTokenA.amount) * poolTokenAmount) / supply
    );

    const tokenBAmount = Math.floor(
      Number(swapTokenB.amount) * poolTokenAmount
    );

    await program.rpc.withdrawAll(
      new anchor.BN(POOL_TOKEN_AMOUNT),
      new anchor.BN(tokenAAmount),
      new anchor.BN(tokenBAmount),
      {
        accounts: {
          amm: amm,
          authority: poolAuthority,
          owner: wallet.publicKey,
          sourceInfo: sourcePoolTokenAddress,
          vaultTokenA: vaultSource, //vault address 1
          vaultTokenB: vaultDest, //vault address 2
          poolMint: poolMint,
          destTokenAInfo: sourceTokenAddress,
          destTokenBInfo: destTokenAddress,
          feeAccount: feeAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    );
  };

  return (
    <div>
      <form
        onSubmit={
          token.id === 0 ? withdrawAll : token.id === 1 ? withdrawA : withdrawB
        }
      >
        {/* From */}
        <div className="bg-[#141041] relative p-2 w-full rounded-2xl">
          <div className="flex relative w-full justify-between">
            <div className="w-full">
              <div className="mb-2">
                {/* listbox */}

                <Listbox value={selectedTokens} onChange={handlePairChange}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative border p-1 w-full cursor-default rounded-lg py-2 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
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
              <div
                key={item.id}
                onChange={() => handleTokenName(window.event as any, item.id)}
              >
                <input
                  type="radio"
                  value={item.tokenName}
                  onChange={() => handleTokenName(window.event as any, item.id)}
                  name={item.name}
                  id={item.id.toString()}
                  checked={item.tokenName === selectedRadio}
                />{" "}
                <label htmlFor={item.id.toString()}>
                  Remove {item.tokenName}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="flex justify-between opacity-60 mb-2">
              <p>Amount</p>
              <p>
                Available <b>0</b> {token.tokenName}
              </p>
            </div>

            <div>
              <div className="w-full flex mb-2">
                <input
                  type="number"
                  placeholder="1000"
                  className="bg-transparent border outline-none w-2/3 p-2 "
                  onChange={handleValue}
                />

                <div className="border w-1/3 flex items-center justify-center">
                  <Image src={token.icon} alt="token" height={30} width={30} />
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

        <button type = "submit" className="flex justify-center bg-[#512DA8] w-full mt-6 py-3 font-bold rounded-[20px] hover:bg-opacity-80">
          Remove Liquidity
        </button>
      </form>
    </div>
  );
};

export default RemoveLiquidity;
