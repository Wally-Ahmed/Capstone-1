import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { RestaurantTable, ItemTypes } from ".";

interface DroppableCellProps {
    x: number;
    y: number;
    onDrop: (item: { table: RestaurantTable } | null, x: number, y: number) => void;
    isSelected: boolean;
    children: React.ReactNode;
}

export const DroppableCell: React.FC<DroppableCellProps> = ({ x, y, onDrop, isSelected, children }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.TABLE,
        drop: (item: any) => onDrop(item, x, y),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <td ref={drop} className={`w-16 h-16 border border-gray-100 ${isSelected && children ? 'bg-gray-300' : 'bg-white'} flex items-center justify-center`}>
            {children}
        </td>
    );
};