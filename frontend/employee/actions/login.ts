import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function login(formData) {
    'use server';


    const payload: { [key: string]: string; } = { password: formData.get('password'), employee_email: formData.get('email'), }


    try {
        const res = await fetch(`${backendURL}staff/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });


        // Check if the res status is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }



        // Parse the res as JSON
        const data = await res.json();

        cookies().set('token', data.token)
        console.log('hiiter', data.token)


    } catch (error) {
        console.log(error, ':(')
    }

    // Example function to process the form data
    redirect('/');
}