import React from 'react';
import Register from '@/components/Register';
import { cookies } from 'next/headers';
import validateJWT from '@/api/validateJWT';

export default async function Home() {


    const cookie = cookies().get('token');

    return (
        <>
            <Register jwt={cookie.value} />
        </>
    );
}

