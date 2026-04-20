"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, DollarSign, CheckCheck, LineChart } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const SYMPTOMS = [
  "WhatsApp timesheets",
  "Paper daily logs",
  "Guessing at costs",
  "Lost receipts",
  '"Who approved that?"',
  "Excel from 2019",
  "Unbilled hours",
  "Missed material runs",
];

interface Solution {
  icon: typeof Clock;
  title: string;
  caption: string;
}

const SOLUTIONS: Solution[] = [
  {
    icon: Clock,
    title: "Timesheets sign themselves",
    caption: "Crew taps to clock, boss approves in a swipe",
  },
  {
    icon: DollarSign,
    title: "Budget updates in real time",
    caption: "Every hour, every bag of QUIKRETE, on the bar",
  },
  {
    icon: CheckCheck,
    title: "Requests approved in two taps",
    caption: "Photo, qty, approve — attached to the job",
  },
  {
    icon: LineChart,
    title: "Monthly reports, one click",
    caption: "Labor, materials, fuel — exportable for your bookkeeper",
  },
];

function SymptomChip({ label, index }: { label: string; index: number }) {
  const prefersReduced = useReducedMotion();
  // Alternating ±1°..±2° tilt, staggered animation delay so they don't
  // wobble in lockstep.
  const rot = (index % 2 === 0 ? -1 : 1) * ((index % 3) + 1);
  const style: CSSProperties = {
    ["--rot" as string]: `${rot}deg`,
    animationDelay: `${(index * 0.4).toFixed(1)}s`,
    transform: prefersReduced ? `rotate(${rot}deg)` : undefined,
  };

  return (
    <span
      style={style}
      className={`inline-block px-3.5 py-2 rounded-lg font-heading text-[13px] font-medium text-red-200/85 bg-red-950/40 border border-red-400/20 ${
        prefersReduced ? "" : "animate-wobble"
      }`}
    >
      {label}
    </span>
  );
}

export default function TheShift() {
  return (
    <section id="the-shift" className="relative py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header — aligned left, matching the rest of the site's rhythm */}
        <div className="max-w-2xl mb-14 lg:mb-16">
          <FadeIn>
            <SectionLabel>The shift</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            Tuesday morning looks different.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75">
              Before and after Stroyka, at the same crew of twelve.
            </p>
          </FadeIn>
        </div>

        {/* Two cards, one narrative */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ── Before ─────────────────────────────────────────────── */}
          <FadeIn>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden h-full rounded-2xl p-8 lg:p-10 border border-red-400/15 bg-gradient-to-br from-red-950/25 via-brand-deep/70 to-brand-midnight/80 backdrop-blur-sm"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-red-500/20 blur-[80px]"
              />
              <span className="inline-flex items-center gap-2 mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Before
              </span>
              <h3 className="text-2xl lg:text-[28px] font-heading font-bold text-white mb-4 leading-snug">
                Duct-taped out of four apps.
              </h3>
              <p className="text-brand-sage-mist/75 text-[15px] leading-relaxed mb-7 max-w-md">
                Hours in WhatsApp. Receipts in the truck. Budgets in a
                spreadsheet no one&rsquo;s opened since bid day. One rainy
                Tuesday and the week slips.
              </p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s, i) => (
                  <SymptomChip key={s} label={s} index={i} />
                ))}
              </div>
            </motion.div>
          </FadeIn>

          {/* ── After ──────────────────────────────────────────────── */}
          <FadeIn delay={0.1}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden h-full rounded-2xl p-8 lg:p-10 border border-brand-forest/25 bg-gradient-to-br from-brand-forest/20 via-brand-deep/70 to-brand-midnight/80 backdrop-blur-sm"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-brand-sage/25 blur-[80px]"
              />
              <span className="inline-flex items-center gap-2 mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-sage">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
                After
              </span>
              <h3 className="text-2xl lg:text-[28px] font-heading font-bold text-white mb-4 leading-snug">
                One app. Every number aligned.
              </h3>
              <p className="text-brand-sage-mist/75 text-[15px] leading-relaxed mb-7 max-w-md">
                Crew clocks in. Budget moves. Materials approve. You open the
                phone at 6am and know exactly where Johnson Home stands.
              </p>

              <div className="flex flex-col gap-2.5">
                {SOLUTIONS.map(({ icon: Icon, title, caption }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-brand-midnight/60 border border-brand-forest/15"
                  >
                    <span className="w-9 h-9 rounded-lg bg-brand-forest/20 text-brand-sage flex items-center justify-center flex-shrink-0">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-[14.5px] font-medium text-white leading-tight">
                        {title}
                      </p>
                      <p className="mt-1 text-[12.5px] text-brand-sage-mist/55 leading-snug">
                        {caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
