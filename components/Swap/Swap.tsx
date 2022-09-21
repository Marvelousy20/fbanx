import { utils } from "@project-serum/anchor";
import React from "react";
import { useProgram } from "../../hooks/useProgram";
import {mint1,mint2,feeAccount} from '../utils/constant'
import {PublicKey} from '@solana/web3.js';
import * as token from "@solana/spl-token"
import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
const utf8 = utils.bytes.utf8;

const Swap: React.FC = () => {
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

      
  }
  

  return (
    <div className="fixed inset-0 overflow-y-auto mt-10">
      <div className="min-h-full flex justify-center items-center max-w-md mx-auto">
        <div
          style={{
            background:
              "linear-gradient(107.53deg,#02f1ff -7.25%,#4839ff 46.29%,#e902b6 108.39%)",
          }}
          className="h-[500px] w-full rounded-3xl pt-[2.3px] p-[2px]"
        >
          <div
            style={{
              background:
                "linear-gradient(140.14deg, rgba(0, 182, 191, 0.15) 0%, rgba(27, 22, 89, 0.1) 86.61%), linear-gradient(321.82deg, #18134D 0%, #1B1659 100%",
            }}

            className="h-full rounded-3xl p-4"
          >
            <div>
              <p className="font-bold">Swap</p>
              <div>
                
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
