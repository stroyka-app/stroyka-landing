"use client";

import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Crown, Download } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";
import { useCountUp } from "@/lib/hooks/useCountUp";

type Billing = "monthly" | "annual";

const PRICES = {
  starter: { monthly: 149, annual: 1488, annualPerMonth: 124 },
  pro: { monthly: 249, annual: 2484, annualPerMonth: 207 },
} as const;

const FOUNDING_SPOTS_TOTAL = 20;
const FOUNDING_SPOTS_TAKEN = Number(
  process.env.NEXT_PUBLIC_FOUNDING_SPOTS_TAKEN ?? 6,
);
const FOUNDING_SPOTS_REMAINING = Math.max(
  0,
  FOUNDING_SPOTS_TOTAL - FOUNDING_SPOTS_TAKEN,
);

interface Feature {
  label: string;
  included: boolean;
}

const FREE_FEATURES: Feature[] = [
  { label: "Up to 5 workers", included: true },
  { label: "Time tracking & daily logs", included: true },
  { label: "Material & fuel requests", included: true },
  { label: "Task management & messaging", included: true },
  { label: "Worker earnings tracker", included: true },
  { label: "Offline-first sync", included: true },
  { label: "PDF & CSV reports (Starter+)", included: false },
  { label: "Job costing & P&L (Starter+)", included: false },
  { label: "Overtime alerts (Starter+)", included: false },
];

const STARTER_FEATURES: Feature[] = [
  { label: "Everything in Free", included: true },
  { label: "Up to 15 workers", included: true },
  { label: "Per-worker hourly rates", included: true },
  { label: "Overtime alerts (32h & 40h warnings)", included: true },
  { label: "PDF reports — Timesheet, P&L, Materials", included: true },
  { label: "Job costing & P&L dashboard", included: true },
  { label: "CSV export", included: true },
  { label: "Email support", included: true },
  { label: "Client invoice generator (Pro)", included: false },
  { label: "File & photo attachments (Pro)", included: false },
];

const PRO_FEATURES: Feature[] = [
  { label: "Everything in Starter", included: true },
  { label: "Unlimited workers", included: true },
  { label: "Client invoice generator", included: true },
  { label: "File & photo attachments in tasks", included: true },
  { label: "Excel export", included: true },
  { label: "Advanced analytics", included: true },
  { label: "Priority support", included: true },
  { label: "Dedicated onboarding call", included: true },
];

function FeatureList({ features, sub }: { features: Feature[]; sub?: boolean }) {
  return (
    <ul className="flex flex-col gap-3 mb-8">
      {features.map((f) => (
        <li
          key={f.label}
          className={`flex items-start gap-2.5 text-[14px] ${
            f.included ? (sub ? "text-ink/80" : "text-ink/75") : "text-ink/30 line-through"
          }`}
        >
          <span
            className={`mt-0.5 flex-shrink-0 ${
              f.included ? "text-clay" : "text-ink/25"
            }`}
          >
            {f.included ? <Check size={14} strokeWidth={2.5} /> : <X size={14} strokeWidth={2} />}
          </span>
          {f.label}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const prefersReduced = useReducedMotion();
  const freeGlow = useCursorGlow();
  const starterGlow = useCursorGlow();
  const proGlow = useCursorGlow();
  const { ref: countRef, value: spotsCount } = useCountUp<HTMLSpanElement>({
    to: FOUNDING_SPOTS_TAKEN,
    duration: 1600,
  });

  return (
    <section id="pricing" className="relative bg-gradient-to-b from-[#D4CBB4] to-[#BFB49C] py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-0 w-[50vw] h-[50vw] opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 90% 30%, rgba(205, 160, 122, 0.18), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <FadeIn>
            <SectionLabel>Pricing</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            Flat monthly. No per-seat games.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink/70 leading-relaxed max-w-xl">
              Per-seat = per-worker. We don&rsquo;t do that. Free forever for crews up to&nbsp;5.
            </p>
          </FadeIn>
        </div>

        {/* Billing toggle */}
        <FadeIn delay={0.15}>
          <div className="flex items-center mb-12">
            <div className="inline-flex items-center bg-bone-soft/60 border border-ink/20 backdrop-blur-md rounded-full p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-2 rounded-full transition-all duration-200 ${
                  billing === "monthly"
                    ? "bg-brand-forest text-bone shadow-[0_0_20px_-4px_rgba(63,78,53,0.5)]"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                className={`font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  billing === "annual"
                    ? "bg-brand-forest text-bone shadow-[0_0_20px_-4px_rgba(63,78,53,0.5)]"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Annual
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${
                  billing === "annual" ? "bg-ink/20 text-ink" : "bg-clay/15 text-clay"
                }`}>
                  −17%
                </span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Three-card grid */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mb-16 items-stretch">
          {/* Free */}
          <FadeIn>
            <div
              {...freeGlow}
              className="card-stone cursor-glow border border-ink/18 backdrop-blur-sm rounded-sm p-8 h-full flex flex-col relative hover:border-ink/35 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Download size={16} className="text-ink-muted" />
                <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-ink-muted">Free</h3>
              </div>
              <p className="text-ink/70 text-[14px] mb-6 mt-2">For crews just getting started</p>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-light text-ink tabular-nums">$0</span>
                  <span className="text-ink/55 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">forever</span>
                </div>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink/50 mt-1.5">
                  Up to 5 workers
                </p>
              </div>
              <FeatureList features={FREE_FEATURES} />
              <div className="mt-auto">
                <Button variant="secondary" href="/#download" className="w-full">
                  Start free
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Starter (sage-bright highlight) */}
          <FadeIn delay={0.1}>
            <motion.div
              {...starterGlow}
              whileHover={prefersReduced ? undefined : { y: -3 }}
              transition={{ duration: 0.2 }}
              className="card-stone-warm cursor-glow glow-border backdrop-blur-md border border-clay/40 rounded-sm p-8 h-full flex flex-col relative shadow-[0_0_60px_-20px_rgba(184,120,78,0.35)]"
            >
              {!prefersReduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-sm overflow-hidden"
                >
                  <span className="glow-sweep" />
                </span>
              )}
              <span className="absolute -top-3 left-8 z-[3] bg-brand-forest text-bone font-mono text-[11px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full">
                Most popular
              </span>
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-clay" />
                  <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-clay">Starter</h3>
                </div>
                <p className="text-ink/70 text-[14px] mb-6 mt-2">For growing crews up to 15</p>
                <div className="mb-8 min-h-[112px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={billing}
                      initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReduced ? {} : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-5xl font-light text-ink tabular-nums">
                          ${billing === "monthly" ? PRICES.starter.monthly : PRICES.starter.annualPerMonth}
                        </span>
                        <span className="text-ink/55 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">/ month</span>
                      </div>
                      {billing === "annual" && (
                        <p className="mt-2 font-mono text-[12px] tracking-[0.08em] uppercase text-ink/65 tabular-nums">
                          ${PRICES.starter.annual.toLocaleString()} billed annually
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink/50 mt-2">
                    Up to 15 workers
                  </p>
                </div>
                <FeatureList features={STARTER_FEATURES} />
                <div className="mt-auto">
                  <Button variant="primary" href={`/get-started?plan=starter&billing=${billing}`} className="w-full">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          {/* Pro — oak accent */}
          <FadeIn delay={0.2}>
            <motion.div
              {...proGlow}
              whileHover={prefersReduced ? undefined : { y: -3 }}
              transition={{ duration: 0.2 }}
              style={
                {
                  "--glow-c1": "#D4A574",
                  "--glow-c2": "#E8C89D",
                  "--glow-c3": "#F1D9B4",
                  "--glow-duration": "7s",
                } as CSSProperties
              }
              className="card-stone cursor-glow glow-border backdrop-blur-md border border-clay/30 rounded-sm p-8 h-full flex flex-col relative shadow-[0_0_60px_-20px_rgba(205,160,122,0.3)]"
            >
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} className="text-clay" />
                  <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-clay">Pro</h3>
                </div>
                <p className="text-ink/70 text-[14px] mb-6 mt-2">For larger operations, no limits</p>
                <div className="mb-8 min-h-[112px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={billing}
                      initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReduced ? {} : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-5xl font-light text-ink tabular-nums">
                          ${billing === "monthly" ? PRICES.pro.monthly : PRICES.pro.annualPerMonth}
                        </span>
                        <span className="text-ink/55 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">/ month</span>
                      </div>
                      {billing === "annual" && (
                        <p className="mt-2 font-mono text-[12px] tracking-[0.08em] uppercase text-ink/65 tabular-nums">
                          ${PRICES.pro.annual.toLocaleString()} billed annually
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-clay/85 mt-2">
                    Unlimited workers
                  </p>
                </div>
                <FeatureList features={PRO_FEATURES} />
                <div className="mt-auto">
                  <Button variant="secondary" href={`/get-started?plan=pro&billing=${billing}`} className="w-full">
                    Get Pro
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Founding Member band */}
        <FadeIn delay={0.3}>
          <div className="relative overflow-hidden rounded-sm mb-10 max-w-5xl border border-clay/30 bg-[linear-gradient(135deg,#242E22_0%,#2F2E22_50%,#242E22_100%)] p-10 md:p-14 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[80px] bg-clay/20"
            />
            <div className="relative">
              <p className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase text-clay mb-5 flex items-center gap-2">
                <ShieldCheck size={14} className="text-clay" />
                Founding Member — limited
              </p>
              <h3 className="font-display text-3xl md:text-5xl leading-[1.02] text-bone mb-5">
                $99 a month. <span className="italic">Locked forever.</span>
              </h3>
              <p className="text-[15px] text-bone/75 mb-7 leading-relaxed max-w-lg">
                The first 20 companies to subscribe lock in $99/month for life — Starter at 34% off, forever. No matter what the public rate becomes.
              </p>
              <Button variant="invert" href="/get-started?plan=starter&coupon=FOUNDING99">
                Claim a Founding Spot →
              </Button>
            </div>

            <div className="relative z-[1] rounded-sm p-6 bg-bone/5 border border-bone/15 backdrop-blur-sm">
              <div className="flex justify-between items-baseline mb-3 font-mono">
                <span className="text-[11px] tracking-[0.18em] uppercase text-bone/65">
                  Spots claimed
                </span>
                <span className="font-display text-3xl text-bone tabular-nums">
                  <span ref={countRef}>{spotsCount}</span>
                  <span className="text-[15px] text-bone/55 font-mono">
                    {" "}/{" "}{FOUNDING_SPOTS_TOTAL}
                  </span>
                </span>
              </div>
              <div className="h-[3px] rounded bg-bone/12 overflow-hidden mb-4 relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${(FOUNDING_SPOTS_TAKEN / FOUNDING_SPOTS_TOTAL) * 100}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded bg-gradient-to-r from-clay to-clay-soft"
                />
              </div>
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-bone/55">
                {FOUNDING_SPOTS_TAKEN} of {FOUNDING_SPOTS_TOTAL}
                {FOUNDING_SPOTS_REMAINING > 0 && ` · ${FOUNDING_SPOTS_REMAINING} remaining`}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-ink/55 max-w-xl">
            Not sure which plan fits? Book a 20-minute demo and we&rsquo;ll recommend the right one for your crew size.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
