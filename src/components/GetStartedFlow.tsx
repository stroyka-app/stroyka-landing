"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Check, ArrowRight, ArrowLeft, Loader2, Lock } from "lucide-react";
import { PRICES } from "@/data/pricing";
import FlapText from "@/components/site/ui/FlapText";
import { useReduced } from "@/components/site/ui/useReduced";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";

/* ─── Types ────────────────────────────────────────────────────── */

type Plan = "starter" | "pro";
type Billing = "monthly" | "annual";

interface FormData {
  name: string;
  email: string;
  companyName: string;
}

/* ─── Price data ───────────────────────────────────────────────── */

// Imported, never re-declared. This file carried its own copy of the price
// table until 2026-08-30, when repricing Starter 149 -> 29 in data/pricing.ts
// would have left the checkout still quoting the old numbers.

/* ─── Animations ───────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

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
  ease: EASE,
};

/* ─── Morning Bone styles (docs/design/morning-bone-system.md) ─── */

const FIELD =
  "h-12 w-full rounded-xl bg-site-night px-4 text-[15px] text-site-paper ring-1 ring-inset placeholder:text-site-paper/35 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-site-vis";
const LABEL = "mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55";
const DISPLAY = "font-flex font-semibold tracking-[-0.03em] [font-variation-settings:'wdth'_110]";

/* ─── Helpers ──────────────────────────────────────────────────── */

/**
 * The price digits roll when billing flips (same move as the home's Plans):
 * the old figure leaves upward, the new one arrives from below.
 */
function RollingPrice({ value, reduced, className = "" }: { value: number; reduced: boolean; className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden tabular-nums ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="block"
          initial={reduced ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          ${value.toLocaleString("en-US")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Price block for a plan card: big per-month figure, then the annual math. */
function PlanPrice({
  plan,
  billing,
  hot,
  reduced,
}: {
  plan: Plan;
  billing: Billing;
  hot: boolean;
  reduced: boolean;
}) {
  const t = useTranslations("getStarted");
  const monthly = PRICES[plan].monthly;
  const annual = PRICES[plan].annual;
  const fullAnnual = monthly * 12;
  const saved = fullAnnual - annual;
  const perMonth = billing === "annual" ? Math.round(annual / 12) : monthly;
  const muted = hot ? "text-site-on-vis/65" : "text-site-paper/55";

  return (
    <div>
      <div className="flex items-end gap-2">
        <RollingPrice
          value={perMonth}
          reduced={reduced}
          className={`${DISPLAY} text-[clamp(3.2rem,6vw,4.2rem)] leading-[0.9]`}
        />
        <span className={`mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] ${muted}`}>{t("perMonth")}</span>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {billing === "annual" && (
          <motion.div
            key="annual"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mt-3 space-y-1 font-mono text-[11px] uppercase tracking-[0.12em] tabular-nums"
          >
            <p className={hot ? "text-site-on-vis/85" : "text-site-paper/80"}>
              ${annual.toLocaleString("en-US")} <span className={muted}>{t("billedAnnually")}</span>
            </p>
            <p className="flex flex-wrap items-center gap-x-2">
              <span className={`line-through ${hot ? "text-site-on-vis/45" : "text-site-paper/40"}`}>
                ${fullAnnual.toLocaleString("en-US")}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-semibold ${hot ? "bg-site-on-vis text-site-vis" : "bg-site-vis/10 text-site-vis"}`}
              >
                {t("saveAmount", { amount: saved })}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A pill button with the home's knob-arrow; `tone` picks its surface. */
function KnobButton({
  children,
  tone,
  type = "button",
  disabled,
  busy,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  tone: "solid" | "dark";
  type?: "button" | "submit";
  disabled?: boolean;
  busy?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const face =
    tone === "solid"
      ? "bg-site-vis text-site-on-vis hover:bg-site-vis-hover focus-visible:ring-site-vis"
      : "bg-site-on-vis text-site-vis hover:bg-site-on-vis/85 focus-visible:ring-site-on-vis";
  const knob = tone === "solid" ? "bg-site-on-vis text-site-vis" : "bg-site-vis text-site-on-vis";
  const slide = "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`group inline-flex h-14 items-center justify-between gap-4 rounded-full pl-7 pr-2 text-[16px] font-medium tracking-[-0.005em] transition-[background-color,transform] duration-200 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-site-night ${face} ${className}`}
    >
      <span className="text-left">{children}</span>
      <span className={`relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full ${knob}`}>
        {busy ? (
          <Loader2 size={17} strokeWidth={2.2} className="animate-spin" />
        ) : (
          <>
            <ArrowRight size={17} strokeWidth={2.2} className={`${slide} group-hover:translate-x-7`} />
            <ArrowRight size={17} strokeWidth={2.2} className={`absolute -translate-x-7 ${slide} group-hover:translate-x-0`} />
          </>
        )}
      </span>
    </button>
  );
}

/* ─── Component ────────────────────────────────────────────────── */

export default function GetStartedFlow() {
  const t = useTranslations("getStarted");
  // The language this buyer chose on OUR site. Sent to the checkout route so
  // Stripe bills and receipts them in it — see the note there.
  const locale = useLocale();
  const searchParams = useSearchParams();
  const reduced = useReduced();
  const track = useCtaTracker("get_started");

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
    // A visitor who arrived with ?plan= already fired this from Pricing; the
    // URL auto-advance above deliberately does not fire it again.
    track("plan_selected", { plan: selectedPlan, billing });
    setPlan(selectedPlan);
    // Step 2 always opens clean — never carry a prior triggered validation
    // state across a plan change (e.g. Continue → Back → Claim Founding Spot).
    setFieldErrors({});
    setSubmitError("");
    setDirection(1);
    setStep(2);
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

    // Fired on the validated submit, before the session request, so a
    // checkout the API then refuses still counts as an attempt.
    track("checkout_started", { plan, billing, hasCoupon: Boolean(coupon) });
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
          locale,
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
    `${FIELD} ${
      field && fieldErrors[field] ? "ring-site-alert/70" : "ring-site-paper/15 hover:ring-site-paper/30"
    }`;

  const errProps = (field: keyof FormData) =>
    fieldErrors[field] ? { "aria-invalid": true as const, "aria-describedby": `gs-${field}-error` } : {};

  const heading = step === 1 ? t("chooseYourPlan") : step === 2 ? t("almostThere") : t("redirecting");

  const cards: { id: Plan; hot: boolean; features: string[] }[] = [
    { id: "starter", hot: true, features: starterFeatures },
    { id: "pro", hot: false, features: proFeatures },
  ];

  /* ─── Render ────────────────────────────────────────────────── */

  return (
    <div className="relative overflow-hidden bg-site-night pb-16 pt-32 text-site-paper md:pb-24 md:pt-40">
      {/* Low morning bloom — the home's sky, kept off the top edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-25%] top-[18%] h-[760px] w-[980px] max-w-none opacity-45"
        style={{ background: "radial-gradient(closest-side, var(--sky-top), transparent)" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
        {/* Heading row: progress kicker + flap headline; billing toggle on the right. */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            {step < 3 && (
              <div
                className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]"
                aria-label={`${step} / 2`}
              >
                <span className="tabular-nums text-site-vis">01</span>
                <span aria-hidden className="flex gap-1.5">
                  {[1, 2].map((s) => (
                    <span key={s} className="relative h-[3px] w-8 overflow-hidden rounded-full bg-site-paper/15">
                      <motion.span
                        className="absolute inset-0 origin-left rounded-full bg-site-vis"
                        initial={false}
                        animate={{ scaleX: step >= s ? 1 : 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
                      />
                    </span>
                  ))}
                </span>
                <span className={`tabular-nums transition-colors duration-300 ${step >= 2 ? "text-site-vis" : "text-site-paper/45"}`}>02</span>
              </div>
            )}
            <FlapText
              key={step}
              as="h1"
              immediate
              lines={[heading]}
              className={`${DISPLAY} max-w-[16ch] text-[clamp(2.4rem,5.6vw,5rem)] leading-[0.95] [overflow-wrap:anywhere]`}
            />
            {step === 1 && (
              <p className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-site-paper/70">{t("noPerSeatFees")}</p>
            )}
            {step === 2 && (
              <p className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-site-paper/70">{t("enterDetails")}</p>
            )}
          </div>

          {/* Billing toggle — LayoutGroup shared pill, same as the home's Plans. */}
          {step === 1 && (
            <LayoutGroup id="getstarted-billing-toggle">
              <div className="inline-flex shrink-0 self-start rounded-full bg-site-slab p-1 ring-1 ring-site-paper/[0.08] lg:self-auto">
                {(["monthly", "annual"] as const).map((mode) => {
                  const active = billing === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setBilling(mode)}
                      aria-pressed={active}
                      className={`relative rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-200 ${
                        active ? "text-site-on-vis" : "text-site-paper/70 hover:text-site-paper"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="getstarted-billing-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-site-vis"
                          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        {mode === "monthly" ? t("monthly") : t("annual")}
                        {mode === "annual" && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                              active ? "bg-site-on-vis/15" : "bg-site-vis/15 text-site-vis"
                            }`}
                          >
                            −17%
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          )}
        </div>

        {/* Steps with animated transitions */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* ─── Step 1: Plan selection ─────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={reduced ? {} : stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="mt-12 grid items-stretch gap-4 md:mt-16 md:grid-cols-2"
            >
              {cards.map(({ id, hot, features }) => (
                <div
                  key={id}
                  onClick={() => setPlan(id)}
                  className={`relative flex cursor-pointer flex-col rounded-[28px] p-7 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-9 motion-safe:hover:-translate-y-1 ${
                    hot ? "bg-site-vis text-site-on-vis" : "bg-site-slab ring-1 ring-site-paper/[0.08]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-flex text-[22px] font-semibold [font-variation-settings:'wdth'_115]">
                      {t(`${id}.name`)}
                    </h2>
                    {hot && (
                      <span className="rounded-full bg-site-on-vis px-3 py-1 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-site-vis">
                        {t("mostPopular")}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-[14px] ${hot ? "text-site-on-vis/70" : "text-site-paper/60"}`}>
                    {t(`${id}.description`)}
                  </p>

                  <div className="mt-8">
                    <PlanPrice plan={id} billing={billing} hot={hot} reduced={reduced} />
                  </div>
                  <p
                    className={`mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] ${
                      hot ? "text-site-on-vis/70" : "text-site-vis/90"
                    }`}
                  >
                    {t(`${id}.workerLimit`)}
                  </p>

                  <ul
                    className={`mt-8 space-y-3 border-t pt-6 text-[14px] ${
                      hot ? "border-site-on-vis/15" : "border-site-paper/10"
                    }`}
                  >
                    {features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check
                          size={15}
                          strokeWidth={2.4}
                          className={`mt-0.5 flex-shrink-0 ${hot ? "text-site-on-vis" : "text-site-vis"}`}
                        />
                        <span className={hot ? "text-site-on-vis/85" : "text-site-paper/80"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-9">
                    <KnobButton
                      tone={hot ? "dark" : "solid"}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToStep2(id);
                      }}
                    >
                      {t("continue")}
                    </KnobButton>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ─── Step 2: Account details ────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={reduced ? {} : stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="mt-12 grid items-start gap-4 md:mt-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-6"
            >
              {/* Selected plan — a forest ticket; above the form on phones. */}
              <aside className="relative overflow-hidden rounded-[26px] bg-site-vis p-7 text-site-on-vis md:rounded-[28px] md:p-9 lg:order-2 lg:sticky lg:top-32">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-on-vis/65">{t("selectedPlan")}</p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                  <p className="font-flex text-[30px] font-semibold leading-none tracking-[-0.02em] [font-variation-settings:'wdth'_115]">
                    {plan === "starter" ? t("starter.name") : plan === "pro" ? t("pro.name") : plan}
                  </p>
                  <p className="flex items-baseline gap-1.5">
                    <span className={`${DISPLAY} text-[40px] leading-none tabular-nums`}>
                      ${billing === "annual" ? Math.round(PRICES[plan!].annual / 12) : PRICES[plan!].monthly}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-site-on-vis/65">
                      {t("perMonthShort")}
                    </span>
                  </p>
                </div>
                {billing === "annual" && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] tabular-nums text-site-on-vis/75">
                    ${PRICES[plan!].annual.toLocaleString()}
                    {t("perYrBilledAnnually")}
                  </p>
                )}
                <p className="mt-7 flex gap-2.5 border-t border-site-on-vis/15 pt-5 text-[13px] leading-relaxed text-site-on-vis/70">
                  <Lock size={14} strokeWidth={2} className="mt-[3px] shrink-0" aria-hidden />
                  {t("poweredByStripe")}
                </p>
              </aside>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 rounded-[26px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] sm:p-8 md:rounded-[30px] md:p-10 lg:order-1"
              >
                <div>
                  <label htmlFor="gs-name" className={LABEL}>
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
                    {...errProps("name")}
                  />
                  {fieldErrors.name && (
                    <p id="gs-name-error" className="mt-2 text-[13px] leading-snug text-site-alert">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gs-email" className={LABEL}>
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
                    {...errProps("email")}
                  />
                  {fieldErrors.email && (
                    <p id="gs-email-error" className="mt-2 text-[13px] leading-snug text-site-alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gs-companyName" className={LABEL}>
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
                    {...errProps("companyName")}
                  />
                  {fieldErrors.companyName && (
                    <p id="gs-companyName-error" className="mt-2 text-[13px] leading-snug text-site-alert">
                      {fieldErrors.companyName}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-xl bg-site-alert/[0.08] p-4 text-[14px] leading-relaxed text-site-alert ring-1 ring-inset ring-site-alert/30"
                  >
                    {submitError}{t("form.retryHint")}{" "}
                    <a href="mailto:hello@getstroyka.com" className="underline underline-offset-2 hover:text-site-paper">
                      hello@getstroyka.com
                    </a>
                  </div>
                )}

                <div className="mt-2 flex flex-col-reverse gap-3 border-t border-site-paper/10 pt-7 sm:flex-row">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-medium text-site-paper ring-1 ring-inset ring-site-paper/25 transition-[background-color,box-shadow,transform] duration-200 hover:bg-site-paper/[0.05] hover:ring-site-paper/45 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis"
                  >
                    <ArrowLeft size={16} />
                    {t("back")}
                  </button>
                  <KnobButton type="submit" tone="solid" disabled={submitting} busy={submitting} className="flex-1">
                    {submitting ? t("processing") : t("continueToPayment")}
                  </KnobButton>
                </div>

                <p className="text-[13px] text-site-paper/55">
                  {/* Points at the stores, not at a login page: there is
                      no longer anywhere to sign in on the web. The browser
                      app was retired on 2026-09-21 and app.getstroyka.com
                      now serves a signpost, so "Log in" would have sent
                      someone to a page telling them to install the app —
                      one hop too many, and a confusing one mid-checkout. */}
                  {t("alreadyHaveAccount")}{" "}
                  <a
                    href="https://www.getstroyka.com/get"
                    className="font-medium text-site-vis underline decoration-site-vis/30 underline-offset-4 transition-colors duration-200 hover:decoration-site-vis"
                  >
                    {t("signInInApp")}
                  </a>
                </p>
              </form>
            </motion.div>
          )}

          {/* ─── Step 3: Loading/redirect ───────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-12 md:mt-16"
            >
              <div className="flex max-w-xl items-center gap-5 rounded-[26px] bg-site-slab p-7 ring-1 ring-site-paper/[0.08] md:p-9">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-site-vis text-site-on-vis">
                  <Loader2 size={22} className="animate-spin" />
                </span>
                <div>
                  <p className="font-flex text-[19px] font-medium leading-snug tracking-[-0.01em]">
                    {t("takingYouToCheckout")}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-site-paper/55">{t("poweredByStripe")}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
