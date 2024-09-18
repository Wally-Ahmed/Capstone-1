import React, { useEffect, useState } from 'react';
import { backendURL } from '@/public/config';
import NewCheckoutInstrumentForm from '../NewCheckoutInstrumentForm';




const Ticketdetail = ({ checkoutMethods, getCheckoutMethods, closeCheckoutForm, addSumUpSoloPayment }) => {

    const [showNewCheckoutInstrumentForm, setShowNewCheckoutInstrumentForm] = useState<boolean>(false);

    useEffect(() => {
        getCheckoutMethods();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-5">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-5/6 overflow-hidden pb-20">

                <div className='flex justify-end'>
                    <button className=""
                        onClick={() => closeCheckoutForm()}
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
                            <h2 className="text-3xl font-bold mb-4">Choose a Checkout Method</h2>
                        </div>

                        {/* <p className="text-sm">{ticket.comments}</p> */}
                    </div>

                </div>

                {/* <p className='mt-4'><b>Items:</b></p> */}


                <div className="space-y-4 h-4/6 overflow-y-auto pb-10" >

                    <div className="mt-2">
                        {checkoutMethods && (<>
                            {checkoutMethods.find(method => method.method === "Cash") && <p className=" w-full h-[50px] flex justify-center items-center p-2 border rounded-lg bg-gray-50">Cash</p>}
                            {checkoutMethods.filter(method => method.method !== "Cash").map(method => <p className=" w-full h-[50px] flex justify-center items-center p-2 border rounded-lg bg-gray-50">{method.method}</p>)}
                        </>)}

                    </div>

                </div>


                <button type='button' onClick={() => { setShowNewCheckoutInstrumentForm(true) }} className=" w-full h-[50px] flex justify-center items-center p-2 mt-[50px] border rounded-lg bg-gray-50">New Checkout Method</button>


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

            {showNewCheckoutInstrumentForm && <NewCheckoutInstrumentForm closeShowNewCheckoutInstrumentForm={() => { setShowNewCheckoutInstrumentForm(false) }} addSumUpSoloPayment={addSumUpSoloPayment} />}


        </div>
    );
};

export default Ticketdetail