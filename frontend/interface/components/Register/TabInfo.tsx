import React, { Dispatch, SetStateAction, useState } from 'react';
import { fullTab, fullTicket, TicketItemProperties, TabProperties, TicketProperties, fullMenu } from './types'; // Adjust import path accordingly
import NewTicketForm from './NewTicketForm';
import Ticketdetail from './TicketDetail';
import Menu from './Menu';
import MenuTitles from './MenuTitles';
import TicketSubmitConfirm from './TicketSubmitConfirm';

interface TabInfoProps {
    getTabs: () => Promise<{ tabs: fullTab[], menus: fullMenu[] }>;
    handleCreateNewTicketItem: (itemId: string) => Promise<void>;
    fullTab: fullTab;
    menus: fullMenu[];
    selectedMenu: fullMenu;
    openTabMenu: () => void;
    handleProcessTicket: () => {};
    handleCreateNewTicket: () => void;
    setSelectedMenu: Dispatch<SetStateAction<fullMenu>>;
}

const TabInfo: React.FC<TabInfoProps> = ({ fullTab, getTabs, handleCreateNewTicket, menus, selectedMenu, setSelectedMenu, handleCreateNewTicketItem, handleProcessTicket, openTabMenu }) => {

    // const [showTicketForm, setShowTicketForm] = useState(false);
    const [showTicketConfim, setShowTicketConfirm] = useState(false);
    const [selectItemView, setSelectItemView] = useState(false)

    if (selectItemView) {
        return (selectedMenu
            ? <Menu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} handleCreateNewTicketItem={handleCreateNewTicketItem} closeMenu={() => { setSelectItemView(false) }} />
            : <MenuTitles menus={menus} getTabs={getTabs} setSelectedMenu={setSelectedMenu} returnToTab={() => { setSelectItemView(false) }} />
        )
    }

    const activeTicket = fullTab.tickets.map(ticket => ticket.status).includes(null)

    return (
        <div className="pt-24">
            <div className="container mx-auto">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <button
                        onClick={() => { openTabMenu() }}
                        className="flex mb-3"
                    >
                        <svg width="30" height="30" viewBox="-3 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 19L8 12L15 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold mb-4"><strong>Customer Name:</strong> {fullTab.customer_name}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Status:</strong> {fullTab.tab_status}</p>
                        <p><strong>Server:</strong> {fullTab.server_name}</p>
                        <p><strong>Table ID:</strong> {fullTab.table_name ?? 'N/A'}</p>
                        <p><strong>Discount:</strong> {fullTab.discount}</p>
                        {/* <p><strong>Total Tip:</strong> {fullTab.total_tip ?? 'N/A'}</p>
                        <p><strong>Tax:</strong> {fullTab.calculated_tax ?? 'N/A'}</p> */}
                    </div>
                    <br />
                    <br />
                    {/* <h3 className="text-2xl font-bold mb-4">Cart:</h3> */}
                    {/* <div id="shiftList" style={{ height: '35vh' }} className="overflow-hidden"> */}
                    {/* <div className="space-y-4 h-full overflow-y-auto pb-10" > */}
                    {fullTab.tickets.map(ticket => (
                        <div key={ticket.id} >
                            {/* <h3 className="text-lg font-semibold mb-2">Ticket: {ticket.id}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Comments:</strong> {ticket.comments}</p>
                                <p><strong>Tab ID:</strong> {ticket.tab_id}</p>
                                <p><strong>Restaurant ID:</strong> {ticket.restaurant_id}</p>
                                <p><strong>Time Completed:</strong> {ticket.time_completed?.toString() ?? 'N/A'}</p>
                                <p><strong>Status:</strong> {ticket.status ?? 'N/A'}</p>
                            </div> */}

                            <div className="mt-4">
                                {ticket.ticketItems.map(item => (
                                    <div key={item.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                        <p><strong>{item.item_name}</strong> {item.variation_description}</p>
                                        <p><strong>Price:</strong> {item.price}</p>
                                        {item.comments.length !== 0 && <p>{item.comments}</p>}
                                        {/* <p><strong>Prep Time Required:</strong> {item.prep_time_required ? 'Yes' : 'No'}</p>
                                        <p><strong>Ticket ID:</strong> {item.ticket_id}</p>
                                        <p><strong>Tab ID:</strong> {item.tab_id}</p>
                                        <p>{console.log(item)}</p> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* </div> */}
                    {/* </div> */}

                    <div className='flex gap-3'>
                        <div
                            onClick={() => { handleCreateNewTicket(); }}
                            className="flex items-center justify-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                        >
                            Open New Ticket
                        </div>
                        <div
                            onClick={() => { setShowTicketConfirm(true) }}
                            className="flex items-center justify-center w-full h-20 p-4 bg-blue-500 border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                        >
                            Process ticket
                        </div>
                    </div>

                </div>


            </div>

            {activeTicket && <Ticketdetail ticket={fullTab.tickets.find(ticket => ticket.status === null)} handleOpenSelectItem={() => { setSelectItemView(true) }} setShowTicketConfirm={setShowTicketConfirm} />}
            {showTicketConfim && <TicketSubmitConfirm closeShowTicketSubmitConfirm={() => { setShowTicketConfirm(false) }} handleProcessTicket={handleProcessTicket} />}
        </div>
    );
};

export default TabInfo;