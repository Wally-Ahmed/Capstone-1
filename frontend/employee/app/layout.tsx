import { Providers } from "./providers";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Background from "@/components/Background";
import { Inter } from "next/font/google";
import "../styles/index.css";
import validateJWT from "@/api/validateJWT";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await validateJWT();


  return (
    <html suppressHydrationWarning lang="en">

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>

        <Providers>
          {/* {user.validated ? 'logged in' : 'not logged in'} */}
          {children}
          {/* <ScrollToTop /> */}
        </Providers>

      </body>
    </html>
  );
}

