import { backendURL } from "@/public/config";
import { cookies } from "next/headers";

interface body {
    tablemap_permission: boolean,
    tab_permission: boolean,
    kitchen_permission: boolean,
    shift_permission: boolean,
}

export default async function validateJWT(): Promise<{
    validated: boolean, user?: body
}> {
    const cookie = cookies().get('token');


    if (cookie) {

        try {
            const res = await fetch(`${backendURL}interface/validate-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cookie.value,
                    'Cache-Control': 'no-store',
                }
            },);
            const response: {
                validated: boolean,
                user?: body
            } = await res.json();


            return response;
        } catch (error) {
            return { validated: false }
        }

    } else {
        return { validated: false }
    }
}
