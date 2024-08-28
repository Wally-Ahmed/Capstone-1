import React from 'react';
import { TicketProperties } from './types'; // Adjust import path accordingly

interface NewTicketFormProps {
    newTicket: Partial<TicketProperties>;
    handleSubmitNewTicketForm: (event: React.FormEvent<HTMLFormElement>) => void;
    handleNewTicketChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleCloseNewTicketForm: () => void;
}

export default function NewTicketForm({
    newTicket,
    handleSubmitNewTicketForm,
    handleNewTicketChange,
    handleCloseNewTicketForm,
}: NewTicketFormProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Ticket</h2>
                <form onSubmit={handleSubmitNewTicketForm}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comments
                        </label>
                        <textarea
                            name="comments"
                            value={newTicket.comments || ''}
                            onChange={handleNewTicketChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={handleCloseNewTicketForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Add Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
