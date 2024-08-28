'use client';

import { backendURL } from '@/public/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fullMenu, fullTab } from '../types';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface MenuListProps {
    menus: any[]
    getTabs: () => Promise<{ tabs: fullTab[] }>;
    setSelectedMenu: Dispatch<SetStateAction<fullMenu>>;
    returnToTab: () => void;
}

const MenuList: React.FC<MenuListProps> = ({ menus, getTabs, setSelectedMenu, returnToTab }) => {
    // const router = useRouter();

    const updateMenus = async () => {
        await getTabs()
    }

    useEffect(() => {
        updateMenus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="relative">
            <div className='p-4 border border-gray-300 rounded-lg shadow-lg'>

                <button
                    onClick={() => { returnToTab() }}
                    className="flex mb-3"
                >
                    <svg width="30" height="30" viewBox="-3 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 19L8 12L15 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <div className="flex flex-wrap justify-start gap-4">
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            onClick={() => { setSelectedMenu(menu) }}
                        >
                            <div
                                className="flex flex-col items-center justify-center w-48 h-64 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
                            >
                                <h2 className="text-center text-xl font-bold">{menu.menu_title}</h2>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    );
};

export default MenuList;
