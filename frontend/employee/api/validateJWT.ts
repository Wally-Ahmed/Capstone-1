import { backendURL } from "@/public/config";
import { cookies } from "next/headers";

interface body {
    restaurant_name: string,
    restaurant_address: string,
    email: string,
    phone_number: string,
}

export default async function validateJWT(): Promise<{
    validated: boolean, user?: {
        restaurant_name: string,
        restaurant_address: string,
        email: string,
        phone_number: string,
    }
}> {
    const cookie = cookies().get('token');

    if (cookie) {

        try {
            const res = await fetch(`${backendURL}staff/validate-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cookie.value,
                    'Cache-Control': 'no-store',
                }
            },);
            const response: {
                validated: boolean,
                user?: {
                    restaurant_name: string,
                    restaurant_address: string,
                    email: string,
                    phone_number: string,
                }
            } = await res.json();

            return response;
        } catch (error) {
            return { validated: false }
        }

    } else {
        return { validated: false }
    }
}
