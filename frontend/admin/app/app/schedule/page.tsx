import ScrollUp from "@/components/Common/ScrollUp";
import UpdateScheduleForm from "@/components/UpdateScheduleForm";
import validateJWT from "@/api/validateJWT";
import getSchedule from "@/api/getSchedule";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";



export default async function App() {


    const cookie = cookies().get('token');
    const schedule = await getSchedule();


    return (
        <>
            <UpdateScheduleForm initialSchedule={schedule.data} jwt={cookie.value} />
        </>
    );
};