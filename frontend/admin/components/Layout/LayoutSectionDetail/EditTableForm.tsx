export default function EditTableForm({ selectedTable, setSelectedTable, handleUpdateTable, setShowDeleteTableConfirm, }) {
    return (
        <>
            <div className='flex justify-end'>
                <button className="" onClick={() => setSelectedTable(null)}>
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>
            <h3 className="text-lg font-bold mb-2">Edit Table</h3>
            <form onSubmit={handleUpdateTable}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Table Name
                    </label>
                    <input
                        type="text"
                        value={selectedTable.table_name}
                        onChange={(e) => setSelectedTable({ ...selectedTable, table_name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reservable
                    </label>
                    <input
                        type="checkbox"
                        checked={selectedTable.reservable}
                        onChange={(e) => setSelectedTable({ ...selectedTable, reservable: e.target.checked })}
                        className="p-4 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seats
                    </label>
                    <input
                        type="number"
                        value={selectedTable.seats}
                        onChange={(e) => setSelectedTable({ ...selectedTable, seats: Number(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="flex space-x-5 justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Update Table
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowDeleteTableConfirm(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Delete Table
                    </button>
                </div>
            </form>
        </>
    )
};
