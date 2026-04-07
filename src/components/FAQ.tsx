"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const QUESTIONS = [
  {
    q: "Does it work without internet?",
    a: "Yes. Stroyka is offline-first — all data is stored locally on each device and syncs automatically when a connection is restored. Workers in basements, rural areas, or anywhere with poor signal can still log time, submit requests, and view tasks.",
  },
  {
    q: "How do workers join?",
    a: "The boss sends email invites directly from the app. Workers click the link, create a password, and they're in. No app store download required for web — it runs in the browser on any phone.",
  },
  {
    q: "What happens if a worker leaves?",
    a: "You can deactivate a worker's account instantly from the app. They immediately lose access. Their historical timesheet and cost data stays in your account.",
  },
  {
    q: "Is my data secure?",
    a: "Stroyka runs on Supabase (enterprise-grade PostgreSQL) with row-level security — meaning your company's data is completely isolated from other companies at the database level. We don't share or sell your data. See our Privacy Policy for full details.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Every project, timesheet, and cost record can be exported as CSV or PDF at any time. If you ever cancel, you have 30 days to export everything.",
  },
  {
    q: "Why not just use enterprise construction software?",
    a: "Most construction platforms are designed for large general contractors with dedicated office staff and IT teams. They cost $500–$1,000+/month, take weeks to onboard, and charge per seat. Stroyka is purpose-built for small crews of 5–25 workers — the people who actually swing hammers. Flat pricing, no per-seat fees, no training required. Your crew can be up and running the same day.",
  },
  {
    q: "Is there a free trial?",
    a: "We're currently offering personalized demos for early customers. Request a demo and we'll walk you through the app live with your own sample data.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: typeof QUESTIONS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-brand-deep">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-5 text-left cursor-pointer group"
      >
        <span className={`font-heading font-semibold text-base transition-colors duration-200 ${isOpen ? "text-brand-sage" : "text-white group-hover:text-white"}`}>
          {item.q}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-brand-sage flex-shrink-0 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-brand-sage-mist/70 text-sm leading-relaxed pb-5">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>FAQ</SectionLabel>
          </FadeIn>
          <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
            Common questions
          </TextReveal>
        </div>
        <FadeIn>
          <div>
            {QUESTIONS.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
