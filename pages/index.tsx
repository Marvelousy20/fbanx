import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header.tsx/Header'
import Swap from '../components/Swap/Swap'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='bg-[#161617] text-white h-screen'>
        <Header />
        <Swap />
      </main>
    </div>
  )
}

export default Home