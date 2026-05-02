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
      <div className="bg-[#4E6253]" style={{ minHeight: "60vh" }} aria-hidden="true" />
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
 *
 * `stops` lets us multi-stop through intermediate hues (forest → olive →
 * sand) which is much smoother than a straight 2-color gradient when the
 * endpoints sit far apart in hue.
 */
function Bridge({
  from,
  to,
  height = "h-32",
  stops,
}: {
  from: string;
  to: string;
  height?: string;
  stops?: string[];
}) {
  const gradient =
    stops && stops.length > 0
      ? `linear-gradient(to bottom, ${from}, ${stops.join(", ")}, ${to})`
      : `linear-gradient(to bottom, ${from}, ${to})`;
  return (
    <div
      aria-hidden
      className={`${height} w-full`}
      style={{ background: gradient }}
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
      {/* Features ends on stone (#BFB49C). Fade into PlanToDoneAnimation's
          sage-olive canvas (#4E6253) — lighter + warmer than the previous
          dark-sage so the value jump from sand is small enough that the
          transition reads as an ambient shift, not a "new room." Shorter
          bridges follow — less distance to cover. */}
      <Bridge
        from="#BFB49C"
        to="#4E6253"
        height="h-48 lg:h-64"
        stops={["#A59E7D 22%", "#868C70 48%", "#647566 72%"]}
      />
      <PlanToDoneAnimation />
      <Bridge
        from="#4E6253"
        to="#BFB49C"
        height="h-48 lg:h-64"
        stops={["#4E6253 8%", "#566B5C 20%", "#647566 38%", "#868C70 58%", "#A59E7D 78%"]}
      />
      <Comparison />
      <FounderNote />
      <Integrations />
      <Pricing />
      <Guarantee />
      <FAQ />
      {/* FAQ ends and CTA starts both on #BFB49C — but Tailwind's
          bg-gradient-to-b vs the CTA's inline linear-gradient render
          subtly differently and a sub-pixel seam shows up at certain
          zooms. A short flat hold of the shared color masks it. */}
      <Bridge from="#BFB49C" to="#BFB49C" height="h-10 lg:h-14" />
      <CTABanner />
      <Footer />
    </main>
  );
}
