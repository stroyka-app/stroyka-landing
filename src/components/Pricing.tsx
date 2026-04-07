"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

const STARTER_FEATURES = [
  "Unlimited projects",
  "Up to 10 workers",
  "Job costing & P&L reports",
  "Time tracking & timesheets",
  "Supply request workflow",
  "Offline-first sync",
  "CSV & PDF export",
  "Email support",
];

const PRO_FEATURES = [
  "Everything in Starter",
  "Up to 25 workers",
  "Advanced reporting",
  "Priority support",
  "Dedicated onboarding call",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <SectionLabel>Pricing</SectionLabel>
          </FadeIn>
          <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4">
            One price. Whole crew included.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75 max-w-lg mx-auto">
              No per-seat fees. No hidden add-ons. One flat monthly rate — your entire team uses Stroyka for the same price.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <FadeIn>
            <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-8 h-full">
              <h3 className="font-heading font-semibold text-xl mb-1">Starter</h3>
              <p className="text-brand-sage-mist/60 text-sm mb-6">For crews up to 10 workers</p>
              <div className="mb-6">
                <span className="text-4xl font-heading font-bold">$149</span>
                <span className="text-brand-sage-mist/60 ml-1">/ month</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8">
                {STARTER_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-brand-sage-mist/70">
                    <span className="text-brand-forest mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" href="/demo" className="w-full">Request Demo</Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-brand-deep border border-brand-forest ring-1 ring-brand-forest/30 rounded-2xl p-8 relative h-full"
            >
              <span className="absolute -top-3 left-8 bg-brand-forest text-white text-xs font-heading font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="font-heading font-semibold text-xl mb-1">Pro</h3>
              <p className="text-brand-sage-mist/60 text-sm mb-6">For crews up to 25 workers</p>
              <div className="mb-6">
                <span className="text-4xl font-heading font-bold">$299</span>
                <span className="text-brand-sage-mist/60 ml-1">/ month</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-brand-sage-mist/70">
                    <span className="text-brand-forest mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button variant="primary" href="/demo" className="w-full">Request Demo</Button>
            </motion.div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto border border-dashed border-brand-sage/30 bg-brand-deep/30 rounded-2xl p-8 text-center mb-10">
            <p className="text-lg font-heading font-semibold mb-2 flex items-center justify-center gap-2">
              <ShieldCheck size={20} className="text-brand-forest" />
              Founding Member Rate — $99/month, locked forever
            </p>
            <p className="text-sm text-brand-sage-mist/70 mb-6">
              The first 20 companies to sign up lock in $99/month for life. Price never increases, no matter what the public rate becomes.
            </p>
            <Button variant="primary" href="/demo" className="mb-6">Claim a Founding Spot →</Button>
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-brand-deep rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "40%", backgroundColor: "#d97706" }} />
              </div>
              <p className="text-xs text-brand-sage-mist/50 mt-2">12 of 20 spots remaining</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-brand-sage-mist/50">
            Not sure which plan fits? Book a 20-minute demo and we&rsquo;ll recommend the right one for your crew size.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
