// pages/app.tsx
import ScrollUp from "@/components/Common/ScrollUp";
import LayoutTitles from "@/components/Layout/LayoutTitles";
import validateJWT from "@/api/validateJWT";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function App() {

    const user = await validateJWT();

    return (
        <>
            <LayoutTitles activeLayoutId={user.user.active_layout_id} />
        </>
    );
}
