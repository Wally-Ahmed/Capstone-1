'use client';
import { io } from 'socket.io-client';


import { backendURL } from '@/public/config';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DeleteTableConfirm from './DeleteTableConfirm';
import EditTableForm from './EditTableForm';
import Clock from './Clock';
import ShiftForm from './ShiftForm';
import ShiftList from './ShiftList';
import { LoadingSpinner } from './LoadingSpinner';
// import { Grid } from "./Grid";



export interface ShiftClockProps {
    jwt: string;
}


export interface ActiveShiftProperties {
    id: string;
    start_date_time: Date;
    employee_name: string;
    restaurant_employee_id: string;
}

const ShiftClock: React.FC<ShiftClockProps> = ({ jwt }) => {

    const router = useRouter();

    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
    const [shifts, setShifts] = useState<ActiveShiftProperties[] | null>(null);
    const [selectedShift, setSelectedShift] = useState<ActiveShiftProperties | null>(null);
    const [employeeCode, setEmployeeCodeValue] = useState<string>('');
    // const [selectedShift, setSelectedShift] = useState<>(null)

    const getShifts = async () => {
        console.log('hitttt')
        try {
            const res = await fetch(`${backendURL}interface/shift`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch layout');
            }

            const data: { shifts: ActiveShiftProperties[] } = await res.json();
            setShifts(data.shifts);

            if (selectedShift && !data.shifts.map((shift: ActiveShiftProperties) => { return shift.id }).includes(selectedShift.id)) {
                setSelectedShift(null)
            }

            console.log(data, 'hhh')



            // const selectedSection = data.layout.sections.find((sec: Section) => sec.id === sectionId);
            // if (selectedSection) {
            //     setSection(selectedSection);
            //     setSectionName(selectedSection.section_name);
            //     setWidth(selectedSection.width);
            //     setHeight(selectedSection.height);
            // }

        } catch (error) {
            router.refresh()
        }
    };

    useEffect(() => {
        getShifts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // const socket = io(`${backendURL}shift`, { auth: { token: jwt } })

    // useEffect(() => {
    //     socket.on('connect', async () => {
    //         console.log('connect')
    //         await getShifts()
    //         // else if (selectedSection) {
    //         //     setSelectedSectionIdQuery(selectedSection.id)
    //         // }
    //     });

    //     socket.on('update', async () => {
    //         console.log('update')
    //         getShifts()
    //     });

    //     socket.on('disconnect', () => {
    //         console.log('disconnect')
    //         // router.refresh()
    //     });
    // }, [socket]);


    useEffect(() => {
        const timerId = setInterval(async () => {
            await getShifts()
            console.log('lap')
        }, 10000);

        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleShiftClockIn = async (shift: ActiveShiftProperties | null) => {
        // alert(`Submitted: ${employeeCode}`);

        if (selectedShift) {
            console.log('miss')

        } else {
            setShowLoadingSpinner(true)

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const res = await fetch(`${backendURL}interface/shift`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ employee_code: employeeCode })
            });

            await getShifts()

            if (!res.ok) { alert((await res.json()).error.message) }

            setShowLoadingSpinner(false)
            // if (res.ok) { console.log(await res.json(), 'hit hit') }
            // else { console.log(await res.json()) }
        }

        setEmployeeCodeValue('');
    };

    const handleShiftClockOut = async (shift: ActiveShiftProperties | null) => {
        // alert(`Submitted: ${employeeCode}`);

        if (!selectedShift) {
            console.log('miss')

        } else {
            setShowLoadingSpinner(true)

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const res = await fetch(`${backendURL}interface/shift/${selectedShift.id}`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ employee_code: employeeCode })
            });

            await getShifts()
            setShowLoadingSpinner(false)
            if (!res.ok) { console.log(await res.json(), 'hit hit') }
        }

        setEmployeeCodeValue('');
    };

    const handleShiftFormChange = (e) => setEmployeeCodeValue(e.target.value)

    const toggleSelectedShift = (shift: ActiveShiftProperties) => {

        if (selectedShift && shift.id === selectedShift.id) {
            setSelectedShift(null)
        } else {
            setSelectedShift({ ...shift })
        }
    };

    if (!shifts) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className="container mx-auto p-4 mt-20 flex">
                <div className="w-1/3 pr-4">

                    <div className="bg-white p-4 rounded shadow-lg border border-gray-300">

                        <div id="shiftList" style={{ minHeight: '60vh' }}>
                            <ShiftList
                                activeShifts={shifts}
                                selectedShift={selectedShift}
                                toggleSelectedShift={toggleSelectedShift}
                            />
                        </div>
                        {/* {selectedTable ?
                            <EditTableForm selectedTable={selectedTable} setSelectedTable={setSelectedTable} handleUpdateTable={handleUpdateTable} setShowDeleteTableConfirm={setShowDeleteTableConfirm} />
                            : <EditSectionForm handleUpdateSection={handleUpdateSection} sectionName={sectionName} setSectionName={setSectionName} width={width} setWidth={setWidth} height={height} setHeight={setHeight} />} */}
                    </div>
                </div>
                <div className="w-2/3 pl-4">
                    <div className="bg-gray-200 border border-gray-300 rounded-md p-40 mb-4 flex justify-center">
                        <div className="flex items-center justify-center">
                            <div className="text-6xl font-mono text-black">
                                <Clock />
                                <ShiftForm employeeCode={employeeCode} handleShiftFormChange={handleShiftFormChange} handleShiftClockIn={handleShiftClockIn} handleShiftClockOut={handleShiftClockOut} selectedShift={selectedShift} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showLoadingSpinner && <LoadingSpinner />}
            {/* {showDeleteTableConfirm && <DeleteTableConfirm setShowDeleteTableConfirm={setShowDeleteTableConfirm} handleDeleteTable={handleDeleteTable} />} */}
        </>
    );
};



export default ShiftClock;
