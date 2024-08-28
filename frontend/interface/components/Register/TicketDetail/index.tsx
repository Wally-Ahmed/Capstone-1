import React, { useState } from 'react';
import { backendURL } from '@/public/config';




const Ticketdetail = ({ ticket, handleOpenSelectItem, setShowTicketConfirm }) => {



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-5">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-5/6 overflow-hidden pb-20">


                <h2 className="text-2xl font-bold mb-4">{ }</h2>

                {/*  */}
                <div className="flex">
                    <div>
                        <div className='flex justify-between'>
                            <h2 className="text-3xl font-bold mb-4">Add items and submit ticket</h2>
                        </div>

                        <p className="text-sm">{ticket.comments}</p>
                    </div>

                </div>
                {/*  */}

                <p className='mt-4'><b>Items:</b></p>


                <div className="space-y-4 h-4/6 overflow-y-auto pb-10" >

                    <div className="mt-2">
                        {ticket.ticketItems.map(item => (
                            <div key={item.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                <p><strong>{item.item_name}</strong> {item.variation_description}</p>
                                <p><strong>Price:</strong> {item.price}</p>
                                {item.comments.length !== 0 && <p>{item.comments}</p>}
                            </div>
                        ))}
                    </div>

                </div>



                <div className='flex gap-3'>
                    <div
                        onClick={() => { handleOpenSelectItem(true) }}
                        className="flex items-center justify-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    >
                        Add items to ticket
                    </div>
                    <div
                        onClick={() => { setShowTicketConfirm(true) }}
                        className="flex items-center justify-center w-full h-20 p-4 bg-blue-500 border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    >
                        Process ticket
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Ticketdetail