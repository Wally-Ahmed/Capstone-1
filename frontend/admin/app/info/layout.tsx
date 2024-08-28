import Footer from "@/components/Footer";
import Header from "@/components/Header";
import validateJWT from "@/api/validateJWT";
import { backendURL } from "@/public/config";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await validateJWT();


  const cookie = cookies().get('token');


  const jwt = cookie ? cookie.value : null;

  return (
    <>
      <Header view='info' jwt={jwt} loggedIn={user.validated} />
      {children}
      <Footer />
    </>
  );
}

