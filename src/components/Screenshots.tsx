"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Screenshot {
  path: string;
  label: string;
  caption: string;
}

const SCREENSHOTS: Screenshot[] = [
  {
    path: "/screenshots/projects.png",
    label: "Projects",
    caption:
      "All your active jobs in one place — costs, crew, and status at a glance",
  },
  {
    path: "/screenshots/job-costing.png",
    label: "Job Costing",
    caption:
      "Every dollar tracked — labor, materials, fuel, and equipment per project",
  },
  {
    path: "/screenshots/tasks.png",
    label: "Tasks",
    caption:
      "Assign work, set priorities, and track completion across your crew",
  },
  {
    path: "/screenshots/requests.png",
    label: "Requests",
    caption: "Workers submit supply requests — you approve, costs auto-log",
  },
  {
    path: "/screenshots/worker-view.png",
    label: "Worker View",
    caption:
      "Your crew gets their own dashboard — tasks, time logging, and daily updates",
  },
];

const AUTO_ADVANCE_MS = 5000;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
}

export default function Screenshots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex(wrap(index, SCREENSHOTS.length));
  }, []);

  const goNext = useCallback(
    () => goTo(activeIndex + 1),
    [activeIndex, goTo]
  );
  const goPrev = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo]
  );

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext]);

  // Preload images
  useEffect(() => {
    SCREENSHOTS.forEach((s) => {
      const img = new Image();
      img.src = s.path;
    });
  }, []);

  const prevIndex = wrap(activeIndex - 1, SCREENSHOTS.length);
  const nextIndex = wrap(activeIndex + 1, SCREENSHOTS.length);

  return (
    <section id="screenshots" className="py-16 lg:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <SectionLabel>The App</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            See it in action
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/60 max-w-lg mx-auto">
              Built for the field, not the office. Every screen works offline
              and syncs when you&apos;re back in range
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Tab navigation */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10 flex-wrap">
              {SCREENSHOTS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => goTo(i)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-heading font-medium transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-brand-forest text-white shadow-lg shadow-brand-forest/20"
                      : "text-brand-sage/60 hover:text-brand-sage-mist hover:bg-brand-deep/50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Coverflow carousel */}
            <div
              className="relative mx-auto"
              style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}
            >
              {/* Navigation arrows */}
              <button
                onClick={goPrev}
                aria-label="Previous screenshot"
                className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-brand-deep/80 backdrop-blur-sm border border-brand-sage/10 hover:bg-brand-deep hover:border-brand-forest/30 items-center justify-center transition-all duration-200"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={goNext}
                aria-label="Next screenshot"
                className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-brand-deep/80 backdrop-blur-sm border border-brand-sage/10 hover:bg-brand-deep hover:border-brand-forest/30 items-center justify-center transition-all duration-200"
              >
                <ChevronRightIcon />
              </button>

              {/* Three-phone layout */}
              <div
                className="relative mx-auto flex items-center justify-center"
                style={{
                  height: "640px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Left phone — hidden on mobile */}
                <div
                  className="hidden md:block absolute"
                  style={{
                    width: "220px",
                    left: "50%",
                    marginLeft: "-410px",
                    transformStyle: "preserve-3d",
                    zIndex: 5,
                  }}
                >
                  <CoverflowPhone
                    screenshot={SCREENSHOTS[prevIndex]}
                    position="left"
                    onClick={goPrev}
                  />
                </div>

                {/* Center phone */}
                <div
                  className="relative"
                  style={{ width: "min(340px, 80vw)", zIndex: 20 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={SPRING}
                    >
                      <CoverflowPhone
                        screenshot={SCREENSHOTS[activeIndex]}
                        position="center"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right phone — hidden on mobile */}
                <div
                  className="hidden md:block absolute"
                  style={{
                    width: "220px",
                    right: "50%",
                    marginRight: "-410px",
                    transformStyle: "preserve-3d",
                    zIndex: 5,
                  }}
                >
                  <CoverflowPhone
                    screenshot={SCREENSHOTS[nextIndex]}
                    position="right"
                    onClick={goNext}
                  />
                </div>
              </div>

              {/* Mobile swipe hint */}
              <p className="md:hidden text-center text-xs text-brand-sage/30 mt-2">
                Tap a tab to browse
              </p>
            </div>

            {/* Caption */}
            <div className="mt-8 text-center min-h-[3rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-base text-brand-sage-mist/70 max-w-md mx-auto"
                >
                  {SCREENSHOTS[activeIndex].caption}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {SCREENSHOTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-6 h-2 bg-brand-forest"
                        : "w-2 h-2 bg-brand-sage-mist/25 hover:bg-brand-sage-mist/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

interface CoverflowPhoneProps {
  screenshot: Screenshot;
  position: "left" | "center" | "right";
  onClick?: () => void;
}

function CoverflowPhone({ screenshot, position, onClick }: CoverflowPhoneProps) {
  const isCenter = position === "center";
  const rotateY = position === "left" ? 45 : position === "right" ? -45 : 0;

  return (
    <motion.div
      animate={{ rotateY, opacity: isCenter ? 1 : 0.55 }}
      transition={SPRING}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: position === "left" ? "right center" : position === "right" ? "left center" : "center center",
        filter: isCenter
          ? "drop-shadow(0 30px 60px rgba(82,121,111,0.5))"
          : "brightness(0.55) drop-shadow(0 10px 30px rgba(0,0,0,0.3))",
        cursor: isCenter ? "default" : "pointer",
      }}
      onClick={onClick}
      whileHover={!isCenter ? { opacity: 0.7 } : undefined}
    >
      <div className={`rounded-2xl overflow-hidden ring-1 ring-brand-forest/20 ${isCenter ? "bg-brand-deep" : ""}`}>
        <img
          src={screenshot.path}
          alt={screenshot.label}
          className="w-full h-auto block select-none pointer-events-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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
      width="18"
      height="18"
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
