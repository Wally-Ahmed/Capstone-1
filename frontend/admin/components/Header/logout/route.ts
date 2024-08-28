import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { backendURL } from '@/public/config';

export async function POST() {
    const cookieStore = cookies();
    const token = cookieStore.get('token') || null;

    try {
        const res = await fetch(`${backendURL}admin/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.value,
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Clear the token cookie
        cookieStore.set('token', '', { maxAge: 0 });

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
