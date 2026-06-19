import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GetStartedFlow from "@/components/GetStartedFlow";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Choose a Stroyka plan and start managing your construction crew today. No per-seat fees — your entire team is included.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
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
