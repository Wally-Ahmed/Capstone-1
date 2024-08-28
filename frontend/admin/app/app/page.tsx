import ScrollUp from "@/components/Common/ScrollUp";
import UserInfo from "@/components/Dashboard/UserInfo";
import validateJWT from "@/api/validateJWT";
import getSchedule from "@/api/getSchedule";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function App() {

    const user = await validateJWT();
    const schedule = await getSchedule();

    if (!user.validated) { redirect('/info') }

    return (
        <>
            <UserInfo user={user.user} schedule={schedule.data} />
            {console.log(schedule)}
        </>
    );
};