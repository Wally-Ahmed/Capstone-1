import React from 'react';

interface EditVariationFormProps {
    handleUpdateVariation: (e: React.FormEvent<HTMLFormElement>) => void;
    newVariation: {
        description: string;
        priceDifference: string;
    };
    handleVariationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCloseEditForm: () => void;
}

const EditVariationForm: React.FC<EditVariationFormProps> = ({
    handleUpdateVariation,
    newVariation,
    handleVariationChange,
    handleCloseEditForm,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Variation</h2>
                <form onSubmit={handleUpdateVariation}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Variation Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={newVariation.description}
                            onChange={handleVariationChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price Difference
                        </label>
                        <input
                            type="number"
                            name="priceDifference"
                            step="0.01"
                            min="0"
                            value={newVariation.priceDifference}
                            onChange={handleVariationChange}
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
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Update Variation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVariationForm;
