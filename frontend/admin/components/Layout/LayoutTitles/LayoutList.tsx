'use client';

import { backendURL } from '@/public/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AddLayoutForm from './AddLayoutForm';
import EditLayoutForm from './EditLayoutForm';
import DeleteLayoutForm from './DeleteLayoutForm';

interface Layout {
    id: string;
    layout_name: string;
    restaurant_id: string;
}

interface LayoutListProps {
    jwt: string;
    activeLayoutId: string;
}


const LayoutList: React.FC<LayoutListProps> = ({ jwt, activeLayoutId }) => {
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const [showAddLayoutPopup, setShowAddLayoutPopup] = useState(false);
    const [layoutTitle, setLayoutTitle] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
    const [newLayoutTitle, setNewLayoutTitle] = useState('');
    const router = useRouter();

    const updateLayouts = async () => {

        if (!jwt) {
            throw new Error('Not logged in!');
        }
        const res = await fetch(`${backendURL}admin/layout`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });

        if (!res.ok) { router.refresh() }

        const response: { layouts: { layout_name: string, restaurant_id: string, id: string }[] } = await res.json();

        setLayouts(response.layouts);

        return { data: response.layouts };
    };

    useEffect(() => {
        updateLayouts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlusCardClick = () => {
        setShowAddLayoutPopup(true);
    };

    const handleAddLayoutClose = () => {
        setShowAddLayoutPopup(false);
    };

    const handleAddLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLayoutTitle(e.target.value);
    };

    const handleAddLayoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submit = async () => {
            try {
                const res = await fetch(`${backendURL}admin/layout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({ layout_name: layoutTitle })
                });
                if (res.ok) {
                    await updateLayouts();
                } else {
                    throw new Error('Failed to add layout');
                }
            } catch (error) {
                console.error('Error saving layout:', error);
            }
        };

        submit();
        setShowAddLayoutPopup(false);
    };

    const handleRenameLayout = (layout: Layout) => {
        setSelectedLayout(layout);
        setNewLayoutTitle(layout.layout_name);
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
    };

    const handleRenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLayoutTitle(e.target.value);
    };

    const handleSubmitRename = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedLayout) return;
        try {
            const res = await fetch(`${backendURL}admin/layout/${selectedLayout.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ layout_name: newLayoutTitle })
            });
            if (res.ok) {
                await updateLayouts();
                setShowEditForm(false);
            } else {
                console.error('Failed to rename layout');
            }
        } catch (error) {
            console.error('Error renaming layout:', error);
        }
    };

    const handleSetActiveLayout = async (layoutId: string) => {
        try {
            const res = await fetch(`${backendURL}admin/layout/${layoutId}/set-active`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });
            if (res.ok) {
                await updateLayouts();
                handleCloseEditForm();
            } else {
                throw new Error('Failed to set active layout');
            }
        } catch (error) {
            console.error('Error setting active layout:', error);
        }
    };

    const handleDeleteLayout = (layout: Layout) => {
        setSelectedLayout(layout);
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedLayout) return;
        try {
            const res = await fetch(`${backendURL}admin/layout/${selectedLayout.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });
            if (res.ok) {
                await updateLayouts();
                setShowDeleteConfirm(false);
            } else {
                alert('Failed to delete layout')
                console.error('Failed to delete layout');
            }
        } catch (error) {
            console.error('Error deleting layout:', error);
        }
    };


    return (
        <div className="relative">
            <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                {layouts.map((layout) => (
                    <div
                        key={layout.id}
                        className={`relative w-full`}
                    >
                        <Link href={`/app/layouts/${layout.id}`}>
                            <div className="flex items-center justify-center w-full h-64 p-4 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer">
                                <h2 className="text-center text-2xl font-bold">{layout.layout_name}</h2>
                            </div>
                        </Link>
                        <div className="absolute top-1 right-0 flex space-x-1">
                            {layout.id === activeLayoutId && <p className='text-green-500 text-2xl'><b>Active</b></p>}
                            <button
                                onClick={() => handleRenameLayout(layout)}
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
                                onClick={() => handleDeleteLayout(layout)}
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
                <div
                    className="flex items-center justify-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
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

            {showAddLayoutPopup && (
                <AddLayoutForm layoutTitle={layoutTitle} handleAddLayoutChange={handleAddLayoutChange} handleAddLayoutSubmit={handleAddLayoutSubmit} handleAddLayoutClose={handleAddLayoutClose} />
            )}

            {showEditForm && selectedLayout && (
                <EditLayoutForm
                    handleSubmitRename={handleSubmitRename}
                    newLayoutTitle={newLayoutTitle}
                    handleRenameChange={handleRenameChange}
                    handleCloseEditForm={handleCloseEditForm}
                    handleSetActiveLayout={() => handleSetActiveLayout(selectedLayout.id)}
                />
            )}

            {showDeleteConfirm && (
                <DeleteLayoutForm handleConfirmDelete={handleConfirmDelete} handleCloseDeleteConfirm={handleCloseDeleteConfirm} />
            )}
        </div>
    );
};

export default LayoutList;
