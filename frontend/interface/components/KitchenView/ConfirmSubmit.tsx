export default function ConfirmSubmit({ closeConfirmSubmit, handleProcessTicket }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Submit Ticket</h2>
                <p>Set ticket as completed</p>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                        onClick={closeConfirmSubmit}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded"
                        onClick={async () => { await handleProcessTicket(); closeConfirmSubmit(); }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
};
