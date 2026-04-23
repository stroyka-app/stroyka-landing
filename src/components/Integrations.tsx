"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, FileText, CreditCard, Cloud } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

interface Tool {
  name: string;
  caption: string;
  icon: typeof FileSpreadsheet;
  status: "live" | "soon";
}

const TOOLS: Tool[] = [
  { name: "QuickBooks",          caption: "CSV export today · direct sync on roadmap", icon: FileSpreadsheet, status: "soon" },
  { name: "Xero",                caption: "CSV export today · direct sync on roadmap", icon: FileSpreadsheet, status: "soon" },
  { name: "Excel / Google Sheets", caption: "CSV export — every project, every timesheet", icon: FileText, status: "live" },
  { name: "Stripe",              caption: "Your Stroyka subscription, billed through Stripe", icon: CreditCard, status: "live" },
  { name: "PDF reports",         caption: "Timesheet, P&L, materials — one click", icon: FileText, status: "live" },
  { name: "Cloud backup",        caption: "Encrypted backup on Supabase storage", icon: Cloud, status: "live" },
];

export default function Integrations() {
  return (
    <section id="integrations" className="relative bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <FadeIn>
            <SectionLabel>Plays well with others</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-4">
              Send your numbers where they need to go.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-[15px] text-ink-soft max-w-lg leading-relaxed">
              CSV and PDF export today. Native integrations rolling out in 2026 — email us to move yours up the list.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOOLS.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative flex items-start gap-3 p-5 rounded-sm bg-bone-soft border border-ink/15 hover:border-ink/30 transition-colors"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-ink text-bone flex items-center justify-center">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[17px] leading-tight text-ink">
                        {tool.name}
                      </p>
                      {tool.status === "soon" && (
                        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.15em] text-clay px-1.5 py-0.5 rounded bg-clay/10 border border-clay/30">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.05em] text-ink-muted leading-snug">
                      {tool.caption}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
