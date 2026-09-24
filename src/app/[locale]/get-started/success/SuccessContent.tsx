"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlapText from "@/components/site/ui/FlapText";
import { useReduced } from "@/components/site/ui/useReduced";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import { IOS_APP_URL, ANDROID_APP_URL } from "@/lib/appLinks";
import { PRICES } from "@/data/pricing";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const reduced = useReduced();
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

  /** Content settles in after the headline has opened and the stamp landed. */
  const rise = (i: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 18 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.55 + i * 0.08, duration: 0.45, ease: EASE },
  });

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-site-night pb-16 pt-32 text-site-paper md:pb-24 md:pt-40">
        {/* Low morning bloom — the home's sky, kept off the top edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-20%] top-[8%] h-[720px] w-[900px] max-w-none opacity-55"
          style={{ background: "radial-gradient(closest-side, var(--sky-top), transparent)" }}
        />

        <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="min-w-0">
              {/* Live kicker — the subscription just went active. */}
              <p className="mb-6 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">
                <span className="relative inline-flex h-1.5 w-1.5" aria-hidden>
                  {!reduced && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-site-vis opacity-60" />
                  )}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-site-vis" />
                </span>
                {t("subscriptionActive")}
              </p>
              <FlapText
                as="h1"
                immediate
                lines={[t("welcome")]}
                className="max-w-[15ch] font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110] [overflow-wrap:anywhere]"
              />
            </div>

            {/* The stamp: the plan, inked onto the page. */}
            <PlanStamp
              reduced={reduced}
              word={planLabel || t("subscriptionActive")}
              note={planLabel ? t("planActive", { plan: planLabel }) : t("planActiveGeneric")}
            />
          </div>

          {/* Next steps: get the app, then create the account IN the app with
              the checkout email — create-company links the pending Stripe
              subscription by that email. The web signup used to be step 1;
              the site stopped creating web accounts on 2026-09-13. */}
          <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <motion.section
              {...rise(0)}
              className="rounded-[26px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] sm:p-8 md:rounded-[30px] md:p-10"
            >
              <h2 className="font-flex text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-[-0.02em] [font-variation-settings:'wdth'_110]">
                {t("newToStroyka")}
              </h2>

              <ol className="mt-8 border-t border-site-paper/10">
                {/* Step 1 — download */}
                <li className="flex gap-5 border-b border-site-paper/10 py-6 md:gap-8">
                  <StepNum>01</StepNum>
                  <div className="min-w-0 flex-1">
                    <p className="font-flex text-[18px] font-medium leading-snug tracking-[-0.01em] md:text-[20px]">
                      {t("step1")}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <StoreBadge
                        href={IOS_APP_URL}
                        label={t("appStore")}
                        icon={<AppleGlyph className="h-4 w-4" />}
                        onClick={() => track("store_badge_clicked", { store: "app_store" })}
                      />
                      {ANDROID_APP_URL !== "#" && (
                        <StoreBadge
                          href={ANDROID_APP_URL}
                          label={t("googlePlay")}
                          icon={<GooglePlayGlyph className="h-4 w-4" />}
                          onClick={() => track("store_badge_clicked", { store: "google_play" })}
                        />
                      )}
                    </div>
                  </div>
                </li>

                {/* Step 2 — create the account in the app */}
                <li className="flex gap-5 pt-6 md:gap-8">
                  <StepNum>02</StepNum>
                  <p className="min-w-0 flex-1 font-flex text-[18px] font-medium leading-snug tracking-[-0.01em] md:text-[20px]">
                    {t("step2")}
                  </p>
                </li>
              </ol>
            </motion.section>

            <div className="flex flex-col gap-4">
              {/* Already have an account — quiet secondary path */}
              <motion.div
                {...rise(1)}
                className="rounded-[26px] p-6 ring-1 ring-inset ring-site-paper/15 sm:p-8 md:rounded-[30px]"
              >
                <p className="font-flex text-[18px] font-semibold leading-snug tracking-[-0.01em]">{t("haveApp")}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-site-paper/65">{t("openSignIn")}</p>
              </motion.div>

              {/* Questions */}
              <motion.p
                {...rise(2)}
                className="px-1 pt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-site-paper/50"
              >
                {t("questions")}{" "}
                <a
                  href="mailto:hello@getstroyka.com"
                  className="normal-case tracking-[0.06em] text-site-vis underline decoration-site-vis/30 underline-offset-4 transition-colors hover:decoration-site-vis"
                >
                  hello@getstroyka.com
                </a>
              </motion.p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/**
 * The success stamp (spec: border-[2.5px] accent, font-flex extrabold
 * uppercase, spring 380/14, rotate −8…−12°, impact ring 1 → 1.85). It lands
 * once the headline's flap has opened.
 */
function PlanStamp({ reduced, word, note }: { reduced: boolean; word: string; note: string }) {
  return (
    <motion.div
      initial={reduced ? false : { scale: 0, rotate: -24, opacity: 0 }}
      animate={{ scale: 1, rotate: -9, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.45 }}
      className="origin-center justify-self-start pl-2 lg:mb-3 lg:justify-self-end lg:pl-0 lg:pr-4"
    >
      <span className="relative block max-w-[300px] rounded-xl border-[2.5px] border-site-vis px-5 py-3 text-site-vis">
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-[-2.5px] rounded-xl ring-2 ring-site-vis"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.85], opacity: [0.7, 0] }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.52 }}
          />
        )}
        <span className="block break-words font-flex text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold uppercase leading-none tracking-[0.03em] [font-variation-settings:'wdth'_125]">
          {word}
        </span>
        <span className="mt-2 block font-mono text-[10px] uppercase leading-snug tracking-[0.18em]">{note}</span>
      </span>
    </motion.div>
  );
}

/** Step numeral — a mono micro-label in the accent, like the home's FAQ. */
function StepNum({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 font-mono text-[11px] tabular-nums tracking-[0.1em] text-site-vis">{children}</span>
  );
}

/** Store badge — an ink pill with the store's glyph. */
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
      className="inline-flex h-12 items-center gap-2.5 rounded-full bg-site-paper px-5 text-[14.5px] font-medium text-site-night transition-[background-color,transform] duration-200 hover:bg-site-vis active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-slab"
    >
      {icon}
      {label}
    </a>
  );
}
