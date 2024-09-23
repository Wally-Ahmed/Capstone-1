import { useState } from "react"

export default function LinkSumUpSoloForm({ handleLinkSolo, closeLinkSumUpSoloForm }) {
    const [code, setCode] = useState('')
    const handleNewTabFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Enter Api Code:</h2>
                <form >
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Api code:
                        </label>
                        <input
                            type="text"
                            value={code}
                            maxLength={9}
                            onChange={handleNewTabFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                            onClick={closeLinkSumUpSoloForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => { handleLinkSolo(code) }}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Link Solo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};
