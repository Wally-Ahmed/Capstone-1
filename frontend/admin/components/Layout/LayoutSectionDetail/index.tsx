'use client';
import { backendURL } from '@/public/config';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DeleteTableConfirm from './DeleteTableConfirm';
import EditTableForm from './EditTableForm';
import EditSectionForm from './EditSectionForm';
import { DraggableTable } from "./DraggableTable";
import { DroppableCell } from "./DroppableCell";
import { Grid } from "./Grid";

export const ItemTypes = {
    TABLE: 'table',
};

export interface Reservation {
    id: string;
    time: string;
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

export interface LayoutDetailComponentProps {
    jwt: string;
}

const LayoutDetailComponent: React.FC<LayoutDetailComponentProps> = ({ jwt }) => {
    const [layout, setLayout] = useState<Layout>({ id: '', layout_name: '', sections: [] });
    const [section, setSection] = useState<Section | null>(null);
    const [sectionName, setSectionName] = useState('');
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
    const [showDeleteTableConfirm, setShowDeleteTableConfirm] = useState(false);

    const params = useParams();
    const { layoutId, sectionId } = params;

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


        if (!res.ok) { router.refresh() }

        const data = await res.json();
        setLayout(data.layout);

        const selectedSection = data.layout.sections.find((sec: Section) => sec.id === sectionId);
        if (selectedSection) {
            setSection(selectedSection);
            setSectionName(selectedSection.section_name);
            setWidth(selectedSection.width);
            setHeight(selectedSection.height);
        }
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

    const handleUpdateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${backendURL}admin/layout/${layoutId}/section/${sectionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
            body: JSON.stringify({ section_name: sectionName, width, height }),
        });

        if (res.ok) {
            await getLayout();
        } else {
            alert((await res.json()).error.message)
            console.error('Failed to update section');
        }
    };

    const handleDrop = async (x: number, y: number, table: RestaurantTable | null) => {
        if (!section) return;

        if (table) {
            // Reposition existing table
            const updatedTable = { ...table, x, y };
            setSection(prev => {
                if (!prev) return prev;
                const updatedTables = prev.restaurantTables.map(t => t.id === table.id ? updatedTable : t);
                return { ...prev, restaurantTables: updatedTables };
            });

            const res = await fetch(`${backendURL}admin/layout/${layoutId}/section/${sectionId}/table/${table.id}/reposition`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify({ x, y }),
            });

            if (res.ok) {
                await getLayout();
            } else {
                console.error('Failed to reposition table', await res.json());
                await getLayout();
            }
        } else {
            // Add new table
            const newTable = {
                table_name: 'New Table',
                table_status: 'available',
                reservable: true,
                seats: 4,
                x,
                y,
            };

            const res = await fetch(`${backendURL}admin/layout/${layoutId}/section/${sectionId}/table`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
                body: JSON.stringify(newTable),
            });

            if (res.ok) {
                await getLayout();
            } else {
                console.error('Failed to add table', JSON.stringify(newTable));
            }
        }
    };

    const handleTableClick = (table: RestaurantTable) => {
        setSelectedTable(table);
    };

    const handleUpdateTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;

        const res = await fetch(`${backendURL}admin/layout/${layoutId}/section/${sectionId}/table/${selectedTable.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
            body: JSON.stringify(selectedTable),
        });

        if (res.ok) {
            await getLayout();
        } else {
            console.error('Failed to update table');
        }
    };

    const handleDeleteTable = async () => {
        if (!selectedTable) return;

        const res = await fetch(`${backendURL}admin/layout/${layoutId}/section/${sectionId}/table/${selectedTable.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
            },
        });

        if (res.ok) {
            await getLayout();
            setSelectedTable(null);
        } else {
            alert((await res.json()).error.message)
            console.error('Failed to delete table');
        }

        setShowDeleteTableConfirm(false);
    };


    if (!section) {
        return <div>Loading...</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-4 mt-20 flex">
                <div className="w-2/3 pr-4">
                    <h1 className="text-4xl font-bold mb-8">{section.section_name}</h1>
                    <Grid section={section} selectedTable={selectedTable} handleDrop={handleDrop} handleTableClick={handleTableClick} />
                </div>
                <div className="w-1/3 pl-4">

                    <div className="bg-white p-4 rounded shadow-lg border border-gray-300 min-h-[620px]">
                        {selectedTable ?
                            <EditTableForm selectedTable={selectedTable} setSelectedTable={setSelectedTable} handleUpdateTable={handleUpdateTable} setShowDeleteTableConfirm={setShowDeleteTableConfirm} />
                            : <EditSectionForm handleUpdateSection={handleUpdateSection} sectionName={sectionName} setSectionName={setSectionName} width={width} setWidth={setWidth} height={height} setHeight={setHeight} />}
                    </div>
                </div>
            </div>
            {showDeleteTableConfirm && <DeleteTableConfirm setShowDeleteTableConfirm={setShowDeleteTableConfirm} handleDeleteTable={handleDeleteTable} />}
        </DndProvider>
    );
};



export default LayoutDetailComponent;
