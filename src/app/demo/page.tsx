import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Request a Demo",
  description: "See Stroyka in action. Book a 20-minute demo with the founder.",
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <FadeIn>
            <SectionLabel>Get started</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-5">
              Request your demo
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-10 max-w-lg">
              Fill out the form and we&rsquo;ll schedule a 20-minute personalized demo with your own sample data. No commitment, no credit card.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <DemoForm />
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
