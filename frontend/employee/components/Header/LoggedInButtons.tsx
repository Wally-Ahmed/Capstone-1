"use client";
import Link from "next/link";
import { logout } from "@/actions/logout";
import { backendURL } from "@/public/config";
import { useRouter } from "next/navigation";

export default function Buttons({ view, jwt }) {

    const router = useRouter();

    const handleLogout = async (jwt) => {

        try {
            const res = await fetch(`${backendURL}staff/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
            });

            // Check if the res status is OK (status code 200-299)
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${await res.json()}`);
            }

            router.refresh();

        } catch (error) {
            console.log(error, ':(');
            router.refresh();
        }

    };

    return (
        <>
            {view === 'info' && (
                <Link
                    href="/app"
                    className="hidden px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
                >
                    Dashboard
                </Link>
            )}
            <button
                onClick={() => { handleLogout(jwt) }}
                className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
            >
                Log Out
            </button>
        </>
    );
}
