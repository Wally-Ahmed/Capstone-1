"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Menu({ menuData }) {
    const pathname = usePathname(); // Correctly use the hook inside the component
    const [openIndex, setOpenIndex] = useState(null);

    const handleSubmenu = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <ul className="block lg:flex lg:space-x-12">
            {menuData.map((menuItem, index) => (
                <li key={index} className="group relative">
                    {menuItem.path ? (
                        <Link
                            href={menuItem.path}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${pathname === menuItem.path
                                ? "text-primary dark:text-white"
                                : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                                }`}
                        >
                            {menuItem.title}
                        </Link>
                    ) : (
                        <>
                            <p
                                onClick={() => handleSubmenu(index)}
                                className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                                {menuItem.title}
                                <span className="pl-3">
                                    <svg width="25" height="24" viewBox="0 0 25 24">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </span>
                            </p>
                            <div
                                className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${openIndex === index ? "block" : "hidden"
                                    }`}
                            >
                                {menuItem.submenu.map((submenuItem, index) => (
                                    <Link
                                        href={submenuItem.path}
                                        key={index}
                                        className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                    >
                                        {submenuItem.title}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}
