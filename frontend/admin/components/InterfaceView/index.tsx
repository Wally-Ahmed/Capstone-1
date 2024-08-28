'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { backendURL } from '@/public/config';

interface RestaurantInterfaceProperties {
    id: string;
    interface_name: string;
    time_created: Date;
    link_code: string | null;
    interface_token: string | null;
    restaurant_id: string;
    tablemap_permission: boolean;
    tab_permission: boolean;
    kitchen_permission: boolean;
    shift_permission: boolean;
}

interface MenuTitlesProps {
    jwt: string;
}

const MenuTitles: React.FC<MenuTitlesProps> = ({ jwt }) => {
    const [interfaces, setInterfaces] = useState<RestaurantInterfaceProperties[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentInterface, setCurrentInterface] = useState<RestaurantInterfaceProperties | null>(null);
    const [createFormValues, setCreateFormValues] = useState({
        interface_name: '',
        tablemap_permission: false,
        tab_permission: false,
        kitchen_permission: false,
        shift_permission: false,
    });
    const [editFormValues, setEditFormValues] = useState({
        interface_name: '',
        tablemap_permission: false,
        tab_permission: false,
        kitchen_permission: false,
        shift_permission: false,
    });

    async function getRestaurantInterfaces() {
        if (!jwt) {
            throw new Error('Not logged in!');
        }
        const res = await fetch(`${backendURL}admin/interface`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });
        const response: { restaurantInterfaces: RestaurantInterfaceProperties[] } = await res.json();
        setInterfaces(response.restaurantInterfaces);
    }

    useEffect(() => {
        getRestaurantInterfaces();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'create' | 'edit') => {
        const { name, value, type, checked } = e.target;
        const setFormValues = formType === 'create' ? setCreateFormValues : setEditFormValues;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCreateFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${backendURL}admin/interface`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
            body: JSON.stringify(createFormValues),
        });

        if (res.ok) {
            setShowCreateForm(false);
            setCreateFormValues({
                interface_name: '',
                tablemap_permission: false,
                tab_permission: false,
                kitchen_permission: false,
                shift_permission: false,
            });
            getRestaurantInterfaces();
        } else {
            console.error('Failed to add new interface');
        }
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentInterface) {
            const res = await fetch(`${backendURL}admin/interface/${currentInterface.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify(editFormValues),
            });

            if (res.ok) {
                setShowEditForm(false);
                setEditFormValues({
                    interface_name: '',
                    tablemap_permission: false,
                    tab_permission: false,
                    kitchen_permission: false,
                    shift_permission: false,
                });
                getRestaurantInterfaces();
            } else {
                console.error('Failed to update interface');
            }
        }
    };

    const handleEditClick = (interfaceItem: RestaurantInterfaceProperties) => {
        setCurrentInterface(interfaceItem);
        setEditFormValues({
            interface_name: interfaceItem.interface_name,
            tablemap_permission: interfaceItem.tablemap_permission,
            tab_permission: interfaceItem.tab_permission,
            kitchen_permission: interfaceItem.kitchen_permission,
            shift_permission: interfaceItem.shift_permission,
        });
        setShowEditForm(true);
    };

    const handleDeleteClick = (interfaceItem: RestaurantInterfaceProperties) => {
        setCurrentInterface(interfaceItem);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (currentInterface) {
            const res = await fetch(`${backendURL}admin/interface/${currentInterface.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
            });

            if (res.ok) {
                setShowDeleteConfirm(false);
                setCurrentInterface(null);
                getRestaurantInterfaces();
            } else {
                console.error('Failed to delete interface');
            }
        }
    };

    const handleSetCodeClick = async () => {
        console.log(currentInterface, 'hit')
        if (currentInterface) {
            const res = await fetch(`${backendURL}admin/interface/${currentInterface.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
            });

            if (res.ok) {
                getRestaurantInterfaces();
                setShowEditForm(false);
            } else {
                console.error('Failed to set code');
            }
        }
    };

    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Restaurant Interfaces</h1>
            <div className="container mx-auto">
                <div className="relative">
                    <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                        {interfaces.map((interfaceItem) => (
                            <div key={interfaceItem.id} className="relative w-full">
                                <div className="flex flex-col items-start justify-start w-full h-55 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer">
                                    <h2 className="text-center text-2xl font-bold mb-2">{interfaceItem.interface_name || 'null'}</h2>
                                    <p className="text-center text-lg text-gray-700">Link Code: {interfaceItem.link_code || 'null'}</p>
                                    <p className="text-center text-md text-gray-500">Table Map Permission: {interfaceItem.tablemap_permission ? 'Yes' : 'No'}</p>
                                    <p className="text-center text-md text-gray-500">Tab Permission: {interfaceItem.tab_permission ? 'Yes' : 'No'}</p>
                                    <p className="text-center text-md text-gray-500">Kitchen Permission: {interfaceItem.kitchen_permission ? 'Yes' : 'No'}</p>
                                    <p className="text-center text-md text-gray-500">Shift Permission: {interfaceItem.shift_permission ? 'Yes' : 'No'}</p>
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <button
                                            onClick={() => handleEditClick(interfaceItem)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="20px" width="20px" viewBox="0 0 306.637 306.637">
                                                <g>
                                                    <g>
                                                        <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896    l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z" />
                                                        <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095    L265.13,75.602L231.035,41.507z" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(interfaceItem)}
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
                            </div>
                        ))}
                        <div
                            className="flex items-center justify-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                            onClick={() => setShowCreateForm(true)}
                        >
                            <svg
                                className="w-12 h-12 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            {showCreateForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Interface</h2>
                        <form onSubmit={handleCreateFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="interface_name"
                                    value={createFormValues.interface_name}
                                    onChange={(e) => handleFormChange(e, 'create')}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="tablemap_permission"
                                    checked={createFormValues.tablemap_permission}
                                    onChange={(e) => handleFormChange(e, 'create')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Table Map Permission
                                </label>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="tab_permission"
                                    checked={createFormValues.tab_permission}
                                    onChange={(e) => handleFormChange(e, 'create')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Tab Permission
                                </label>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="kitchen_permission"
                                    checked={createFormValues.kitchen_permission}
                                    onChange={(e) => handleFormChange(e, 'create')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Kitchen Permission
                                </label>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="shift_permission"
                                    checked={createFormValues.shift_permission}
                                    onChange={(e) => handleFormChange(e, 'create')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Shift Permission
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Add Interface
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Interface</h2>
                        <form onSubmit={handleEditFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="interface_name"
                                    value={editFormValues.interface_name}
                                    onChange={(e) => handleFormChange(e, 'edit')}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="tablemap_permission"
                                    checked={editFormValues.tablemap_permission}
                                    onChange={(e) => handleFormChange(e, 'edit')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Table Map Permission
                                </label>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="tab_permission"
                                    checked={editFormValues.tab_permission}
                                    onChange={(e) => handleFormChange(e, 'edit')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Tab Permission
                                </label>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="kitchen_permission"
                                    checked={editFormValues.kitchen_permission}
                                    onChange={(e) => handleFormChange(e, 'edit')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Kitchen Permission
                                </label>
                            </div>
                            <div className="mb-4">
                                <input
                                    type="checkbox"
                                    name="shift_permission"
                                    checked={editFormValues.shift_permission}
                                    onChange={(e) => handleFormChange(e, 'edit')}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Shift Permission
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                    onClick={() => setShowEditForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={handleSetCodeClick}
                                >
                                    Set Code
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Delete Interface</h2>
                        <p>Are you sure you want to delete this interface?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuTitles;
