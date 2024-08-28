import { backendURL } from "@/public/config";
import { cookies } from "next/headers";


export default async function getMenuTitles(): Promise<{
    data: { menu_title: string, restaurant_id: string, id: string }[]
}> {
    const cookie = cookies().get('token') || null;

    if (!cookie) {
        throw new Error('Not logged in!');
    };
    const res = await fetch(`${backendURL}admin/menu`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json',
            'Authorization': cookie.value
        }
    },);
    const response: {
        menus: { menu_title: string, restaurant_id: string, id: string }[]
    } = await res.json();

    return { data: response.menus };

}
