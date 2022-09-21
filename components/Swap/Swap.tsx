
import { utils } from "@project-serum/anchor";
import { useProgram } from "../../hooks/useProgram";
import {mint1,mint2,feeAccount} from '../utils/constant'
import {PublicKey} from '@solana/web3.js';
import * as token from "@solana/spl-token"
import * as anchor from "@project-serum/anchor";
import React, { useEffect, useState, Fragment } from "react";
import { MdOutlineSwapVert } from "react-icons/md";
import { Listbox, Transition } from "@headlessui/react";
import { MdArrowDropDown } from "react-icons/md";
import Image from "next/image";

import Usdt from "cryptocurrency-icons"
// import Usdt from "../../node_modules/cryptocurrency-icons/svg/color/usdt.svg";
// import Usdc from "../../node_modules/cryptocurrency-icons/svg/color/usdc.svg";
// // import Sol from "../../node_modules/cryptocurrency-icons/svg/color/sol.svg";
// import Btc from "../../node_modules/cryptocurrency-icons/svg/color/btc.svg";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const utf8 = utils.bytes.utf8;

const Swap = () => {
  const { program, wallet, connection } = useProgram();

  const swap = async () => {
    if (!wallet){
      return
    }
    if (!program){
      return
  }

  const [amm,_ammBump] = await PublicKey.findProgramAddress(
      [utf8.encode("amm"),mint1.toBuffer(),mint2.toBuffer()],
      program.programId
  );

  const [poolAuthority,_bump] = await PublicKey.findProgramAddress(
    [utf8.encode("authority"),amm.toBuffer()],
    program.programId
  );

  const [vaultSource,_vault0bump] = await PublicKey.findProgramAddress(
    [utf8.encode("vault0"),amm.toBuffer()],
    program.programId
  );

  const [vaultDest,_vault1bump] =  await PublicKey.findProgramAddress(
    [utf8.encode("vault1"),amm.toBuffer()],
    program.programId
  );

  const [poolMint,poolBump] = await PublicKey.findProgramAddress(
    [utf8.encode("pool_mint"),amm.toBuffer()],
    program.programId
  );

  const userSrcATA = await token.getAssociatedTokenAddress(mint1, wallet.publicKey)
  const userDstATA = await token.getAssociatedTokenAddress(mint2,wallet.publicKey)

  await program.rpc.swap(
    new anchor.BN(amount),
    new anchor.BN(SWAP_AMOUNT_IN),
    {
    accounts : {
        poolAuthority : poolAuthority ,
        amm : amm ,
        vaultSourceInfo : vaultSource,
        vaultDestinationInfo : vaultDest,
        swapSource : userSrcATA ,
        swapDestination : userDstATA ,
        poolMint : poolMint,
        feeAccount : feeAccount,
        owmer : wallet.publicKey ,
        tokenProgram : TOKEN_PROGRAM_ID,
        hostFeeAccount : feeAccount,
    }
  })

      

interface Props {
  id: number;
  name: string;
}

const FromItems = [
  { id: 1, name: "FBANX", icon: Btc },
  { id: 2, name: "USDT", icon: Usdt },
  { id: 3, name: "USDC", icon: Usdc },
  { id: 4, name: "SOL", icon: Sol },
];

const ToItems = [
  { id: 1, name: "FBANX", icon: Btc },
  { id: 2, name: "USDT", icon: Usdt },
  { id: 3, name: "USDC", icon: Usdc },
  { id: 4, name: "SOL", icon: Sol },
];

const Swap: React.FC = () => {
  const [reverse, setReserve] = useState<boolean>(false);
  const [swapFrom, setSwapFrom] = useState<Props>(FromItems[0]);
  const [swapTo, setSwapTo] = useState<Props>(ToItems[0]);
  const [value, setValue] = useState<number>(0);

  const handleSwitch = () => {
    setReserve(!reverse);
  };

  const handleValue = (e: React.FormEvent) => {
    setValue(Number((e.target as HTMLInputElement).value));
  };

  console.log(value);

  useEffect(() => {
    setSwapFrom(swapTo);
    setSwapTo(swapFrom);
  }, [reverse]);

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
              <p className="font-bold mb-4">Swap</p>
              {/* From */}

              <div className="bg-[#141041] relative p-3 rounded-2xl h-[100px]">
                <div className="flex justify-between">
                  <p>From</p>
                  <p>Balance: 0</p>
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
                      placeholder="0"
                      className="text-right bg-transparent outline-none"
                      onChange={handleValue}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-[#512DA8] px-3 py-1 rounded hover:bg-opacity-80">
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
                  <p>Balance: 0</p>
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

              <button>
                
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;


