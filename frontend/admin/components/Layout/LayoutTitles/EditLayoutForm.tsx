import React from 'react';

interface EditLayoutFormProps {
    handleSubmitRename: (e: React.FormEvent<HTMLFormElement>) => void;
    newLayoutTitle: string;
    handleRenameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCloseEditForm: () => void;
    handleSetActiveLayout: () => void;
}

export default function EditLayoutForm({
    handleSubmitRename,
    newLayoutTitle,
    handleRenameChange,
    handleCloseEditForm,
    handleSetActiveLayout
}: EditLayoutFormProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Rename Layout</h2>
                <form onSubmit={handleSubmitRename}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Layout Title
                        </label>
                        <input
                            type="text"
                            value={newLayoutTitle}
                            onChange={handleRenameChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={handleCloseEditForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                            onClick={handleSetActiveLayout}
                        >
                            Set Active
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Rename Layout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};
