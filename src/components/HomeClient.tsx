"use client";

import dynamic from "next/dynamic";
import LoadingCurtain from "@/components/LoadingCurtain";
import HashScroll from "@/components/HashScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TheShift from "@/components/TheShift";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import FounderNote from "@/components/FounderNote";
import Integrations from "@/components/Integrations";
import Pricing from "@/components/Pricing";
import Guarantee from "@/components/Guarantee";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import Marginalia from "@/components/ui/Marginalia";

const PlanToDoneAnimation = dynamic(
  () => import("@/components/PlanToDoneAnimation"),
  {
    ssr: false,
    // Reserve the section's REAL height (the live section is `height: 500vh`,
    // see PlanToDoneAnimation.tsx). The old 60vh placeholder let every
    // anchor target below this section sit ~440vh too high until the R3F
    // chunk mounted — which is why /#pricing and footer links landed short.
    // Matching the height means the layout never shifts on mount, so hash
    // scrolling is correct from the first paint.
    loading: () => (
      <div className="bg-[#4E6253]" style={{ height: "500vh" }} aria-hidden="true" />
    ),
  },
);

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

export default function HomeClient() {
  return (
    <main className="relative">
      <LoadingCurtain />
      <HashScroll />
      <Navbar />
      <Hero />
      <TheShift />
      <HowItWorks />
      {/* Field-journal marginalia — the dead air between sections becomes
          the margins of one bound journal (the footer masthead's device).
          This one pulls up into HowItWorks' 30vh sticky-phone runway. MUST stay
          transparent (a solid full-width bg here would paint a band over the
          sticky phone): HowItWorks now holds a flat #D4CBB4 across that bottom
          runway, so the transparent marginalia shows a seam-matching colour and
          the transition into Features is invisible. */}
      {/* Mobile: no -mt pull-up, so this strip sits BETWEEN sections where
          the raw bone page-surface would show as a lighter band — both
          neighbours (HowItWorks' bottom runway and Features' top) are flat
          #D4CBB4, so paint the strip to match. Desktop keeps transparent
          (it overlaps the sticky-phone runway; a solid bg would band). */}
      <Marginalia
        note="06:15 — crew clocked in · 12 / 12"
        folio="02"
        className="bg-[#D4CBB4] md:bg-transparent md:-mt-[16vh] pb-12"
      />
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
      <Marginalia
        note="thursday — zero “did you approve that?” texts"
        folio="03"
        side="right"
        className="bg-[#D4CBB4] pb-10 md:-mt-6"
      />
      <FounderNote />
      <Marginalia
        note="— written from the truck, jobsite #204"
        folio="04"
        className="bg-[#E3DCC9] pb-10 md:-mt-14"
      />
      <Integrations />
      <Marginalia
        note="W-38 — invoice matched the estimate. first time ever."
        folio="05"
        side="right"
        className="bg-[#D4CBB4] pb-10 md:-mt-8"
      />
      <Pricing />
      <Marginalia
        note="— read it twice. it really is $0 to start."
        folio="06"
        side="right"
        className="bg-[#BFB49C] pb-10 md:-mt-8"
      />
      <Guarantee />
      <Marginalia
        note="no training day. the crew just… used it."
        folio="07"
        className="bg-[#A89E85] pb-10 md:-mt-10"
      />
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
