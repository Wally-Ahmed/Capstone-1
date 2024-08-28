'use client';

import React, { useEffect, useState } from 'react';
import { fullItemRoot, fullMenu, fullMenuSection } from './menuProperties';

import MenuSectionList from './MenuSectionList';
import { useParams, useRouter } from 'next/navigation';
import { backendURL } from '@/public/config';
import ItemSelector from './ItemSelector';

interface MenuBuilderProps {
    jwt: string;
}

const MenuBuilder: React.FC<MenuBuilderProps> = ({ jwt }) => {
    const [fullMenu, setFullMenu] = useState<fullMenu>({ menu_title: '', MenuSections: [] });
    const [showSectionForm, setShowSectionForm] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [selectedSection, setSelectedSection] = useState<fullMenuSection | null>(null)

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

        if (!res.ok) { router.refresh() }

        const response = await res.json();
        setFullMenu(response.menu);
        return response.menu as fullMenu;
    };

    useEffect(() => {
        updateMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const initializeMenu = async () => {
            const sections = fullMenu.MenuSections
            if (fullMenu && !selectedSection) {
                if (sections.length > 0) {
                    setSelectedSection(sections[0])
                } else {
                    setSelectedSection(null)
                }
            } else if (selectedSection) {
                if (sections.length === 0) {
                    setSelectedSection(null)
                } else {
                    const section = fullMenu.MenuSections.filter(section => section.id === selectedSection.id)[0]
                    setSelectedSection(section)
                }
            }
        };
        initializeMenu();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullMenu]);

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
                } else { throw new Error('Failed to add menu section') }
            } catch (error) {
                console.error('Error saving schedule:', error);
            }
        };

        submit(e);
        setShowSectionForm(false);
    };

    return (
        <>
            <div className="container mx-auto p-4 mt-20 flex">
                <div className="w-1/3 pr-4">

                    <div className="bg-white p-4 rounded shadow-lg border border-gray-300">

                        {/* fix scroll */}
                        <div id="shiftList" style={{ height: '65vh' }} className="overflow-hidden">
                            <div className="space-y-4 h-full overflow-y-auto pb-10" >
                                {fullMenu.MenuSections.map((section) => (
                                    <MenuSectionList key={section.id} section={section} menuId={menuId as string} jwt={jwt} updateMenu={updateMenu} selectSection={() => { setSelectedSection(section) }} selectedSection={selectedSection} />
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleAddSection}
                            className="w-full h-20 bg-blue-500 text-white rounded shadow-md flex items-center justify-center hover:bg-blue-700"
                        >
                            <svg
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
                            </svg>
                            {/* Add Section */}
                        </button>
                        {/* {selectedTable ?
                            <EditTableForm selectedTable={selectedTable} setSelectedTable={setSelectedTable} handleUpdateTable={handleUpdateTable} setShowDeleteTableConfirm={setShowDeleteTableConfirm} />
                            : <EditSectionForm handleUpdateSection={handleUpdateSection} sectionName={sectionName} setSectionName={setSectionName} width={width} setWidth={setWidth} height={height} setHeight={setHeight} />} */}
                    </div>
                </div>
                <div className="w-2/3 pl-4" >
                    <div className="bg-gray-200 border border-gray-300 rounded-md mb-4 flex" >
                        <div id='parent' className="w-full m-2" style={{ height: '75vh' }}>

                            {selectedSection && <ItemSelector section={selectedSection} updateMenu={updateMenu} jwt={jwt} menuId={menuId as string} />}

                        </div>
                    </div>
                </div>
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

        </>
    );
};

export default MenuBuilder;
