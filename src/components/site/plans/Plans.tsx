"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, LayoutGroup, animate, motion, useMotionValue } from "motion/react";
import { Check } from "lucide-react";
import FlapText from "../ui/FlapText";
import VisButton from "../ui/VisButton";
import Odometer from "../ui/Odometer";
import Hanging from "./Hanging";
import { useCrew } from "./CrewContext";
import { PRICES } from "@/data/pricing";
import { WORKYARD, stroykaPlanFor } from "@/data/competitors";
import { useSignupHref } from "@/lib/hooks/useSignupHref";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import { useReduced } from "../ui/useReduced";

type Billing = "monthly" | "annual";
type PlanId = "free" | "starter" | "pro";

const FEATURE_COUNT = { free: 7, starter: 8, pro: 8 } as const;

/**
 * Pricing on the crane site. Same plans, same strings as before (the
 * `pricing` namespace); new staging: the plans hang as price tags from a
 * beam, lowered in by the crane the first time you get here, swinging when
 * billing flips, the digits rolling like the ledger's odometer. If the
 * visitor dialled in their crew on SeatMath, the matching plan is tagged
 * and one line does the per-seat maths for them (same sourced formula).
 */
export default function Plans() {
  const t = useTranslations("pricing");
  const tg = useTranslations("guarantee");
  const tc = useTranslations("site.plansCrew");
  const reduced = useReduced();
  const [billing, setBilling] = useState<Billing>("monthly");
  const signupHref = useSignupHref();
  const track = useCtaTracker("pricing");
  const { crew } = useCrew();
  const fit = crew ? stroykaPlanFor(crew) : null;
  const fitId = fit ? (fit.name.toLowerCase() as PlanId) : null;

  const price = (tier: "starter" | "pro") =>
    billing === "monthly" ? PRICES[tier].monthly : PRICES[tier].annualPerMonth;

  const plans = [
    {
      id: "free" as const,
      price: 0,
      note: t("free.priceForever"),
      href: signupHref,
      onClick: () => track("cta_start_free", { plan: "free" }),
    },
    {
      id: "starter" as const,
      price: price("starter"),
      note: billing === "annual" ? t("billedAnnually", { total: `$${PRICES.starter.annual.toLocaleString()}` }) : t("perMonth"),
      href: `/get-started?plan=starter&billing=${billing}`,
      onClick: () => track("plan_selected", { plan: "starter", billing }),
    },
    {
      id: "pro" as const,
      price: price("pro"),
      note: billing === "annual" ? t("billedAnnually", { total: `$${PRICES.pro.annual.toLocaleString()}` }) : t("perMonth"),
      href: `/get-started?plan=pro&billing=${billing}`,
      onClick: () => track("plan_selected", { plan: "pro", billing }),
    },
  ];

  return (
    <section id="pricing" className="relative bg-site-night py-24 text-site-paper md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("eyebrow")}</p>
            <FlapText
              lines={[t("heading")]}
              className="max-w-[18ch] font-flex text-[clamp(2.3rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
            />
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-site-paper/70">{t("subhead")}</p>
          </div>

          <LayoutGroup id="billing">
            <div className="inline-flex self-start rounded-full bg-site-slab p-1 ring-1 ring-site-paper/[0.08] lg:self-auto">
              {(["monthly", "annual"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBilling(mode)}
                  aria-pressed={billing === mode}
                  className={`relative rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-200 ${billing === mode ? "text-site-on-vis" : "text-site-paper/70 hover:text-site-paper"}`}
                >
                  {billing === mode && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-site-vis"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {mode === "monthly" ? t("monthly") : t("annual")}
                    {mode === "annual" && (
                      <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${billing === "annual" ? "bg-site-on-vis/15" : "bg-site-vis/15 text-site-vis"}`}>
                        {t("annualSave")}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        {/* Your crew, carried down from SeatMath. */}
        <AnimatePresence initial={false}>
          {fit && crew && (
            <motion.p
              key="crew"
              data-crew-line
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-3xl text-[15.5px] leading-relaxed text-site-paper/75"
            >
              <span className="font-medium text-site-paper">
                {tc("line", { crew, plan: t(`${fitId}.name`), ours: fit.monthly })}
              </span>{" "}
              {WORKYARD.costFor(crew) > fit.monthly && tc("them", { name: WORKYARD.name, theirs: WORKYARD.costFor(crew) })}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="relative mt-12 md:mt-16">
          {/* The beam the tags hang from (one run across all three on desktop). */}
          <span aria-hidden className="absolute inset-x-0 top-[-3px] hidden h-[6px] rounded-full bg-site-paper/75 lg:block">
            <span className="absolute inset-x-0 top-[2px] h-px bg-site-night/40" />
          </span>
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-4">
            {plans.map((p, i) => {
              const hot = p.id === "starter";
              const fits = fitId === p.id;
              return (
                <Hanging key={p.id} index={i} swingKey={billing}>
                  <div
                    data-plan={p.id}
                    data-fits={fits ? "1" : "0"}
                    className={`relative flex h-full flex-col rounded-[28px] p-7 md:p-9 ${
                      hot ? "bg-site-vis text-site-on-vis" : "bg-site-slab ring-1 ring-site-paper/[0.08]"
                    } ${fits ? "outline outline-[3px] outline-offset-4 outline-site-vis" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-flex text-[22px] font-semibold [font-variation-settings:'wdth'_115]">{t(`${p.id}.name`)}</span>
                      <div className="flex items-center gap-2">
                        <AnimatePresence initial={false}>
                          {fits && (
                            <motion.span
                              key="fits"
                              initial={reduced ? false : { scale: 0, rotate: -12, opacity: 0 }}
                              animate={{ scale: 1, rotate: -4, opacity: 1 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 380, damping: 14 }}
                              className={`rounded-md border-2 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                hot ? "border-site-on-vis text-site-on-vis" : "border-site-vis text-site-vis"
                              }`}
                            >
                              {tc("fits")}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {hot && (
                          <span className="rounded-full bg-site-on-vis px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-site-vis">
                            {t("mostPopular")}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={`mt-2 text-[14px] ${hot ? "text-site-on-vis/70" : "text-site-paper/60"}`}>{t(`${p.id}.description`)}</p>

                    <div className="mt-8 flex items-end gap-2">
                      <RollingPrice value={p.price} digits={p.id === "free" ? 1 : String(PRICES[p.id].monthly).length} reduced={reduced} />
                      <span className={`mb-1 text-[13px] ${hot ? "text-site-on-vis/65" : "text-site-paper/55"}`}>{p.note}</span>
                    </div>
                    <p className={`mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] ${hot ? "text-site-on-vis/70" : "text-site-vis/90"}`}>
                      {t(`${p.id}.limit`)}
                    </p>

                    <ul className={`mt-8 space-y-3 border-t pt-6 text-[14px] ${hot ? "border-site-on-vis/15" : "border-site-paper/10"}`}>
                      {Array.from({ length: FEATURE_COUNT[p.id] }).map((_, k) => (
                        <li key={k} className="flex gap-2.5">
                          <Check size={15} strokeWidth={2.4} className={`mt-0.5 flex-shrink-0 ${hot ? "text-site-on-vis" : "text-site-vis"}`} />
                          <span className={hot ? "text-site-on-vis/85" : "text-site-paper/80"}>{t(`${p.id}.features.${k}`)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-9">
                      <VisButton href={p.href} onClick={p.onClick} variant={hot ? "dark" : "solid"}>
                        {t(`${p.id}.cta`)}
                      </VisButton>
                    </div>
                  </div>
                </Hanging>
              );
            })}
          </div>
        </div>

        {/* The fine print, as three short promises. */}
        <div className="mt-16 grid gap-8 border-t border-site-paper/10 pt-10 md:grid-cols-3">
          {[0, 1, 2].map((k) => (
            <div key={k}>
              <p className="font-flex text-[18px] font-semibold">{tg(`promises.${k}.title`)}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-site-paper/60">{tg(`promises.${k}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The price, on the ledger's odometer: digits roll to the new figure when billing flips. */
function RollingPrice({ value, digits, reduced }: { value: number; digits: number; reduced: boolean }) {
  const mv = useMotionValue(value);
  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [value, reduced, mv]);
  return (
    <>
      <span className="sr-only">${value}</span>
      <Odometer value={mv} digits={digits} className="font-flex text-[64px] font-semibold leading-[0.85] tracking-[-0.03em]" />
    </>
  );
}
