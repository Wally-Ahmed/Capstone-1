import { backendURL } from "@/public/config";
import { cookies } from "next/headers";

interface body {
    restaurant_name: string,
    restaurant_address: string,
    email: string,
    phone_number: string,
    active_layout_id: string
}

export default async function validateJWT(): Promise<{
    validated: boolean, user?: body
}> {
    const cookie = cookies().get('token');

    if (cookie) {

        try {
            const res = await fetch(`${backendURL}admin/validate-login`, {
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
