import Footer from "@/components/Footer";
import validateJWT from "@/api/validateJWT";
import { backendURL } from "@/public/config";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { NextFetchEvent } from "next/server";
import { revalidatePath } from "next/cache";

const inter = Inter({ subsets: ["latin"] });


export const dynamic = 'force-dynamic'


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  revalidatePath('/app', 'layout');


  const user = await validateJWT();

  if (!user.validated) {
    redirect('/')
  }

  const cookie = cookies().get('token');

  return (
    <>
      <Header view='app' jwt={cookie.value} loggedIn={user.validated} />
      {children}

    </>
  );
}

