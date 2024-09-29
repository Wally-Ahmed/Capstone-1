// app/signin/page.jsx

import Link from "next/link";
import { Metadata } from "next";
import { link } from "@/actions/link";
import { adminURL } from "@/public/config";

export const metadata: Metadata = {
  title: "Link Interface Page",
  description: "Link Interface to Restaurant",
  // other metadata
};

const LinkInterfacePage = ({ searchParams }) => {
  const error = searchParams?.error;

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Link Interface To Restaurant
                </h3>

                {/* Display error message if it exists */}
                {error && (
                  <div className="mb-6 text-center text-red-500">
                    {decodeURIComponent(error)}
                  </div>
                )}

                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>

                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                </div>
                <form action={link}>
                  <div className="mb-8">

                    <input
                      type="text"
                      name="link_code"
                      placeholder="Enter code to link interface"
                      required
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  <div className="mb-6">
                    <button
                      type="submit"
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
                    >
                      Link
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Login as an admin?{" "}
                  <a href={adminURL} className="text-primary hover:underline">
                    Admin page
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Background SVG or any other elements */}
        <div className="absolute left-0 top-0 z-[-1]">
          {/* ... Your SVG code ... */}
        </div>
      </section>
    </>
  );
};

export default LinkInterfacePage;
