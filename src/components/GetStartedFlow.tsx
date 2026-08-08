"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Crown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";

/* ─── Types ────────────────────────────────────────────────────── */

type Plan = "starter" | "pro";
type Billing = "monthly" | "annual";

interface FormData {
  name: string;
  email: string;
  companyName: string;
}

/* ─── Price data ───────────────────────────────────────────────── */

const PRICES = {
  starter: { monthly: 149, annual: 1488 },
  pro: { monthly: 249, annual: 2484 },
} as const;

/* ─── Animations ───────────────────────────────────────────────── */

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

const stepTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

/* ─── Helpers ──────────────────────────────────────────────────── */

function AnnualPriceDisplay({ plan, tone = "light" }: { plan: Plan; tone?: "light" | "dark" }) {
  const t = useTranslations("getStarted");
  const monthly = PRICES[plan].monthly;
  const annual = PRICES[plan].annual;
  const fullAnnual = monthly * 12;
  const saved = fullAnnual - annual;
  const perMonth = Math.round(annual / 12);
  const isDark = tone === "dark";

  const primary = isDark ? "text-bone" : "text-ink";
  const secondary = isDark ? "text-bone/75" : "text-ink";
  const muted = isDark ? "text-bone/55" : "text-ink-muted";
  const strike = isDark ? "text-bone/40" : "text-ink-muted/60";
  const savings = isDark ? "text-brand-sage-bright" : "text-brand-forest";

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className={`font-display text-5xl font-light ${primary} tabular-nums`}>${perMonth}</span>
        <span className={`${muted} ml-2 font-mono text-[12px] tracking-[0.08em] uppercase`}>{t("perMonth")}</span>
      </div>
      <p className={`mt-2 font-mono text-[12px] tracking-[0.08em] uppercase tabular-nums ${secondary}`}>
        ${annual.toLocaleString()} <span className={muted}>{t("billedAnnually")}</span>
      </p>
      <div className="flex items-center gap-2 mt-1.5 font-mono text-[11px] tracking-[0.08em] uppercase tabular-nums">
        <span className={`${strike} line-through`}>${fullAnnual.toLocaleString()}</span>
        <span className={`font-semibold ${savings}`}>{t("saveAmount", { amount: saved })}</span>
      </div>
    </div>
  );
}

/* ─── Component ────────────────────────────────────────────────── */

export default function GetStartedFlow() {
  const t = useTranslations("getStarted");
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();

  // URL params (initial values only)
  const urlPlan = searchParams.get("plan") as Plan | null;
  const urlCoupon = searchParams.get("coupon") ?? undefined;
  const urlBilling = searchParams.get("billing") as Billing | null;

  // State — coupon tracked separately so back button can clear it
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [plan, setPlan] = useState<Plan | null>(
    urlPlan === "starter" || urlPlan === "pro" ? urlPlan : null
  );
  const [billing, setBilling] = useState<Billing>(
    urlBilling === "annual" ? "annual" : "monthly",
  );
  const [coupon, setCoupon] = useState<string | undefined>(urlCoupon);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    companyName: "",
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // If plan pre-selected via URL, auto-advance to step 2
  useEffect(() => {
    if (urlPlan === "starter" || urlPlan === "pro") {
      setPlan(urlPlan);
      setStep(2);
      setDirection(1);
    }
  }, [urlPlan]);

  /* ─── Derived ───────────────────────────────────────────────── */

  const isFoundingMember = coupon === "FOUNDING99" && plan === "starter";

  // Translated feature lists (explicit keys match message file indices)
  const starterFeatures = [
    t("starter.features.0"),
    t("starter.features.1"),
    t("starter.features.2"),
    t("starter.features.3"),
    t("starter.features.4"),
    t("starter.features.5"),
  ];

  const proFeatures = [
    t("pro.features.0"),
    t("pro.features.1"),
    t("pro.features.2"),
    t("pro.features.3"),
    t("pro.features.4"),
    t("pro.features.5"),
    t("pro.features.6"),
  ];

  /* ─── Handlers ──────────────────────────────────────────────── */

  const goToStep2 = (selectedPlan: Plan) => {
    setPlan(selectedPlan);
    // Step 2 always opens clean — never carry a prior triggered validation
    // state across a plan change (e.g. Continue → Back → Claim Founding Spot).
    setFieldErrors({});
    setSubmitError("");
    setDirection(1);
    setStep(2);
  };

  const claimFoundingSpot = () => {
    setCoupon("FOUNDING99");
    setBilling("monthly");
    goToStep2("starter");
  };

  const goBack = () => {
    // Clear coupon when going back (unless it came from external URL)
    if (!urlCoupon) {
      setCoupon(undefined);
    }
    // Reset any triggered validation so returning to plan-select is clean.
    setFieldErrors({});
    setSubmitError("");
    setDirection(-1);
    setStep(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errors.name = t("form.errors.nameRequired");
    if (!form.email.trim()) {
      errors.email = t("form.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = t("form.errors.emailInvalid");
    }
    if (!form.companyName.trim())
      errors.companyName = t("form.errors.companyRequired");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !plan) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing,
          email: form.email,
          name: form.name,
          companyName: form.companyName,
          ...(coupon && { coupon }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        // `message` is the human-readable form (e.g. the already-subscribed
        // 409); `error` is the machine code and reads like a bug when shown
        // raw. Prefer the sentence, fall back to the code, then to generic.
        throw new Error(
          data.message || data.error || t("form.errors.somethingWentWrong")
        );
      }

      const { url } = await res.json();
      if (url) {
        setDirection(1);
        setStep(3);
        window.location.href = url;
      }
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        err instanceof Error ? err.message : t("form.errors.somethingWentWrong")
      );
    }
  };

  /* ─── Shared styles ─────────────────────────────────────────── */

  const inputCls = (field?: keyof FormData) =>
    `w-full bg-bone-soft/80 border ${
      field && fieldErrors[field]
        ? "border-red-500/60"
        : "border-ink/20 hover:border-ink/35"
    } rounded-xl px-4 py-3 text-ink placeholder:text-ink-muted/55 focus:outline-none focus:border-brand-forest focus:bg-bone transition-colors duration-200 font-body text-[15px]`;

  /* ─── Render ────────────────────────────────────────────────── */

  return (
    <div className="relative min-h-screen overflow-hidden bg-bone text-ink pt-28 pb-16">
      <AmbientBackdrop />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-8">
          {/* Field-journal folio — decorative continuity with the homepage device */}
          <div aria-hidden className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-ink/35 mb-4">
            Field journal · Appendix A
          </div>
          <TextReveal as="h1" className="text-4xl lg:text-5xl font-display font-light leading-tight tracking-[-0.02em] text-ink mb-3">
            {step === 1 ? t("chooseYourPlan") : step === 2 ? t("almostThere") : t("redirecting")}
          </TextReveal>
          {step === 1 && (
            <p className="text-base text-ink-soft max-w-lg mx-auto">
              {t("noPerSeatFees")}
            </p>
          )}
          {step === 2 && (
            <p className="text-base text-ink-soft max-w-lg mx-auto">
              {t("enterDetails")}
            </p>
          )}
        </div>

        {/* Step indicators */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-semibold transition-colors duration-200 ${
                    step >= s
                      ? "bg-brand-deep text-bone shadow-[0_0_18px_-4px_rgba(52,69,58,0.5)]"
                      : "bg-bone-soft/80 text-ink-muted border border-ink/20"
                  }`}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-0.5 transition-colors duration-200 ${
                      step > s ? "bg-brand-deep" : "bg-ink/15"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Steps with animated transitions */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ─── Step 1: Plan selection ─────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={prefersReduced ? {} : stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              {/* Billing toggle — LayoutGroup sliding pill, matches the
                  landing-page Pricing toggle exactly. Single shared
                  motion.span pill animates between Monthly/Annual. */}
              <div className="flex items-center justify-center mb-8">
                <LayoutGroup id="getstarted-billing-toggle">
                  <div className="relative inline-flex items-center bg-bone-soft/80 border border-ink/20 backdrop-blur-md rounded-full p-1">
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
                              layoutId="getstarted-billing-pill"
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
                              −17%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
                {/* Starter card — sage-highlighted (matches main Pricing) */}
                <motion.div
                  whileHover={prefersReduced ? {} : { y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="card-stone-sage border border-brand-sage/45 rounded-2xl p-8 relative cursor-pointer flex flex-col shadow-[0_0_60px_-20px_rgba(138,170,145,0.35)]"
                  onClick={() => setPlan("starter")}
                >
                  <span className="absolute -top-3 left-8 bg-brand-deep text-bone font-mono text-[11px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full">
                    {t("mostPopular")}
                  </span>

                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={18} className="text-brand-forest" />
                    <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-brand-forest">{t("starter.name")}</h3>
                  </div>
                  <p className="text-ink-soft text-sm mb-5 mt-1">
                    {t("starter.description")}
                  </p>

                  <div className="mb-6 min-h-[112px]">
                    {billing === "monthly" ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-5xl font-light text-ink tabular-nums">
                            ${PRICES.starter.monthly}
                          </span>
                          <span className="text-ink-muted ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">{t("perMonth")}</span>
                        </div>
                      </div>
                    ) : (
                      <AnnualPriceDisplay plan="starter" />
                    )}
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-muted mt-2">
                      {t("starter.workerLimit")}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-8">
                    {starterFeatures.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-ink-soft"
                      >
                        <span className="text-brand-forest mt-0.5">
                          <Check size={14} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="primary"
                    size="md"
                    className="mt-auto w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep2("starter");
                    }}
                  >
                    {t("continue")}
                    <ArrowRight size={16} />
                  </Button>
                </motion.div>

                {/* Pro card — premium dark (matches main Pricing Pro) */}
                <motion.div
                  whileHover={prefersReduced ? {} : { y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="card-stone-dark border border-brand-sage/30 rounded-2xl p-8 relative cursor-pointer flex flex-col shadow-[0_30px_80px_-30px_rgba(20,30,24,0.5)]"
                  onClick={() => setPlan("pro")}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={18} className="text-brand-sage-bright" />
                    <h3 className="font-mono text-[12px] tracking-[0.2em] uppercase text-brand-sage-bright">{t("pro.name")}</h3>
                  </div>
                  <p className="text-bone/70 text-sm mb-5 mt-1">
                    {t("pro.description")}
                  </p>

                  <div className="mb-6 min-h-[112px]">
                    {billing === "monthly" ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-5xl font-light text-bone tabular-nums">
                            ${PRICES.pro.monthly}
                          </span>
                          <span className="text-bone/60 ml-2 font-mono text-[12px] tracking-[0.08em] uppercase">{t("perMonth")}</span>
                        </div>
                      </div>
                    ) : (
                      <AnnualPriceDisplay plan="pro" tone="dark" />
                    )}
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-brand-sage-bright/85 mt-2">
                      {t("pro.workerLimit")}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-8">
                    {proFeatures.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-bone/85"
                      >
                        <span className="text-brand-sage-bright mt-0.5">
                          <Check size={14} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="invert"
                    size="md"
                    className="mt-auto w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep2("pro");
                    }}
                  >
                    {t("continue")}
                    <ArrowRight size={16} />
                  </Button>
                </motion.div>
              </div>

              {/* Founding member banner */}
              <motion.div
                initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl mx-auto mt-8"
              >
                <div className="card-stone border border-brand-sage/35 rounded-2xl p-6 text-center">
                  <p className="text-sm font-heading font-semibold flex items-center justify-center gap-2 text-ink">
                    <ShieldCheck size={16} className="text-brand-forest" />
                    {t("founding.title")}
                  </p>
                  <p className="text-xs text-ink-soft mt-2 mb-4">
                    {t("founding.body")}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={claimFoundingSpot}
                    className="text-brand-forest hover:text-brand-deep"
                  >
                    {t("founding.cta")}
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ─── Step 2: Account details ────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={prefersReduced ? {} : stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              <div className="max-w-lg mx-auto">
                {/* Selected plan summary */}
                <div className="card-stone border border-ink/15 rounded-2xl p-5 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[11px] text-ink-muted uppercase tracking-[0.2em] mb-2">{t("selectedPlan")}</p>
                      <p className="font-heading font-semibold text-xl capitalize flex items-center gap-2 text-ink">
                        {plan === "pro" ? (
                          <Crown size={18} className="text-brand-deep" />
                        ) : (
                          <Zap size={18} className="text-brand-forest" />
                        )}
                        {plan === "starter" ? t("starter.name") : plan === "pro" ? t("pro.name") : plan}
                      </p>
                    </div>
                    <div className="text-right">
                      {isFoundingMember && billing === "monthly" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-ink-muted/75 line-through">$149</span>
                          <span className="font-display text-3xl font-light text-ink tabular-nums">$99</span>
                          <span className="text-ink-muted text-sm">{t("perMonthShort")}</span>
                        </div>
                      ) : billing === "annual" ? (
                        <div>
                          <div className="flex items-baseline gap-2 justify-end">
                            <span className="font-display text-3xl font-light text-ink tabular-nums">
                              ${Math.round(PRICES[plan!].annual / 12)}
                            </span>
                            <span className="text-ink-muted text-sm">{t("perMonthShort")}</span>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5">
                            ${PRICES[plan!].annual.toLocaleString()}{t("perYrBilledAnnually")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-3xl font-light text-ink tabular-nums">
                            ${PRICES[plan!].monthly}
                          </span>
                          <span className="text-ink-muted text-sm">{t("perMonthShort")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isFoundingMember && (
                    <div className="mt-3 pt-3 border-t border-ink/15">
                      <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-brand-forest">
                        <ShieldCheck size={13} />
                        {t("founding.badge")}
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label
                      htmlFor="gs-name"
                      className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2"
                    >
                      {t("form.nameLbl")}
                    </label>
                    <input
                      id="gs-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={inputCls("name")}
                      placeholder={t("form.namePlaceholder")}
                      autoComplete="name"
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-700 mt-1.5">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="gs-email"
                      className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2"
                    >
                      {t("form.emailLbl")}
                    </label>
                    <input
                      id="gs-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputCls("email")}
                      placeholder={t("form.emailPlaceholder")}
                      autoComplete="email"
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-700 mt-1.5">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="gs-companyName"
                      className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2"
                    >
                      {t("form.companyLbl")}
                    </label>
                    <input
                      id="gs-companyName"
                      name="companyName"
                      type="text"
                      value={form.companyName}
                      onChange={handleChange}
                      className={inputCls("companyName")}
                      placeholder={t("form.companyPlaceholder")}
                      autoComplete="organization"
                    />
                    {fieldErrors.companyName && (
                      <p className="text-xs text-red-700 mt-1.5">
                        {fieldErrors.companyName}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div className="rounded-xl border border-red-400/40 bg-red-50 p-4 text-sm text-red-800">
                      {submitError}{t("form.retryHint")}{" "}
                      <a
                        href="mailto:hello@getstroyka.com"
                        className="underline hover:text-red-900"
                      >
                        hello@getstroyka.com
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={goBack}
                      className="sm:w-auto"
                    >
                      <ArrowLeft size={16} />
                      {t("back")}
                    </Button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 relative inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide rounded-full transition duration-200 cursor-pointer bg-brand-deep text-bone hover:bg-brand-midnight-dark active:scale-[0.97] text-base px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bone"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {t("processing")}
                        </>
                      ) : (
                        <>
                          {t("continueToPayment")}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-ink-muted/60 text-center mt-2">
                    {t("alreadyHaveAccount")}{" "}
                    <a
                      href="https://app.getstroyka.com"
                      className="text-brand-forest hover:text-brand-sage transition-colors duration-200 underline"
                    >
                      {t("login")}
                    </a>
                  </p>
                </form>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Loading/redirect ───────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={40} className="text-brand-forest" />
                </motion.div>
                <p className="font-heading text-lg text-ink-soft/80">
                  {t("takingYouToCheckout")}
                </p>
                <p className="text-sm text-ink-muted/60">
                  {t("poweredByStripe")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
