import React, { useEffect, useState } from 'react';
import { backendURL } from '@/public/config';




const SumUpSoloList = ({ soloList, handleSelectSolo, closeForm, getAvailableSolos }) => {

    useEffect(() => { getAvailableSolos() }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-5">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-5/6 overflow-hidden pb-20">

                <div className='flex justify-end'>
                    <button className=""
                        onClick={() => closeForm()}
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
                            <h2 className="text-3xl font-bold mb-4">Select a new SumUp solo payment instrument</h2>
                        </div>
                    </div>

                </div>
                {/*  */}

                <div className="space-y-4 h-4/6 overflow-y-auto pb-10" >
                    {soloList && soloList.map(solo => (
                        <button className="mt-2 w-full" type="button" onClick={() => { handleSelectSolo(solo.id) }}>

                            <div key={solo.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                <p><strong>Model:</strong> {solo.device.identifier}</p>
                                <p>{solo.name}</p>
                            </div>

                        </button>
                    ))}

                </div>



                {/* <div className='flex gap-3'>
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
                </div> */}
            </div>


        </div>
    );
};

export default SumUpSoloList