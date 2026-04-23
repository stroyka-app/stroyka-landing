"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Feature {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.008v.008H12V18z" />
      </svg>
    ),
    title: "Works without cell service",
    body: "Stroyka stores everything locally on each device and syncs automatically when a connection returns. Workers can log time, submit requests, and check tasks at any job site — basement, rural, or underground.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Built for both sides of the crew",
    body: "Bosses get budget tracking, approval workflows, and real-time cost reports. Workers get a focused view of their tasks, time logging, and request submission. Same app, purpose-built for each role.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Know your numbers before month-end",
    body: "Every purchase, timesheet entry, and fuel trip rolls up automatically into a project P&L. See labor costs, material spend, and budget remaining at a glance — updated the moment a worker submits.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
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
        "relative cursor-pointer rounded-sm border overflow-hidden",
        "flex-shrink-0 min-w-0 transition-colors",
        isActive
          ? "border-ink bg-bone-soft p-8"
          : "border-ink/15 bg-bone/60 p-6",
      ].join(" ")}
      style={{ flexBasis: 0 }}
    >
      <div
        className={[
          "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
          isActive
            ? "bg-ink text-bone"
            : "bg-bone-soft text-ink-muted",
        ].join(" ")}
      >
        {feature.icon}
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
    <section id="features" className="bg-bone-deep py-24 lg:py-32">
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
              <div className="bg-bone-soft border border-ink/15 rounded-sm p-6">
                <div className="w-11 h-11 bg-ink text-bone rounded-full flex items-center justify-center mb-5">
                  {feature.icon}
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
