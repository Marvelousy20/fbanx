import React from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import Image from "next/image";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex pr-2 justify-between items-center md:px-12 py-4 fixed w-full z-[1000000]">
      <div className="flex items-center gap-x-1 md:gap-x-12">
        <div className="text-3xl font-bold cursor-pointer hidden md:block">
          <Link href="/">
            <Image src="/logo.png" alt = "logo"  height={100} width={100} />
          </Link>
        </div>

        <div className="text-3xl font-bold block md:hidden cursor-pointer">
          <Link href="/">
            <Image src="/logo.png" alt = "logo"  height={50} width={50} />
          </Link>
        </div>

        <div className="flex md:grid grid-cols-3 gap-x-2 md:gap-x-8">
          <div>
            <Link href="/swap">
              <a
                className={
                  router.pathname === "/"
                    ? "text-[#14b9f4] font-semibold"
                    : "hover:text-[#14b9f4] text-white transition-all font-semibold"
                }
              >
                Swap
              </a>
            </Link>
          </div>

          <div>
            <Link href="/liquidity">
              <a className={
                  router.pathname === "/liquidity"
                    ? "text-[#14b9f4] font-semibold"
                    : "hover:text-[#14b9f4] text-white transition-all font-semibold"
                }
              >
                Liquidity
              </a>
            </Link>
          </div>

          <div>
            <Link href="/pools">
              <a className="hover:text-[#14b9f4] transition-all font-semibold">
                Pools
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Header;
