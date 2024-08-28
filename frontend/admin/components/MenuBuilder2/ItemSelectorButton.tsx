import React from 'react';

interface ItemSelectorButtonProps {
    name: string;
    onClick: () => void;
}

const ItemSelectorButton: React.FC<ItemSelectorButtonProps> = ({ name, onClick }) => {
    return (
        <button type='button' className="w-1/5 ml-3 mr-2 h-32 bg-white border border-gray-300 rounded shadow flex items-center justify-center text-center hover:bg-gray-300"
            onClick={onClick}
        >
            {name}
        </button>
    );
};

export default ItemSelectorButton;
