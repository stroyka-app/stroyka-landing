"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Crown, Download } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { PRICES } from "@/data/pricing";

type Billing = "monthly" | "annual";

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

function FeatureList({ features, sub }: { features: Feature[]; sub?: boolean }) {
  return (
    <ul className="flex flex-col gap-3 mb-8">
      {features.map((f, i) => (
        <li
          key={i}
          className={`flex items-start gap-2.5 text-[14px] ${
            f.included ? (sub ? "text-ink/80" : "text-ink/75") : "text-ink/30 line-through"
          }`}
        >
          <span
            className={`mt-0.5 flex-shrink-0 ${
              f.included ? "text-brand-forest" : "text-ink/25"
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
  const t = useTranslations("pricing");
  const [billing, setBilling] = useState<Billing>("monthly");
  const prefersReduced = useReducedMotion();
  const freeGlow = useCursorGlow();
  const starterGlow = useCursorGlow();
  const proGlow = useCursorGlow();
  const { ref: countRef, value: spotsCount } = useCountUp<HTMLSpanElement>({
    to: FOUNDING_SPOTS_TAKEN,
    duration: 1600,
  });

  const FREE_FEATURES: Feature[] = [
    { label: t("free.features.0"), included: true },
    { label: t("free.features.1"), included: true },
    { label: t("free.features.2"), included: true },
    { label: t("free.features.3"), included: true },
    { label: t("free.features.4"), included: true },
    { label: t("free.features.5"), included: true },
    { label: t("free.features.6"), included: false },
    { label: t("free.features.7"), included: false },
    { label: t("free.features.8"), included: false },
  ];

  const STARTER_FEATURES: Feature[] = [
    { label: t("starter.features.0"), included: true },
    { label: t("starter.features.1"), included: true },
    { label: t("starter.features.2"), included: true },
    { label: t("starter.features.3"), included: true },
    { label: t("starter.features.4"), included: true },
    { label: t("starter.features.5"), included: true },
    { label: t("starter.features.6"), included: true },
    { label: t("starter.features.7"), included: true },
    { label: t("starter.features.8"), included: false },
    { label: t("starter.features.9"), included: false },
  ];

  const PRO_FEATURES: Feature[] = [
    { label: t("pro.features.0"), included: true },
    { label: t("pro.features.1"), included: true },
    { label: t("pro.features.2"), included: true },
    { label: t("pro.features.3"), included: true },
    { label: t("pro.features.4"), included: true },
    { label: t("pro.features.5"), included: true },
    { label: t("pro.features.6"), included: true },
    { label: t("pro.features.7"), included: true },
  ];

  return (
    <section id="pricing" className="relative bg-gradient-to-b from-[#D4CBB4] to-[#BFB49C] py-24 lg:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-0 w-[50vw] h-[50vw] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 90% 30%, rgba(184,212,189,0.25), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-14">
          <FadeIn>
            <SectionLabel>{t("eyebrow")}</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            {t("heading")}
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink/70 leading-relaxed max-w-xl">
              {t("subhead")}
            </p>
          </FadeIn>
        </div>

        {/* Billing toggle — LayoutGroup gives us a single sage "pill" that
            slides between Monthly/Annual instead of two separate filled
            buttons. The pill IS shared layout — Apple-style. */}
        <FadeIn delay={0.15}>
          <div className="flex items-center mb-12">
            <LayoutGroup id="pricing-billing-toggle">
              <div className="relative inline-flex items-center bg-bone-soft/60 border border-ink/20 backdrop-blur-md rounded-full p-1">
                {(["monthly", "annual"] as const).map((mode) => {
                  const active = billing === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setBilling(mode)}
                      className={`relative z-[1] font-mono text-[12px] tracking-[0.15em] uppercase px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 ${
                        active ? "text-bone" : "text-ink/60 hover:text-ink"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="pricing-billing-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-brand-forest shadow-[0_0_20px_-4px_rgba(63,78,53,0.5)] -z-[1]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative">
                        {mode === "monthly" ? t("monthly") : t("annual")}
                      </span>
                      {mode === "annual" && (
                        <span
                          className="relative text-[10px] font-bold px-2 py-0.5 rounded-full leading-none transition-colors bg-brand-sage-bright text-ink shadow-[0_2px_10px_-2px_rgba(184,212,189,0.55)]"
                        >
                          {t("annualSave")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>
        </FadeIn>

        {/* Three-card grid */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mb-16 items-stretch">
          {/* Free */}
          <FadeIn>
            <div
              {...freeGlow}
              className="card-stone cursor-glow border border-ink/18 backdrop-blur-sm rounded-2xl p-8 h-full flex flex-col relative hover:border-ink/35 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Download size={16} className="text-ink-muted" />
                <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-ink-muted">{t("free.name")}</h3>
              </div>
              <p className="text-ink/70 text-[14px] mb-6 mt-2">{t("free.description")}</p>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-light text-ink tabular-nums">$0</span>
                  <span className="text-ink/55 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">{t("free.priceForever")}</span>
                </div>
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink/50 mt-1.5">
                  {t("free.limit")}
                </p>
              </div>
              <FeatureList features={FREE_FEATURES} />
              <div className="mt-auto">
                <Button variant="secondary" href="/#download" className="w-full">
                  {t("free.cta")}
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
              className="card-stone-sage cursor-glow glow-border backdrop-blur-md border border-brand-sage/45 rounded-2xl p-8 h-full flex flex-col relative shadow-[0_0_60px_-20px_rgba(138,170,145,0.4)]"
            >
              {!prefersReduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <span className="glow-sweep" />
                </span>
              )}
              <span className="absolute -top-3 left-8 z-[3] bg-brand-forest text-bone font-mono text-[11px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full">
                {t("mostPopular")}
              </span>
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={16} className="text-brand-forest" />
                  <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-brand-forest">{t("starter.name")}</h3>
                </div>
                <p className="text-ink/70 text-[14px] mb-6 mt-2">{t("starter.description")}</p>
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
                        <span className="text-ink/55 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">{t("perMonth")}</span>
                      </div>
                      {billing === "annual" && (
                        <p className="mt-2 font-mono text-[12px] tracking-[0.08em] uppercase text-ink/65 tabular-nums">
                          {t("billedAnnually", { total: `$${PRICES.starter.annual.toLocaleString()}` })}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink/50 mt-2">
                    {t("starter.limit")}
                  </p>
                </div>
                <FeatureList features={STARTER_FEATURES} />
                <div className="mt-auto">
                  <Button variant="primary" href={`/get-started?plan=starter&billing=${billing}`} className="w-full">
                    {t("starter.cta")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeIn>

          {/* Pro — dark premium card, distinct from Free and from the
              sage Starter. Uses `card-stone-dark` gradient with cream
              text and a brighter sage glow for high-end feel.
              Breathing scale `[1, 1.005, 1]` over 5s — alive, never aggressive. */}
          <FadeIn delay={0.2}>
            <motion.div
              {...proGlow}
              animate={
                prefersReduced
                  ? undefined
                  : { scale: [1, 1.006, 1] }
              }
              whileHover={prefersReduced ? undefined : { y: -3, scale: 1.012 }}
              transition={
                prefersReduced
                  ? { duration: 0.2 }
                  : {
                      scale: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                      y: { duration: 0.2 },
                    }
              }
              style={
                {
                  "--glow-c1": "#2B3D30",
                  "--glow-c2": "#8AAA91",
                  "--glow-c3": "#B8D4BD",
                  "--glow-duration": "7s",
                } as CSSProperties
              }
              className="card-stone-dark cursor-glow glow-border backdrop-blur-md border border-brand-sage/30 rounded-2xl p-8 h-full flex flex-col relative"
            >
              <div className="relative z-[1] flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={16} className="text-brand-sage-bright" />
                  <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-brand-sage-bright">{t("pro.name")}</h3>
                </div>
                <p className="text-bone/70 text-[14px] mb-6 mt-2">{t("pro.description")}</p>
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
                          ${billing === "monthly" ? PRICES.pro.monthly : PRICES.pro.annualPerMonth}
                        </span>
                        <span className="text-bone/60 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">{t("perMonth")}</span>
                      </div>
                      {billing === "annual" && (
                        <p className="mt-2 font-mono text-[12px] tracking-[0.08em] uppercase text-bone/70 tabular-nums">
                          {t("billedAnnually", { total: `$${PRICES.pro.annual.toLocaleString()}` })}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-sage-bright/85 mt-2">
                    {t("pro.limit")}
                  </p>
                </div>
                <ul className="flex flex-col gap-3 mb-8">
                  {PRO_FEATURES.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2.5 text-[14px] ${
                        f.included ? "text-bone/85" : "text-bone/30 line-through"
                      }`}
                    >
                      <span className={`mt-0.5 flex-shrink-0 ${f.included ? "text-brand-sage-bright" : "text-bone/25"}`}>
                        {f.included ? <Check size={14} strokeWidth={2.5} /> : <X size={14} strokeWidth={2} />}
                      </span>
                      {f.label}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Button variant="invert" href={`/get-started?plan=pro&billing=${billing}`} className="w-full">
                    {t("pro.cta")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Founding Member band */}
        <FadeIn delay={0.3}>
          <div className="relative overflow-hidden rounded-3xl mb-10 max-w-5xl border border-brand-sage/25 bg-[linear-gradient(135deg,#2B3D30_0%,#34453A_50%,#2B3D30_100%)] p-10 md:p-14">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[30%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[80px] bg-brand-sage-bright/18"
            />
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div className="relative">
              <p className="font-mono text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-sage-bright mb-5 flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-sage-bright" />
                {t("founding.title")}
              </p>
              <h3 className="font-display text-3xl md:text-5xl leading-[1.02] text-bone mb-5">
                {t("founding.pricePart1")} <span className="italic">{t("founding.pricePart2")}</span>
              </h3>
              <p className="text-[15px] text-bone/75 mb-7 leading-relaxed max-w-lg">
                {t("founding.body")}
              </p>
              <Button variant="invert" href="/get-started?plan=starter&coupon=FOUNDING99" className="text-center">
                {t("founding.cta")}
              </Button>
            </div>

            <div className="relative z-[1] rounded-2xl p-6 bg-bone/5 border border-bone/15 backdrop-blur-sm">
              <div className="flex justify-between items-baseline mb-3 font-mono">
                <span className="text-[11px] tracking-[0.18em] uppercase text-bone/65">
                  {t("spotsClaimed")}
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
                  className="h-full rounded bg-gradient-to-r from-brand-sage to-brand-sage-bright"
                />
              </div>
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-bone/55">
                {t("spotsCounter", { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
                {FOUNDING_SPOTS_REMAINING > 0 && ` · ${t("spotsRemaining", { count: FOUNDING_SPOTS_REMAINING })}`}
              </p>
            </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-ink/55 max-w-xl">
            {t("notSure")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
