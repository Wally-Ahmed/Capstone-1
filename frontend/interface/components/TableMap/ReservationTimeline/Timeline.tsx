import React from 'react';
import { Reservation } from '..';


interface TimelineProps {
    reservations: Reservation[];
    reservationDuration: number;
    selectReservation: (reservation: Reservation) => {};
    openShowDeleteReservationConfirm: (reservation: Reservation) => {}
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const timeSlotSpacing = 40;

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const slot = new Date();
            slot.setHours(hour);
            slot.setMinutes(minute);
            slot.setSeconds(0);
            slot.setMilliseconds(0);
            slots.push(slot);
        }
    }
    return slots;
}

const Timeline: React.FC<TimelineProps> = ({ reservations, reservationDuration, selectReservation, openShowDeleteReservationConfirm }) => {
    const timeSlots = generateTimeSlots();

    const getReservationPosition = (reservation: Reservation) => {
        const reservation_time = new Date(reservation.reservation_time);
        const startTime = reservation_time.getHours() * 60 + reservation_time.getMinutes();
        return (startTime / 15) * timeSlotSpacing + timeSlotSpacing / 2;
    }

    const currentTime = new Date();

    return (
        <div className="relative flex flex-col items-center w-full">
            <div className="relative w-full">
                {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-start w-full" style={{ height: `${timeSlotSpacing}px` }}>
                        <div className="w-24 text-sm text-gray-600">{formatTime(slot)}</div>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                ))}
                <div
                    className="absolute w-full"
                    style={{
                        top: `${(currentTime.getHours() * 60 + currentTime.getMinutes()) / 15 * timeSlotSpacing + timeSlotSpacing / 2}px`
                    }}
                >
                    <div className="flex-1 h-1 bg-red-500"></div>
                </div>
                {reservations.map((reservation, index) => (
                    <div
                        key={index}
                        className="absolute left-28 bg-white border border-gray-200 rounded-lg shadow-md w-4/5 p-4"
                        style={{
                            top: `${getReservationPosition(reservation)}px`,
                            height: `${reservationDuration / 15 * timeSlotSpacing}px`
                        }}
                    >
                        <h3 className="text-lg font-semibold">{reservation.guest_name}</h3>
                        <p className="text-sm text-gray-600">
                            {formatTime(new Date(reservation.reservation_time))} - {reservationDuration} mins
                        </p>
                        <div className="absolute top-1 right-0 flex space-x-1">

                            <button
                                onClick={() => { console.log(reservation), selectReservation(reservation) }}
                                className="p-1 text-black rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="20px" width="20px" viewBox="0 0 306.637 306.637">
                                    <g>
                                        <g>
                                            <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896 l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z" />
                                            <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095 L265.13,75.602L231.035,41.507z" />
                                        </g>
                                    </g>
                                </svg>
                            </button>
                            <button
                                onClick={() => openShowDeleteReservationConfirm(reservation)}
                                className="p-1 text-black rounded"
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Timeline;
