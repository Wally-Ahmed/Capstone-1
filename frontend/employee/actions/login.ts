// actions/login.js
'use server';

import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData) {
    const payload = {
        employee_email: formData.get('email'),
        password: formData.get('password'),
    };

    const res = await fetch(`${backendURL}staff/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        // Extract error message from the response
        const errorMessage = data.error?.message || data.message || 'Login failed';
        // Redirect back to the sign-in page with error message
        redirect(`/signin?error=${encodeURIComponent(errorMessage)}`);
    }

    // Set the token cookie
    cookies().set('token', data.token);

    // Redirect after successful login
    redirect('/');
}
