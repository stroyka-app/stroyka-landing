"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  title,
  subtitle,
  effectiveDate,
  sections,
}: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  const activeSection = sections.find((s) => s.id === activeId);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        {/* Soft sage vignette top-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-[55vw] h-[55vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 15% 15%, rgba(184,212,189,0.28), transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-14">
            <FadeIn>
              <SectionLabel>Legal</SectionLabel>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-3">
                {title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-[15px] text-ink-soft mb-1.5 max-w-xl">
                {subtitle}
              </p>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-muted">
                {effectiveDate}
              </p>
            </FadeIn>
          </div>

          {/* Mobile: Accordion layout */}
          <div className="lg:hidden space-y-2">
            {sections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <div
                  key={section.id}
                  className={`card-stone rounded-2xl border overflow-hidden transition-colors ${
                    isActive ? "border-brand-sage/45" : "border-ink/15"
                  }`}
                >
                  <button
                    onClick={() => setActiveId(isActive ? "" : section.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 ${
                      isActive
                        ? "bg-brand-sage/8 text-ink"
                        : "text-ink-soft hover:bg-ink/5"
                    }`}
                  >
                    <span className="font-display text-[16px] leading-snug">
                      {section.title}
                    </span>
                    <motion.span
                      animate={{ rotate: isActive ? 90 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`shrink-0 ${
                        isActive ? "text-brand-forest" : "text-ink/40"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-5 border-t border-ink/10">
                          <div className="legal-content text-ink-soft">
                            {section.content}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Desktop: Sidebar + Content */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-10">
            {/* Sidebar */}
            <nav className="sticky top-28 self-start">
              <div className="space-y-1">
                {sections.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveId(section.id)}
                      className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                        isActive
                          ? "bg-brand-sage/12 text-ink"
                          : "text-ink-soft hover:text-ink hover:bg-ink/5"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`block w-1 h-5 rounded-full transition-colors duration-200 ${
                          isActive
                            ? "bg-brand-forest"
                            : "bg-transparent group-hover:bg-ink/25"
                        }`}
                      />
                      <span className="font-display text-[15px] leading-tight">
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Content panel */}
            <div className="min-h-[60vh]">
              <AnimatePresence mode="wait">
                {activeSection && (
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="card-stone rounded-2xl border border-ink/15 p-9 lg:p-10"
                  >
                    <h2 className="font-display font-light text-[26px] lg:text-[30px] leading-tight text-ink mb-6 tracking-[-0.01em]">
                      {activeSection.title}
                    </h2>
                    <div className="legal-content text-ink-soft text-[15px] leading-[1.7]">
                      {activeSection.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
