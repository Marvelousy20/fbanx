import { utils } from "@project-serum/anchor";
import { useProgram } from "../../hooks/useProgram";
import {  feeAccount } from "../../utils/constant";
import { PublicKey } from "@solana/web3.js";
import * as token from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import React, { useEffect, useState, Fragment } from "react";
import { MdOutlineSwapVert } from "react-icons/md";
import { Listbox, Transition } from "@headlessui/react";
import { MdArrowDropDown } from "react-icons/md";
import Image from "next/image";
import * as Web3 from '@solana/web3.js'


import Usdt from "cryptocurrency-icons/svg/color/usdt.svg";
import Usdc from "cryptocurrency-icons/svg/color/usdc.svg";
import Sol from "cryptocurrency-icons/svg/color/sol.svg";
import Btc from "cryptocurrency-icons/svg/color/btc.svg";



import { fbanxMint, usdcMint, usdtMint, solMint } from "./const";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const utf8 = utils.bytes.utf8;
const tokenAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

const tokenPublicKey = new Web3.PublicKey(tokenAddress);

interface Props {
  id: number;
  name: string;
}

const FromItems = [
  { id: 1, name: "FBANX", icon: Btc, address: fbanxMint },
  { id: 2, name: "USDT", icon: Usdt, address: usdtMint },
  { id: 3, name: "USDC", icon: Usdc, address: usdcMint },
  { id: 4, name: "SOL", icon: Sol, address: solMint },
];

const ToItems = [
  { id: 1, name: "FBANX", icon: Btc, address: fbanxMint },
  { id: 2, name: "USDT", icon: Usdt, address: usdtMint },
  { id: 3, name: "USDC", icon: Usdc, address: usdcMint },
  { id: 4, name: "SOL", icon: Sol, address: solMint },
];

const Swap = () => {
  const [balance, setBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [reverse, setReserve] = useState<boolean>(false);
  const [swapFrom, setSwapFrom] = useState<Props>(FromItems[0]);
  const [swapTo, setSwapTo] = useState<Props>(ToItems[0]);
  const [value, setValue] = useState<number>(0);
  const [mintSource, setMintSource] = useState<PublicKey>(FromItems[0].address);
  const [mintDestination, setMintDestination] = useState<PublicKey>(
    ToItems[0].address
  );

  const handleSwitch = () => {
    setReserve(!reverse);
  };

  const handleValue = (e: React.FormEvent) => {
    setValue(Number((e.target as HTMLInputElement).value));
  };

  const { program, wallet, connection } = useProgram();

  const showBalance = async() => {
    if (!wallet) {
      return;
    }

    connection.getBalance(wallet.publicKey).then(balance => {
      setBalance(balance/Web3.LAMPORTS_PER_SOL)
    })
  } 

  const showTokenBalance = async() => {
    if (!wallet) {
      return;
    }
    connection.getParsedTokenAccountsByOwner(
      wallet.publicKey, { mint: tokenPublicKey }
    ).then(balance => {
      setTokenBalance(balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount)
      console.log(balance)
    })
    
  } 

  showBalance()
  
  
  

  
  // connection.getParsedTokenAccountsByOwner(
  //   wallet.publicKey, { mint: tokenPublicKey }
  // );

  const swaps = async () => {
    if (!wallet) {
      return;
    }
    if (!program) {
      return;
    }

    

    connection.getParsedTokenAccountsByOwner(
      wallet.publicKey, { mint: tokenPublicKey }
    );

    const [amm, _ammBump] = await PublicKey.findProgramAddress(
      [utf8.encode("amm"), mintSource.toBuffer(), mintDestination.toBuffer()],
      program.programId
    );

    const [poolAuthority, _bump] = await PublicKey.findProgramAddress(
      [utf8.encode("authority"), amm.toBuffer()],
      program.programId
    );

    const [vaultSource, _vault0bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault0"), amm.toBuffer()],
      program.programId
    );

    const [vaultDest, _vault1bump] = await PublicKey.findProgramAddress(
      [utf8.encode("vault1"), amm.toBuffer()],
      program.programId
    );

    const [poolMint, poolBump] = await PublicKey.findProgramAddress(
      [utf8.encode("pool_mint"), amm.toBuffer()],
      program.programId
    );

    const userSrcATA = await token.getAssociatedTokenAddress(
      mintSource,
      wallet.publicKey
    );
    const userDstATA = await token.getAssociatedTokenAddress(
      mintDestination,
      wallet.publicKey
    );

    await program.rpc.swap(
      new anchor.BN(value),
      new anchor.BN(SWAP_AMOUNT_IN),
      {
        accounts: {
          poolAuthority: poolAuthority,
          amm: amm,
          vaultSourceInfo: vaultSource,
          vaultDestinationInfo: vaultDest,
          swapSource: userSrcATA,
          swapDestination: userDstATA,
          poolMint: poolMint,
          feeAccount: feeAccount,
          owmer: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          hostFeeAccount: feeAccount,
        },
      }
    );
  };

  useEffect(() => {
    setSwapFrom(swapTo);
    setSwapTo(swapFrom);
  }, [reverse]);

  return (
    <div className="fixed inset-0 overflow-y-auto mt-10 px-2 md:px-0">
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
              <p className="font-bold mb-4">Swap</p>
              {/* From */}

              <div className="bg-[#141041] relative p-3 rounded-2xl h-[100px]">
                <div className="flex justify-between">
                  <p>From</p>
                  <p>{`Balance: ${balance} SOL`}</p>
                </div>

                <div className="flex relative justify-between">
                  <div className="">
                    <div className="fixed">
                      <Listbox value={swapFrom} onChange={setSwapFrom}>
                        <Listbox.Button className="flex items-center gap-2">
                          {swapFrom.name} <MdArrowDropDown />{" "}
                        </Listbox.Button>
                        <Listbox.Options className="bg-[#126499] grid gap-y-4 p-2">
                          {FromItems.map((item) => (
                            <Listbox.Option
                              key={item.id}
                              value={item}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <Image
                                src={item.icon}
                                alt="img"
                                height="25px"
                                width="25px"
                              />
                              {item.name}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Listbox>
                    </div>
                  </div>

                  <div>
                    <input
                      type="number"
                      required
                      placeholder="5"
                      className="text-right bg-transparent outline-none"
                      onChange={handleValue}
                    />
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

              {/* Switch */}
              <div
                className="py-4 flex justify-center cursor-pointer"
                onClick={handleSwitch}
              >
                <span className="bg-[#1B2D65] p-3 rounded-full hover:bg-opacity-80">
                  <MdOutlineSwapVert
                    size="24"
                    className="hover:rotate-180 transition-all"
                  />
                </span>
              </div>

              {/* To */}

              <div className="bg-[#141041] p-3 rounded-2xl h-[100px]">
                <div className="flex justify-between">
                  <p>To</p>
                  <p>{`Balance: ${tokenBalance} SOL`}</p>
                </div>

                <div className="flex justify-between">
                  <div className="">
                    <Listbox value={swapTo} onChange={setSwapTo}>
                      <Listbox.Button className="flex items-center gap-2">
                        {swapTo.name} <MdArrowDropDown />{" "}
                      </Listbox.Button>
                      <Listbox.Options className="bg-[#126499] grid gap-y-4 p-2">
                        {ToItems.map((item) => (
                          <Listbox.Option
                            key={item.id}
                            value={item}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <Image
                              src={item.icon}
                              alt="img"
                              height="25px"
                              width="25px"
                            />
                            {item.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox>
                  </div>
                  <p>0</p>
                </div>
              </div>

              <button className="flex justify-center bg-[#512DA8] w-full mt-6 py-3 font-bold rounded-[20px] hover:bg-opacity-80">
                SWAP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
