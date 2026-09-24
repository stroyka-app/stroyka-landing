"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {AnimatePresence, LayoutGroup, motion} from "motion/react";
import { Check } from "lucide-react";
import FlapText from "../ui/FlapText";
import VisButton from "../ui/VisButton";
import { PRICES } from "@/data/pricing";
import { useSignupHref } from "@/lib/hooks/useSignupHref";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import { useReduced } from "../ui/useReduced";

type Billing = "monthly" | "annual";

const FEATURE_COUNT = { free: 7, starter: 8, pro: 8 } as const;

/**
 * Pricing on the dusk site. Same plans, same strings as the old Pricing
 * (the `pricing` namespace), new staging: a shared-pill billing toggle,
 * the price digits sliding when it flips, Starter lifted in hi-vis.
 */
export default function Plans() {
  const t = useTranslations("pricing");
  const tg = useTranslations("guarantee");
  const reduced = useReduced();
  const [billing, setBilling] = useState<Billing>("monthly");
  const signupHref = useSignupHref();
  const track = useCtaTracker("pricing");

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

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-3">
          {plans.map((p, i) => {
            const hot = p.id === "starter";
            return (
              <motion.div
                key={p.id}
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col rounded-[28px] p-7 md:p-9 ${hot ? "bg-site-vis text-site-on-vis lg:-translate-y-4" : "bg-site-slab ring-1 ring-site-paper/[0.08]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-flex text-[22px] font-semibold [font-variation-settings:'wdth'_115]">{t(`${p.id}.name`)}</span>
                  {hot && (
                    <span className="rounded-full bg-site-on-vis px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-site-vis">
                      {t("mostPopular")}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-[14px] ${hot ? "text-site-on-vis/70" : "text-site-paper/60"}`}>{t(`${p.id}.description`)}</p>

                <div className="mt-8 flex items-end gap-2">
                  <span className="font-flex text-[64px] font-semibold leading-[0.85] tracking-[-0.03em]">$</span>
                  <span className="relative h-[54px] overflow-hidden font-flex text-[64px] font-semibold leading-[0.85] tracking-[-0.03em] tabular-nums">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={p.price}
                        className="block"
                        initial={reduced ? false : { y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {p.price}
                      </motion.span>
                    </AnimatePresence>
                  </span>
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
              </motion.div>
            );
          })}
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
