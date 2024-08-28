export default function SelectTableForReservationNavigation({ undoTableSelect }) {
    return (

        <>
            <h2 className="text-2xl font-bold mb-4">Select a Table to Assign Reservation</h2>
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    disabled={false}
                    onClick={() => { undoTableSelect() }}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                >
                    Go Back
                </button>
            </div>
        </>
    )
};
