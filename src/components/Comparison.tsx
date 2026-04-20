"use client";

import { motion } from "framer-motion";
import { Check, X, Minus, HardHat } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

type CellValue = "yes" | "no" | "partial";

interface Row {
  label: string;
  spreadsheets: CellValue;
  enterprise: CellValue;
  stroyka: CellValue;
  note?: string;
}

const ROWS: Row[] = [
  {
    label: "Works offline at the jobsite",
    spreadsheets: "no",
    enterprise: "partial",
    stroyka: "yes",
  },
  {
    label: "Flat monthly pricing",
    spreadsheets: "yes",
    enterprise: "no",
    stroyka: "yes",
    note: "$0 / $149 / $249. No per-worker fees.",
  },
  {
    label: "Setup in under an afternoon",
    spreadsheets: "yes",
    enterprise: "no",
    stroyka: "yes",
  },
  {
    label: "Real-time job costing",
    spreadsheets: "no",
    enterprise: "yes",
    stroyka: "yes",
  },
  {
    label: "Crew-facing mobile app",
    spreadsheets: "no",
    enterprise: "partial",
    stroyka: "yes",
  },
  {
    label: "No training required",
    spreadsheets: "yes",
    enterprise: "no",
    stroyka: "yes",
  },
  {
    label: "Approval workflows + audit trail",
    spreadsheets: "no",
    enterprise: "yes",
    stroyka: "yes",
  },
  {
    label: "Export to QuickBooks / Xero",
    spreadsheets: "partial",
    enterprise: "yes",
    stroyka: "yes",
    note: "CSV + PDF now, direct integrations on the roadmap.",
  },
];

function Cell({ value, highlight }: { value: CellValue; highlight: boolean }) {
  const base =
    "flex items-center justify-center w-8 h-8 rounded-full border transition-colors";
  if (value === "yes") {
    return (
      <span
        className={`${base} ${
          highlight
            ? "bg-brand-forest/25 border-brand-sage/50 text-brand-sage"
            : "bg-brand-forest/10 border-brand-forest/30 text-brand-sage/70"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        className={`${base} bg-amber-500/10 border-amber-500/30 text-amber-400/80`}
        title="Partial"
      >
        <Minus size={14} strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-red-950/20 border-red-400/20 text-red-300/60`}
    >
      <X size={14} strokeWidth={3} />
    </span>
  );
}

const COLS = [
  { key: "spreadsheets", label: "Spreadsheets + WhatsApp", sub: "The default" },
  {
    key: "enterprise",
    label: "Enterprise software",
    sub: "For 50+ person GCs",
  },
  { key: "stroyka", label: "Stroyka", sub: "For crews of 5–25" },
] as const;

export default function Comparison() {
  return (
    <section id="comparison" className="relative py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <FadeIn>
            <SectionLabel>The alternatives</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            Where Stroyka lands.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75 max-w-xl mx-auto">
              Honest comparison. If you&rsquo;re a 50+ person GC with a
              dedicated back-office team, enterprise tools are still the right
              call. If you&rsquo;re a 5–25 crew trying to stop texting
              timesheets, keep reading.
            </p>
          </FadeIn>
        </div>

        {/* Table */}
        <FadeIn delay={0.15}>
          <div className="relative rounded-3xl border border-brand-forest/15 bg-brand-deep/30 backdrop-blur-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] gap-2 px-4 md:px-8 py-5 border-b border-brand-forest/15 bg-brand-midnight/50">
              {/* Top-left corner — small label with icon so the cell doesn't read empty */}
              <div className="flex items-center gap-2.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-forest/15 border border-brand-forest/25 flex items-center justify-center text-brand-sage">
                  <HardHat size={16} strokeWidth={1.8} />
                </span>
                <div className="hidden sm:block">
                  <div className="font-heading font-semibold text-sm text-brand-sage-mist/85 leading-tight">
                    What matters
                  </div>
                  <div className="text-[11px] text-brand-sage-mist/45 mt-0.5">
                    on the jobsite
                  </div>
                </div>
              </div>
              {COLS.map((col) => {
                const isStroyka = col.key === "stroyka";
                return (
                  <div
                    key={col.key}
                    className={`text-center ${
                      isStroyka ? "relative" : ""
                    }`}
                  >
                    {isStroyka && (
                      <span
                        aria-hidden
                        className="absolute inset-x-2 -top-1 bottom-0 rounded-2xl bg-brand-forest/10 border border-brand-forest/30 -z-0"
                      />
                    )}
                    <div
                      className={`relative z-[1] font-heading font-semibold leading-tight ${
                        isStroyka
                          ? "text-brand-sage text-base md:text-lg"
                          : "text-brand-sage-mist/85 text-sm md:text-base"
                      }`}
                    >
                      {col.label}
                    </div>
                    <div
                      className={`relative z-[1] mt-1 text-[11px] md:text-xs font-medium ${
                        isStroyka
                          ? "text-brand-sage/70"
                          : "text-brand-sage-mist/45"
                      }`}
                    >
                      {col.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            <div className="divide-y divide-brand-forest/10">
              {ROWS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="grid grid-cols-[1.5fr_repeat(3,1fr)] gap-2 px-4 md:px-8 py-4 items-center hover:bg-brand-forest/5 transition-colors"
                >
                  <div>
                    <p className="text-[14px] md:text-[15px] text-brand-sage-mist/85 font-medium leading-snug">
                      {row.label}
                    </p>
                    {row.note && (
                      <p className="mt-1 text-[11.5px] text-brand-sage-mist/45 leading-snug">
                        {row.note}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Cell value={row.spreadsheets} highlight={false} />
                  </div>
                  <div className="flex justify-center">
                    <Cell value={row.enterprise} highlight={false} />
                  </div>
                  <div className="flex justify-center">
                    <Cell value={row.stroyka} highlight />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Legend */}
        <FadeIn delay={0.25}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[12.5px] text-brand-sage-mist/55">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-brand-forest/15 border border-brand-forest/30 flex items-center justify-center text-brand-sage">
                <Check size={10} strokeWidth={3} />
              </span>
              Yes
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Minus size={10} strokeWidth={3} />
              </span>
              Partial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-950/20 border border-red-400/20 flex items-center justify-center text-red-300/70">
                <X size={10} strokeWidth={3} />
              </span>
              No
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
