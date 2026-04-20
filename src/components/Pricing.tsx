"use client";

import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Crown, Download } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

/* ─── Pricing data ─────────────────────────────────────────────── */

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

/* ─── Price display ────────────────────────────────────────────── */

interface PaidPriceProps {
  plan: "starter" | "pro";
  billing: Billing;
}

function PaidPrice({ plan, billing }: PaidPriceProps) {
  const monthly = PRICES[plan].monthly;
  const annualPerMonth = PRICES[plan].annualPerMonth;
  const annualTotal = PRICES[plan].annual;
  const fullAnnual = monthly * 12;
  const saved = fullAnnual - annualTotal;

  if (billing === "monthly") {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-heading font-bold">${monthly}</span>
        <span className="text-brand-sage-mist/60 ml-1">/ month</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-heading font-bold">${annualPerMonth}</span>
        <span className="text-brand-sage-mist/60 ml-1">/ month</span>
      </div>
      <p className="mt-2 text-[15px] font-heading font-semibold text-brand-sage-mist/90">
        ${annualTotal.toLocaleString()}{" "}
        <span className="text-brand-sage-mist/60 font-medium">
          billed annually
        </span>
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-xs text-brand-sage-mist/40 line-through">
          ${fullAnnual.toLocaleString()}
        </span>
        <span className="text-xs font-heading font-semibold text-green-400">
          Save ${saved}
        </span>
      </div>
    </div>
  );
}

/* ─── Feature list ─────────────────────────────────────────────── */

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="flex flex-col gap-2.5 mb-8">
      {features.map((f) => (
        <li
          key={f.label}
          className={`flex items-start gap-2 text-sm ${
            f.included
              ? "text-brand-sage-mist/70"
              : "text-brand-sage-mist/35"
          }`}
        >
          <span
            className={`mt-0.5 ${
              f.included ? "text-brand-forest" : "text-brand-sage-mist/30"
            }`}
          >
            {f.included ? <Check size={14} /> : <X size={14} />}
          </span>
          {f.label}
        </li>
      ))}
    </ul>
  );
}

/* ─── Component ────────────────────────────────────────────────── */

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const prefersReduced = useReducedMotion();

  return (
    <section id="pricing" className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <FadeIn>
            <SectionLabel>Pricing</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            Flat monthly. No per-seat games.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75 max-w-lg mx-auto">
              Per-seat = per-worker. We don&rsquo;t do that. Free forever for
              crews up to 5.
            </p>
          </FadeIn>
        </div>

        {/* Monthly / Annual toggle */}
        <FadeIn delay={0.15}>
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center bg-brand-deep/80 border border-brand-deep rounded-full p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`font-heading text-sm px-5 py-2 rounded-full transition-all duration-200 ${
                  billing === "monthly"
                    ? "bg-brand-forest text-white shadow-lg shadow-brand-forest/20"
                    : "text-brand-sage-mist/60 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                className={`font-heading text-sm px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  billing === "annual"
                    ? "bg-brand-forest text-white shadow-lg shadow-brand-forest/20"
                    : "text-brand-sage-mist/60 hover:text-white"
                }`}
              >
                Annual
                <span className="bg-green-500/20 text-green-400 text-[11px] font-semibold px-2 py-0.5 rounded-full leading-none">
                  -17%
                </span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Three-card grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 items-stretch">
          {/* ── Free ─────────────────────────────────────────────── */}
          <FadeIn>
            <div className="bg-brand-deep/30 border border-brand-deep/60 rounded-2xl p-8 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Download size={18} className="text-brand-sage-mist/60" />
                <h3 className="font-heading font-semibold text-xl">Free</h3>
              </div>
              <p className="text-brand-sage-mist/60 text-sm mb-5">
                For crews just getting started
              </p>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-heading font-bold">$0</span>
                  <span className="text-brand-sage-mist/60 ml-1">/ forever</span>
                </div>
                <p className="text-xs text-brand-sage-mist/50 mt-1">
                  Up to 5 workers
                </p>
              </div>
              <FeatureList features={FREE_FEATURES} />
              <div className="mt-auto">
                <Button
                  variant="secondary"
                  href="/#download"
                  className="w-full"
                >
                  Download the App
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* ── Starter (hero card) ──────────────────────────────── */}
          <FadeIn delay={0.1}>
            <motion.div
              whileHover={prefersReduced ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="glow-border bg-brand-deep/90 border border-brand-forest/50 rounded-2xl p-8 relative h-full flex flex-col shadow-xl shadow-brand-forest/20 hover:shadow-brand-forest/40 transition-shadow"
            >
              {!prefersReduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <span className="glow-sweep" />
                </span>
              )}
              <span className="absolute -top-3 left-8 z-[3] bg-brand-forest text-white text-xs font-heading font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-brand-forest" />
                  <h3 className="font-heading font-semibold text-xl">Starter</h3>
                </div>
                <p className="text-brand-sage-mist/60 text-sm mb-5">
                  For growing crews up to 15
                </p>
                <div className="mb-6 min-h-[112px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={billing}
                      initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReduced ? {} : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PaidPrice plan="starter" billing={billing} />
                    </motion.div>
                  </AnimatePresence>
                  <p className="text-xs text-brand-sage-mist/50 mt-2">
                    Up to 15 workers
                  </p>
                </div>
                <FeatureList features={STARTER_FEATURES} />
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    href={`/get-started?plan=starter&billing=${billing}`}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          {/* ── Pro (premium) ────────────────────────────────────── */}
          <FadeIn delay={0.2}>
            <motion.div
              whileHover={prefersReduced ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
              style={
                {
                  "--glow-c1": "#d97706",
                  "--glow-c2": "#f59e0b",
                  "--glow-c3": "#fbbf24",
                  "--glow-duration": "7s",
                } as CSSProperties
              }
              className="glow-border bg-gradient-to-b from-brand-deep to-brand-deep/70 border border-amber-500/30 rounded-2xl p-8 relative h-full flex flex-col shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/25 transition-shadow"
            >
              {!prefersReduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <span
                    className="glow-sweep"
                    style={
                      {
                        "--sweep-c1": "rgba(217, 119, 6, 0.28)",
                        "--sweep-c2": "rgba(245, 158, 11, 0.22)",
                        "--sweep-c3": "rgba(251, 191, 36, 0.18)",
                      } as CSSProperties
                    }
                  />
                </span>
              )}
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={18} className="text-amber-400" />
                  <h3 className="font-heading font-semibold text-xl">Pro</h3>
                </div>
                <p className="text-brand-sage-mist/60 text-sm mb-5">
                  For larger operations, no limits
                </p>
                <div className="mb-6 min-h-[112px]">
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
                  <p className="text-xs text-amber-400/70 mt-2">
                    Unlimited workers
                  </p>
                </div>
                <FeatureList features={PRO_FEATURES} />
                <div className="mt-auto">
                  <Button
                    variant="secondary"
                    href={`/get-started?plan=pro&billing=${billing}`}
                    className="w-full"
                  >
                    Get Pro
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Founding Member */}
        <FadeIn delay={0.3}>
          <div className="relative overflow-hidden rounded-3xl mb-10 border border-brand-amber/20 bg-[linear-gradient(135deg,#1a1108_0%,#2a1a0a_50%,#1a2428_100%)] p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30%] -right-[10%] w-[400px] h-[400px] rounded-full blur-[60px] bg-[radial-gradient(circle,rgba(245,158,11,0.15),transparent_70%)]"
            />

            {/* Left — headline & CTA (original copy preserved) */}
            <div className="relative">
              <p className="font-heading text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#fbbf24] mb-4 flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#fbbf24]" />
                Founding Member — limited
              </p>
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-3 leading-tight">
                Founding Member Rate — $99/month, locked forever
              </h3>
              <p className="text-sm text-brand-sage-mist/75 mb-6 leading-relaxed max-w-lg">
                The first 20 companies to subscribe lock in $99/month for life —
                that&rsquo;s Starter plan at 34% off, forever. No matter what the
                public rate becomes.
              </p>
              <Button
                variant="primary"
                href="/get-started?plan=starter&coupon=FOUNDING99"
              >
                Claim a Founding Spot →
              </Button>
            </div>

            {/* Right — live meter */}
            <div className="relative z-[1] rounded-2xl p-5 bg-black/30 border border-brand-amber/15">
              <div className="flex justify-between items-baseline mb-2.5 font-heading">
                <span className="text-[13px] text-brand-sage-mist/65">
                  Spots claimed
                </span>
                <span className="text-2xl font-bold text-white tabular-nums">
                  {FOUNDING_SPOTS_TAKEN}
                  <span className="text-sm font-medium text-brand-sage-mist/60">
                    {" "}
                    / {FOUNDING_SPOTS_TOTAL}
                  </span>
                </span>
              </div>
              <div className="h-2 rounded bg-brand-sage-mist/10 overflow-hidden mb-4">
                <div
                  className={`h-full rounded bg-gradient-to-r from-brand-amber to-brand-amber-bright ${
                    prefersReduced ? "" : "animate-pulse-amber"
                  }`}
                  style={{
                    width: `${(FOUNDING_SPOTS_TAKEN / FOUNDING_SPOTS_TOTAL) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[12.5px] text-brand-sage-mist/60">
                {FOUNDING_SPOTS_TAKEN} of {FOUNDING_SPOTS_TOTAL} spots taken
                {FOUNDING_SPOTS_REMAINING > 0
                  ? ` · ${FOUNDING_SPOTS_REMAINING} remaining`
                  : ""}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-center text-sm text-brand-sage-mist/50">
            Not sure which plan fits? Book a 20-minute demo and we&rsquo;ll
            recommend the right one for your crew size.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
