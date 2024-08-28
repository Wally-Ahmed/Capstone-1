// components/TicketList.tsx
import { cookies } from 'next/headers';
import Tickets from './Tickets';
import { backendURL } from '@/public/config';
// import { fullMenu, fullTab } from '../types';
import { Dispatch, SetStateAction } from 'react';
import { TicketProperties } from '..';

interface Menu {
    id: string;
    menu_title: string;
    restaurant_id: string;
}

interface TicketListProps {
    getTickets: () => void;
    tickets: TicketProperties[]
    setSelectedTicket: React.Dispatch<React.SetStateAction<TicketProperties>>
}



const TicketList: React.FC<TicketListProps> = ({ getTickets, tickets, setSelectedTicket }) => {

    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Open Tickets</h1>
            <div className="container mx-auto">
                <Tickets tickets={tickets} getTickets={getTickets} setSelectedTicket={setSelectedTicket} />
            </div>
        </div>
    );
};

export default TicketList;
