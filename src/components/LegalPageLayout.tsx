"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <main className="min-h-screen pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-brand-sage-mist mb-3">
              {title}
            </h1>
            <p className="text-sm text-brand-sage/60">{subtitle}</p>
            <p className="text-xs text-brand-sage/40 mt-1">{effectiveDate}</p>
          </div>

          {/* Mobile: Accordion layout */}
          <div className="lg:hidden space-y-2">
            {sections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-brand-deep/60 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveId(isActive ? "" : section.id)
                    }
                    className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 ${
                      isActive
                        ? "bg-brand-forest/10 text-brand-sage-mist"
                        : "bg-brand-deep/20 text-brand-sage/70 hover:bg-brand-deep/30"
                    }`}
                  >
                    <span className="font-heading text-sm font-medium">
                      {section.title}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-5 bg-brand-deep/10 border-t border-brand-deep/40">
                          <div className="legal-content">{section.content}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Desktop: Sidebar + Content */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <nav className="sticky top-28 self-start">
              <div className="space-y-1">
                {sections.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveId(section.id)}
                      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-brand-forest/15 text-brand-sage-mist"
                          : "text-brand-sage/60 hover:text-brand-sage hover:bg-brand-deep/30"
                      }`}
                    >
                      <div
                        className={`w-1 h-5 rounded-full transition-all duration-200 ${
                          isActive
                            ? "bg-brand-forest"
                            : "bg-transparent group-hover:bg-brand-deep"
                        }`}
                      />
                      <span className="font-heading text-sm font-medium">
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
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="rounded-2xl border border-brand-deep/40 bg-brand-deep/10 p-8"
                  >
                    <h2 className="text-xl font-heading font-semibold text-brand-sage-mist mb-6">
                      {activeSection.title}
                    </h2>
                    <div className="legal-content">
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
