import { Section, RestaurantTable } from ".";
import { Table } from "./Table";
import { Cell } from "./Cell";

interface GridProps {
    section: Section;
    selectedTable: RestaurantTable;
    // handleDrop: (x: number, y: number, table: RestaurantTable | null) => void;
    handleTableClick: (table: RestaurantTable) => void;
}

export const Grid: React.FC<GridProps> = ({ section, selectedTable, handleTableClick }) => {
    const grid = Array.from({ length: section.height }, () =>
        Array.from({ length: section.width }, () => null)
    );

    section.restaurantTables.forEach((table) => {
        if (table.x >= 0 && table.x < section.width && table.y >= 0 && table.y < section.height) {
            grid[table.y][table.x] = table;
        }
    });

    return (
        <div className="bg-gray-200 border border-gray-300 rounded-md p-4 mb-4 flex items-center flex-col">
            {/* <h1 className="text-4xl font-bold mb-8">{section.section_name}</h1> */}
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, rowIndex) => (
                        <tr key={rowIndex} className='flex'>
                            {row.map((cell, cellIndex) => (
                                <Cell key={cellIndex} isSelected={cell === selectedTable}>
                                    {cell ? (
                                        <Table table={cell} onClick={() => handleTableClick(cell)} />
                                    ) : null}
                                </Cell>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};