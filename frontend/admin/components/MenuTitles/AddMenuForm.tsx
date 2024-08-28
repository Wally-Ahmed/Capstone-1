export default function AddMenuForm({ menuTitle, handleAddMenuSubmit, handleAddMenuChange, handleAddMenuClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Menu</h2>
                <form onSubmit={handleAddMenuSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Menu Title
                        </label>
                        <input
                            type="text"
                            name="menu_title"
                            value={menuTitle}
                            onChange={handleAddMenuChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={handleAddMenuClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Add Menu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};