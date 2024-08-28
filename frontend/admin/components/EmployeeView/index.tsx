'use client';
import React, { useEffect, useState } from 'react';
import { backendURL } from '@/public/config';
import Link from 'next/link';

interface EmployeeProperties {
    id: string;
    employee_id: string;
    restaurant_id: string;
    employee_rank: string;
    employee_code: string;
    employment_status: string;
}

interface EmployeeInfo extends EmployeeProperties {
    employee_name: string;
    employee_email: string;
}

interface MenuTitlesProps {
    jwt: string;
}

async function getEmployeeData(jwt: string): Promise<{ data: EmployeeInfo[] }> {
    if (!jwt) {
        throw new Error('Not logged in!');
    }
    const res = await fetch(`${backendURL}admin/employee`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json',
            'Authorization': jwt
        }
    });
    const response: { employees: EmployeeInfo[] } = await res.json();
    return { data: response.employees };
}

const MenuTitles: React.FC<MenuTitlesProps> = ({ jwt }) => {
    const [employees, setEmployees] = useState<EmployeeInfo[]>([]);
    const [employeeCode, setEmployeeCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const updateEmployees = async () => {
        const newEmployees = await getEmployeeData(jwt);
        setEmployees(newEmployees.data);
    };

    useEffect(() => {
        updateEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLinkEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${backendURL}admin/employee/link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ code: employeeCode })
            });

            if (res.ok) {
                setSuccess('Employee linked successfully!');
                updateEmployees();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to link employee');
                updateEmployees();
            }
        } catch (error) {
            setError('Failed to link employee');
            updateEmployees();
        }

        setEmployeeCode('');
    };

    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Restaurant Employees</h1>
            <div className="container mx-auto">
                <div className="relative">
                    <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                        {employees.map((employee) => (
                            <div key={employee.id} className="relative w-full">
                                {/* <Link href={`/app/employees/${employee.id}`}> */}
                                <div className="flex flex-col items-start justify-start w-full h-55 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                    <h2 className="text-center text-2xl font-bold mb-2">{employee.employee_name}</h2>
                                    <p className="text-center text-lg text-gray-700">Rank: {employee.employee_rank}</p>
                                    <p className="text-center text-md text-gray-500">Employment Status: {employee.employment_status}</p>
                                    <p className="text-center text-md text-gray-500">Email: {employee.employee_email}</p>
                                </div>
                                {/* {</Link>} */}
                            </div>
                        ))}
                        <form onSubmit={handleLinkEmployee} className="flex items-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md transition-shadow duration-300 ease-in-out">
                            <input
                                type="text"
                                value={employeeCode}
                                onChange={(e) => setEmployeeCode(e.target.value)}
                                placeholder="Enter employee code to register a new employee"
                                className="w-full p-2 mr-2 h-10 border border-gray-300 rounded"
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 h-10 w-40 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                Link Employee
                            </button>
                        </form>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {success && <p className="text-green-500 mt-2">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuTitles;
