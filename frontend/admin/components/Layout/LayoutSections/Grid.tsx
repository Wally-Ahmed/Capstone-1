import { Section } from ".";

interface SectionProps {
    section: {
        height: number;
        width: number;
        restaurantTables: {
            x: number;
            y: number;
        }[];
    };
}

const SectionGrid: React.FC<SectionProps> = ({ section }) => {
    const grid = Array.from({ length: section.height }, () =>
        Array.from({ length: section.width }, () => null)
    );

    section.restaurantTables.forEach((table) => {
        if (table.x >= 0 && table.x < section.width && table.y >= 0 && table.y < section.height) {
            grid[table.y][table.x] = table;
        }
    });

    console.log({ section });

    return (
        <div className="p-4 mb-4 flex justify-center">
            <table className="border-collapse">
                <tbody>
                    {grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="w-16 h-16 border border-gray-100 bg-white">
                                    {cell ? (
                                        <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto"></div>
                                    ) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SectionGrid;