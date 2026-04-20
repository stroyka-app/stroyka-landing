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

/**
 * Integrations — honest. We export CSV/PDF today; direct integrations are on
 * the roadmap. Do not claim "one-click sync with QuickBooks" until that ships.
 */
const TOOLS: Tool[] = [
  {
    name: "QuickBooks",
    caption: "CSV export today · direct sync on roadmap",
    icon: FileSpreadsheet,
    status: "soon",
  },
  {
    name: "Xero",
    caption: "CSV export today · direct sync on roadmap",
    icon: FileSpreadsheet,
    status: "soon",
  },
  {
    name: "Excel / Google Sheets",
    caption: "CSV export — every project, every timesheet",
    icon: FileText,
    status: "live",
  },
  {
    name: "Stripe",
    caption: "Your Stroyka subscription, billed through Stripe",
    icon: CreditCard,
    status: "live",
  },
  {
    name: "PDF reports",
    caption: "Timesheet, P&L, materials — one click",
    icon: FileText,
    status: "live",
  },
  {
    name: "Cloud backup",
    caption: "Encrypted backup on Supabase storage",
    icon: Cloud,
    status: "live",
  },
];

export default function Integrations() {
  return (
    <section id="integrations" className="relative py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <FadeIn>
            <SectionLabel>Plays well with others</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold leading-tight text-white">
              Send your numbers where they need to go.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 text-sm text-brand-sage-mist/65 max-w-lg mx-auto">
              CSV + PDF export today. Direct integrations shipping through
              2026 — email us if you want us to prioritize yours.
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
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative flex items-start gap-3 p-4 rounded-xl bg-brand-deep/40 border border-brand-forest/15 hover:border-brand-forest/30 transition-colors"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-forest/15 border border-brand-forest/20 flex items-center justify-center text-brand-sage">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-semibold text-white text-sm">
                        {tool.name}
                      </p>
                      {tool.status === "soon" && (
                        <span className="text-[9.5px] font-heading font-semibold uppercase tracking-[0.15em] text-brand-sage-mist/50 px-1.5 py-0.5 rounded bg-brand-midnight-dark/60 border border-brand-sage-mist/10">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[12px] text-brand-sage-mist/55 leading-snug">
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
