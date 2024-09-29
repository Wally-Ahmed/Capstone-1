// actions/signUp.js
'use server';

import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData) {
    const payload = {
        employee_name: formData.get('employee_name'),
        employee_email: formData.get('employee_email'),
        employee_phone: formData.get('employee_phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    };

    const res = await fetch(`${backendURL}staff/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        // Extract error message from the response
        const errorMessage = data.error?.message || data.message || 'Sign-up failed';
        // Redirect back to the sign-up page with error message
        redirect(`/signup?error=${encodeURIComponent(errorMessage)}`);
    }

    // Set the token cookie
    cookies().set('token', data.token);

    // Redirect after successful sign-up
    redirect('/');
}
