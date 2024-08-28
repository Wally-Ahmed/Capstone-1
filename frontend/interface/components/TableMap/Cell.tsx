import { RestaurantTable, ItemTypes } from ".";

interface CellProps {
    isSelected: boolean;
    children: React.ReactNode;
}

export const Cell: React.FC<CellProps> = ({ isSelected, children }) => {

    return (
        <td className={`w-16 h-16 border border-gray-100 ${isSelected && children ? 'bg-gray-300' : 'bg-white'} flex items-center justify-center`}>
            {children}
        </td>
    );
};