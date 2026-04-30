"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Feature {
  icon: (active: boolean) => React.ReactNode;
  title: string;
  body: string;
}

/* ── Per-feature motion icons ──
   Each icon has a static (un-active) and a live (active) variant. The
   active variant runs a slow loop tied to the section's narrative beat
   (signal-bars rebuilding for offline, two-roles handing off, dollar
   ticking up, request being approved). All transform-only / stroke-only
   so they stay GPU-cheap. */

const SignalIcon = ({ active }: { active: boolean }) => {
  const prefersReduced = useReducedMotion();
  const bars = [4, 8, 12, 16];
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      {bars.map((h, i) => (
        <motion.line
          key={i}
          x1={5 + i * 4.5}
          x2={5 + i * 4.5}
          y1={20}
          y2={20 - h}
          initial={false}
          animate={
            active && !prefersReduced
              ? { opacity: [0.25, 1, 1, 0.25], pathLength: [0.2, 1, 1, 0.2] }
              : { opacity: 1, pathLength: 1 }
          }
          transition={
            active && !prefersReduced
              ? {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </svg>
  );
};

const CrewIcon = ({ active }: { active: boolean }) => {
  const prefersReduced = useReducedMotion();
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <motion.g
        animate={
          active && !prefersReduced
            ? { x: [-1.5, 0, -1.5] }
            : { x: 0 }
        }
        transition={
          active && !prefersReduced
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      >
        <circle cx="8" cy="8" r="2.6" />
        <path d="M3 19c.5-2.6 2.6-4.4 5-4.4s4.5 1.8 5 4.4" />
      </motion.g>
      <motion.g
        animate={
          active && !prefersReduced
            ? { x: [1.5, 0, 1.5] }
            : { x: 0 }
        }
        transition={
          active && !prefersReduced
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      >
        <circle cx="16" cy="9" r="2.2" />
        <path d="M12 19c.4-2.1 2.1-3.6 4-3.6s3.6 1.5 4 3.6" />
      </motion.g>
    </svg>
  );
};

const DollarIcon = ({ active }: { active: boolean }) => {
  const prefersReduced = useReducedMotion();
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        initial={false}
        animate={active && !prefersReduced ? { rotate: 360 } : { rotate: 0 }}
        transition={
          active && !prefersReduced
            ? { duration: 24, repeat: Infinity, ease: "linear" }
            : { duration: 0.3 }
        }
        style={{ transformOrigin: "12px 12px" }}
      />
      <motion.path
        d="M12 6v12"
        initial={false}
        animate={
          active && !prefersReduced
            ? { y: [0, -0.8, 0] }
            : { y: 0 }
        }
        transition={
          active && !prefersReduced
            ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />
      <path d="M9 15.18l.88.66c1.17.88 3.07.88 4.24 0 1.17-.88 1.17-2.3 0-3.18C13.54 12.22 12.77 12 12 12c-.73 0-1.45-.22-2-.66-1.1-.88-1.1-2.3 0-3.18s2.9-.88 4 0l.42.33" />
    </svg>
  );
};

const ApproveIcon = ({ active }: { active: boolean }) => {
  const prefersReduced = useReducedMotion();
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
      <path d="M9 11h6M9 14h4" />
      <motion.path
        d="M8.5 17l2.2 2.2 4.3-4.3"
        stroke="#3F4E35"
        strokeWidth={2}
        initial={false}
        animate={
          active && !prefersReduced
            ? { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
            : { pathLength: 0, opacity: 0 }
        }
        transition={
          active && !prefersReduced
            ? { duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.75, 1] }
            : { duration: 0.3 }
        }
      />
    </svg>
  );
};

const FEATURES: Feature[] = [
  {
    icon: (active) => <SignalIcon active={active} />,
    title: "Works without cell service",
    body: "Stroyka stores everything locally on each device and syncs automatically when a connection returns. Workers can log time, submit requests, and check tasks at any job site — basement, rural, or underground.",
  },
  {
    icon: (active) => <CrewIcon active={active} />,
    title: "Built for both sides of the crew",
    body: "Bosses get budget tracking, approval workflows, and real-time cost reports. Workers get a focused view of their tasks, time logging, and request submission. Same app, purpose-built for each role.",
  },
  {
    icon: (active) => <DollarIcon active={active} />,
    title: "Know your numbers before month-end",
    body: "Every purchase, timesheet entry, and fuel trip rolls up automatically into a project P&L. See labor costs, material spend, and budget remaining at a glance — updated the moment a worker submits.",
  },
  {
    icon: (active) => <ApproveIcon active={active} />,
    title: "No more \"did you approve that?\"",
    body: "Workers submit material or supply requests from the field. Bosses review and approve with one tap. Approved items auto-log to project costs. Full audit trail, no text message chains.",
  },
];

interface FlipperCardProps {
  feature: Feature;
  isActive: boolean;
  onActivate: () => void;
}

function FlipperCard({ feature, isActive, onActivate }: FlipperCardProps) {
  return (
    <motion.div
      layout
      onClick={onActivate}
      onMouseEnter={onActivate}
      animate={{
        flexGrow: isActive ? 3 : 1,
      }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 35 },
        flexGrow: { type: "spring", stiffness: 300, damping: 35 },
      }}
      className={[
        "relative cursor-pointer rounded-2xl border overflow-hidden",
        "flex-shrink-0 min-w-0 transition-colors",
        isActive
          ? "card-stone-sage border-brand-sage/45 p-8"
          : "card-stone border-ink/12 p-6",
      ].join(" ")}
      style={{ flexBasis: 0 }}
    >
      <div
        className={[
          "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
          isActive
            ? "bg-brand-deep text-bone shadow-[0_0_20px_-4px_rgba(61,88,67,0.55)]"
            : "bg-bone text-ink-muted border border-ink/15",
        ].join(" ")}
      >
        {feature.icon(isActive)}
      </div>

      <h3
        className={[
          "font-display leading-snug mt-5 min-w-0 transition-colors",
          isActive ? "text-2xl mb-3 text-ink" : "text-[15px] mb-0 text-ink-soft",
        ].join(" ")}
      >
        {feature.title}
      </h3>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.p
            key="body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="text-ink-soft text-[14.5px] leading-relaxed min-w-0"
          >
            {feature.body}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="features" className="bg-gradient-to-b from-[#D4CBB4] to-[#BFB49C] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <FadeIn>
            <SectionLabel>Features</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink"
          >
            Everything your crew needs. Nothing they don&apos;t.
          </TextReveal>
        </div>

        {/* Desktop: horizontal flipper row */}
        <FadeIn delay={0.1}>
          <div className="hidden md:flex gap-4 h-72">
            {FEATURES.map((feature, i) => (
              <FlipperCard
                key={feature.title}
                feature={feature}
                isActive={activeIndex === i}
                onActivate={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </FadeIn>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={0.08 * i}>
              <div className="card-stone border border-ink/15 rounded-2xl p-6">
                <div className="w-11 h-11 bg-ink text-bone rounded-full flex items-center justify-center mb-5">
                  {feature.icon(true)}
                </div>
                <h3 className="font-display text-2xl leading-snug text-ink mb-3">
                  {feature.title}
                </h3>
                <p className="text-ink-soft text-[14.5px] leading-relaxed">
                  {feature.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
