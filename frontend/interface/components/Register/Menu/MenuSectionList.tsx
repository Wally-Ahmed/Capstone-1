'use client';

import React, { useState } from 'react';
import { fullMenu, fullMenuSection } from './menuProperties'; // Adjust the import path
// import MenuItemRootComponent from './MenuItemRootComponent';
import { backendURL } from '@/public/config';
import { fullTab } from '../types';

interface MenuSectionComponentProps {
    section: fullMenuSection;
    selectedSection: fullMenuSection
    selectSection: () => void;
}

const MenuSectionComponent: React.FC<MenuSectionComponentProps> = ({ section, selectedSection, selectSection }) => {


    return (
        <div
            onClick={selectSection}
            className={`mb-2 p-4 border rounded shadow-md relative ${(selectedSection && section.id === selectedSection.id) ? 'bg-blue-400' : ''}`}
        >
            <div className='flex justify-start container mx-auto'>
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-right mb-2 p-4 mt-1">{section.menu_section_title}</h2>
                </div>
            </div>

        </div>
    );
};

export default MenuSectionComponent;
