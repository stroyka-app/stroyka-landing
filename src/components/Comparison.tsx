"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
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
    label: "Flat monthly pricing",
    spreadsheets: "yes",
    enterprise: "no",
    stroyka: "yes",
    note: "$0 / $149 / $249. No per-worker fees.",
  },
  { label: "Setup in under an afternoon", spreadsheets: "yes", enterprise: "no",  stroyka: "yes" },
  { label: "No training required",        spreadsheets: "yes", enterprise: "no",  stroyka: "yes" },
  {
    label: "Export to QuickBooks / Xero",
    spreadsheets: "partial",
    enterprise: "yes",
    stroyka: "yes",
    note: "CSV + PDF now, direct integrations on the roadmap.",
  },
  { label: "Real-time job costing",              spreadsheets: "no", enterprise: "yes",     stroyka: "yes" },
  { label: "Approval workflows + audit trail",   spreadsheets: "no", enterprise: "yes",     stroyka: "yes" },
  { label: "Works offline at the jobsite",       spreadsheets: "no", enterprise: "partial", stroyka: "yes" },
  { label: "Crew-facing mobile app",             spreadsheets: "no", enterprise: "partial", stroyka: "yes" },
];

function Cell({ value, highlight }: { value: CellValue; highlight: boolean }) {
  if (value === "yes") {
    const cls = highlight
      ? "bg-ink text-bone border-ink"
      : "bg-transparent text-ink border-ink/30";
    return (
      <span className={`flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] ${cls}`}>
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] border-clay/50 text-clay" title="Partial">
        <Minus size={14} strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] border-ink/15 text-ink-muted/60">
      <X size={14} strokeWidth={3} />
    </span>
  );
}

const COLS = [
  { key: "spreadsheets", label: "Spreadsheets + WhatsApp", sub: "The default" },
  { key: "enterprise",   label: "Enterprise software",      sub: "For 50+ person GCs" },
  { key: "stroyka",      label: "Stroyka",                  sub: "For crews of 5–25" },
] as const;

export default function Comparison() {
  return (
    <section id="comparison" className="relative bg-bone py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <FadeIn>
            <SectionLabel>The alternatives</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            Where Stroyka lands.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
              Honest comparison. If you&rsquo;re a 50+ person GC with a dedicated back-office team, enterprise tools are still the right call. If you&rsquo;re a 5–25 crew trying to stop texting timesheets, keep reading.
            </p>
          </FadeIn>
        </div>

        {/* Table */}
        <FadeIn delay={0.15}>
          <div className="relative border border-ink/15 bg-bone-soft rounded-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] gap-2 px-6 md:px-8 py-5 border-b border-ink/15 bg-bone-deep/50">
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted self-center">
                What matters on the jobsite
              </div>
              {COLS.map((col) => {
                const isStroyka = col.key === "stroyka";
                return (
                  <div key={col.key} className="text-center">
                    <div className={`font-display leading-tight ${isStroyka ? "text-ink text-xl" : "text-ink-soft text-[15px]"}`}>
                      {col.label}
                    </div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.15em] uppercase text-ink-muted/80">
                      {col.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            <div className="divide-y divide-ink/10">
              {ROWS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="grid grid-cols-[1.6fr_repeat(3,1fr)] gap-2 px-6 md:px-8 py-4 items-center hover:bg-bone-deep/40 transition-colors"
                >
                  <div>
                    <p className="text-[15px] text-ink font-medium leading-snug">
                      {row.label}
                    </p>
                    {row.note && (
                      <p className="mt-1 font-mono text-[11px] tracking-[0.05em] text-ink-muted leading-snug">
                        {row.note}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center"><Cell value={row.spreadsheets} highlight={false} /></div>
                  <div className="flex justify-center"><Cell value={row.enterprise}   highlight={false} /></div>
                  <div className="flex justify-center"><Cell value={row.stroyka}      highlight /></div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Legend */}
        <FadeIn delay={0.25}>
          <div className="mt-8 flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.15em] uppercase text-ink-muted">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-ink text-bone flex items-center justify-center">
                <Check size={10} strokeWidth={3} />
              </span>
              Yes
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-[1.5px] border-clay/60 text-clay flex items-center justify-center">
                <Minus size={10} strokeWidth={3} />
              </span>
              Partial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-[1.5px] border-ink/20 text-ink-muted/70 flex items-center justify-center">
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
