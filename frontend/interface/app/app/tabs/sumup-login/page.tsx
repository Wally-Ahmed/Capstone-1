import React from 'react';
import Register from '@/components/Register';
import { cookies } from 'next/headers';
import validateJWT from '@/api/validateJWT';
import { backendURL, oauth2SumUpClientId, oauth2SumUpClientSecret } from '@/public/config';
import ErrorPage from './ErrorPage';
import { access } from 'fs';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams }) {


    const cookie = cookies().get('token');

    const code = searchParams['code'];

    const tokenRes = await fetch(`https://api.sumup.com/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: oauth2SumUpClientId,
            client_secret: oauth2SumUpClientSecret,
            code: code
        })
    });

    if (!tokenRes.ok) {
        return <ErrorPage />
    }

    const tokenData: { access_token: string, refresh_token: string, expires_in: number, scope: string, token_type: string } = await tokenRes.json()

    const res = await fetch(`${backendURL}interface/tab/checkout/sumup-oauth-login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookie.value
        },
        body: JSON.stringify({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            code: code
        })
    });

    if (res.ok) { redirect('/app/tabs') }

    return <ErrorPage />
}

