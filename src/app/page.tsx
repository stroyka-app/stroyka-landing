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

/**
 * Bridge — thin gradient div that sits between two sections with different
 * end colors. Used to smooth the transition into and out of the dark
 * PlanToDone (R3F) section so there's no hard edge.
 */
function Bridge({ from, to, height = "h-32" }: { from: string; to: string; height?: string }) {
  return (
    <div
      aria-hidden
      className={`${height} w-full`}
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TheShift />
      <HowItWorks />
      <Features />
      {/* PlanToDoneAnimation now handles its own title-on-stone section
          + internal gradient bridge into the dark 3D canvas. We only
          need the outbound bridge from the canvas (#2A3842) back to
          Comparison's start color (#BFB49C). */}
      <PlanToDoneAnimation />
      <Bridge from="#2A3842" to="#BFB49C" height="h-40" />
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
