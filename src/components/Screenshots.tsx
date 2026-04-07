"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Screenshot {
  path: string;
  label: string;
  emoji: string;
}

const SCREENSHOTS: Screenshot[] = [
  {
    path: "/screenshots/dashboard.png",
    label: "Project Dashboard — Real-time P&L at a glance",
    emoji: "📊",
  },
  {
    path: "/screenshots/tasks.png",
    label: "Task Board — Assign, prioritize, and track progress",
    emoji: "✅",
  },
  {
    path: "/screenshots/requests.png",
    label: "Supply Requests — Submit, approve, and auto-log costs",
    emoji: "📦",
  },
  {
    path: "/screenshots/timesheet.png",
    label: "Timesheets — Clock in/out with offline support",
    emoji: "⏱",
  },
  {
    path: "/screenshots/reports.png",
    label: "Reports — Export CSV & PDF anytime",
    emoji: "📄",
  },
];

const AUTO_ADVANCE_MS = 4000;

export default function Screenshots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex((SCREENSHOTS.length + index) % SCREENSHOTS.length);
  }, []);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    }, AUTO_ADVANCE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const activeScreenshot = SCREENSHOTS[activeIndex];

  return (
    <section id="screenshots" className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>The App</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight"
          >
            See it in action
          </TextReveal>
        </div>

        {/* Carousel */}
        <FadeIn delay={0.1}>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Device frame */}
            <div className="rounded-2xl bg-brand-deep ring-1 ring-brand-forest/25 p-3">
              <div className="relative overflow-hidden rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="w-full aspect-[16/10] rounded-xl bg-brand-midnight flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl mb-2 block">
                          {activeScreenshot.emoji}
                        </span>
                        <p className="text-sm text-brand-sage-mist/50">
                          {activeScreenshot.label}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Left arrow */}
            <button
              onClick={goPrev}
              aria-label="Previous screenshot"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brand-deep/80 hover:bg-brand-deep flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest"
            >
              <ChevronLeftIcon />
            </button>

            {/* Right arrow */}
            <button
              onClick={goNext}
              aria-label="Next screenshot"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brand-deep/80 hover:bg-brand-deep flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Caption */}
          <div className="mt-4 text-center min-h-[1.5rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-brand-sage-mist/70"
              >
                {activeScreenshot.label}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {SCREENSHOTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to screenshot ${i + 1}`}
                className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest ${
                  i === activeIndex
                    ? "w-4 h-2 bg-brand-forest"
                    : "w-2 h-2 bg-brand-sage-mist/30 hover:bg-brand-sage-mist/50"
                }`}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-sage-mist"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-sage-mist"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
