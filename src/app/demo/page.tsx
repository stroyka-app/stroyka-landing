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
      <main className="min-h-screen pt-32 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <FadeIn>
            <SectionLabel>Get Started</SectionLabel>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4">
              Request your demo
            </h1>
            <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-10">
              Fill out the form below and we&apos;ll schedule a 20-minute personalized demo with your own sample data. No commitment, no credit card.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <DemoForm />
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
