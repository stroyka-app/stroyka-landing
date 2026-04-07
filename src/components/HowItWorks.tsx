"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const TABS = {
  boss: {
    label: "For the Boss",
    steps: [
      { num: "01", title: "Create a project", body: "Add the name, address, and budget. Takes 30 seconds." },
      { num: "02", title: "Invite your crew", body: "Workers get an email invite and join with one tap. No account setup forms." },
      { num: "03", title: "Watch costs update", body: "As workers log time and submit requests, your project P&L updates in real time." },
    ],
  },
  worker: {
    label: "For the Crew",
    steps: [
      { num: "01", title: "Accept your invite", body: "Tap the link in your email. You're in." },
      { num: "02", title: "See your tasks", body: "Your boss assigns tasks with instructions and priority. They're waiting for you when you open the app." },
      { num: "03", title: "Log and submit", body: "Clock in, submit supply requests, mark tasks done. Works offline — it all syncs when you get signal." },
    ],
  },
} as const;

type TabKey = keyof typeof TABS;

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabKey>("boss");

  return (
    <section id="how-it-works" className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>How It Works</SectionLabel>
          </FadeIn>
          <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-8">
            Simple for everyone.
          </TextReveal>
          <FadeIn delay={0.1}>
            <div className="inline-flex gap-2 bg-brand-deep/50 rounded-full p-1">
              {(Object.keys(TABS) as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-2.5 rounded-full font-heading text-sm font-medium transition-all duration-200 ${
                    activeTab === key ? "bg-brand-forest text-white" : "text-brand-sage hover:text-white"
                  }`}
                >
                  {TABS[key].label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col gap-12">
              {TABS[activeTab].steps.map((step) => (
                <div key={step.num} className="relative pl-24">
                  <span className="absolute left-0 top-0 text-7xl font-heading font-bold text-brand-forest/20 leading-none select-none">
                    {step.num}
                  </span>
                  <h3 className="font-heading font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-brand-sage-mist/70 text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
