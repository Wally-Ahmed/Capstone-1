import React, { useEffect, useState } from 'react';

import { Reservation } from '.';

interface EditReservationFormProps {
    editReservationData: Reservation | null;
    handleCloseEditReservation: () => void;
    handleSelectTableForReservation: () => void;
    handleEditReservationFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    jwt: string;
}

export const EditReservationForm: React.FC<EditReservationFormProps> = ({
    editReservationData,
    handleEditReservationFormChange,
    handleCloseEditReservation,
    handleSelectTableForReservation,
}) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-3/4 overflow-hidden">
                <h2 className="text-2xl font-bold mb-4">Edit Reservation</h2>
                <form className="space-y-4 h-full overflow-y-auto pb-10" onSubmit={() => handleSelectTableForReservation()}>

                    <label className="block text-sm font-bold mb-2">Guest Name</label>
                    <input
                        required={true}
                        type="text"
                        name="guest_name"
                        value={editReservationData.guest_name}
                        onChange={handleEditReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Party Size</label>
                    <input
                        required={true}
                        min={1}
                        type="number"
                        name="party_size"
                        value={editReservationData.party_size}
                        onChange={handleEditReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Reservation Time</label>
                    <input
                        required={true}
                        type="datetime-local"
                        name="reservation_time"
                        value={new Date(editReservationData.reservation_time.getTime() - editReservationData.reservation_time.getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                        onChange={handleEditReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Guest Phone</label>
                    <input
                        required={true}
                        type="text"
                        name="guest_phone"
                        value={editReservationData.guest_phone}
                        onChange={handleEditReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <label className="block text-sm font-bold mb-2">Guest Email</label>
                    <input
                        required={true}
                        type="email"
                        name="guest_email"
                        value={editReservationData.guest_email}
                        onChange={handleEditReservationFormChange}
                        className="w-full p-2 border rounded"
                    />

                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={() => { handleCloseEditReservation() }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => { handleSelectTableForReservation() }}
                        >
                            Update Reservation
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
