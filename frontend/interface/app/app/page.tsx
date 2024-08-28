import RestaurantView from "@/components/RestaurantView";
import validateJWT from "@/api/validateJWT";
import { backendURL } from "@/public/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header"
import Image from "next/image";
import Hero from "@/components/Hero";

export default async function App() {

    const user = await validateJWT();

    if (!user.validated) { redirect('/') }


    const cookie = cookies().get('token');

    if (user.user.tablemap_permission) {
        redirect("/app/tables")
    }
    if (user.user.tab_permission) {
        redirect("/app/tabs")
    }
    if (user.user.kitchen_permission) {
        redirect("/app/kitchen")
    }
    if (user.user.shift_permission) {
        redirect("/app/shifts")
    }


    return (
        <>
            <Hero />
        </>
    );
};