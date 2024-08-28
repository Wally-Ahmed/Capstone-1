import React, { useEffect, useState } from 'react';
import ItemSelectorButton from './ItemSelectorButton';
import { fullMenuSection } from './menuProperties';
import NewItemRootForm from './NewItemRootForm';
import { backendURL } from '@/public/config';

import { fullItemRoot } from './menuProperties';
import Itemdetail from './ItemDetail';

interface ItemSelectorProps {
    section: fullMenuSection;
    updateMenu: () => void;
    jwt: string;
    menuId: string;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ section, updateMenu, menuId, jwt }) => {

    const [selectedItemRoot, setSelectedItemRoot] = useState<fullItemRoot | null>(null)
    const [showNewItemForm, setShowNewItemForm] = useState<boolean>(false)
    const [newItemRoot, setNewItemRoot] = useState({
        name: '',
        price: '',
        description: '',
        prepTimeRequired: false,
    });

    useEffect(() => {
        if (selectedItemRoot) {
            const item = section.MenuItemRoots.filter(item => item.id === selectedItemRoot.id)[0]
            setSelectedItemRoot(item)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section])

    const handleSubmitItemRoot = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submit = async () => {
            try {
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${section.id}/item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        menu_item_root_name: newItemRoot.name,
                        base_price: parseFloat(newItemRoot.price).toFixed(2),
                        menu_item_root_description: newItemRoot.description,
                        prep_time_required: newItemRoot.prepTimeRequired
                    })
                });
                if (res.ok) {
                    await updateMenu();
                } else {
                    console.log(`${backendURL}admin/menu/${menuId}/section/${section.id}/item`)
                    console.log(await res.json(), parseFloat(newItemRoot.price));
                    throw new Error('Failed to add menu item root');
                }
            } catch (error) {
                console.error('Error saving item root:', error);
            }
        };

        submit();
        setShowNewItemForm(false);
    };

    const handleRootChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setNewItemRoot((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

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
                <div className="flex justify-end p-4">
                    <button
                        type='button'
                        onClick={() => { setShowNewItemForm(true) }}
                        className="w-48 h-12 bg-blue-500 text-white rounded shadow flex items-center justify-center hover:bg-blue-700"
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
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded">Add New Item</span>
                    </button>
                </div>
            </div >
            {showNewItemForm && <NewItemRootForm newItemRoot={newItemRoot} handleSubmitItemRoot={handleSubmitItemRoot} handleRootChange={handleRootChange} handleCloseItemRootForm={() => { setShowNewItemForm(false) }} />}
            {selectedItemRoot && <Itemdetail closeItemDetail={() => { setSelectedItemRoot(null) }} itemRoot={selectedItemRoot} jwt={jwt} menuId={menuId} sectionId={section.id} updateMenu={updateMenu} />}
        </>
    );
};

export default ItemSelector;