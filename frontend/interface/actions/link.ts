import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function link(formData) {
    'use server';


    const payload: { [key: string]: string; } = { link_code: formData.get('link_code') }


    try {
        const res = await fetch(`${backendURL}interface/link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // console.log('huh', await res.json())



        // Check if the res status is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }


        // Parse the res as JSON
        const data = await res.json();
        console.log('great', data)


        // console.log('pew pew', await res.json(), data.token)

        cookies().set('token', data.token)
        console.log('data', data)


    } catch (error) {
        console.log(error.message, ':(')
        return
    }

    // Example function to process the form data
    redirect('/');
}