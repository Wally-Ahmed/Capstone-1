import Image from "next/image";
import Link from "next/link";

const checkIcon = (
    <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
        <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
    </svg>
);

const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
        <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
            {checkIcon}
        </span>
        {text}
    </p>
);

interface Schedule {
    monday_opening: string | null;
    tuesday_opening: string | null;
    wednesday_opening: string | null;
    thursday_opening: string | null;
    friday_opening: string | null;
    saturday_opening: string | null;
    sunday_opening: string | null;
    monday_closing: string | null;
    tuesday_closing: string | null;
    wednesday_closing: string | null;
    thursday_closing: string | null;
    friday_closing: string | null;
    saturday_closing: string | null;
    sunday_closing: string | null;
    time_zone: string | null;
    time_until_first_reservation_minutes: number;
    time_until_last_reservation_minutes: number;
    reservation_duration_minutes: number;
}

const userInfo = ({ user, schedule }) => {
    const renderScheduleItem = (day, opening, closing) => {
        return (
            <li className="mb-2 flex justify-between">
                <span className="font-semibold">{day}:</span>
                <span>{opening ? opening : '--:--'} to {closing ? closing : '--:--'}</span>
            </li>
        );
    };

    return (
        <section id="about" className="pt-16 md:pt-20 lg:pt-28">
            <div className="container mx-auto">
                <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
                    <div className="-mx-4 flex flex-wrap items-center">
                        <div className="w-full px-4 lg:w-1/2">
                            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                                Welcome to <b>{user.restaurant_name}</b>
                            </h1>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                                Located at {user.restaurant_address}
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                                Email: <span className="font-medium underline">{user.email}</span>
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                                Phone: <span className="font-medium">{user.phone_number}</span>
                            </p>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Schedule</h2>
                            <ul className="list-none pl-0 text-gray-700 dark:text-gray-300">
                                {renderScheduleItem('Monday', schedule.monday_opening, schedule.monday_closing)}
                                {renderScheduleItem('Tuesday', schedule.tuesday_opening, schedule.tuesday_closing)}
                                {renderScheduleItem('Wednesday', schedule.wednesday_opening, schedule.wednesday_closing)}
                                {renderScheduleItem('Thursday', schedule.thursday_opening, schedule.thursday_closing)}
                                {renderScheduleItem('Friday', schedule.friday_opening, schedule.friday_closing)}
                                {renderScheduleItem('Saturday', schedule.saturday_opening, schedule.saturday_closing)}
                                {renderScheduleItem('Sunday', schedule.sunday_opening, schedule.sunday_closing)}
                                <li className="mb-2 flex justify-between">
                                    <span className="font-semibold">Time Zone:</span>
                                    <span>{schedule.time_zone}</span>
                                </li>
                                <li className="mb-2 flex justify-between">
                                    <span className="font-semibold">Reservations start:</span>
                                    <span>{schedule.time_until_first_reservation_minutes} minutes after opening</span>
                                </li>
                                <li className="mb-2 flex justify-between">
                                    <span className="font-semibold">Reservations end:</span>
                                    <span>{schedule.time_until_last_reservation_minutes} minutes before closing</span>
                                </li>
                                <li className="mb-2 flex justify-between">
                                    <span className="font-semibold">Reservations duration:</span>
                                    <span>{schedule.reservation_duration_minutes} minutes</span>
                                </li>
                            </ul>
                            <div>
                                <Link
                                    href="/app/schedule"
                                    className="mt-6 inline-flex items-center justify-center ease-in-up shadow-btn hover:shadow-btn-hover rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90"
                                >
                                    Edit schedule
                                </Link>
                            </div>

                        </div>
                        <div className="w-full px-4 lg:w-1/2">
                            <div className="relative mx-auto aspect-w-1 aspect-h-1 max-w-[500px] lg:mr-0">
                                <Image
                                    src="/images/about/about-image.svg"
                                    alt="about-image"
                                    layout="fill"
                                    className="rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default userInfo;
