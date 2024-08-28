import React, { useState } from 'react';

const ShiftForm = ({ employeeCode, handleShiftFormChange, handleShiftClockIn, handleShiftClockOut, selectedShift }) => {

    return (
        <form className="flex justify-center items-center space-x-4 mt-8" >
            <input
                type="text"
                value={employeeCode}
                onChange={handleShiftFormChange}
                className=" max-w-lg h-16 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Employee-Code..."
            />
            {
                selectedShift ?
                    <button
                        type="button"
                        className="h-16 px-6 text-lg text-white bg-red-500 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => { handleShiftClockOut() }}
                    >
                        Clock-Out
                    </button>
                    : <button
                        type="button"
                        className="h-16 px-6 text-lg text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => { handleShiftClockIn() }}
                    >
                        Clock-In
                    </button>
            }
        </form>
    );
};

export default ShiftForm;
