"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Crown, Download } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

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

interface PaidPriceProps {
  plan: "starter" | "pro";
  billing: Billing;
  accentText?: string;
}

function PaidPrice({ plan, billing, accentText = "text-ink" }: PaidPriceProps) {
  const monthly = PRICES[plan].monthly;
  const annualPerMonth = PRICES[plan].annualPerMonth;
  const annualTotal = PRICES[plan].annual;
  const fullAnnual = monthly * 12;
  const saved = fullAnnual - annualTotal;

  if (billing === "monthly") {
    return (
      <div className="flex items-baseline gap-1">
        <span className={`font-display text-5xl font-light ${accentText} tabular-nums`}>${monthly}</span>
        <span className="text-ink-muted ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">/ month</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className={`font-display text-5xl font-light ${accentText} tabular-nums`}>${annualPerMonth}</span>
        <span className="text-ink-muted ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">/ month</span>
      </div>
      <p className="mt-2 font-mono text-[12px] tracking-[0.08em] uppercase text-ink-soft tabular-nums">
        ${annualTotal.toLocaleString()} billed annually
      </p>
      <div className="flex items-center gap-2 mt-1.5 font-mono text-[11px] tracking-[0.08em] uppercase tabular-nums">
        <span className="text-ink-muted/60 line-through">
          ${fullAnnual.toLocaleString()}
        </span>
        <span className="text-brand-forest font-semibold">
          Save ${saved}
        </span>
      </div>
    </div>
  );
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="flex flex-col gap-3 mb-8">
      {features.map((f) => (
        <li
          key={f.label}
          className={`flex items-start gap-2.5 text-[14px] ${
            f.included ? "text-ink-soft" : "text-ink-muted/50 line-through"
          }`}
        >
          <span
            className={`mt-0.5 flex-shrink-0 ${
              f.included ? "text-ink" : "text-ink-muted/30"
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

  return (
    <section id="pricing" className="bg-bone py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
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
            <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
              Per-seat = per-worker. We don&rsquo;t do that. Free forever for crews up to&nbsp;5.
            </p>
          </FadeIn>
        </div>

        {/* Billing toggle */}
        <FadeIn delay={0.15}>
          <div className="flex items-center mb-12">
            <div className="inline-flex items-center bg-bone-soft border border-ink/15 rounded-full p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-2 rounded-full transition-all duration-200 ${
                  billing === "monthly"
                    ? "bg-ink text-bone"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                className={`font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  billing === "annual"
                    ? "bg-ink text-bone"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                Annual
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${
                  billing === "annual" ? "bg-brand-sage/40 text-bone" : "bg-brand-sage/20 text-brand-forest"
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
            <div className="bg-bone-soft border border-ink/15 rounded-sm p-8 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Download size={16} className="text-ink-muted" />
                <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-ink-muted">Free</h3>
              </div>
              <p className="text-ink-soft text-[14px] mb-6 mt-2">For crews just getting started</p>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-light text-ink tabular-nums">$0</span>
                  <span className="text-ink-muted ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">forever</span>
                </div>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-muted mt-1.5">
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

          {/* Starter (default highlight) */}
          <FadeIn delay={0.1}>
            <motion.div
              whileHover={prefersReduced ? undefined : { y: -2 }}
              transition={{ duration: 0.2 }}
              className="relative bg-ink text-bone border border-ink rounded-sm p-8 h-full flex flex-col"
            >
              <span className="absolute -top-3 left-8 bg-brand-sage text-ink font-mono text-[11px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full">
                Most popular
              </span>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-brand-sage" />
                <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-brand-sage">Starter</h3>
              </div>
              <p className="text-brand-sage-mist/75 text-[14px] mb-6 mt-2">For growing crews up to 15</p>
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
                      <span className="font-display text-5xl font-light text-bone tabular-nums">
                        ${billing === "monthly" ? PRICES.starter.monthly : PRICES.starter.annualPerMonth}
                      </span>
                      <span className="text-brand-sage-mist/65 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">/ month</span>
                    </div>
                    {billing === "annual" && (
                      <p className="mt-2 font-mono text-[12px] tracking-[0.08em] uppercase text-brand-sage-mist/70 tabular-nums">
                        ${PRICES.starter.annual.toLocaleString()} billed annually
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-sage-mist/55 mt-2">
                  Up to 15 workers
                </p>
              </div>
              <ul className="flex flex-col gap-3 mb-8">
                {STARTER_FEATURES.map((f) => (
                  <li
                    key={f.label}
                    className={`flex items-start gap-2.5 text-[14px] ${
                      f.included ? "text-brand-sage-mist/80" : "text-brand-sage-mist/30 line-through"
                    }`}
                  >
                    <span className={`mt-0.5 flex-shrink-0 ${f.included ? "text-brand-sage" : "text-brand-sage-mist/30"}`}>
                      {f.included ? <Check size={14} strokeWidth={2.5} /> : <X size={14} strokeWidth={2} />}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button variant="invert" href={`/get-started?plan=starter&billing=${billing}`} className="w-full">
                  Get Started
                </Button>
              </div>
            </motion.div>
          </FadeIn>

          {/* Pro — clay accent */}
          <FadeIn delay={0.2}>
            <motion.div
              whileHover={prefersReduced ? undefined : { y: -2 }}
              transition={{ duration: 0.2 }}
              className="relative bg-bone-soft border border-clay/40 rounded-sm p-8 h-full flex flex-col"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-0.5 bg-clay"
              />
              <div className="flex items-center gap-2 mb-1">
                <Crown size={16} className="text-clay" />
                <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-clay">Pro</h3>
              </div>
              <p className="text-ink-soft text-[14px] mb-6 mt-2">For larger operations, no limits</p>
              <div className="mb-8 min-h-[112px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={billing}
                    initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? {} : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PaidPrice plan="pro" billing={billing} />
                  </motion.div>
                </AnimatePresence>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-clay/80 mt-2">
                  Unlimited workers
                </p>
              </div>
              <FeatureList features={PRO_FEATURES} />
              <div className="mt-auto">
                <Button variant="secondary" href={`/get-started?plan=pro&billing=${billing}`} className="w-full">
                  Get Pro
                </Button>
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Founding Member band */}
        <FadeIn delay={0.3}>
          <div className="relative overflow-hidden rounded-sm mb-10 max-w-5xl border border-ink/20 bg-ink text-bone p-10 md:p-14 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30%] -right-[10%] w-[400px] h-[400px] rounded-full blur-[60px] bg-clay/25"
            />
            <div className="relative">
              <p className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase text-clay mb-5 flex items-center gap-2">
                <ShieldCheck size={14} className="text-clay" />
                Founding Member — limited
              </p>
              <h3 className="font-display text-3xl md:text-5xl leading-[1.02] text-bone mb-5">
                $99 a month. <span className="italic">Locked forever.</span>
              </h3>
              <p className="text-[15px] text-brand-sage-mist/75 mb-7 leading-relaxed max-w-lg">
                The first 20 companies to subscribe lock in $99/month for life — Starter at 34% off, forever. No matter what the public rate becomes.
              </p>
              <Button variant="invert" href="/get-started?plan=starter&coupon=FOUNDING99">
                Claim a Founding Spot →
              </Button>
            </div>

            <div className="relative z-[1] rounded-sm p-6 bg-bone/5 border border-bone/15">
              <div className="flex justify-between items-baseline mb-3 font-mono">
                <span className="text-[11px] tracking-[0.18em] uppercase text-brand-sage-mist/65">
                  Spots claimed
                </span>
                <span className="font-display text-3xl text-bone tabular-nums">
                  {FOUNDING_SPOTS_TAKEN}
                  <span className="text-[15px] text-brand-sage-mist/60 font-mono">
                    {" "}/{" "}{FOUNDING_SPOTS_TOTAL}
                  </span>
                </span>
              </div>
              <div className="h-[3px] rounded bg-bone/10 overflow-hidden mb-4">
                <div
                  className="h-full rounded bg-clay"
                  style={{
                    width: `${(FOUNDING_SPOTS_TAKEN / FOUNDING_SPOTS_TOTAL) * 100}%`,
                  }}
                />
              </div>
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-sage-mist/55">
                {FOUNDING_SPOTS_TAKEN} of {FOUNDING_SPOTS_TOTAL}
                {FOUNDING_SPOTS_REMAINING > 0 && ` · ${FOUNDING_SPOTS_REMAINING} remaining`}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-ink-muted max-w-xl">
            Not sure which plan fits? Book a 20-minute demo and we&rsquo;ll recommend the right one for your crew size.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
