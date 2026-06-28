"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X, Minus, HardHat } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";

type CellValue = "yes" | "no" | "partial";

interface RowCells {
  spreadsheets: CellValue;
  enterprise: CellValue;
  stroyka: CellValue;
  hasNote: boolean;
}

// Structural data only — translatable text lives in messages/comparison.*
const ROW_CELLS: RowCells[] = [
  { spreadsheets: "yes",     enterprise: "no",      stroyka: "yes", hasNote: true  },
  { spreadsheets: "yes",     enterprise: "no",      stroyka: "yes", hasNote: false },
  { spreadsheets: "yes",     enterprise: "no",      stroyka: "yes", hasNote: false },
  { spreadsheets: "partial", enterprise: "yes",     stroyka: "yes", hasNote: true  },
  { spreadsheets: "no",      enterprise: "yes",     stroyka: "yes", hasNote: false },
  { spreadsheets: "no",      enterprise: "yes",     stroyka: "yes", hasNote: false },
  { spreadsheets: "no",      enterprise: "partial", stroyka: "yes", hasNote: false },
  { spreadsheets: "no",      enterprise: "partial", stroyka: "yes", hasNote: false },
];

// Column keys in display order — "yes"/"partial"/"no" enum values stay in TS
const COL_KEYS = ["spreadsheets", "enterprise", "stroyka"] as const;

function Cell({
  value,
  highlight,
  delay = 0,
}: {
  value: CellValue;
  highlight: boolean;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (value === "yes") {
    // Both highlighted (Stroyka) and un-highlighted "Yes" use the same sage
    // brand color — a tinted sage circle with a filled sage variant for
    // the Stroyka column so it still visually blooms.
    const cls = highlight
      ? "bg-brand-deep text-bone border-brand-deep shadow-[0_0_22px_-2px_rgba(52,69,58,0.5)]"
      : "bg-brand-sage/15 text-brand-deep border-brand-sage/60";

    return (
      <motion.span
        className={`relative flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] ${cls}`}
        initial={prefersReduced ? false : { scale: 0.6, opacity: 0 }}
        whileInView={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          delay,
          type: "spring",
          stiffness: 380,
          damping: 16,
        }}
      >
        {/* Stroyka column gets a one-shot sage ring pulse on land */}
        {highlight && !prefersReduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-brand-sage-bright/70"
            initial={{ scale: 1, opacity: 0 }}
            whileInView={{ scale: [1, 1.7], opacity: [0.7, 0] }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: delay + 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={prefersReduced ? false : { pathLength: 0 }}
            whileInView={prefersReduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: delay + 0.05, duration: 0.4, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.span>
    );
  }
  if (value === "partial") {
    return (
      <motion.span
        className="flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] border-ink-muted/45 bg-ink-muted/10 text-ink-muted"
        title="Partial"
        initial={prefersReduced ? false : { scale: 0.7, opacity: 0 }}
        whileInView={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay, type: "spring", stiffness: 380, damping: 18 }}
      >
        <Minus size={14} strokeWidth={3} />
      </motion.span>
    );
  }
  return (
    <motion.span
      className="flex items-center justify-center w-9 h-9 rounded-full border border-ink/15 text-ink/40"
      initial={prefersReduced ? false : { scale: 0.7, opacity: 0 }}
      whileInView={prefersReduced ? undefined : { scale: 1, opacity: 0.85 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <X size={14} strokeWidth={2.5} />
    </motion.span>
  );
}

export default function Comparison() {
  const t = useTranslations("comparison");

  return (
    <section id="comparison" className="relative bg-gradient-to-b from-[#BFB49C] to-[#D4CBB4] py-24 lg:py-32 overflow-hidden">
      {/* Ambient sage glow behind the Stroyka column */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-[8%] w-[40vw] h-[40vw] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 45% 50% at 50% 50%, rgba(184, 212, 189, 0.24), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
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

        {/* Table — desktop / tablet (≥md) */}
        <FadeIn delay={0.15}>
          <div className="hidden md:block card-stone relative rounded-3xl border border-ink/15 backdrop-blur-sm overflow-hidden">
            {/* Sage "Stroyka" column bloom — sits behind the cells */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 bottom-0 right-0 w-[calc(25%-4px)] bg-[linear-gradient(180deg,rgba(138,170,145,0.1)_0%,rgba(61,88,67,0.05)_100%)]"
            />

            {/* Column headers */}
            <div className="relative grid grid-cols-[1.6fr_repeat(3,1fr)] gap-2 px-4 md:px-8 py-5 border-b border-ink/15">
              <div className="flex items-center gap-2.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-ink/10 border border-ink/20 flex items-center justify-center text-ink/60">
                  <HardHat size={15} strokeWidth={1.8} />
                </span>
                <div className="hidden sm:block">
                  <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink/70 leading-tight">
                    {t("whatMatters")}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mt-0.5">
                    {t("onJobsite")}
                  </div>
                </div>
              </div>
              {COL_KEYS.map((key, colIdx) => {
                const isStroyka = key === "stroyka";
                return (
                  <div key={key} className="text-center relative">
                    <div
                      className={`font-display leading-tight ${
                        isStroyka ? "text-ink text-xl" : "text-ink/80 text-[15px]"
                      }`}
                    >
                      {t(`cols.${colIdx}.name`)}
                    </div>
                    <div
                      className={`mt-1 font-mono text-[10px] tracking-[0.15em] uppercase ${
                        isStroyka ? "text-brand-forest" : "text-ink/40"
                      }`}
                    >
                      {t(`cols.${colIdx}.sub`)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            <div className="relative divide-y divide-ink/10">
              {ROW_CELLS.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="grid grid-cols-[1.6fr_repeat(3,1fr)] gap-2 px-4 md:px-8 py-4 items-center hover:bg-ink/[0.03] transition-colors"
                >
                  <div>
                    <p className="text-[15px] text-ink font-medium leading-snug">
                      {t(`rows.${i}.label`)}
                    </p>
                    {row.hasNote && (
                      <p className="mt-1 font-mono text-[11px] tracking-[0.05em] text-ink/50 leading-snug">
                        {t(`rows.${i}.note`)}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Cell value={row.spreadsheets} highlight={false} delay={i * 0.04 + 0.05} />
                  </div>
                  <div className="flex justify-center">
                    <Cell value={row.enterprise} highlight={false} delay={i * 0.04 + 0.1} />
                  </div>
                  <div className="flex justify-center">
                    <Cell value={row.stroyka} highlight delay={i * 0.04 + 0.18} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Mobile (<md) — stacked card per row, columns travel with the data */}
        <FadeIn delay={0.15}>
          <div className="md:hidden flex flex-col gap-3">
            {ROW_CELLS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="card-stone relative rounded-2xl border border-ink/15 backdrop-blur-sm px-4 py-4 overflow-hidden"
              >
                <div className="relative">
                  <p className="text-[15px] text-ink font-medium leading-snug">
                    {t(`rows.${i}.label`)}
                  </p>
                  {row.hasNote && (
                    <p className="mt-1 font-mono text-[11px] tracking-[0.05em] text-ink/50 leading-snug">
                      {t(`rows.${i}.note`)}
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {COL_KEYS.map((key, colIdx) => {
                      const value = row[key];
                      const isStroyka = key === "stroyka";
                      return (
                        <div
                          key={key}
                          className={`flex flex-col items-center text-center gap-2 rounded-xl px-2 py-2.5 ${
                            isStroyka
                              ? "bg-brand-sage/10 border border-brand-sage/30"
                              : "bg-ink/[0.03] border border-ink/10"
                          }`}
                        >
                          <Cell
                            value={value}
                            highlight={isStroyka}
                            delay={i * 0.04 + 0.1}
                          />
                          <div
                            className={`font-mono text-[9px] tracking-[0.12em] uppercase leading-tight ${
                              isStroyka ? "text-brand-forest font-semibold" : "text-ink/55"
                            }`}
                          >
                            {t(`cols.${colIdx}.name`)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Legend */}
        <FadeIn delay={0.25}>
          <div className="mt-8 flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.15em] uppercase text-ink/55">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-brand-sage/15 text-brand-deep border-[1.5px] border-brand-sage/60 flex items-center justify-center">
                <Check size={10} strokeWidth={3} />
              </span>
              {t("legendYes")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-[1.5px] border-ink-muted/45 bg-ink-muted/10 text-ink-muted flex items-center justify-center">
                <Minus size={10} strokeWidth={3} />
              </span>
              {t("legendPartial")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-ink/20 text-ink/40 flex items-center justify-center">
                <X size={10} strokeWidth={2.5} />
              </span>
              {t("legendNo")}
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
