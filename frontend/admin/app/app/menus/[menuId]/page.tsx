// pages/app.tsx
import ScrollUp from "@/components/Common/ScrollUp";
import MenuBuilder2 from "@/components/MenuBuilder2";
import validateJWT from "@/api/validateJWT";
import getFullMenuById from "@/api/getFullMenuById";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { useRouter } from 'next/router';




export default async function App() {

    const cookie = cookies().get('token');

    return (
        <>
            <MenuBuilder2 jwt={cookie.value} />
        </>
    );
}

