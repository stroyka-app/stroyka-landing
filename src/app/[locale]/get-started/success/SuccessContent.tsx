"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { Crown, Zap, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import { IOS_APP_URL, ANDROID_APP_URL, SIGNUP_URL } from "@/lib/appLinks";
import { PRICES } from "@/data/pricing";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";

/**
 * What the buyer just paid, from the params the checkout route put on its
 * success_url. `undefined` when either is missing or unrecognised, in which
 * case the Purchase pixel event is skipped rather than sent with no value.
 */
function purchaseValue(plan: string | null, billing: string | null): number | undefined {
  if (plan !== "starter" && plan !== "pro") return undefined;
  if (billing === "monthly") return PRICES[plan].monthly;
  if (billing === "annual") return PRICES[plan].annual;
  return undefined;
}

/**
 * Stripe's success_url is a page a buyer can refresh or reopen from history,
 * and each load would report another purchase. The session id is unique per
 * checkout, so it keys a one-shot marker for this browser.
 */
function claimPurchaseOnce(sessionId: string | null): boolean {
  if (!sessionId) return true;
  const key = `stroyka:purchase_tracked:${sessionId}`;
  try {
    if (window.sessionStorage.getItem(key)) return false;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Storage blocked (private mode, ITP): fall through and report once per load.
  }
  return true;
}

export default function SuccessContent() {
  const t = useTranslations("getStarted");
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const sessionId = searchParams.get("session_id");
  const prefersReduced = useReducedMotion();
  const track = useCtaTracker("get_started_success");
  const reported = useRef(false);

  useEffect(() => {
    // The ref guards React's dev double-invoke; the storage marker guards a
    // human reloading the page.
    if (reported.current || !claimPurchaseOnce(sessionId)) return;
    reported.current = true;
    const value = purchaseValue(plan, billing);
    track("checkout_success", {
      plan: plan ?? "unknown",
      billing: billing ?? "unknown",
      ...(value !== undefined && { value }),
    });
  }, [track, plan, billing, sessionId]);

  const planLabel =
    plan === "pro" ? t("pro.name") : plan === "starter" ? t("starter.name") : "";
  const isPro = planLabel === t("pro.name");
  const isStarter = planLabel === t("starter.name");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        <AmbientBackdrop />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          {/* Live eyebrow — a pulsing sage dot signals the subscription just went
              active. Folio detail on the right echoes /demo + /get-started. */}
          <FadeIn>
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-ink-soft">
                <span className="relative inline-flex h-1.5 w-1.5" aria-hidden>
                  {!prefersReduced && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-75 animate-ping" />
                  )}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-sage" />
                </span>
                {t("subscriptionActive")}
              </span>
              <span
                aria-hidden
                className="hidden sm:block font-mono text-[9.5px] tracking-[0.24em] uppercase text-ink/35"
              >
                Field journal · Appendix C
              </span>
            </div>
          </FadeIn>

          <TextReveal
            as="h1"
            className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-4"
          >
            {t("welcome")}
          </TextReveal>

          <FadeIn delay={0.12}>
            <div className="flex items-center gap-2 mb-12">
              {isPro && <Crown size={16} className="text-brand-forest" />}
              {isStarter && <Zap size={16} className="text-brand-forest" />}
              <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-ink-soft">
                {planLabel
                  ? t("planActive", { plan: planLabel })
                  : t("planActiveGeneric")}
              </p>
            </div>
          </FadeIn>

          {/* Next steps — the real flow: create the account on the web FIRST
              (iOS app is sign-in-only), then download + sign in. */}
          <FadeIn delay={0.2}>
            <div className="card-stone border border-ink/15 rounded-2xl p-6 sm:p-8 text-left mb-6">
              <h2 className="font-display text-[20px] leading-snug text-ink mb-7">
                {t("newToStroyka")}
              </h2>

              {/* Step 1 — create account on the web */}
              <div className="flex gap-4">
                <StepDot>1</StepDot>
                <div className="flex-1 pb-7">
                  <p className="text-[14.5px] text-ink-soft leading-relaxed mb-4">
                    {t("step1")}
                  </p>
                  <a
                    href={SIGNUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 bg-ink text-bone hover:bg-brand-deep transition-colors rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.1em] uppercase"
                  >
                    {t("createAccount")}
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>

              {/* Step 2 — download + sign in */}
              <div className="flex gap-4">
                <StepDot>2</StepDot>
                <div className="flex-1">
                  <p className="text-[14.5px] text-ink-soft leading-relaxed mb-4">
                    {t("step2")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <StoreBadge
                      href={IOS_APP_URL}
                      label={t("appStore")}
                      icon={<AppleGlyph className="h-3 w-3" />}
                      onClick={() => track("store_badge_clicked", { store: "app_store" })}
                    />
                    {ANDROID_APP_URL !== "#" && (
                      <StoreBadge
                        href={ANDROID_APP_URL}
                        label={t("googlePlay")}
                        icon={<GooglePlayGlyph className="h-3 w-3" />}
                        onClick={() => track("store_badge_clicked", { store: "google_play" })}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Already have an account — quiet secondary path */}
          <FadeIn delay={0.28}>
            <p className="text-[13.5px] text-ink-soft leading-relaxed mb-12">
              <span className="text-ink font-medium">{t("haveApp")}</span>{" "}
              {t("openSignIn")}
            </p>
          </FadeIn>

          {/* Questions */}
          <FadeIn delay={0.34}>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted">
              {t("questions")}{" "}
              <a
                href="mailto:hello@getstroyka.com"
                className="text-brand-forest hover:text-brand-deep transition-colors"
              >
                hello@getstroyka.com
              </a>
            </p>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Numbered step marker — sage-outlined coin with a mono numeral. */
function StepDot({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-sage/45 bg-brand-sage/10 font-mono text-[12px] font-semibold text-brand-forest">
      {children}
    </div>
  );
}

/** Pill store badge — dark ink chip with a brand glyph. */
function StoreBadge({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone transition-colors hover:bg-brand-deep"
    >
      {icon}
      {label}
    </a>
  );
}
