import RestaurantView from "@/components/RestaurantView";
import validateJWT from "@/api/validateJWT";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function App() {

    const user = await validateJWT();

    if (!user.validated) { redirect('/') }


    const cookie = cookies().get('token');


    const res = await fetch(`${backendURL}staff/employeecode`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.value
        },
    });

    if (!res.ok) {
        throw new Error('Failed to update employee code');
    }

    const data = await res.json();


    return (
        <>
            <RestaurantView jwt={cookie.value} code={data.code} />
        </>
    );
};