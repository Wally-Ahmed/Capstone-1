import { useState } from "react"
import { Reservation } from "."
import ReservationTimeline from "./ReservationTimeline";
import Link from "next/link";
import { backendURL } from "@/public/config";

export default function EditTableForm({ selectedTable, setSelectedTable, openReservationsTimeline, handleEditReservationAvailability, showNewTabForm }) {

    return (

        // <>
        //     {JSON.stringify(selectedTable)}
        // </>
        <>
            <div className='flex justify-end'>
                <button className="" onClick={() => setSelectedTable(null)}>
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

            <h2 className="text-2xl font-bold mb-2">{selectedTable.table_name}</h2>

            <p className="mb-1"><strong>Seats:</strong> {selectedTable.seats}</p>
            <p className="mb-1"><strong>Reservable:</strong> {selectedTable.reservable ? 'Yes' : 'No'}</p>
            {/* {reservations.map((reservation: {}) => { return JSON.stringify(reservation) })} */}
            {/* <div className="h-100 overflow-hidden">
                <div className="space-y-4 h-full overflow-y-auto pb-10">
                    {reservations.map((reservation: Reservation) => {
                        return (
                            <div className="px-4 py-2 bg-gray-400 text-white rounded mb-2">
                                {`"${reservation.guest_name}" party of ${reservation.party_size} at ${reservation.reservation_time}`}
                            </div>
                        )
                    })}
                </div>
            </div> */}

            <div className="flex flex-col mt-4">

                {
                    selectedTable.table_status === 'available' && (
                        <button
                            type="button"
                            onClick={() => { handleEditReservationAvailability('on-hold') }}
                            className="px-4 py-2 bg-green-500 text-white rounded mb-2"
                        >
                            <p className="mb-1"><strong>Status:</strong> {selectedTable.table_status}</p>
                        </button>
                    )
                }
                {
                    selectedTable.table_status === 'on-hold' && (
                        <button
                            type="button"
                            onClick={() => { handleEditReservationAvailability('occupied') }}
                            className="px-4 py-2 bg-amber-500 text-white rounded mb-2"
                        >
                            <p className="mb-1"><strong>Status:</strong> {selectedTable.table_status}</p>
                        </button>
                    )
                }
                {
                    selectedTable.table_status === 'occupied' && (
                        <button
                            type="button"
                            onClick={() => { handleEditReservationAvailability('available') }}
                            className="px-4 py-2 bg-red-500 text-white rounded mb-2"
                        >
                            <p className="mb-1"><strong>Status:</strong> {selectedTable.table_status}</p>
                        </button>
                    )
                }

                <button
                    type="button"
                    onClick={() => { openReservationsTimeline() }}
                    className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
                >
                    Reservations
                </button>

                {
                    selectedTable.table_status === 'occupied' && (
                        <div
                            className="w-full h-90 flex flex-col justify-start items-center"
                        >
                            <p className="flex w-full mb-4"><strong>Tabs:</strong></p>
                            <div
                                className="w-full flex flex-col justify-start items-center"
                                style={{ height: '200px' }}
                            >
                                <div className="bg-white rounded-lg w-full h-full overflow-hidden">
                                    <div className="space-y-1 h-full overflow-y-auto pb-5" >
                                        {selectedTable.tabs.map(tab => (
                                            <Link href={`/app/tabs?tabId=${tab.id}`} key={tab.id} className=" w-full flex justify-center p-2 border rounded-lg bg-gray-50">
                                                {tab.customer_name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { showNewTabForm() }}
                                className="w-full px-4 py-2 bg-green-500 text-white rounded m-3"
                            >
                                <p className="mb-1"><strong>NewTab</strong></p>
                            </button>
                        </div>
                    )
                }

            </div>
        </>
    )
};
