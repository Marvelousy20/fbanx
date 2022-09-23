import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { BiCaretDown } from "react-icons/bi";
import Image from "next/image";
import Usdt from "cryptocurrency-icons/svg/color/usdt.svg";
import Usdc from "cryptocurrency-icons/svg/color/usdc.svg";
import Sol from "cryptocurrency-icons/svg/color/sol.svg";
import Btc from "cryptocurrency-icons/svg/color/btc.svg";

const tokens = [
  {
    id: 1,
    name: "FBNX/USDT",
    poolAddress: "",
    subToken: [
      { id: 0, tokenName: "FBNX/USDT", icon: Btc, name: "tokens" },
      { id: 1, tokenName: "FBNX", icon: Btc, name: "tokens" },
      { id: 2, tokenName: "USDT", icon: Usdt, name: "tokens" },
    ],
  },

  {
    id: 2,
    name: "FBNX/USDC",
    poolAddress: "",
    subToken: [
      { id: 0, tokenName: "FBNX/USDC", icon: Btc, name: "tokens" },
      { id: 1, tokenName: "FBNX", icon: Btc, name: "tokens" },
      { id: 2, tokenName: "USDC", icon: Usdc, name: "tokens" },
    ],
  },
  {
    id: 3,
    name: "FBNX/SOL",
    poolAddress: "",
    subToken: [
      { id: 0, tokenName: "FBNX/SOL", icon: Btc, name: "tokens" },
      { id: 1, tokenName: "FBNX", icon: Btc, name: "tokens" },
      { id: 2, tokenName: "SOL", icon: Sol, name: "tokens" },
    ],
  },
];

const RemoveLiquidity = () => {
  const [selectedTokens, setSelectedTokens] = useState(tokens[0]);
  const [selectedSubTokens, setSelectedSubTokens] = useState(
    selectedTokens.subToken
  );
  const [selectedRadio, setSelectedRadio] = useState(
    selectedSubTokens[0].tokenName
  );
  const [token, setToken] = useState(selectedSubTokens[0]);
  console.log("selectedSubToken:", selectedSubTokens);
  console.log("selectedToken:", selectedTokens);
  console.log("selectedRadio", selectedRadio);
  console.log("token", token);

  const handleTokenName = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setSelectedRadio((e.target as HTMLInputElement).value);

    let newToken = [...selectedSubTokens];
    let token = newToken.find((token) => token.id === id);
    setToken(token);
  };

  const handleSubToken = () => {
    setSelectedSubTokens(selectedTokens.subToken);
  };

  useEffect(() => {
    handleSubToken();
  }, [selectedTokens]);

  return (
    <div>
      <form>
        {/* From */}
        <div className="bg-[#141041] relative p-2 w-full rounded-2xl">
          <div className="flex relative w-full justify-between">
            <div className="w-full">
              <div className="mb-2">
                {/* listbox */}

                <Listbox value={selectedTokens} onChange={setSelectedTokens}>
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
                            onClick={handleSubToken}
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
                <label htmlFor={item.id.toString()}>Remove {item.tokenName}</label>
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
                />

                <div className="border w-1/3 flex items-center justify-center">
                  <Image src={token.icon} alt="token" />
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
          Remove Liquidity
        </button>
      </form>
    </div>
  );
};

export default RemoveLiquidity;
