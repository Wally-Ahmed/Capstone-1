// actions/login.js
'use server';

import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData) {
    const payload = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const res = await fetch(`${backendURL}admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        // Redirect back to the login page with error message
        const errorMessage = data.error.message || 'Login failed';
        redirect(`/signin?error=${encodeURIComponent(errorMessage)}`);
    }

    // Set the token cookie
    cookies().set('token', data.token);

    // Redirect after successful login
    redirect('/');
}
