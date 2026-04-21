"use client";

import dynamic from "next/dynamic";
import { useSectionColors } from "@/lib/hooks/useSectionColors";
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

const SECTION_IDS = [
  "hero",
  "the-shift",
  "how-it-works",
  "features",
  "plan-to-done",
  "comparison",
  "founder",
  "integrations",
  "pricing",
  "guarantee",
  "faq",
  "cta",
  "footer",
];

export default function Home() {
  const bgColor = useSectionColors(SECTION_IDS);

  return (
    <main
      style={{ backgroundColor: bgColor }}
      className="relative transition-colors duration-500"
    >
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
