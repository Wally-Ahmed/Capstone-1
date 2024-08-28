'use client';

import React, { useState } from 'react';
import { fullMenu, fullMenuSection } from './menuProperties'; // Adjust the import path
import { backendURL } from '@/public/config';
import NewItemRootForm from './NewItemRootForm';

interface MenuSectionComponentProps {
    menuId: string;
    jwt: string;
    section: fullMenuSection;
    selectedSection: fullMenuSection
    updateMenu: () => Promise<fullMenu>;
    selectSection: () => void;
}

const MenuSectionComponent: React.FC<MenuSectionComponentProps> = ({ menuId, section, selectedSection, jwt, updateMenu, selectSection }) => {

    const [showRenameForm, setShowRenameForm] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState(section.menu_section_title);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);



    const handleRenameSection = () => {
        setShowRenameForm(true);
    };

    const handleCloseRenameForm = () => {
        setShowRenameForm(false);
    };

    const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSectionTitle(e.target.value);
    };

    const handleSubmitRename = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${section.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ menu_section_title: newSectionTitle })
            });
            if (res.ok) {
                await updateMenu();
                setShowRenameForm(false);
            } else {
                alert((await res.json()).error.message)
            }
        } catch (error) {
            console.error('Error renaming section:', error);
        }
    };

    const handleDeleteSection = () => {
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${section.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });
            if (res.ok) {
                await updateMenu();
                setShowDeleteConfirm(false);
            } else {
                alert((await res.json()).error.message)
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    return (
        <div
            onClick={selectSection}
            className={`mb-2 p-4 border rounded shadow-md relative ${(selectedSection && section.id === selectedSection.id) ? 'bg-blue-400' : ''}`}
        >
            <div className='flex justify-start container mx-auto'>
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-right mb-2 p-4 mt-1">{section.menu_section_title}</h2>
                    <div>
                        <button
                            onClick={handleRenameSection}
                            className="p-1  text-black rounded "
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
                            onClick={handleDeleteSection}
                            className="p-1  text-black rounded "
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 -3 24 24"
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

            {showRenameForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Rename Section</h2>
                        <form onSubmit={handleSubmitRename}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Section Title
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
                                    onClick={handleCloseRenameForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Rename Section
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Delete Section</h2>
                        <p>Are you sure you want to delete this section?</p>
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
                                Delete Section
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuSectionComponent;
