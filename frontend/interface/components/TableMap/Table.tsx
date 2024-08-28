import { RestaurantTable, ItemTypes } from ".";

interface TableProps {
    table: RestaurantTable | null;
    onClick?: () => void;
}


export const Table: React.FC<TableProps> = ({ table, onClick }) => {

    let className;
    switch (table.table_status) {
        case 'available':
            className = 'w-8 h-8 bg-blue-500 rounded-full cursor-pointer flex items-center justify-center';
            break;
        case 'on-hold':
            className = 'w-8 h-8 bg-amber-500 rounded-full cursor-pointer flex items-center justify-center';
            break;
        case 'occupied':
            className = 'w-8 h-8 bg-red-500 rounded-full cursor-pointer flex items-center justify-center'
            break;

        default:
            className = 'w-8 h-8 bg-gray-500 rounded-full cursor-pointer flex items-center justify-center'
            break;
    }


    return (
        <div
            className={className}
            onClick={onClick}
        />
    );
};