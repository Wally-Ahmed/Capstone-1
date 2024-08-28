import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData) {
    'use server';

    const payload = {
        employee_name: formData.get('employee_name'),
        employee_email: formData.get('employee_email'),
        employee_phone: formData.get('employee_phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    try {
        const res = await fetch(`${backendURL}staff/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        console.log(data)

        cookies().set('token', data.token);

    } catch (error) {
        console.error('Error during sign up:', error);
        return
    }

    redirect('/');
}
