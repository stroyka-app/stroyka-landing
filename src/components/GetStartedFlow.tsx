"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Crown,
} from "lucide-react";
import Logo from "@/components/Logo";

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
  starter: { monthly: 149, annual: 1490 },
  pro: { monthly: 249, annual: 2490 },
} as const;

const STARTER_FEATURES = [
  "Unlimited projects",
  "Up to 10 workers",
  "Job costing & P&L reports",
  "Time tracking & timesheets",
  "Supply request workflow",
  "Offline-first sync",
  "CSV & PDF export",
  "Email support",
];

const PRO_FEATURES = [
  "Everything in Starter",
  "Up to 25 workers",
  "Advanced reporting",
  "Priority support",
  "Dedicated onboarding call",
];

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

function AnnualPriceDisplay({ plan }: { plan: Plan }) {
  const monthly = PRICES[plan].monthly;
  const annual = PRICES[plan].annual;
  const fullAnnual = monthly * 12;
  const saved = fullAnnual - annual;

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-heading font-bold">${annual}</span>
        <span className="text-brand-sage-mist/60">/ year</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-brand-sage-mist/40 line-through">
          ${fullAnnual}
        </span>
        <span className="text-sm text-green-400 font-heading font-semibold">
          Save ${saved}
        </span>
      </div>
      <p className="text-xs text-brand-sage-mist/50 mt-0.5">
        ${Math.round(annual / 12)}/mo billed annually
      </p>
    </div>
  );
}

/* ─── Component ────────────────────────────────────────────────── */

export default function GetStartedFlow() {
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();

  // URL params (initial values only)
  const urlPlan = searchParams.get("plan") as Plan | null;
  const urlCoupon = searchParams.get("coupon") ?? undefined;

  // State — coupon tracked separately so back button can clear it
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [plan, setPlan] = useState<Plan | null>(
    urlPlan === "starter" || urlPlan === "pro" ? urlPlan : null
  );
  const [billing, setBilling] = useState<Billing>("monthly");
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

  /* ─── Handlers ──────────────────────────────────────────────── */

  const goToStep2 = (selectedPlan: Plan) => {
    setPlan(selectedPlan);
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
    if (!form.name.trim()) errors.name = "Please enter your name.";
    if (!form.email.trim()) {
      errors.email = "We need your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "That doesn't look like a valid email.";
    }
    if (!form.companyName.trim())
      errors.companyName = "Please enter your company name.";
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
        throw new Error(data.error || "Something went wrong");
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
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  /* ─── Shared styles ─────────────────────────────────────────── */

  const inputCls = (field?: keyof FormData) =>
    `w-full bg-brand-deep/50 border ${
      field && fieldErrors[field]
        ? "border-red-500/50"
        : "border-brand-deep"
    } rounded-xl px-4 py-3 text-white placeholder:text-brand-sage-mist/40 focus:outline-none focus:border-brand-forest transition-colors duration-200 font-body text-sm`;

  /* ─── Render ────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Logo variant="dark" size={40} showWordmark />
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-3">
            {step === 1
              ? "Choose your plan"
              : step === 2
                ? "Almost there"
                : "Redirecting..."}
          </h1>
          {step === 1 && (
            <p className="text-base text-brand-sage-mist/75 max-w-lg mx-auto">
              No per-seat fees. Your entire crew is included.
            </p>
          )}
          {step === 2 && (
            <p className="text-base text-brand-sage-mist/75 max-w-lg mx-auto">
              Enter your details and we&apos;ll take you to secure checkout.
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
                      ? "bg-brand-forest text-white"
                      : "bg-brand-deep/50 text-brand-sage-mist/40 border border-brand-deep"
                  }`}
                >
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-0.5 transition-colors duration-200 ${
                      step > s ? "bg-brand-forest" : "bg-brand-deep"
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
              {/* Billing toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex items-center bg-brand-deep/80 border border-brand-deep rounded-full p-1">
                  <button
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

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Starter card */}
                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-brand-deep/50 border rounded-2xl p-8 cursor-pointer transition-colors duration-200 ${
                    plan === "starter"
                      ? "border-brand-forest ring-1 ring-brand-forest/30"
                      : "border-brand-deep hover:border-brand-forest/40"
                  }`}
                  onClick={() => setPlan("starter")}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={18} className="text-brand-forest" />
                    <h3 className="font-heading font-semibold text-xl">Starter</h3>
                  </div>
                  <p className="text-brand-sage-mist/60 text-sm mb-5">
                    For crews up to 10 workers
                  </p>

                  <div className="mb-6">
                    {billing === "monthly" ? (
                      <div>
                        <span className="text-4xl font-heading font-bold">
                          ${PRICES.starter.monthly}
                        </span>
                        <span className="text-brand-sage-mist/60 ml-1">/ month</span>
                      </div>
                    ) : (
                      <AnnualPriceDisplay plan="starter" />
                    )}
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-8">
                    {STARTER_FEATURES.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-brand-sage-mist/70"
                      >
                        <span className="text-brand-forest mt-0.5">
                          <Check size={14} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep2("starter");
                    }}
                    className="w-full relative inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide rounded-xl transition-colors duration-200 cursor-pointer bg-brand-forest text-white hover:bg-brand-deep active:scale-95 shadow-lg shadow-brand-forest/20 text-base px-6 py-3"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                </motion.div>

                {/* Pro card */}
                <motion.div
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-brand-deep border rounded-2xl p-8 relative cursor-pointer transition-colors duration-200 ${
                    plan === "pro"
                      ? "border-brand-forest ring-1 ring-brand-forest/30"
                      : "border-brand-deep hover:border-brand-forest/40"
                  }`}
                  onClick={() => setPlan("pro")}
                >
                  <span className="absolute -top-3 left-8 bg-brand-forest text-white text-xs font-heading font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>

                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={18} className="text-brand-forest" />
                    <h3 className="font-heading font-semibold text-xl">Pro</h3>
                  </div>
                  <p className="text-brand-sage-mist/60 text-sm mb-5">
                    For crews up to 25 workers
                  </p>

                  <div className="mb-6">
                    {billing === "monthly" ? (
                      <div>
                        <span className="text-4xl font-heading font-bold">
                          ${PRICES.pro.monthly}
                        </span>
                        <span className="text-brand-sage-mist/60 ml-1">/ month</span>
                      </div>
                    ) : (
                      <AnnualPriceDisplay plan="pro" />
                    )}
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-8">
                    {PRO_FEATURES.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-brand-sage-mist/70"
                      >
                        <span className="text-brand-forest mt-0.5">
                          <Check size={14} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToStep2("pro");
                    }}
                    className="w-full relative inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide rounded-xl transition-colors duration-200 cursor-pointer bg-brand-forest text-white hover:bg-brand-deep active:scale-95 shadow-lg shadow-brand-forest/20 text-base px-6 py-3"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              </div>

              {/* Founding member banner — always visible on step 1 */}
              <motion.div
                initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl mx-auto mt-8"
              >
                <div className="border border-dashed border-brand-sage/30 bg-brand-deep/30 rounded-2xl p-6 text-center">
                  <p className="text-sm font-heading font-semibold flex items-center justify-center gap-2">
                    <ShieldCheck size={16} className="text-brand-forest" />
                    Founding Member Rate — $99/month, locked forever
                  </p>
                  <p className="text-xs text-brand-sage-mist/60 mt-2 mb-4">
                    The first 20 companies lock in Starter at $99/month for life. $50 off every month, forever.
                  </p>
                  <button
                    onClick={claimFoundingSpot}
                    className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-brand-forest hover:text-brand-sage transition-colors duration-200 cursor-pointer"
                  >
                    Claim a Founding Spot
                    <ArrowRight size={14} />
                  </button>
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
                <div className="bg-brand-deep/50 border border-brand-deep rounded-xl p-5 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-sage-mist/50 uppercase tracking-wider mb-1">Selected plan</p>
                      <p className="font-heading font-semibold text-xl capitalize">
                        {plan}
                      </p>
                    </div>
                    <div className="text-right">
                      {isFoundingMember && billing === "monthly" ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-brand-sage-mist/40 line-through">$149</span>
                          <span className="font-heading font-bold text-2xl">$99</span>
                          <span className="text-brand-sage-mist/50 text-sm">/mo</span>
                        </div>
                      ) : billing === "annual" ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-brand-sage-mist/40 line-through">
                              ${PRICES[plan!].monthly * 12}
                            </span>
                            <span className="font-heading font-bold text-2xl">
                              ${PRICES[plan!].annual}
                            </span>
                            <span className="text-brand-sage-mist/50 text-sm">/yr</span>
                          </div>
                          <p className="text-xs text-brand-sage-mist/40 mt-0.5">
                            ${Math.round(PRICES[plan!].annual / 12)}/mo billed annually
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading font-bold text-2xl">
                            ${PRICES[plan!].monthly}
                          </span>
                          <span className="text-brand-sage-mist/50 text-sm">/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isFoundingMember && (
                    <div className="mt-3 pt-3 border-t border-brand-deep">
                      <span className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-amber-400">
                        <ShieldCheck size={13} />
                        Founding Member — $50 off every month, forever
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label
                      htmlFor="gs-name"
                      className="block text-sm text-brand-sage mb-1.5"
                    >
                      Your name *
                    </label>
                    <input
                      id="gs-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={inputCls("name")}
                      placeholder="John Smith"
                      autoComplete="name"
                    />
                    {fieldErrors.name && (
                      <p className="text-xs text-red-400 mt-1.5">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="gs-email"
                      className="block text-sm text-brand-sage mb-1.5"
                    >
                      Work email *
                    </label>
                    <input
                      id="gs-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputCls("email")}
                      placeholder="john@smithconstruction.com"
                      autoComplete="email"
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-400 mt-1.5">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="gs-companyName"
                      className="block text-sm text-brand-sage mb-1.5"
                    >
                      Company name *
                    </label>
                    <input
                      id="gs-companyName"
                      name="companyName"
                      type="text"
                      value={form.companyName}
                      onChange={handleChange}
                      className={inputCls("companyName")}
                      placeholder="Smith Construction LLC"
                      autoComplete="organization"
                    />
                    {fieldErrors.companyName && (
                      <p className="text-xs text-red-400 mt-1.5">
                        {fieldErrors.companyName}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">
                      {submitError}. Please try again or email us at{" "}
                      <a
                        href="mailto:hello@getstroyka.com"
                        className="underline hover:text-red-200"
                      >
                        hello@getstroyka.com
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide rounded-xl transition-colors duration-200 cursor-pointer border border-brand-forest text-brand-sage hover:bg-brand-forest/10 active:scale-95 text-base px-6 py-3 sm:w-auto"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 relative inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-wide rounded-xl transition-colors duration-200 cursor-pointer bg-brand-forest text-white hover:bg-brand-deep active:scale-95 shadow-lg shadow-brand-forest/20 text-base px-6 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-brand-sage-mist/40 text-center mt-2">
                    Already have an account?{" "}
                    <a
                      href="https://getstroyka.com/account"
                      className="text-brand-forest hover:text-brand-sage transition-colors duration-200 underline"
                    >
                      Sign in at getstroyka.com/account
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
                <p className="font-heading text-lg text-brand-sage-mist/80">
                  Taking you to secure checkout...
                </p>
                <p className="text-sm text-brand-sage-mist/40">
                  Powered by Stripe. Your payment info is never stored on our servers.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
