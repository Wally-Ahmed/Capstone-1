// pages/app.tsx
import ScrollUp from "@/components/Common/ScrollUp";
import MenuTitles from "@/components/MenuTitles";
import validateJWT from "@/api/validateJWT";
import getMenuTitles from "@/api/getMenuTitles";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function App() {
    const menuTitles = await getMenuTitles();

    return (
        <>
            <MenuTitles />
        </>
    );
}
