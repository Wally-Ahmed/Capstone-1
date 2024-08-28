'use client';

import { backendURL } from '@/public/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TicketProperties } from '..';
// import { fullMenu, fullTab } from '../types';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface MenuListProps {
    tickets: TicketProperties[]
    getTickets: () => void;
    setSelectedTicket: Dispatch<SetStateAction<TicketProperties>>;
}

const MenuList: React.FC<MenuListProps> = ({ tickets, getTickets, setSelectedTicket }) => {
    // const router = useRouter();

    const updateMenus = async () => {
        await getTickets()
    }

    useEffect(() => {
        updateMenus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(tickets)

    return (
        <div className='p-4 border border-gray-300 rounded-lg shadow-lg'>

            <div className="flex flex-wrap justify-start gap-4">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        onClick={() => { setSelectedTicket(ticket) }}
                        className="flex flex-col items-center justify-center w-60 h-96 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
                    >
                        <div className='h-full w-full'>
                            <div className="rounded-lg w-full max-w-3xl h-full overflow-hidden pb-40">
                                <div className='p-1 pb-4 mt-2 border border-gray-400'>
                                    <p><b>Customer: </b>{ticket.customer_name}</p>
                                    <p><b>Table: </b>{ticket.table_name ? ticket.table_name : 'N/A'}</p>
                                </div>
                                <div className="space-y-4 h-full overflow-y-auto mt-5 pb-10" >
                                    {ticket.ticketItems.filter(item => item.prep_time_required).map(item => (<p key={item.id}><strong>{item.item_name}:</strong> {item.variation_description}</p>))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default MenuList;
