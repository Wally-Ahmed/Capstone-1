import React, { useState } from 'react';
import Variations from './Variations';
import { backendURL } from '@/public/config';
import { fullItemRoot } from '../menuProperties';



const Itemdetail = ({ closeItemDetail, itemRoot, handleCreateNewTicketItem, closeMenu }) => {


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-5">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-5/6 overflow-hidden pb-40">
                <div className='flex justify-end'>
                    <button className=""
                        onClick={() => closeItemDetail()}
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>


                <h2 className="text-2xl font-bold mb-4">{ }</h2>

                {/*  */}
                <div className="flex">
                    <div>
                        <div className='flex justify-between'>
                            <h2 className="text-3xl font-bold mb-4">{itemRoot.menu_item_root_name}</h2>
                        </div>

                        <p className="text-lg font-bold">${itemRoot.base_price}</p>
                        <p className="text-sm">Prep time: {itemRoot.prep_time_required ? 'Required' : 'Not required'}</p>
                        <p>{itemRoot.menu_item_root_description}</p>
                    </div>

                </div>
                {/*  */}

                <p className='mt-4'><b>Variations</b></p>

                <div className="space-y-4 h-4/6 overflow-y-auto pb-10" >

                    <div className="mt-2">
                        {itemRoot.MenuItemVariations.map((variation) => <Variations key={variation.id} variation={variation} handleCreateNewTicketItem={handleCreateNewTicketItem} closeMenu={closeMenu} />)}
                    </div>


                </div>


            </div>

        </div>
    );
};

export default Itemdetail