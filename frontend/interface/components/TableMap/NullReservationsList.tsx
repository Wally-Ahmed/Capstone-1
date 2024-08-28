import React from 'react';
import { Reservation } from '.';

interface NullReservationsListProps {
    setShowNullReservations: (show: boolean) => void;
    handleOpenNewReservation: () => void;
    nullReservations: Reservation[];
    selectReservation: (reservation: Reservation) => void;
}

export const NullReservationsList: React.FC<NullReservationsListProps> = ({
    setShowNullReservations,
    handleOpenNewReservation,
    nullReservations,
    selectReservation
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Unassigned Reservations</h2>
                <p>Select a reservation and assign it to a table.</p>
                <div className="mt-4 space-y-4 overflow-y-auto">
                    {nullReservations.length > 0 ? (
                        nullReservations.map((reservation, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                                onClick={() => selectReservation(reservation)}
                            >
                                <h3 className="text-lg font-bold">{reservation.guest_name}</h3>
                                <p>Party Size: {reservation.party_size}</p>
                                <p>Reservation Time: {new Date(reservation.reservation_time).toLocaleString()}</p>
                                <p>Guest Phone: {reservation.guest_phone}</p>
                                <p>Guest Email: {reservation.guest_email}</p>
                            </div>
                        ))
                    ) : (
                        <p>No unassigned reservations available.</p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                        onClick={() => setShowNullReservations(false)}
                    >
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    );
};
