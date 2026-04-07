"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

interface Step {
  num: string;
  title: string;
  body: string;
}

interface CardProps {
  step: Step;
  position: number; // -1 = left behind, 0 = active, 1 = right behind
  total: number;
}

function StepCard({ step, position }: CardProps) {
  const isActive = position === 0;

  const variants = {
    active: {
      scale: 1,
      x: 0,
      opacity: 1,
      zIndex: 10,
      rotateY: 0,
    },
    behindLeft: {
      scale: 0.88,
      x: "-14%",
      opacity: 0.45,
      zIndex: 5,
      rotateY: 8,
    },
    behindRight: {
      scale: 0.88,
      x: "14%",
      opacity: 0.45,
      zIndex: 5,
      rotateY: -8,
    },
    hiddenLeft: {
      scale: 0.76,
      x: "-28%",
      opacity: 0,
      zIndex: 1,
      rotateY: 12,
    },
    hiddenRight: {
      scale: 0.76,
      x: "28%",
      opacity: 0,
      zIndex: 1,
      rotateY: -12,
    },
  };

  const getVariant = () => {
    if (position === 0) return "active";
    if (position === -1) return "behindLeft";
    if (position === 1) return "behindRight";
    if (position < -1) return "hiddenLeft";
    return "hiddenRight";
  };

  return (
    <motion.div
      variants={variants}
      animate={getVariant()}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={`absolute inset-0 flex flex-col justify-between rounded-2xl p-8 border border-brand-deep bg-brand-deep transition-shadow ${
        isActive ? "ring-1 ring-brand-forest/30 shadow-2xl shadow-brand-forest/10" : ""
      }`}
    >
      <div>
        <span className="block font-heading font-bold text-7xl leading-none select-none text-brand-forest/25 mb-6">
          {step.num}
        </span>
        <h3 className="font-heading font-semibold text-xl text-white mb-3">{step.title}</h3>
        <p className="text-brand-sage-mist/70 text-sm leading-relaxed">{step.body}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabKey>("boss");
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = TABS[activeTab].steps;
  const total = steps.length;

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % total) + total) % total);
  }, [total]);

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Reset index when tab changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeTab]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, total, activeTab]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  return (
    <section id="how-it-works" className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>How It Works</SectionLabel>
          </FadeIn>
          <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-8">
            Simple for everyone.
          </TextReveal>

          {/* Tab switcher */}
          <FadeIn delay={0.1}>
            <div className="inline-flex gap-2 bg-brand-deep/50 rounded-full p-1">
              {(Object.keys(TABS) as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-2.5 rounded-full font-heading text-sm font-medium transition-all duration-200 ${
                    activeTab === key
                      ? "bg-brand-forest text-white"
                      : "text-brand-sage hover:text-white"
                  }`}
                >
                  {TABS[key].label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <FadeIn delay={0.15}>
              <div
                className="relative mx-auto max-w-xl"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Card stage */}
                <div className="relative h-64 sm:h-56" style={{ perspective: "1200px" }}>
                  {steps.map((step, i) => {
                    const position = i - activeIndex;
                    // Wrap positions for circular carousel
                    const wrappedPosition = (() => {
                      if (position === 0) return 0;
                      if (Math.abs(position) <= 1) return position;
                      // For 3 items: position 2 wraps to -1 and position -2 wraps to 1
                      if (position === total - 1) return -1;
                      if (position === -(total - 1)) return 1;
                      return position > 0 ? 2 : -2;
                    })();

                    return (
                      <StepCard
                        key={step.num}
                        step={step}
                        position={wrappedPosition}
                        total={total}
                      />
                    );
                  })}
                </div>

                {/* Arrow navigation */}
                <div className="flex items-center justify-between mt-6 px-1">
                  <button
                    onClick={prev}
                    aria-label="Previous step"
                    className="w-10 h-10 rounded-full border border-brand-forest/30 text-brand-sage hover:border-brand-forest hover:text-white transition-all duration-200 flex items-center justify-center"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Dot indicators */}
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to step ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                          i === activeIndex
                            ? "w-6 h-2 bg-brand-forest"
                            : "w-2 h-2 bg-brand-forest/30 hover:bg-brand-forest/60"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={next}
                    aria-label="Next step"
                    className="w-10 h-10 rounded-full border border-brand-forest/30 text-brand-sage hover:border-brand-forest hover:text-white transition-all duration-200 flex items-center justify-center"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </FadeIn>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
