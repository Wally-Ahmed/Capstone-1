'use client';
import { backendURL } from '@/public/config';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface Schedule {
    monday_opening: string | null;
    tuesday_opening: string | null;
    wednesday_opening: string | null;
    thursday_opening: string | null;
    friday_opening: string | null;
    saturday_opening: string | null;
    sunday_opening: string | null;
    monday_closing: string | null;
    tuesday_closing: string | null;
    wednesday_closing: string | null;
    thursday_closing: string | null;
    friday_closing: string | null;
    saturday_closing: string | null;
    sunday_closing: string | null;
    time_zone: string | null;
    time_until_first_reservation_minutes: number;
    time_until_last_reservation_minutes: number;
    reservation_duration_minutes: number;
}


export default function UpdateScheduleForm({ initialSchedule, jwt }) {
    const router = useRouter();
    const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
    const [disabled, setDisabled] = useState(true)

    const getSchedule = async () => {

        const res = await fetch(`${backendURL}admin/schedule`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        },);
        const response: { schedule: Schedule } = await res.json();

        setSchedule(response.schedule)
        setDisabled(false)
    }

    useEffect(() => {
        getSchedule()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [name]: value,
        }));
    };

    const handleClearDay = (day: string) => {
        setSchedule((prevSchedule) => ({
            ...prevSchedule,
            [`${day}_opening`]: null,
            [`${day}_closing`]: null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${backendURL}admin/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify(schedule)
            });
            if (res.ok) {
                router.push('/app');
                router.refresh();
            } else {
                console.error('Failed to save schedule', await res.json());
                console.log(schedule)
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            throw error;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto mt-16 p-4 bg-white rounded-lg shadow-md">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="flex flex-col mb-4">
                    <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                        {day}
                    </label>
                    <div className="flex space-x-4 items-center">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400" htmlFor={`${day}_opening`}>
                                Opening Time
                            </label>
                            <input
                                type="time"
                                id={`${day}_opening`}
                                name={`${day}_opening`}
                                value={(schedule as any)[day + '_opening'] || ''}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400" htmlFor={`${day}_closing`}>
                                Closing Time
                            </label>
                            <input
                                type="time"
                                id={`${day}_closing`}
                                name={`${day}_closing`}
                                value={(schedule as any)[day + '_closing'] || ''}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleClearDay(day)}
                            className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-red-500 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex flex-col mb-4">
                <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Zone
                </label>
                <input
                    type="text"
                    name="time_zone"
                    value={schedule.time_zone || ''}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
                />
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Until First Reservation (minutes)
                </label>
                <input
                    type="number"
                    min={0}
                    name="time_until_first_reservation_minutes"
                    value={schedule.time_until_first_reservation_minutes}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
                />
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Until Last Reservation (minutes)
                </label>
                <input
                    type="number"
                    min={0}
                    name="time_until_last_reservation_minutes"
                    value={schedule.time_until_last_reservation_minutes}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
                />
            </div>
            <div className="flex flex-col mb-4">
                <label className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reservation Duration (minutes)
                </label>
                <input
                    type="number"
                    min={0}
                    name="reservation_duration_minutes"
                    value={schedule.reservation_duration_minutes}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full"
                />
            </div>
            <button
                disabled={disabled}
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                Save Schedule
            </button>
        </form>
    );
};
