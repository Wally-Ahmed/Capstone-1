'use client';
import { io } from 'socket.io-client';


import { backendURL } from '@/public/config';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import TicketList from './TicketList';
import { LoadingSpinner } from './LoadingSpinner';
import ConfirmSubmit from './ConfirmSubmit';
// import { Grid } from "./Grid";

export interface TicketItemProperties {
    id: string;
    item_name: string;
    variation_description: string;
    comments: string;
    price: number;
    prep_time_required: boolean;
    ticket_id: string;
    menu_item_variation_id: string;
    tab_id: string;
}

export interface TicketProperties {
    id: string;
    comments: string;
    tab_id: string;
    restaurant_id: string;
    ticketItems: TicketItemProperties[];
    time_completed: Date | null;
    status: 'in-progress' | 'completed' | null;
    iat: Date;
    customer_name: string;
    table_name: string | null;
}


export interface ShiftClockProps {
    jwt: string;
}


const ShiftClock: React.FC<ShiftClockProps> = ({ jwt }) => {

    const router = useRouter();

    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
    const [tickets, setTickets] = useState<TicketProperties[] | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketProperties | null>(null);
    // const [employeeCode, setEmployeeCodeValue] = useState<string>('');
    // const [selectedTicket, setSelectedTicket] = useState<>(null)

    const getTickets = async () => {
        console.log('hitttt')
        try {
            const res = await fetch(`${backendURL}interface/kitchen`, {
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

            const data: { tickets: TicketProperties[] } = await res.json();
            setTickets(data.tickets);

            if (selectedTicket && !data.tickets.map((ticket: TicketProperties) => { return ticket.id }).includes(selectedTicket.id)) {
                setSelectedTicket(null)
            }

            console.log(data, 'hhh')


        } catch (error) {
            router.refresh()
        }
    };

    useEffect(() => {
        getTickets()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // const socket = io(`${backendURL}kitchen`, { auth: { token: jwt } })

    // useEffect(() => {
    //     socket.on('connect', async () => {
    //         console.log('connect')
    //         await getTickets()
    //         // else if (selectedSection) {
    //         //     setSelectedSectionIdQuery(selectedSection.id)
    //         // }
    //     });

    //     socket.on('update', async () => {
    //         console.log('update')
    //         getTickets()
    //     });

    //     socket.on('disconnect', () => {
    //         console.log('disconnect')
    //         // router.refresh()
    //     });
    // }, [socket]);


    useEffect(() => {
        const timerId = setInterval(async () => {
            await getTickets()
            console.log('lap')
        }, 10000);

        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProcessTicket = async () => {
        // alert(`Submitted: ${employeeCode}`);

        setShowLoadingSpinner(true)

        await new Promise((resolve) => setTimeout(resolve, 500));

        const res = await fetch(`${backendURL}interface/kitchen/ticket/${selectedTicket.id}`, {
            method: 'PATCH',
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({ status: 'completed' })
        });

        await getTickets()
        setShowLoadingSpinner(false)
        // if (res.ok) { console.log(await res.json(), 'hit hit') }
        // else { console.log(await res.json()) }

    };


    if (!tickets) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <TicketList getTickets={getTickets} tickets={tickets} setSelectedTicket={setSelectedTicket} />

            {selectedTicket && <ConfirmSubmit closeConfirmSubmit={() => { setSelectedTicket(null) }} handleProcessTicket={handleProcessTicket} />}
            {showLoadingSpinner && <LoadingSpinner />}
        </>
    );
};



export default ShiftClock;
