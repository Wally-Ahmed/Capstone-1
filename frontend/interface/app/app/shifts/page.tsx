import React from 'react';
import ShiftClock from '@/components/ShiftClock';
import { cookies } from 'next/headers';
import validateJWT from '@/api/validateJWT';

export default async function Home() {


    const cookie = cookies().get('token');

    return (
        <>
            <ShiftClock jwt={cookie.value} />
        </>
    );
}

