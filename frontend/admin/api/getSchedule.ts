import { backendURL } from "@/public/config";
import { cookies } from "next/headers";


export default async function getSchedule(): Promise<{
    data: {
        monday_opening: string | null,
        tuesday_opening: string | null,
        wednesday_opening: string | null,
        thursday_opening: string | null,
        friday_opening: string | null,
        saturday_opening: string | null,
        sunday_opening: string | null,
        monday_closing: string | null,
        tuesday_closing: string | null,
        wednesday_closing: string | null,
        thursday_closing: string | null,
        friday_closing: string | null,
        saturday_closing: string | null,
        sunday_closing: string | null,
        time_zone: string | null,
        time_until_first_reservation_minutes: number,
        time_until_last_reservation_minutes: number,
        reservation_duration_minutes: number,
    }
}> {
    const cookie = cookies().get('token') || null;

    if (!cookie) {
        throw new Error('Not logged in!');
    };
    const res = await fetch(`${backendURL}admin/schedule`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json',
            'Authorization': cookie.value
        }
    },);
    const response: {
        schedule: {
            monday_opening: string | null,
            tuesday_opening: string | null,
            wednesday_opening: string | null,
            thursday_opening: string | null,
            friday_opening: string | null,
            saturday_opening: string | null,
            sunday_opening: string | null,
            monday_closing: string | null,
            tuesday_closing: string | null,
            wednesday_closing: string | null,
            thursday_closing: string | null,
            friday_closing: string | null,
            saturday_closing: string | null,
            sunday_closing: string | null,
            time_zone: string | null,
            time_until_first_reservation_minutes: number,
            time_until_last_reservation_minutes: number,
            reservation_duration_minutes: number,
        }
    } = await res.json();

    return { data: response.schedule };

}
