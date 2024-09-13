'use client';
import { backendURL } from '@/public/config';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Grid from './Grid';
import DeleteSectionConfirm from './DeleteSectionConfirm';

export interface Reservation {
    id: string;
    time: string;
    // Add other properties as needed
}

export interface RestaurantTable {
    id: string;
    table_name: string;
    table_status: string;
    reservable: boolean;
    seats: number;
    x: number;
    y: number;
}

export interface Section {
    id: string;
    section_name: string;
    width: number;
    height: number;
    position: number;
    restaurantTables: RestaurantTable[];
}

export interface Layout {
    id: string;
    layout_name: string;
    sections: Section[];
}

export interface LayoutComponentProps {
    jwt: string;
}

const LayoutComponent: React.FC<LayoutComponentProps> = ({ jwt }) => {
    const [layout, setLayout] = useState<Layout>({ id: '', layout_name: '', sections: [] });
    const [showForm, setShowForm] = useState(false);
    const [sectionName, setSectionName] = useState('');
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);


    const [selectedSection, setSelectedSection] = useState<Section | null>(null)

    const params = useParams();
    const { layoutId } = params;

    const router = useRouter();

    const getLayout = async () => {
        const res = await fetch(`${backendURL}admin/layout/${layoutId}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
        });

        if (!res.ok) {
            if (!res.ok) { router.refresh() }
        }

        const data = await res.json();
        setLayout(data.layout);
    };

    const handleDeleteSection = async () => {

        const res = await fetch(`${backendURL}admin/layout/${layoutId}/section/${selectedSection.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
        });

        if (res.ok) {
            await getLayout();
            setSelectedSection(null);
        } else {
            alert((await res.json()).error.message)
            console.error('Failed to delete table');
        }

        setSelectedSection(null)
    };

    useEffect(() => {
        const initLayout = async () => {
            try {
                await getLayout();
            } catch (error) {
                console.error('Error fetching layout:', error);
            }
        };

        initLayout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${backendURL}admin/layout/${layoutId}/section`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
            body: JSON.stringify({ section_name: sectionName, width, height }),
        });

        if (res.ok) {
            await getLayout();
            setShowForm(false);
            setSectionName('');
            setWidth(1);
            setHeight(1);
        } else {
            console.error('Failed to add section');
        }
    };

    return (
        <div className="p-4 mt-20 container mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">{layout.layout_name}</h1>
            {layout.sections.map((section) => (
                <div className="bg-gray-200 border border-gray-300 rounded-md mb-8" key={section.id}>
                    <div className='flex justify-end'>
                        <button className="p-5"
                            onClick={() => setSelectedSection(section)}
                        >
                            <svg
                                className="w-10 h-10"
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
                    <Link key={section.id} href={`/app/layouts/${layoutId}/sections/${section.id}`}>
                        <Grid section={section} />
                        <h2 className="text-2xl font-bold mb-4 text-center">{section.section_name}</h2>
                    </Link>
                </div>
            ))}
            <button
                onClick={() => setShowForm(true)}
                className="w-full h-12 bg-blue-500 text-white rounded shadow-md flex items-center justify-center hover:bg-blue-700 mt-4"
            >
                Add Section
            </button>

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Section</h2>
                        <form onSubmit={handleAddSection}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Name
                                </label>
                                <input
                                    type="text"
                                    value={sectionName}
                                    onChange={(e) => setSectionName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Width
                                </label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Height
                                </label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                    onClick={() => setShowForm(false)}
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

            {selectedSection && <DeleteSectionConfirm handleDeleteSection={() => { handleDeleteSection() }} closeDeleteSectionConfirm={() => { setSelectedSection(null) }} />}
        </div>
    );
};

export default LayoutComponent;
