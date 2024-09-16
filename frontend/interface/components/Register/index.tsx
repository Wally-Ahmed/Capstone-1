'use client';
import { io } from 'socket.io-client';


import { backendURL } from '@/public/config';
import useQueryString from '@/hooks/useQueryString';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { TabList } from './TabList';
import NewTabForm from './NewTabForm';
import TabInfo from './TabInfo';
import { fullMenu, fullTab } from './types';
import { useSocket } from '@/hooks/useSocket';
// import { Grid } from "./Grid";



export interface TicketDetailProps {
    jwt: string;
}


const TicketDetail: React.FC<TicketDetailProps> = ({ jwt }) => {

    const router = useRouter();

    const [initialPageLoad, setInitialPageLoad] = useState<boolean>(true)
    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
    const [showNewTabForm, setShowNewTabForm] = useState<boolean>(false);

    const [selectedTabIdQuery, setSelectedTabIdQuery] = useQueryString('tabId')

    const [tabs, setTabs] = useState<fullTab[] | null>(null);
    const [menus, setMenus] = useState<fullMenu[] | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<fullMenu | null>(null);
    const [selectedTab, setSelectedTab] = useState<fullTab | null>(null);
    const [employeeCode, setEmployeeCodeValue] = useState<string>('');
    const [newTabForm, setNewTabForm] = useState({
        customer_name: '',
        employee_code: '',
        restaurant_table_id: null,
    });

    const getTabs = async (): Promise<{ tabs: fullTab[], menus: fullMenu[] }> => {
        try {
            const res = await fetch(`${backendURL}interface/tab`, {
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

            const data: { tabs: fullTab[], menus: fullMenu[] } = await res.json();
            setTabs(data.tabs);
            setMenus(data.menus);

            console.log(data)

            if (selectedTab && !data.tabs.map((shift: fullTab) => { return shift.id }).includes(selectedTab.id)) {
                setSelectedTab(null)
            } else if (selectedTab) {
                setSelectedTabIdQuery(selectedTab.id)
            }


            return { tabs: data.tabs, menus: data.menus }

        } catch (error) {
            console.log(error)
            router.refresh()
        }
    };

    useEffect(() => {
        getTabs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const init = async () => {
            if (selectedTabIdQuery && initialPageLoad && tabs) {
                const updatedTabs = (await getTabs()).tabs
                const tab = updatedTabs.filter(tab => tab.id === selectedTabIdQuery)[0]
                setSelectedTab(tab)
                setInitialPageLoad(false)
            }
            else {
                setSelectedTabIdQuery(selectedTab ? selectedTab.id : null)
            }
        }
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs, selectedTab])

    useEffect(() => {
        if (selectedTab) {
            setSelectedTab(tabs.filter(tab => tab.id === selectedTab.id)[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs])


    const socket = useSocket(jwt, 'tab')

    useEffect(() => {
        socket.on('connect', async () => {
            console.log('connect')
            await getTabs()

        });

        socket.on('update', async () => {
            console.log('update')
            await getTabs()
        });

        socket.on('disconnect', () => {
            console.log('disconnect')
            router.refresh()
        });
    }, [socket]);


    useEffect(() => {
        const timerId = setInterval(async () => {
            await getTabs()
            console.log('lap')
        }, 10000);

        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTabSelect = (tab: fullTab) => {
        setSelectedTab(tab)
        setSelectedTabIdQuery(tab.id)
    };


    const handleCreateNewTab = async () => {

        setShowLoadingSpinner(true);

        await new Promise((resolve) => setTimeout(resolve, 200));

        const res = await fetch(`${backendURL}interface/tab`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(newTabForm)
        });

        await getTabs()
        setShowLoadingSpinner(false)
        if (res.ok) {
            // console.log(await res.json(), 'hit hit')

            setShowNewTabForm(false);

            setNewTabForm({
                customer_name: '',
                employee_code: '',
                restaurant_table_id: null,
            });
        }

    };

    const handleCreateNewTicket = async () => {

        setShowLoadingSpinner(true);

        await new Promise((resolve) => setTimeout(resolve, 200));

        const res = await fetch(`${backendURL}interface/tab/${selectedTab.id}/ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
        });

        await getTabs()
        setShowLoadingSpinner(false)
        if (!res.ok) {
            console.log('hit hit')
        }

    };

    const handleCreateNewTicketItem = async (itemId: string) => {

        setShowLoadingSpinner(true);

        await new Promise((resolve) => setTimeout(resolve, 200));

        const res = await fetch(`${backendURL}interface/tab/${selectedTab.id}/ticket/${selectedTab.tickets.find(ticket => ticket.status === null).id}/item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({ menu_item_variation_id: itemId })
        });

        await getTabs()
        setShowLoadingSpinner(false)
        if (res.ok) {
            console.log('hit hit')
        }

    };

    const handleProcessTicket = async () => {

        setShowLoadingSpinner(true);

        await new Promise((resolve) => setTimeout(resolve, 200));

        const res = await fetch(`${backendURL}interface/tab/${selectedTab.id}/ticket/${selectedTab.tickets.find(ticket => ticket.status === null).id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });

        await getTabs()
        setShowLoadingSpinner(false)
        if (res.ok) {
            console.log('hit hit')
        }

    };

    const handleNewTabFormChange = event => {
        setNewTabForm({
            ...newTabForm,
            [event.target.name]: event.target.value,
        });
    };


    if (!tabs) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {
                selectedTab
                    ? <TabInfo fullTab={selectedTab} handleCreateNewTicket={handleCreateNewTicket} getTabs={getTabs} selectedMenu={selectedMenu} menus={menus} setSelectedMenu={setSelectedMenu} handleCreateNewTicketItem={handleCreateNewTicketItem} handleProcessTicket={handleProcessTicket} openTabMenu={() => { setSelectedTab(null) }} />
                    : <TabList tabs={tabs.filter(tab => tab.restaurant_table_id === null)} toggleShowNewTabForm={() => { setShowNewTabForm(!showNewTabForm) }} setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
            }

            {showNewTabForm && <NewTabForm newTabForm={newTabForm} handleCreateNewTab={handleCreateNewTab} handleNewTabFormChange={handleNewTabFormChange} toggleShowNewTabForm={() => { setShowNewTabForm(!showNewTabForm) }} />}

            {showLoadingSpinner && <LoadingSpinner />}
        </>
    );
};



export default TicketDetail;
