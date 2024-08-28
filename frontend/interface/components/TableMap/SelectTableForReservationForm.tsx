export default function SelectTableForReservationForm({ selectedTable, setSelectedTable, handleNewReservationSubmit, newReservationData, openReservationsTimeline, editReservationData, handleReassignReservationSubmit }) {
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
            <p className="mb-1"><strong>Status:</strong> {selectedTable.table_status}</p>
            <p className="mb-1"><strong>Seats:</strong> {selectedTable.seats}</p>

            <div className="flex flex-col justify-end mt-4 ">
                <button
                    type="button"
                    disabled={false}
                    onClick={() => { openReservationsTimeline() }}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mb-2"
                >
                    View Existing Reservations
                </button>
                {editReservationData ?
                    <button
                        type="button"
                        disabled={false}
                        onClick={() => { handleReassignReservationSubmit({ ...editReservationData, restaurant_table_id: selectedTable.id }) }}
                        className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mb-2"
                    >
                        Reassign Reservation to Table
                    </button>
                    : <button
                        type="button"
                        disabled={false}
                        onClick={() => { handleNewReservationSubmit({ ...newReservationData, restaurant_table_id: selectedTable.id }) }}
                        className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mb-2"
                    >
                        Create New Reservation
                    </button>
                }

            </div>


        </>
    )
};
