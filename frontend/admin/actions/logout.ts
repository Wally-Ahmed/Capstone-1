import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function logout() {
    'use server';



    const cookie = cookies().get('token') || null;


    try {
        const res = await fetch(`${backendURL}admin/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cookie.value
            },
        });


        // Check if the res status is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }



        // Parse the res as JSON
        const data = await res.json();

        cookies().set('token', data.token)


    } catch (error) {
        console.log(error, ':(')
    }

    // Example function to process the form data
    redirect('/');
}