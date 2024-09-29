// actions/login.js
'use server';

import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function link(formData) {
    const payload = { link_code: formData.get('link_code') };

    const res = await fetch(`${backendURL}interface/link`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        // Extract error message from the response
        const errorMessage = data.error?.message || data.message || 'Link failed';
        // Redirect back to the sign-in page with error message
        redirect(`/link?error=${encodeURIComponent(errorMessage)}`);
    }

    // Set the token cookie
    cookies().set('token', data.token);

    // Redirect after successful login
    redirect('/');
}
