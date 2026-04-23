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
  { label: "Flat monthly pricing", spreadsheets: "yes", enterprise: "no", stroyka: "yes", note: "$0 / $149 / $249. No per-worker fees." },
  { label: "Setup in under an afternoon", spreadsheets: "yes", enterprise: "no", stroyka: "yes" },
  { label: "No training required", spreadsheets: "yes", enterprise: "no", stroyka: "yes" },
  { label: "Export to QuickBooks / Xero", spreadsheets: "partial", enterprise: "yes", stroyka: "yes", note: "CSV + PDF now, direct integrations on the roadmap." },
  { label: "Real-time job costing", spreadsheets: "no", enterprise: "yes", stroyka: "yes" },
  { label: "Approval workflows + audit trail", spreadsheets: "no", enterprise: "yes", stroyka: "yes" },
  { label: "Works offline at the jobsite", spreadsheets: "no", enterprise: "partial", stroyka: "yes" },
  { label: "Crew-facing mobile app", spreadsheets: "no", enterprise: "partial", stroyka: "yes" },
];

function Cell({ value, highlight }: { value: CellValue; highlight: boolean }) {
  if (value === "yes") {
    // Both highlighted (Stroyka) and un-highlighted "Yes" use the same sage
    // brand color — a tinted sage circle with a filled sage variant for
    // the Stroyka column so it still visually bloo­ms.
    const cls = highlight
      ? "bg-brand-deep text-bone border-brand-deep shadow-[0_0_22px_-2px_rgba(52,69,58,0.5)]"
      : "bg-brand-sage/15 text-brand-deep border-brand-sage/60";
    return (
      <span className={`flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] ${cls}`}>
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] border-ink-muted/45 bg-ink-muted/10 text-ink-muted" title="Partial">
        <Minus size={14} strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-9 h-9 rounded-full border border-ink/15 text-ink/40">
      <X size={14} strokeWidth={2.5} />
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
            <p className="text-lg text-ink/70 leading-relaxed max-w-xl">
              Honest comparison. If you&rsquo;re a 50+ person GC with a dedicated back-office team, enterprise tools are still the right call. If you&rsquo;re a 5–25 crew trying to stop texting timesheets, keep reading.
            </p>
          </FadeIn>
        </div>

        {/* Table */}
        <FadeIn delay={0.15}>
          <div className="card-stone relative rounded-3xl border border-ink/15 backdrop-blur-sm overflow-hidden">
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
                    What matters
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mt-0.5">
                    on the jobsite
                  </div>
                </div>
              </div>
              {COLS.map((col) => {
                const isStroyka = col.key === "stroyka";
                return (
                  <div key={col.key} className="text-center relative">
                    <div
                      className={`font-display leading-tight ${
                        isStroyka ? "text-ink text-xl" : "text-ink/80 text-[15px]"
                      }`}
                    >
                      {col.label}
                    </div>
                    <div
                      className={`mt-1 font-mono text-[10px] tracking-[0.15em] uppercase ${
                        isStroyka ? "text-brand-forest" : "text-ink/40"
                      }`}
                    >
                      {col.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            <div className="relative divide-y divide-ink/10">
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
                  className="grid grid-cols-[1.6fr_repeat(3,1fr)] gap-2 px-4 md:px-8 py-4 items-center hover:bg-ink/[0.03] transition-colors"
                >
                  <div>
                    <p className="text-[15px] text-ink font-medium leading-snug">
                      {row.label}
                    </p>
                    {row.note && (
                      <p className="mt-1 font-mono text-[11px] tracking-[0.05em] text-ink/50 leading-snug">
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
          <div className="mt-8 flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-[0.15em] uppercase text-ink/55">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-brand-sage/15 text-brand-deep border-[1.5px] border-brand-sage/60 flex items-center justify-center">
                <Check size={10} strokeWidth={3} />
              </span>
              Yes
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-[1.5px] border-ink-muted/45 bg-ink-muted/10 text-ink-muted flex items-center justify-center">
                <Minus size={10} strokeWidth={3} />
              </span>
              Partial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-ink/20 text-ink/40 flex items-center justify-center">
                <X size={10} strokeWidth={2.5} />
              </span>
              No
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
