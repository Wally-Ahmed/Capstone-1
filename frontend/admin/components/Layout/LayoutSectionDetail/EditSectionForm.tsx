import { DraggableTable } from "./DraggableTable";

export default function EditSectionForm({ handleUpdateSection, sectionName, setSectionName, width, setWidth, height, setHeight }) {
    return (
        <>

            <h2 className="text-xl font-bold mb-4">Update Section</h2>
            <form onSubmit={handleUpdateSection}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Name
                    </label>
                    <input
                        type="text"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                    </label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                        min="3"
                        max="13"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                    </label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                        min="3"
                        max="13"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Update Section
                    </button>
                </div>
            </form>
            <h3 className="text-lg font-bold mt-4 mb-4">Click and drag items to add a them to the layout section:</h3>
            <div className="container p-3 border border-gray-400 rounded-md h-[150px]">
                <div className="flex flex-col items-center justify-center w-[60px]">
                    {/* TODO: Fix label : HtmlFor property not binding to the DragableTable Element */}
                    <DraggableTable table={null} />
                    <label htmlFor="newTableElement" className="text-center">New Table</label>
                </div>
            </div>
        </>
    )
};
