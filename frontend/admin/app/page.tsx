import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import validateJWT from "@/api/validateJWT";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";




export default async function Home() {
  const user = await validateJWT()
  console.log(user)
  if (user.validated) {
    redirect('/app');
  }
  else {
    redirect('/info')
  }

  return (
    <></>
  );
}
