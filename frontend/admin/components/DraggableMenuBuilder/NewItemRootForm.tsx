import React from 'react';

const AddItemRootForm = ({ newItemRoot, handleSubmitItemRoot, handleRootChange, handleCloseItemRootForm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Item Root</h2>
                <form onSubmit={handleSubmitItemRoot}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={newItemRoot.name}
                            onChange={handleRootChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price
                        </label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            value={newItemRoot.price}
                            onChange={handleRootChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={newItemRoot.description}
                            onChange={handleRootChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="prepTimeRequired"
                                checked={newItemRoot.prepTimeRequired}
                                onChange={handleRootChange}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Prep Time Required</span>
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={handleCloseItemRootForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Add Item Root
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddItemRootForm.displayName = "AddItemRootForm";

export default AddItemRootForm;
