import React from 'react';
import { fullItemRoot } from './menuProperties';

interface DeleteItemRootFormProps {
    selectedItemRoot: fullItemRoot;
    handleCloseDeleteConfirm: () => void;
    handleConfirmDelete: () => void;
}

const DeleteItemRootForm: React.FC<DeleteItemRootFormProps> = ({ selectedItemRoot, handleCloseDeleteConfirm, handleConfirmDelete }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this item root?</p>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                        onClick={handleCloseDeleteConfirm}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={handleConfirmDelete}
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteItemRootForm;
