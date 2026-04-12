"use client";

import { useSectionColors } from "@/lib/hooks/useSectionColors";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import BuiltTough from "@/components/BuiltTough";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Screenshots from "@/components/Screenshots";
import Pricing from "@/components/Pricing";
// import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

const SECTION_IDS = [
  "hero",
  "problem",
  "built-tough",
  "features",
  "how-it-works",
  "screenshots",
  "pricing",
  "cta",
  "footer",
];

export default function Home() {
  const bgColor = useSectionColors(SECTION_IDS);

  return (
    <main style={{ backgroundColor: bgColor }} className="transition-colors duration-500">
      <Navbar />
      <Hero />
      <Problem />
      <BuiltTough />
      <Features />
      <HowItWorks />
      <Screenshots />
      <Pricing />
      {/* <Testimonials /> */}
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
