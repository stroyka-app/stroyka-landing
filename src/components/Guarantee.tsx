"use client";

import { motion } from "framer-motion";
import { Infinity as InfinityIcon, Download, XCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface Promise {
  icon: typeof InfinityIcon;
  title: string;
  body: string;
}

/**
 * Risk-reversal block. We don't offer a money-back guarantee because the
 * Free tier is the real "try before you pay" — download the app, use it with
 * up to 5 workers forever, upgrade only if you want the paid capabilities.
 */
const PROMISES: Promise[] = [
  {
    icon: InfinityIcon,
    title: "Free forever for crews up to 5",
    body: "Download the app and use it with up to 5 workers as long as you want. No trial timer, no credit card, no nagging upgrade modals.",
  },
  {
    icon: Download,
    title: "Free data import",
    body: "Send us your current spreadsheets or a CSV export from whatever you're using. We'll get your first job in the app for you — on us.",
  },
  {
    icon: XCircle,
    title: "Cancel anytime",
    body: "Paid plans are month-to-month, no contracts. Export every record as CSV or PDF before you go. 30-day grace window on your data.",
  },
];

export default function Guarantee() {
  return (
    <section id="guarantee" className="relative py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header — gives the risk-reversal trio the same weight as every
            other section so it doesn't read as trailing filler under pricing. */}
        <div className="max-w-2xl mb-12 lg:mb-14">
          <FadeIn>
            <SectionLabel>Zero surprises</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            The fine print, in plain English.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75">
              No trial clock. No credit card to try it. No lock-in if you
              decide it&rsquo;s not for you.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PROMISES.map((promise, i) => {
            const Icon = promise.icon;
            return (
              <FadeIn key={promise.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex flex-col p-7 lg:p-8 rounded-2xl border border-brand-forest/20 bg-brand-deep/35 backdrop-blur-sm"
                >
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-forest/15 border border-brand-forest/30 flex items-center justify-center text-brand-sage mb-5">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="font-heading font-semibold text-white text-[17px] leading-snug mb-2.5">
                    {promise.title}
                  </h3>
                  <p className="text-[14px] text-brand-sage-mist/70 leading-relaxed">
                    {promise.body}
                  </p>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
