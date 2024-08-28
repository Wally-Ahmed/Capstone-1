import { Section, RestaurantTable } from ".";
import { DraggableTable } from "./DraggableTable";
import { DroppableCell } from "./DroppableCell";

interface GridProps {
    section: Section;
    selectedTable: RestaurantTable;
    handleDrop: (x: number, y: number, table: RestaurantTable | null) => void;
    handleTableClick: (table: RestaurantTable) => void;
}

export const Grid: React.FC<GridProps> = ({ section, selectedTable, handleDrop, handleTableClick }) => {
    const grid = Array.from({ length: section.height }, () =>
        Array.from({ length: section.width }, () => null)
    );

    console.log(grid)

    section.restaurantTables.forEach((table) => {
        if (table.x >= 0 && table.x < section.width && table.y >= 0 && table.y < section.height) {
            grid[table.y][table.x] = table;
        }
    });

    return (
        <div className="bg-gray-200 border border-gray-300 rounded-md p-4 mb-4 flex justify-center">
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, rowIndex) => (
                        <tr key={rowIndex} className='flex'>
                            {row.map((cell, cellIndex) => (
                                <DroppableCell key={cellIndex} x={cellIndex} y={rowIndex} onDrop={(item, x, y) => handleDrop(x, y, item ? item.table : null)} isSelected={(cell && selectedTable && cell.id === selectedTable.id)}>
                                    {cell ? (
                                        <DraggableTable table={cell} onClick={() => handleTableClick(cell)} />
                                    ) : null}
                                </DroppableCell>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};