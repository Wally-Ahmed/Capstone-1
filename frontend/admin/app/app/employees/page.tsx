// pages/app.tsx
import ScrollUp from "@/components/Common/ScrollUp";
import EmployeeView from "@/components/EmployeeView";
import validateJWT from "@/api/validateJWT";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function App() {


    const cookie = cookies().get('token');

    return (
        <>
            <EmployeeView jwt={cookie.value} />
        </>
    );
}
