import React from 'react';
import { Reservation } from '.';



export const NewReservationForm = ({
    handleCloseNewReservation,
    newReservationData,
    handleNewReservationFormChange,
    handleSelectTableForReservation,
    handleNewReservationSubmit
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-3/4 overflow-hidden">
                <h2 className="text-2xl font-bold mb-4">Create New Reservation</h2>
                <form className="space-y-4 h-full overflow-y-auto pb-10" onSubmit={() => handleSelectTableForReservation()}>

                    <label className="block text-sm font-bold mb-2">Guest Name</label>
                    <input
                        required={true}
                        type="text"
                        name="guest_name"
                        value={newReservationData.guest_name}
                        onChange={handleNewReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Party Size</label>
                    <input
                        required={true}
                        min={1}
                        type="number"
                        name="party_size"
                        value={newReservationData.party_size}
                        onChange={handleNewReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Reservation Time</label>
                    <input
                        required={true}
                        type="datetime-local"
                        name="reservation_time"
                        value={new Date(newReservationData.reservation_time.getTime() - newReservationData.reservation_time.getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                        onChange={handleNewReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Guest Phone</label>
                    <input
                        required={true}
                        type="text"
                        name="guest_phone"
                        value={newReservationData.guest_phone}
                        onChange={handleNewReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Guest Email</label>
                    <input
                        required={true}
                        type="email"
                        name="guest_email"
                        value={newReservationData.guest_email}
                        onChange={handleNewReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2 w-40"
                            onClick={() => handleCloseNewReservation()}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-amber-500 text-white rounded mr-2 w-40"
                            onClick={() => { if (!newReservationData.guest_name || !newReservationData.party_size || !newReservationData.reservation_time || !newReservationData.guest_phone || !newReservationData.guest_email) { alert('Must fill in all sections'); return; } else { handleNewReservationSubmit(newReservationData); } }}
                        >
                            Create an unassigned reservation
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded mr-2 w-40"
                            onClick={() => { if (!newReservationData.guest_name || !newReservationData.party_size || !newReservationData.reservation_time || !newReservationData.guest_phone || !newReservationData.guest_email) { alert('Must fill in all sections'); return; } else { handleSelectTableForReservation(); } }}
                        >
                            Assign reservation to a table
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
