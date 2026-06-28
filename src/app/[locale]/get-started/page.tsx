import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GetStartedFlow from "@/components/GetStartedFlow";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Choose a Stroyka plan and start managing your construction crew today. No per-seat fees — your entire team is included.",
  alternates: { canonical: "/get-started" },
};

export default async function GetStartedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <Suspense>
        <GetStartedFlow />
      </Suspense>
      <Footer />
    </>
  );
}
