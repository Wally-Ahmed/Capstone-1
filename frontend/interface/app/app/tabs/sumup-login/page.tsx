import React from 'react';
import Register from '@/components/Register';
import { cookies } from 'next/headers';
import validateJWT from '@/api/validateJWT';
import { backendURL, oauth2SumUpClientId } from '@/public/config';
import ErrorPage from './ErrorPage';
import { access } from 'fs';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams }) {


    const cookie = cookies().get('token');

    const code = searchParams['code'];

    const res = await fetch(`${backendURL}interface/tab/checkout/sumup-oauth-login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.value
        },
        body: JSON.stringify({
            code: code
        })
    });

    if (res.ok) { redirect('/app/tabs') }

    return <ErrorPage />
}

