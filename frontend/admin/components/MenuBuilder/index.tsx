'use client';

import React, { useEffect, useState } from 'react';
import { fullMenu } from './menuProperties';
import MenuSectionComponent from './MenuSectionComponent';
import { useParams, useRouter } from 'next/navigation';
import { backendURL } from '@/public/config';
import SectionTitle from '../Common/SectionTitle';

interface MenuBuilderProps {
    jwt: string;
}

const MenuBuilder: React.FC<MenuBuilderProps> = ({ jwt }) => {
    const [fullMenu, setFullMenu] = useState<fullMenu>({ menu_title: '', MenuSections: [] });
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');

    const params = useParams();
    const { menuId } = params;

    const router = useRouter();

    const updateMenu = async () => {
        const res = await fetch(`${backendURL}admin/menu/${menuId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
        });
        const response = await res.json();
        setFullMenu(response.menu);
        return response.menu;
    };

    useEffect(() => {
        const initializeMenu = async () => {
            const menu = await updateMenu();
            // setFullMenu(menu);
        };
        initializeMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddSection = () => {
        setShowSectionForm(true);
    };

    const handleCloseSectionForm = () => {
        setShowSectionForm(false);
    };

    const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSectionTitle(e.target.value);
    };

    const handleSubmitSection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submit = async (e: React.FormEvent<HTMLFormElement>) => {
            try {
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({ menu_section_title: newSectionTitle })
                });
                if (res.ok) {
                    await updateMenu();
                    // setFullMenu(initMenu);
                } else { throw new Error('Failed to add menu section') }
            } catch (error) {
                console.error('Error saving schedule:', error);
            }
        };

        submit(e);
        setShowSectionForm(false);
    };

    return (
        <div className="container mx-auto p-4 mt-40 outline outline-2 outline-gray-300 shadow-lg">
            <h1 className="text-5xl font-bold text-center mb-8">{fullMenu.menu_title}</h1>
            {fullMenu.MenuSections.map((section) => (
                <MenuSectionComponent key={section.id} section={section} menuId={menuId as string} jwt={jwt} updateMenu={updateMenu} />
            ))}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handleAddSection}
                    className="w-full h-20 bg-blue-500 text-white rounded shadow-md flex items-center justify-center hover:bg-blue-700"
                >
                    {/* <svg
                        className="w-6 h-6"
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
                    </svg> */}
                    Add Section
                </button>
            </div>

            {showSectionForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Section</h2>
                        <form onSubmit={handleSubmitSection}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Title
                                </label>
                                <input
                                    type="text"
                                    value={newSectionTitle}
                                    onChange={handleSectionTitleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                    onClick={handleCloseSectionForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Add Section
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuBuilder;
