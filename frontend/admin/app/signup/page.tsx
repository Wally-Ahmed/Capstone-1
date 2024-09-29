// app/signup/page.jsx (or .tsx if you're using TypeScript)
import Link from "next/link";
import { Metadata } from "next";
import { signUp } from "@/actions/signUp";

export const metadata: Metadata = {
  title: "Sign Up Page | Free Next.js Template for Startup and SaaS",
  description: "This is Sign Up Page for Startup Nextjs Template",
  // other metadata
};

const SignupPage = ({ searchParams }) => {
  const error = searchParams?.error;

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Create your account
                </h3>

                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-body-color">
                    Register with your email
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                </div>

                {/* Display error message if it exists */}
                {error && (
                  <div className="mb-6 text-center text-red-500">{error}</div>
                )}

                <form action={signUp}>
                  {/* Form Fields */}
                  {/* Restaurant Name */}
                  <div className="mb-8">
                    <label
                      htmlFor="restaurant_name"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Restaurant Name
                    </label>
                    <input
                      required
                      type="text"
                      name="restaurant_name"
                      placeholder="Enter your restaurant name"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Restaurant Address */}
                  <div className="mb-8">
                    <label
                      htmlFor="restaurant_address"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Restaurant Address
                    </label>
                    <input
                      required
                      type="text"
                      name="restaurant_address"
                      placeholder="Enter your restaurant address"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Work Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="Enter your Email"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-8">
                    <label
                      htmlFor="phone"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-8">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-3 block text-sm text-dark dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      required
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Already using Startup?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
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

export default SignupPage;
