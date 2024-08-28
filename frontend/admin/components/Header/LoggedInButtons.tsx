"use client";
import Link from "next/link";
import { logout } from "@/actions/logout";
import { backendURL } from "@/public/config";
import { useRouter } from "next/navigation";

interface ButtonsProps {
    view: string;
    jwt: string;
}

const Buttons: React.FC<ButtonsProps> = ({ view, jwt }) => {
    const router = useRouter();

    const handleLogout = async (jwt: string) => {
        try {
            const res = await fetch(`${backendURL}admin/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt,
                },
            });

            // Check if the response status is OK (status code 200-299)
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${await res.json()}`);
            }

            router.refresh();
        } catch (error) {
            console.log(error, ':(');
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
                onClick={() => handleLogout(jwt)}
                className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
            >
                Log Out
            </button>
        </>
    );
};

export default Buttons;
