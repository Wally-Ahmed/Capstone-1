import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function login(formData) {
    'use server';


    const payload: { [key: string]: string; } = { password: formData.get('password'), email: formData.get('email'), }


    try {
        const res = await fetch(`${backendURL}admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });


        // Parse the res as JSON
        const data = await res.json();

        // Check if the res status is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`${data.error.message}`);
        }




        cookies().set('token', data.token)


    } catch (error) {
        console.log(error.message)
        // throw error
        return
    }

    // Example function to process the form data
    redirect('/');
}