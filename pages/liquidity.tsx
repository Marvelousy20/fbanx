import React from 'react'
import Liquidity from "../components/Liquidity/AddLiquidity"
import Header from '../components/Header'

const liquidity = () => {
  return (
    <div className='bg-[#161617] text-white h-screen'>
        <Header />
        <div className='px-4 md:px-0'>
          <Liquidity />
        </div>
    </div>
  )
}

export default liquidity