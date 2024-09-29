// actions/signUp.js
'use server';

import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData) {
    const payload = {
        restaurant_name: formData.get('restaurant_name'),
        restaurant_address: formData.get('restaurant_address'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    };

    const res = await fetch(`${backendURL}admin/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        // Redirect back to the signup page with error message
        const errorMessage = data.error?.message || data.message || 'Sign-up failed';
        redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
    }

    // Set the token cookie
    cookies().set('token', data.token);

    // Redirect after successful sign-up
    redirect('/');
}
