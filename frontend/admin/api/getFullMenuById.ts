import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { fullMenu } from "./interfaces/menuProperties";


export default async function getMenuTitles(id): Promise<{
    data: fullMenu
}> {
    const cookie = cookies().get('token') || null;

    if (!cookie) {
        throw new Error('Not logged in!');
    };
    const res = await fetch(`${backendURL}admin/menu/id`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json',
            'Authorization': cookie.value
        }
    },);
    const response: {
        menu: fullMenu
    } = await res.json();

    return { data: response.menu };

}
