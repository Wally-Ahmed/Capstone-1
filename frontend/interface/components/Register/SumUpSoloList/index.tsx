import React, { useEffect, useState } from 'react';
import { backendURL } from '@/public/config';




const SumUpSoloList = ({ soloList, handleSelectSolo, closeForm, getAvailableSolos, handleDeleteSumUpSoloInstrument }) => {

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
                        <div key={solo.id} className="relative">
                            <button className="mt-2 w-full" type="button" onClick={() => handleSelectSolo(solo.id)}>
                                <div key={solo.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                    <p><strong>Model:</strong> {solo.device.identifier}</p>
                                    <p>{solo.name}</p>
                                </div>
                            </button>

                            <div className="absolute top-1/2 right-0 -translate-y-1/2 transform flex space-x-0">
                                <button
                                    onClick={() => handleDeleteSumUpSoloInstrument(solo.id)}
                                    className="p-1 text-black rounded"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="5 5 24 24"
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
                        </div>
                    ))}

                </div>


            </div>


        </div>
    );
};

export default SumUpSoloList