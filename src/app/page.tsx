"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TheShift from "@/components/TheShift";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";

const PlanToDoneAnimation = dynamic(
  () => import("@/components/PlanToDoneAnimation"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-brand-midnight" style={{ minHeight: "60vh" }} aria-hidden="true" />
    ),
  },
);
import FounderNote from "@/components/FounderNote";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import Guarantee from "@/components/Guarantee";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TheShift />
      <HowItWorks />
      <Features />
      <PlanToDoneAnimation />
      <Comparison />
      <FounderNote />
      <Integrations />
      <Pricing />
      <Guarantee />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
