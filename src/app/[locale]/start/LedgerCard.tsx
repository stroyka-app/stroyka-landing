"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const prefersReduced = useReducedMotion();

  const rows = [
    [t("ledgerLabor"), "$7,954"],
    [t("ledgerMaterials"), "$4,801"],
    [t("ledgerFuel"), "$222"],
  ] as const;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
      className="card-stone-sage mt-7 rounded-[18px] px-5 py-5 sm:px-6"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-forest">
        {t("ledgerJob")}
      </p>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
        <span className="font-display text-[44px] font-light leading-none tracking-[-0.01em] text-ink sm:text-[52px]">
          $7,433
        </span>
        <span className="font-heading text-[15px] font-semibold text-ink-soft">
          {t("ledgerLeft")}
        </span>
      </p>

      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        {t("ledgerOf", { total: "$23,000", pct: "68%" })}
      </p>

      <dl className="mt-4 space-y-1.5 border-t border-ink/10 pt-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4">
            <dt className="text-[13px] text-ink-soft">{label}</dt>
            <dd className="font-mono text-[13px] tabular-nums text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 border-t border-ink/10 pt-4 font-display text-[16px] font-light italic leading-snug text-ink">
        {t("ledgerPunch")}
      </p>
    </motion.div>
  );
}
