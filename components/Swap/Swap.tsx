import React, { useEffect, useState, Fragment } from "react";
import { MdOutlineSwapVert } from "react-icons/md";
import { Listbox, Transition } from "@headlessui/react";
import { MdArrowDropDown } from "react-icons/md";
import Image from "next/image";
import Usdt from "../../node_modules/cryptocurrency-icons/svg/color/usdt.svg";
import Usdc from "../../node_modules/cryptocurrency-icons/svg/color/usdc.svg";
import Sol from "../../node_modules/cryptocurrency-icons/svg/color/sol.svg";
import Btc from "../../node_modules/cryptocurrency-icons/svg/color/btc.svg";

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
            <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;

//  background-image: linear-gradient(140.14deg, rgba(0, 182, 191, 0.15) 0%, rgba(27, 22, 89, 0.1) 86.61%), linear-gradient(321.82deg, #18134D 0%, #1B1659 100%);

//  background-image: linear-gradient(var(--gradient-rotate, 246deg), #da2eef 7.97%, #2b6aff 49.17%, #39d0d8 92.1%);
