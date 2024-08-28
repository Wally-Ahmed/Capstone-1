'use client';
import { io } from 'socket.io-client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { backendURL } from '@/public/config';
import DeleteReservationConfirm from './DeleteReservationConfirm';
import EditTableForm from './EditTableForm';
import EditSectionForm from './EditSectionForm';
import { Grid } from "./Grid";
import { NullReservationsList } from './NullReservationsList';
import { NewReservationForm } from './NewReservationForm';
import { LoadingSpinner } from './LoadingSpinner';
import SelectTableForReservationForm from './SelectTableForReservationForm';
import SelectTableForReservationNavigation from './SelectTableForReservationNavigation';
import useSearchParams from '@/hooks/useSearchParams';
import useQueryString from '@/hooks/useQueryString';
import ReservationTimeline from './ReservationTimeline';
import { EditReservationForm } from './EditReservationForm';
import NewTabForm from './NewTabForm';

export const ItemTypes = {
    TABLE: 'table',
};

export interface Reservation {
    id?: string,
    party_size: number;
    reservation_time: Date;
    guest_name: string;
    guest_ip?: string | null;
    guest_phone: string;
    guest_email: string;
    confirmation_status: string | null;
    restaurant_table_id: string | null;
    restaurant_id?: string;
}

export interface RestaurantTable {
    id: string;
    table_name: string;
    table_status: string;
    reservable: boolean;
    seats: number;
    x: number;
    y: number;
}

export interface Section {
    id: string;
    section_name: string;
    width: number;
    height: number;
    position: number;
    restaurantTables: RestaurantTable[];
}

export interface Layout {
    id: string;
    layout_name: string;
    sections: Section[];
}

export interface LayoutDetailComponentProps {
    jwt: string;
    tabPermissions: boolean;
}

const LayoutDetailComponent: React.FC<LayoutDetailComponentProps> = ({ jwt, tabPermissions }) => {
    const [isloading, setIsLoading] = useState(false)

    const [layout, setLayout] = useState<Layout | null>(null);
    const [reservationDuration, setReservationDuration] = useState(NaN)
    const [reservations, setReservations] = useState<Reservation[] | null>(null);
    const [selectReservations, setSelectReservations] = useState<Reservation[] | null>(null);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [nullReservations, setNullReservations] = useState<Reservation[] | null>(null);
    const [showReservationsTimeline, setShowReservationsTimeline] = useState(false);
    // const [selectedReservation, setSelectedReservation]

    const router = useRouter();


    const [newReservationData, setNewReservationData] = useState<Reservation | null>(null);

    // const [section, setSection] = useState<Section | null>(null);
    // const [sectionName, setSectionName] = useState('');
    // const [width, setWidth] = useState(1);
    // const [height, setHeight] = useState(1);
    const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
    // const [showDeleteReservationConfirm, setShowDeleteReservationConfirm] = useState(false);
    const [showNewTabForm, setShowNewTabForm] = useState(false);
    const [newTabForm, setNewTabForm] = useState({
        customer_name: '',
        employee_code: '',
        restaurant_table_id: null,
    });

    const [showNullReservations, setShowNullReservations] = useState(false);
    const [showNewReservationForm, setShowNewReservationForm] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);

    const [selectedSectionIdQuery, setSelectedSectionIdQuery] = useQueryString('sectionId')
    const [initialPageLoad, setInitialPageLoad] = useState(true);

    const [editReservationData, setEditReservationData] = useState<Reservation | null>(null);
    const [showEditReservationForm, setShowEditReservationForm] = useState(false)
    const [showDeletReservationConfirm, setShowDeletReservationConfirm] = useState(false)

    useEffect(() => {

        if (layout && selectedSection) {
            setSelectedSection(layout.sections.filter(section => section.id === selectedSection.id)[0])
        }

        if (layout && selectedSection && selectedTable) {
            setSelectedTable(layout.sections.filter(section => section.id === selectedSection.id)[0].restaurantTables.filter(table => table.id === selectedTable.id)[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout, reservations])

    const getLayout = async () => {



        console.log('hit')
        try {
            const resLayout = await fetch(`${backendURL}interface/tablemap/layout`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });

            if (!resLayout.ok) {
                throw new Error('Failed to fetch layout');
            }

            const layoutData = await resLayout.json();
            console.log(`${backendURL}interface/tablemap/layout`)
            setLayout(layoutData.layout);

            const resResvations = await fetch(`${backendURL}interface/tablemap/reservation`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            });

            if (!resResvations.ok) {
                throw new Error('Failed to fetch Reservations');
            }

            const reservationData = await resResvations.json();
            // console.log(reservationData)
            setReservations(reservationData.reservations);
            setReservationDuration(reservationData.reservationDuration)

            // console.log({ lol: new Date(2024, 6, 4, 12, 0) })

            if (reservations) { setNullReservations(reservations.filter((reservation: Reservation) => { reservation.restaurant_table_id === null })) }


            if (selectedSection) {
                setSelectedSectionIdQuery(selectedSection.id)
            }



            // const selectedSection = data.layout.sections.find((sec: Section) => sec.id === sectionId);
            // if (selectedSection) {
            //     setSection(selectedSection);
            //     setSectionName(selectedSection.section_name);
            //     setWidth(selectedSection.width);
            //     setHeight(selectedSection.height);
            // }

            setInitialPageLoad(false)

            console.log(layoutData.layout)

            return layoutData.layout

        } catch (error) {
            router.refresh()
        }
    };

    useEffect(() => {
        getLayout()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const init = async () => {
            if (selectedSectionIdQuery && initialPageLoad && layout) {
                const updatedLayout = await getLayout()
                const section = updatedLayout.sections.filter(section => section.id === selectedSectionIdQuery)[0]
                setSelectedSection(section)
                setInitialPageLoad(false)
            }
            else if (selectedSection) {
                setSelectedSectionIdQuery(selectedSection.id)
            } else {
                router.refresh()
            }
        }
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layout])


    // const socket = io(`${backendURL}tablemap`, { auth: { token: jwt } })

    // useEffect(() => {
    //     socket.on('connect', async () => {
    //         console.log('connect')
    //         await getLayout()

    //     });

    //     socket.on('update', async () => {
    //         console.log('update')
    //         getLayout()
    //     });

    //     socket.on('disconnect', () => {
    //         console.log('disconnect')
    //         router.refresh()
    //     });
    // }, [socket]);

    useEffect(() => {
        const timerId = setInterval(() => {
            getLayout()
            console.log('lap')
        }, 10000);

        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const handleSectionSelect = (section: Section) => {
        setSelectedSection(section)
        setSelectedSectionIdQuery(section.id)
        // const tableIds = section.restaurantTables.map((table) => { return table.id })
        // setSelectReservations(reservations.filter((reservation: Reservation) => { return tableIds.includes(reservation.restaurant_table_id) }))
    };

    const handleSectionDeselect = () => {
        setSelectedSection(null)
        setSelectedSectionIdQuery(null)
    };

    const selectReservation = async (reservation: Reservation) => {

        setSelectedReservation(reservation)
        setEditReservationData({ ...reservation, reservation_time: new Date(reservation.reservation_time) })

        setShowNullReservations(false);
        setShowReservationsTimeline(false);
        setShowEditReservationForm(true);
        // setShowNewReservationForm(false);
    };

    const handleNewReservationSubmit = async (reservationData) => {


        // if (!newReservationData) return;
        // console.log('hello')
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {

            const res = await fetch(`${backendURL}interface/tablemap/reservation`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify(reservationData),
            });

            if (res.ok) { await getLayout() }
            else {
                alert((await res.json()).error.message)
                setIsLoading(false)
                return
            }

        } catch (err) {
            console.log(err.message);
        }

        setShowNewReservationForm(false)
        setNewReservationData(null)
        setIsLoading(false)
        setTimeout(() => { getLayout() }, 500)
    };

    const handleTableClick = (table: RestaurantTable) => {
        setSelectedTable(table);
        // if (newReservationData) {
        //     handleNewReservationSubmit({ ...newReservationData, restaurant_table_id: table.id })
        //     // setNewReservationData(null)
        // } else {
        //     setSelectedTable(table);
        // }
    };

    const handleOpenNewReservation = () => {
        const date = new Date();
        setNewReservationData({
            party_size: 1,
            reservation_time: new Date(),
            guest_name: '',
            guest_phone: '',
            guest_email: '',
            confirmation_status: 'confirmed',
            restaurant_table_id: null,
        });
        setShowNewReservationForm(true)
    };

    const handleSelectTableForReservation = () => {
        // e.preventDefault()
        setShowNullReservations(false)
        setShowNewReservationForm(false)
        setShowEditReservationForm(false)
    };

    const undoTableSelect = () => {
        // setShowNullReservations(true)
        if (editReservationData) {
            setShowEditReservationForm(true)
        }
        else {
            setShowNewReservationForm(true)
        }
    };


    const handleCloseNewReservation = () => {
        setNewReservationData(null);
        setShowNewReservationForm(false)
    };

    const handleNewReservationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value }: { name: string, value: any } = e.target;
        if (name === 'party_size') { value = parseInt(value) }
        if (name === 'reservation_time') { value = new Date(value) }
        setNewReservationData({
            ...newReservationData,
            [name]: value,
        });
    };

    // const handleSelectReservation = (reservation: Reservation) => {
    //     setSelectedReservation(reservation);
    //     setEditReservationData({ ...selectedReservation, reservation_time: new Date(selectedReservation.reservation_time) });
    //     setShowEditReservationForm(true)
    // }
    const openReservationsTimeline = () => { setShowReservationsTimeline(true) }
    const closeReservationsTimeline = () => { setShowReservationsTimeline(false) }

    const handleEditReservationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value }: { name: string, value: any } = e.target;
        if (name === 'party_size') { value = parseInt(value) }
        if (name === 'reservation_time') { value = new Date(value) }
        setEditReservationData({
            ...editReservationData,
            [name]: value,
        });

    }

    const handleReassignReservationSubmit = async (reservationData) => {


        // if (!newReservationData) return;
        // console.log('hello')
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {

            const res = await fetch(`${backendURL}interface/tablemap/reservation/${reservationData.id}`, {
                method: 'PATCH',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ party_size: editReservationData.party_size, reservation_time: editReservationData.reservation_time, guest_name: editReservationData.guest_name, guest_ip: editReservationData.guest_ip, guest_phone: editReservationData.guest_phone, guest_email: editReservationData.guest_email, restaurant_table_id: selectedTable.id, confirmation_status: editReservationData.confirmation_status, }),
            });

            if (res.ok) { await getLayout() }

        } catch (err) {
            console.log(err.message);
        }

        setEditReservationData(null)
        setIsLoading(false)
        setTimeout(() => { getLayout() }, 500)
    };


    const handleCloseEditReservation = () => { setShowEditReservationForm(false); setEditReservationData(null); }

    const handleDeleteReservation = async () => {


        // if (!newReservationData) return;
        // console.log('hello')
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {

            const res = await fetch(`${backendURL}interface/tablemap/reservation/${editReservationData.id}`, {
                method: 'DELETE',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                // body: JSON.stringify({ party_size: editReservationData.party_size, reservation_time: editReservationData.reservation_time, guest_name: editReservationData.guest_name, guest_ip: editReservationData.guest_ip, guest_phone: editReservationData.guest_phone, guest_email: editReservationData.guest_email, restaurant_table_id: selectedTable.id, confirmation_status: editReservationData.confirmation_status, }),
            });

            if (res.ok) { await getLayout() }

        } catch (err) {
            console.log(err.message);
        }

        setEditReservationData(null)
        setIsLoading(false)
        setShowDeletReservationConfirm(false)
        setTimeout(() => { getLayout() }, 500)
    };

    const closeShowDeleteReservationConfirm = () => {
        setEditReservationData(null)
        setShowDeletReservationConfirm(false)
    }

    const openShowDeleteReservationConfirm = (reservation: Reservation) => {
        setEditReservationData({ ...reservation, reservation_time: new Date(reservation.reservation_time) })
        setShowDeletReservationConfirm(true)
    }

    const handleEditReservationAvailability = async (status: string) => {


        // if (!newReservationData) return;
        // console.log('hello')
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {

            const res = await fetch(`${backendURL}interface/tablemap/table/${selectedTable.id}`, {
                method: 'PATCH',
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
                body: JSON.stringify({ table_status: status }),
            });

            if (res.ok) { await getLayout() }
            // socket.emit('update')

        } catch (err) {
            console.log(err.message);
        }

        setIsLoading(false)
        setTimeout(() => { getLayout() }, 500)
    };

    const handleCreateNewTab = async () => {

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await fetch(`${backendURL}interface/tab`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({ customer_name: newTabForm.customer_name, employee_code: newTabForm.employee_code, restaurant_table_id: selectedTable.id })
        });

        const data = await res.json()

        await getLayout()
        setIsLoading(false)
        if (res.ok) {
            // console.log(await res.json(), 'hit hit')

            setShowNewTabForm(false);

            setNewTabForm({
                customer_name: '',
                employee_code: '',
                restaurant_table_id: selectedTable.id,
            });

            router.push(`/app/tabs?tabId=${data.tab.id}`)
        }

    };

    const handleNewTabFormChange = event => {
        setNewTabForm({
            ...newTabForm,
            [event.target.name]: event.target.value,
        });
    };

    if (!layout) {
        return <LoadingSpinner />;
    }

    return (
        <>

            {selectedSection ?
                <div className="container mx-auto p-4 mt-20 flex">
                    <div className="w-2/3 pr-4">
                        <Grid section={selectedSection} selectedTable={selectedTable} handleTableClick={handleTableClick} />
                    </div>
                    <div className="w-1/3 pl-4" >

                        <div className="bg-white p-4 rounded shadow-lg border border-gray-300" style={{ minHeight: '60vh' }} >
                            {newReservationData || editReservationData ?
                                (selectedTable ?
                                    <SelectTableForReservationForm selectedTable={selectedTable} setSelectedTable={setSelectedTable} handleNewReservationSubmit={handleNewReservationSubmit} newReservationData={newReservationData} openReservationsTimeline={openReservationsTimeline} editReservationData={editReservationData} handleReassignReservationSubmit={handleReassignReservationSubmit} />
                                    : <SelectTableForReservationNavigation undoTableSelect={undoTableSelect} />
                                )
                                :
                                (<>
                                    {selectedTable ?
                                        <EditTableForm selectedTable={selectedTable} setSelectedTable={setSelectedTable} openReservationsTimeline={openReservationsTimeline} handleEditReservationAvailability={handleEditReservationAvailability} showNewTabForm={() => { setShowNewTabForm(true) }} />
                                        : <EditSectionForm section={selectedSection} nullReservations={nullReservations} setShowNullReservations={setShowNullReservations} handleSectionDeselect={handleSectionDeselect} handleOpenNewReservation={handleOpenNewReservation} />
                                    }
                                </>)


                            }
                        </div>
                    </div>

                </div>
                :
                <div className='mt-40'>{
                    layout.sections.map((section) => (
                        <div className="p-4 container mx-auto" key={section.id}>
                            <button className="bg-gray-200 border border-gray-300 rounded-md w-full flex justify-center text-2xl font-bold" onClick={() => { handleSectionSelect(section) }}>
                                <p className="text-2xl font-bold m-6">{section.section_name}</p>
                            </button>
                        </div>
                    ))
                }</div>
            }

            {showNewTabForm && <NewTabForm newTabForm={newTabForm} handleCreateNewTab={handleCreateNewTab} handleNewTabFormChange={handleNewTabFormChange} toggleShowNewTabForm={() => { setShowNewTabForm(!showNewTabForm) }} />}
            {showNullReservations && <NullReservationsList setShowNullReservations={setShowNullReservations} nullReservations={nullReservations} selectReservation={selectReservation} handleOpenNewReservation={handleOpenNewReservation} />}
            {showNewReservationForm && <NewReservationForm handleNewReservationSubmit={handleNewReservationSubmit} newReservationData={newReservationData} handleNewReservationFormChange={handleNewReservationFormChange} handleCloseNewReservation={handleCloseNewReservation} handleSelectTableForReservation={handleSelectTableForReservation} />}

            {showReservationsTimeline && <ReservationTimeline table={selectedTable} reservations={reservations.filter((reservation) => { return reservation.restaurant_table_id === selectedTable.id })} closeReservationsTimeline={closeReservationsTimeline} reservationDuration={reservationDuration} selectReservation={selectReservation} editReservationData={editReservationData} openShowDeleteReservationConfirm={openShowDeleteReservationConfirm} />}

            {showEditReservationForm && <EditReservationForm editReservationData={editReservationData} handleCloseEditReservation={handleCloseEditReservation} handleEditReservationFormChange={handleEditReservationFormChange} handleSelectTableForReservation={handleSelectTableForReservation} jwt={jwt} />}
            {showDeletReservationConfirm && <DeleteReservationConfirm closeShowDeleteReservationConfirm={closeShowDeleteReservationConfirm} handleDeleteReservation={handleDeleteReservation} />}

            {isloading && <LoadingSpinner />}

        </>
    );
};



export default LayoutDetailComponent;
