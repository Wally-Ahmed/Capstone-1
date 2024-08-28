import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

"restaurant_name"
"restaurant_address"
"email"
"phone"
"password"
"confirmPassword"

export async function signUp(formData) {
    'use server';


    const payload: { [key: string]: string; } = {
        restaurant_name: formData.get('restaurant_name'),
        restaurant_address: formData.get('restaurant_address'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }


    try {
        const res = await fetch(`${backendURL}admin/signup`, {
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

        console.log(data)


    } catch (error) {
        console.log(error, ':(')
        return
    }

    // Example function to process the form data
    redirect('/');
}