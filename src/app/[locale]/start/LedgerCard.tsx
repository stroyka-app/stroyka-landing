"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The argument, set in type.
 *
 * This is the one element /start has that /get has no reason to want, and it
 * exists because of a finding already in the vault (Channels/paid-social.md,
 * creative reasoning): "Zeely can generate a construction scene; it cannot
 * generate $13,358 of $18,000. A contractor reads those and knows instantly
 * what this is."
 *
 * Those numbers were only ever present inside the phone screenshot, where
 * they render around 11 px on a 390 px phone — legible if you lean in, which
 * nobody does two seconds after tapping an ad. Setting them in Fraunces at
 * headline scale makes the page's strongest asset its most readable one.
 * (Morning Bone, 2026-09-24: Roboto Flex semibold now, not Fraunces, and the
 * 68% is drawn as a budget bar as well as said.)
 *
 * The figures are the real ones from the Report screen shown beside it, so
 * the card and the screenshot agree. If the screenshot is ever regenerated
 * with different data, these change with it.
 *
 * The closing line is continuity with the ad, not a new claim: both Zeely
 * scripts end on finding out in March, so the page answers the sentence the
 * viewer just heard rather than starting a fresh one.
 */
export default function LedgerCard() {
  const t = useTranslations("start");

  const rows = [
    [t("ledgerLabor"), "$7,954"],
    [t("ledgerMaterials"), "$4,801"],
    [t("ledgerFuel"), "$222"],
  ] as const;

  // Reduced motion: the parent's <MotionConfig reducedMotion="user"> drops
  // the transforms (rise, bar fill) and keeps only the fade.
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
      className="mt-7 rounded-[24px] bg-site-slab p-5 ring-1 ring-site-paper/[0.08] sm:p-6"
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-site-vis">
        {t("ledgerJob")}
      </p>

      <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
        <span className="font-flex text-[48px] font-semibold leading-none tracking-[-0.035em] text-site-paper tabular-nums [font-variation-settings:'wdth'_110] sm:text-[56px]">
          $7,433
        </span>
        <span className="font-flex text-[16px] font-semibold text-site-vis">
          {t("ledgerLeft")}
        </span>
      </p>

      {/* Budget used, 68%: a forest rule that fills once on load, with
          quarter ticks like the home page's Job 204 ledger. */}
      <div aria-hidden className="relative mt-4 h-2 overflow-hidden rounded-full bg-site-paper/10">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-site-vis"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.68 }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
        />
        {[25, 50, 75].map((x) => (
          <span key={x} className="absolute inset-y-0 w-px bg-site-slab/70" style={{ left: `${x}%` }} />
        ))}
      </div>

      <p className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-site-paper/55">
        {t("ledgerOf", { total: "$23,000", pct: "68%" })}
      </p>

      <dl className="mt-4 border-t border-site-paper/10">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-b border-site-paper/[0.07] py-2"
          >
            <dt className="text-[14px] text-site-paper/70">{label}</dt>
            <dd className="font-mono text-[13px] tabular-nums text-site-paper">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 flex items-start gap-2.5 font-flex text-[17px] font-semibold leading-snug tracking-[-0.01em] text-site-vis">
        <span aria-hidden className="mt-[0.55em] h-px w-4 shrink-0 bg-site-vis" />
        {t("ledgerPunch")}
      </p>
    </motion.div>
  );
}
