'use client';

import { backendURL } from '@/public/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AddMenuForm from './AddMenuForm';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface MenuListProps {
    jwt: string;
}


const MenuList: React.FC<MenuListProps> = ({ jwt }) => {
    const [menus, setMenus] = useState([]);
    const [showAddMenuPopup, setShowAddMenuPopup] = useState(false);
    const [menuTitle, setMenuTitle] = useState('');
    const [showRenameForm, setShowRenameForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [newMenuTitle, setNewMenuTitle] = useState('');
    const router = useRouter();


    const updateMenus = async () => {

        if (!jwt) {
            throw new Error('Not logged in!');
        };
        const res = await fetch(`${backendURL}admin/menu`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        },);
        const response: {
            menus: { menu_title: string, restaurant_id: string, id: string }[]
        } = await res.json();

        if (!res.ok) { router.refresh() }


        setMenus(response.menus)

        return { data: response.menus };
    }

    useEffect(() => {
        updateMenus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePlusCardClick = () => {
        setShowAddMenuPopup(true);
    };

    const handleAddMenuClose = () => {
        setShowAddMenuPopup(false);
    };

    const handleAddMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMenuTitle(e.target.value);
    };

    const handleAddMenuSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submit = async () => {
            try {
                const res = await fetch(`${backendURL}admin/menu`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({ menu_title: menuTitle })
                });
                if (res.ok) {
                    await updateMenus();
                } else {
                    throw new Error('Failed to add menu');
                }
            } catch (error) {
                console.error('Error saving schedule:', error);
            }
        };

        submit();
        setShowAddMenuPopup(false);
    };

    const handleRenameMenu = (menu: Menu) => {
        setSelectedMenu(menu);
        setNewMenuTitle(menu.menu_title);
        setShowRenameForm(true);
    };

    const handleCloseRenameForm = () => {
        setShowRenameForm(false);
    };

    const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMenuTitle(e.target.value);
    };

    const handleSubmitRename = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedMenu) return;
        try {
            const res = await fetch(`${backendURL}admin/menu/${selectedMenu.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ menu_title: newMenuTitle })
            });
            if (res.ok) {
                await updateMenus()
                setShowRenameForm(false);
            } else {
                console.error('Failed to rename menu');
            }
        } catch (error) {
            console.error('Error renaming menu:', error);
        }
    };

    const handleDeleteMenu = (menu: Menu) => {
        setSelectedMenu(menu);
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedMenu) return;
        try {
            const res = await fetch(`${backendURL}admin/menu/${selectedMenu.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });
            if (res.ok) {
                router.refresh();
                setShowDeleteConfirm(false);
            } else {
                console.error('Failed to delete menu');
            }
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    return (
        <div className="relative">
            <div className="flex flex-wrap justify-start gap-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                {menus.map((menu) => (
                    <div key={menu.id} className="relative">
                        <Link href={`/app/menus/${menu.id}`}>
                            <div
                                className="flex flex-col items-center justify-center w-48 h-64 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
                            >
                                <h2 className="text-center text-xl font-bold">{menu.menu_title}</h2>
                            </div>
                        </Link>
                        <div className="absolute top-1 right-0 flex space-x-0">
                            <button
                                onClick={() => handleRenameMenu(menu)}
                                className="p-1 text-black rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="15px" width="15px" viewBox="0 0 306.637 306.637">
                                    <g>
                                        <g>
                                            <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896    l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z" />
                                            <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095    L265.13,75.602L231.035,41.507z" />
                                        </g>
                                    </g>
                                </svg>
                            </button>
                            <button
                                onClick={() => handleDeleteMenu(menu)}
                                className="p-1 text-black rounded"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="5 0 24 24"
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
                <div
                    className="flex flex-col items-center justify-center w-48 h-64 p-4 bg-white border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    onClick={handlePlusCardClick}
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

            {showAddMenuPopup && (
                <AddMenuForm menuTitle={menuTitle} handleAddMenuChange={handleAddMenuChange} handleAddMenuSubmit={handleAddMenuSubmit} handleAddMenuClose={handleAddMenuClose} />
            )}

            {showRenameForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Rename Menu</h2>
                        <form onSubmit={handleSubmitRename}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Menu Title
                                </label>
                                <input
                                    type="text"
                                    value={newMenuTitle}
                                    onChange={handleRenameChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                    onClick={handleCloseRenameForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Rename Menu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Delete Menu</h2>
                        <p>Are you sure you want to delete this menu?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                onClick={handleCloseDeleteConfirm}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={handleConfirmDelete}
                            >
                                Delete Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuList;