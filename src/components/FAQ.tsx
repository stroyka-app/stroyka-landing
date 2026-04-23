"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { WifiOff, Rocket, UserCog, Lock, Database, Scale, Tag } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";

interface FaqItem {
  q: string;
  a: string;
  meta: string;
}

const QUESTIONS: FaqItem[] = [
  {
    q: "Does it work without internet?",
    a: "Yes. Stroyka is offline-first — all data is stored locally on each device and syncs automatically when a connection is restored. Workers in basements, rural areas, or anywhere with poor signal can still log time, submit requests, and view tasks.",
    meta: "Offline",
  },
  {
    q: "How do workers join?",
    a: "The boss sends email invites directly from the app. Workers click the link, create a password, and they're in. No app store download required for web — it runs in the browser on any phone.",
    meta: "Setup",
  },
  {
    q: "What happens if a worker leaves?",
    a: "You can deactivate a worker's account instantly from the app. They immediately lose access. Their historical timesheet and cost data stays in your account.",
    meta: "Admin",
  },
  {
    q: "Is my data secure?",
    a: "Your company's data is siloed from every other company's data at the database level — we don't mingle it, don't share it, don't sell it. Encrypted at rest and in transit, hosted on battle-tested infrastructure. See our Privacy Policy for the specifics.",
    meta: "Security",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Every project, timesheet, and cost record can be exported as CSV or PDF at any time. If you ever cancel, you have 30 days to export everything.",
    meta: "Data",
  },
  {
    q: "Why not just use enterprise construction software?",
    a: "Most construction platforms are designed for large general contractors with dedicated office staff and IT teams. They cost $500–$1,000+/month, take weeks to onboard, and charge per seat. Stroyka is purpose-built for small crews of 5–25 workers — the people who actually swing hammers. Flat pricing, no per-seat fees, no training required. Your crew can be up and running the same day.",
    meta: "Comparison",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — start free for up to 5 workers, forever. Need more? Claim a founding spot at $99/mo locked for life, or book a 20-minute demo and we'll walk you through the app live with your own sample data.",
    meta: "Pricing",
  },
];

type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
function metaIcon(meta: string): IconType {
  switch (meta) {
    case "Offline":    return WifiOff;
    case "Setup":      return Rocket;
    case "Admin":      return UserCog;
    case "Security":   return Lock;
    case "Data":       return Database;
    case "Comparison": return Scale;
    case "Pricing":    return Tag;
    default:           return Tag;
  }
}

function FAQItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  const glow = useCursorGlow();
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-trigger-${index}`;
  const Icon = metaIcon(item.meta);
  const isPricing = item.meta === "Pricing";

  return (
    <li
      {...glow}
      className={`group cursor-glow relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen
          ? "card-stone border-ink/60"
          : "card-stone border-ink/15 hover:border-ink/35 opacity-90 hover:opacity-100"
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="relative flex w-full items-start gap-5 px-6 py-6 md:px-8 md:py-7 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sage/40"
      >
        <span
          className={`relative flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
            isOpen
              ? "bg-ink text-bone border-ink shadow-[0_0_22px_-4px_rgba(46,38,28,0.6)]"
              : "bg-bone-soft text-ink-muted border-ink/25 group-hover:border-ink/45 group-hover:text-ink"
          }`}
        >
          {isOpen && !prefersReduced && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full border border-brand-sage-bright/55 animate-ping"
            />
          )}
          <Icon size={16} strokeWidth={1.8} />
        </span>

        <div className="flex flex-1 flex-col gap-3 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
            <h3
              className={`font-display text-[22px] md:text-[26px] leading-snug transition-colors duration-300 ${
                isOpen ? "text-ink" : "text-ink"
              }`}
            >
              {item.q}
            </h3>
            <span
              className={`inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] sm:ml-auto shrink-0 transition-colors duration-300 ${
                isPricing
                  ? "text-brand-forest"
                  : isOpen
                    ? "text-brand-sage"
                    : "text-ink-muted"
              }`}
            >
              {item.meta}
            </span>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={prefersReduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "height, opacity" }}
                className="overflow-hidden"
              >
                <p className="pr-2 pt-1 text-[15px] leading-[1.65] text-ink/75 max-w-2xl">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 text-ink/50 mt-1.5 hidden sm:block"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>
    </li>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-gradient-to-b from-[#A89E85] to-[#BFB49C] py-24 lg:py-32 overflow-hidden">
      {/* Ambient sage vignette top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-[50vw] h-[50vw] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 10% 10%, rgba(184, 212, 189, 0.28), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <FadeIn>
            <SectionLabel>FAQ</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            Straight answers. No runaround.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink/70 leading-relaxed max-w-xl">
              Everything you need to know before bringing Stroyka onto a jobsite — the questions real crews actually ask.
            </p>
          </FadeIn>
        </div>

        <FadeIn>
          <ul className="flex flex-col gap-3">
            {QUESTIONS.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
