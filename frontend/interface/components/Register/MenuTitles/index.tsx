// components/MenuTitles.tsx
import { cookies } from 'next/headers';
import MenuList from './MenuList';
import { backendURL } from '@/public/config';
import { fullMenu, fullTab } from '../types';
import { Dispatch, SetStateAction } from 'react';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface MenuTitlesProps {
    getTabs: () => Promise<{ tabs: fullTab[], menus: fullMenu[] }>;
    menus: fullMenu[];
    setSelectedMenu: Dispatch<SetStateAction<fullMenu>>;
    returnToTab: () => void;
}



const MenuTitles: React.FC<MenuTitlesProps> = ({ getTabs, menus, setSelectedMenu, returnToTab }) => {

    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Restaurant Menus</h1>
            <div className="container mx-auto">
                <MenuList menus={menus} getTabs={getTabs} setSelectedMenu={setSelectedMenu} returnToTab={returnToTab} />
            </div>
        </div>
    );
};

export default MenuTitles;
