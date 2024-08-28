import React, { useState } from 'react';
import Timeline from './Timeline';

const newDate = () => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0); // Normalize the time part
    return currentDate
}


const ReservationTimeline = ({ table, reservations, reservationDuration, closeReservationsTimeline, selectReservation, openShowDeleteReservationConfirm, editReservationData }) => {

    const [currentDate, setCurrentDate] = useState(newDate());

    // Filter the array for the current date
    const reservationsForDay = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.reservation_time);
        reservationDate.setHours(0, 0, 0, 0); // Normalize the time part
        return reservationDate.getTime() === currentDate.getTime();
    });

    const handleChange = (event) => {
        setCurrentDate(new Date(event.target.value));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-3/4 overflow-hidden pb-40">
                <div className='flex justify-end'>
                    <button className=""
                        onClick={() => closeReservationsTimeline()}
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
                <h2 className="text-2xl font-bold mb-4">{`Reservations for table ${table.table_name}`}</h2>

                {/* <div className="flex flex-col items-start p-4 border rounded shadow-lg"> */}
                <label className="mb-2 text-lg font-semibold">Selected Date:</label>
                <input
                    type="date"
                    className="p-2 border rounded-md mb-2 text-lg font-semibold"
                    value={currentDate.toISOString().split('T')[0]}
                    onChange={handleChange}
                />
                {/* </div> */}

                <div className="space-y-4 h-full overflow-y-auto pb-10" >

                    <Timeline reservations={reservationsForDay} reservationDuration={reservationDuration} selectReservation={selectReservation} openShowDeleteReservationConfirm={openShowDeleteReservationConfirm} />

                </div>
            </div>
        </div>
    );
};

export default ReservationTimeline