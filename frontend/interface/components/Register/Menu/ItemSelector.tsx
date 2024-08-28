import React, { useEffect, useState } from 'react';
import ItemSelectorButton from './ItemSelectorButton';
import { fullMenuSection } from './menuProperties';
import { backendURL } from '@/public/config';

import { fullItemRoot } from './menuProperties';
import Itemdetail from './ItemDetail';
import { fullMenu, fullTab } from '../types';

interface ItemSelectorProps {
    section: fullMenuSection;
    closeMenu: () => void;
    handleCreateNewTicketItem: (itemId: string) => Promise<void>;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ section, handleCreateNewTicketItem, closeMenu }) => {

    const [selectedItemRoot, setSelectedItemRoot] = useState<fullItemRoot | null>(null)

    useEffect(() => {
        if (selectedItemRoot) {
            const item = section.MenuItemRoots.filter(item => item.id === selectedItemRoot.id)[0]
            setSelectedItemRoot(item)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])


    return (
        <>
            <div id="parent" className="flex flex-col h-full">
                <div className="space-y-4 h-full overflow-y-auto pb-10">
                    <div className="flex-grow flex flex-wrap gap-6 p-4 pl-10 pr-10">
                        {
                            section.MenuItemRoots.length
                                ? section.MenuItemRoots.map((menuItem) => (
                                    <ItemSelectorButton key={menuItem.id} name={menuItem.menu_item_root_name} onClick={() => { setSelectedItemRoot(menuItem) }} />
                                ))
                                : <h2 className="text-2xl font-bold mb-4">Add an item to section</h2>
                        }
                    </div>
                </div>
            </div >
            {selectedItemRoot && <Itemdetail closeItemDetail={() => { setSelectedItemRoot(null) }} itemRoot={selectedItemRoot} handleCreateNewTicketItem={handleCreateNewTicketItem} closeMenu={closeMenu} />}
        </>
    );
};

export default ItemSelector;
