import React from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-4 md:px-12 py-8 fixed w-full z-[1000000]">
      <div className="flex items-center gap-x-12">
        <div className="text-3xl font-bold">LOGO</div>

        <div className="grid grid-cols-3 gap-x-8">
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
