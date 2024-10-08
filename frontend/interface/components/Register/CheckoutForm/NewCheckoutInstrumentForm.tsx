import { useState } from "react"

export default function NewCheckoutInstrumentForm({ closeShowNewCheckoutInstrumentForm, addSumUpSoloPayment, openSelectSumUpSoloList }) {

    const [selectSolo, setSelectSolo] = useState(false)

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-[480px]">
                <div className='flex justify-end'>
                    <button className=""
                        onClick={() => closeShowNewCheckoutInstrumentForm()}
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
                <h2 className="text-xl font-bold mt-1 mb-10">Select New Payment Instrument Type</h2>

                <div className="flex flex-col gap-1 justify-end mt-4">
                    {selectSolo
                        ?
                        <div className="w-full flex justify-between gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded w-1/2"
                                onClick={async () => { await addSumUpSoloPayment() }}
                            >
                                Link Solo
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded w-1/2"
                                onClick={async () => { await openSelectSumUpSoloList() }}
                            >
                                Select Solo
                            </button>
                        </div>
                        : <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={async () => { setSelectSolo(true) }}
                        >
                            SumUp-Solo
                        </button>
                    }
                </div>
            </div>
        </div>
    )
};
