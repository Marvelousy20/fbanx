import {FC,useState,Fragment} from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { BiCaretDown } from 'react-icons/bi'
import { MdChangeCircle } from 'react-icons/md'

interface TokenProps {
    id: number,
    name: string
}

const tokens = [
    { id: 1, name: 'FBNX/USDC' },
    { id: 2, name: 'FBNX/USDT' },
]

<div className=''>
            <div className='py-6 text-3xl flex flex-col items-center justify-center text-center bg-gray-500  h-[150px] w-full'>
                <h1 className='text-white text-3xl'>LIQUIDITY</h1>
            </div>

            <div>
                <div className='text-2xl mb-4'>Liquidity</div>

                <form className='relative'>
                    <div className="top-0 w- border border-[#ccc]">
                        <Listbox value={selectedToken} onChange={setSelectedToken}>
                            <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-[#faebd7] py-2 pl-3 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                    <span className="truncate flex items-center justify-between">{selectedToken.name} <BiCaretDown /></span>

                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#faebd7] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {tokens.map((token, id) => (
                                            <Listbox.Option
                                                key={id}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 flex text-left pl-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                    }`
                                                }
                                                value={token}
                                            >
                                                {token.name}

                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>
                    <div className='mt-4'>
                        <div className='flex gap-3'>
                            <input type="checkbox" aria-selected id='woo' />
                            <label htmlFor="Add BNB + USDT" id='woo'>Add FBNX + USDC</label>
                        </div>

                        <div className='flex gap-3'>
                            <input type="checkbox" aria-selected id='bnb' />
                            <label htmlFor="bnb" id='bnb'>Add USDC</label>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" aria-selected id='bnb' />
                            <label htmlFor="bnb" id='bnb'>Add FBNX</label>
                        </div>
                    </div>


                    <div className='mt-8'>

                        <div className='flex justify-between'>
                            <p>Amount</p>
                            <p>Avaiable {isValue ? "USDT" : "WOO"}</p>
                        </div>
                        <div className='grid grid-cols-5 border border-[#ccc] justify-between items-center relative'>
                            <div className='col-span-3'>
                                <input type="number" placeholder='9.97777-24999.000' className='px-3 w-full bg-transparent py-2 outline-none' />
                            </div>

                            <div>Max</div>

                            <div className="top-0" onClick={handleSwitch}>
                                <div className='flex items-center gap-3'>{isValue ? "USDT" : "WOO"} <MdChangeCircle /></div>
                            </div>
                        </div>
                    </div>
                    
                    <button className='bg-[#24A0ED] w-full mt-6 py-4 rounded-[30px] font-bold text-white hover:bg-opacity-80'>Add Liquidity</button>

                </form>
            </div>
        </div>