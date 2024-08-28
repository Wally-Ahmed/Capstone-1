// src/components/ShiftList.tsx

import React from 'react';
import { ActiveShiftProperties } from '.';


interface ShiftListProps {
    activeShifts: ActiveShiftProperties[];
    selectedShift: ActiveShiftProperties | null;
    toggleSelectedShift: (shift: ActiveShiftProperties) => void;
}

const ShiftList: React.FC<ShiftListProps> = ({ activeShifts, selectedShift, toggleSelectedShift }) => {
    return (
        <div>
            {activeShifts.length === 0 ? (
                <div className="flex items-center justify-center h-32 border border-gray-200 rounded">
                    <p>No active shifts currently available.</p>
                </div>
            ) : (
                activeShifts.map((shift) => (
                    <div
                        key={shift.id}
                        className={`p-4 border-b border-gray-200 ${selectedShift && selectedShift.id === shift.id ? 'bg-blue-200' : ''} cursor-pointer`}
                        onClick={() => { toggleSelectedShift(shift) }}
                    >
                        {/* <p><strong>Shift ID:</strong> {shift.id}</p> */}
                        <p><strong>Employee Name:</strong> {shift.employee_name}</p>
                        <p><strong>Start Time:</strong> {new Date(shift.start_date_time).toLocaleString()}</p>
                        {/* <p><strong>Restaurant Employee ID:</strong> {shift.restaurant_employee_id}</p> */}
                    </div>
                ))
            )}
        </div>
    );
};

export default ShiftList;
