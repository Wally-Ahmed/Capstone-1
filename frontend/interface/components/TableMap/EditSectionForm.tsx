import { Table } from "./Table";

export default function EditSectionForm({ section, nullReservations, setShowNullReservations, handleSectionDeselect, handleOpenNewReservation }) {
    return (
        <>
            <div className='flex justify-end'>
                <button className="" onClick={() => { handleSectionDeselect() }}>
                    <svg width="30" height="30" viewBox="-3 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 19L8 12L15 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>



            <h2 className="text-4xl font-bold mb-8">{section.section_name}</h2>

            <h3 className="text-lg font-bold mb-2">Select a table to view details</h3>
            <div className="flex flex-col mt-4">

                <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mb-2" onClick={() => { setShowNullReservations(true) }}>View Unassigned Reservations</button>
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2 mb-2"
                    onClick={() => handleOpenNewReservation()}
                >
                    Create New Reservation
                </button>
            </div>
        </>
    )
};
