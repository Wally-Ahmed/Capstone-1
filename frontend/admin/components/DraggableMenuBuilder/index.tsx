'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fullMenu } from './menuProperties';
import MenuSectionComponent from './MenuSectionComponent';
import { useParams, useRouter } from 'next/navigation';
import { backendURL } from '@/public/config';

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
            e.preventDefault();
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
                } else { throw new Error('Failed to add menu section') }
            } catch (error) {
                console.error('Error saving schedule:', error);
            }
        };

        submit(e);
        setShowSectionForm(false);
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (type === 'section') {
            const newSections = Array.from(fullMenu.MenuSections);
            const [removed] = newSections.splice(source.index, 1);
            newSections.splice(destination.index, 0, removed);

            setFullMenu({ ...fullMenu, MenuSections: newSections });

            console.log(`Moved section: ${draggableId}, From: ${source.index}, To: ${destination.index}`);


            const update = async () => {
                try {
                    const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${draggableId}/reposition`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': jwt
                        },
                        body: JSON.stringify({ position: destination.index })
                    });
                    if (res.ok) {
                        await updateMenu();
                        // setFullMenu(initMenu);
                    } else { throw new Error('Failed to add menu section') }
                } catch (error) {
                    console.error('Error saving schedule:', error);
                }
            }
            setTimeout(() => {
                update();
            }, 1000);
        }

        if (type === 'item') {
            const sourceSection = fullMenu.MenuSections.find((section) => section.id === source.droppableId);
            const destinationSection = fullMenu.MenuSections.find((section) => section.id === destination.droppableId);

            if (!sourceSection || !destinationSection) return;

            const sourceItems = Array.from(sourceSection.MenuItemRoots);
            const [removed] = sourceItems.splice(source.index, 1);

            const destinationItems = Array.from(destinationSection.MenuItemRoots);
            destinationItems.splice(destination.index, 0, removed);

            const newSections = fullMenu.MenuSections.map((section) => {
                if (section.id === source.droppableId) {
                    return { ...section, MenuItemRoots: sourceItems };
                }
                if (section.id === destination.droppableId) {
                    return { ...section, MenuItemRoots: destinationItems };
                }
                return section;
            });

            setFullMenu({ ...fullMenu, MenuSections: newSections });

            console.log(`Moved item: ${draggableId}, From: ${source.index}, To: ${destination.index}, From Section: ${source.droppableId}, To Section: ${destination.droppableId}`);

            setTimeout(() => {
                updateMenu();
            }, 1000);
        }
    };

    return (
        <div className="container mx-auto p-4 mt-20 outline outline-2 outline-gray-300 shadow-lg">
            <h1 className="text-5xl font-bold text-center mb-8">{fullMenu.menu_title}</h1>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-sections" type="section">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {fullMenu.MenuSections.map((section, index) => (
                                <Draggable draggableId={section.id} index={index} key={section.id}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <MenuSectionComponent
                                                key={section.id}
                                                section={section}
                                                menuId={menuId as string}
                                                jwt={jwt}
                                                updateMenu={updateMenu}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div className="flex justify-center mt-4">
                <button
                    onClick={handleAddSection}
                    className="w-full h-20 bg-blue-500 text-white rounded shadow-md flex items-center justify-center hover:bg-blue-700"
                >
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
