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
    <section id="guarantee" className="relative bg-bone-deep py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <FadeIn>
            <SectionLabel>Zero surprises</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            The fine print, in plain English.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
              No trial clock. No credit card to try it. No lock-in if you decide it&rsquo;s not for you.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl">
          {PROMISES.map((promise, i) => {
            const Icon = promise.icon;
            return (
              <FadeIn key={promise.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex flex-col p-8 rounded-sm border border-ink/15 bg-bone-soft"
                >
                  <span className="flex-shrink-0 w-11 h-11 rounded-full bg-ink text-bone flex items-center justify-center mb-6">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <h3 className="font-display text-[22px] leading-snug text-ink mb-3">
                    {promise.title}
                  </h3>
                  <p className="text-[14.5px] text-ink-soft leading-relaxed">
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
