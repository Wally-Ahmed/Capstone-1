export default function AddLayoutForm({ layoutTitle, handleAddLayoutSubmit, handleAddLayoutChange, handleAddLayoutClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Layout</h2>
                <form onSubmit={handleAddLayoutSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Layout Title
                        </label>
                        <input
                            type="text"
                            name="layout_title"
                            value={layoutTitle}
                            onChange={handleAddLayoutChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={handleAddLayoutClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Add Layout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};
