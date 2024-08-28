'use client';

import React, { useEffect, useState } from 'react';
import { fullItemRoot, fullMenu, fullMenuSection } from './menuProperties';

import MenuSectionList from './MenuSectionList';
import { useParams, useRouter } from 'next/navigation';
import { backendURL } from '@/public/config';
import ItemSelector from './ItemSelector';
import { fullTab } from '../types';

interface MenuProps {
    selectedMenu: fullMenu;
    handleCreateNewTicketItem: (itemId: string) => Promise<void>;
    setSelectedMenu: React.Dispatch<React.SetStateAction<fullMenu>>;
    closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ selectedMenu, setSelectedMenu, handleCreateNewTicketItem, closeMenu }) => {
    const [fullMenu, setFullMenu] = useState<fullMenu>(selectedMenu);
    const [selectedSection, setSelectedSection] = useState<fullMenuSection | null>(null)

    const params = useParams();
    const { menuId } = params;

    const router = useRouter();


    useEffect(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="container mx-auto p-4 mt-20 flex">
                <div className="w-1/3 pr-4">

                    <div className="bg-white p-4 rounded shadow-lg border border-gray-300">
                        <button
                            onClick={() => { setSelectedMenu(null) }}
                            className="flex mb-3"
                        >
                            <svg width="30" height="30" viewBox="-3 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 19L8 12L15 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <div id="shiftList" style={{ height: '69vh' }} className="overflow-hidden">
                            <div className="space-y-4 h-full overflow-y-auto pb-10" >
                                {fullMenu.MenuSections.map((section) => (
                                    <MenuSectionList key={section.id} section={section} selectSection={() => { setSelectedSection(section) }} selectedSection={selectedSection} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-2/3 pl-4" >
                    <div className="bg-gray-200 border border-gray-300 rounded-md mb-4 flex" >
                        <div id='parent' className="w-full m-2" style={{ height: '75vh' }}>

                            {selectedSection && <ItemSelector section={selectedSection} handleCreateNewTicketItem={handleCreateNewTicketItem} closeMenu={closeMenu} />}

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Menu;
