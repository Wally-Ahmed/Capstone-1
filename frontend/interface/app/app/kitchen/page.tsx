import React from 'react';
import KitchenView from '@/components/KitchenView';
import { cookies } from 'next/headers';
import validateJWT from '@/api/validateJWT';

export default async function Home() {
    const user = await validateJWT()

    console.log(user)


    const cookie = cookies().get('token');

    return (
        <>
            <KitchenView jwt={cookie.value} />
        </>
    );
}

