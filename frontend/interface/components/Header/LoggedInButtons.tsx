"use client";
import Link from "next/link";
import { backendURL } from "@/public/config";
import { useRouter } from "next/navigation";

const Buttons = ({ view, jwt }) => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch(`${backendURL}staff/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                },
            });

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
                onClick={() => handleLogout()}
                className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
            >
                Log Out
            </button>
        </>
    );
};

export default Buttons;
