import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { RestaurantTable, ItemTypes } from ".";

interface DraggableTableProps {
    table: RestaurantTable | null;
    onClick?: () => void;
}


export const DraggableTable: React.FC<DraggableTableProps> = ({ table, onClick }) => {
    const [, drag] = useDrag({
        type: ItemTypes.TABLE,
        item: table ? { type: ItemTypes.TABLE, table } : { type: ItemTypes.TABLE },
    });

    return (
        <div
            id={table ? table.id : 'newTableElement'}
            ref={drag}
            className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer flex items-center justify-center"
            onClick={(onClick)}
        />
    );
};