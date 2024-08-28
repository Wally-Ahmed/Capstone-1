'use client';
import React, { useEffect, useState } from 'react';
import { backendURL } from '@/public/config';

interface RestaurantInfo {
    id: string;
    restaurant_id: string;
    employee_rank: string;
    employee_code: string;
    employment_status: string;
    restaurant_name: string;
    restaurant_address: string;
}

interface EmploymentViewProps {
    jwt: string;
    code: string;
}

const EmploymentView: React.FC<EmploymentViewProps> = ({ jwt, code }) => {
    const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
    const [employeeCode, setEmployeeCode] = useState(code);
    const [loading, setLoading] = useState(false);

    const getRestaurantData = async () => {
        if (!jwt) {
            throw new Error('Not logged in!');
        }
        try {
            const res = await fetch(`${backendURL}staff/employment`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch restaurant data');
            }
            const response: { restaurants: RestaurantInfo[] } = await res.json();
            setRestaurants(response.restaurants);
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
        }
    };

    useEffect(() => {
        getRestaurantData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateEmployeeCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${backendURL}staff/employeecode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
            });

            if (!res.ok) {
                throw new Error('Failed to update employee code');
            }

            const data = await res.json();
            setEmployeeCode(data.code);

            await getRestaurantData();
        } catch (error) {
            console.error('Error updating employee code:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Associated Restaurants</h1>
            <div className="container mx-auto">
                <div className="relative">
                    <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                        {restaurants.map((restaurant) => (
                            <div key={restaurant.id} className="relative w-full">
                                <div className="flex flex-col items-start justify-start w-full h-55 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                    <h2 className="text-center text-2xl font-bold mb-2">{restaurant.restaurant_name}</h2>
                                    <p className="text-center text-lg text-gray-700">Rank: {restaurant.employee_rank}</p>
                                    <p className="text-center text-md text-gray-500">Employment Status: {restaurant.employment_status}</p>
                                    <p className="text-center text-md text-gray-500">Address: {restaurant.restaurant_address}</p>
                                    <p className="text-center text-md text-gray-500">Employee Code: {restaurant.employee_code}</p>
                                </div>
                            </div>
                        ))}
                        <form onSubmit={updateEmployeeCode} className="flex items-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md transition-shadow duration-300 ease-in-out">
                            <div className='w-full p-2 mr-2 h-10 border border-gray-300 rounded'>
                                <p>Code: {employeeCode || 'null'}</p>
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 h-10 w-40 bg-blue-500 text-white rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Refreshing...' : 'Refresh Code'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmploymentView;
