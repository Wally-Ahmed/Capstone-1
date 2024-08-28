export default function NewTabForm({ newTabForm, handleCreateNewTab, handleNewTabFormChange, toggleShowNewTabForm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Tab</h2>
                <form >
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            value={newTabForm.customer_name}
                            onChange={handleNewTabFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee Code
                        </label>
                        <input
                            type="text"
                            name="employee_code"
                            value={newTabForm.employee_code}
                            onChange={handleNewTabFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={toggleShowNewTabForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateNewTab}
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
