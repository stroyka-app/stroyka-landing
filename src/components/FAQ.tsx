"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { WifiOff, Rocket, UserCog, Lock, Database, Scale, Tag } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

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

// Category pills stay inside Stroyka's earth-tone palette. Categories that share
// meaning cluster share a tone; a single amber pill (Pricing) is the only "hot"
// colour so it doubles as a pull toward conversion. Icons handle per-category
// differentiation inside each cluster — not colour.
type PillCluster = "trust" | "ops" | "money";

function metaCluster(meta: string): PillCluster {
  switch (meta) {
    case "Offline":
    case "Security":
    case "Data":
      return "trust";
    case "Setup":
    case "Admin":
    case "Comparison":
      return "ops";
    case "Pricing":
      return "money";
    default:
      return "trust";
  }
}

function clusterStyle(cluster: PillCluster): string {
  switch (cluster) {
    case "trust":
      // Sage — reliability cluster
      return "bg-brand-sage/18 border-brand-sage/65 text-brand-sage shadow-[0_0_22px_-6px_rgba(132,169,140,0.55),inset_0_1px_0_0_rgba(202,210,197,0.25)]";
    case "ops":
      // Forest — operations/decisions cluster
      return "bg-brand-forest/30 border-brand-forest/70 text-brand-sage-mist shadow-[0_0_22px_-6px_rgba(82,121,111,0.55),inset_0_1px_0_0_rgba(132,169,140,0.28)]";
    case "money":
      // Amber — the only hot colour, reserved for Pricing
      return "bg-brand-amber/20 border-brand-amber/65 text-brand-amber-bright shadow-[0_0_22px_-6px_rgba(217,119,6,0.60),inset_0_1px_0_0_rgba(245,158,11,0.30)]";
  }
}

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
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-trigger-${index}`;

  const setCardGlow = (e: React.MouseEvent<HTMLLIElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--faq-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--faq-y", `${e.clientY - rect.top}px`);
  };

  const clearCardGlow = (e: React.MouseEvent<HTMLLIElement>) => {
    e.currentTarget.style.removeProperty("--faq-x");
    e.currentTarget.style.removeProperty("--faq-y");
  };

  return (
    <li
      onMouseMove={setCardGlow}
      onMouseLeave={clearCardGlow}
      className="group relative overflow-hidden rounded-3xl border border-brand-forest/15 bg-brand-deep/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-forest/30 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
    >
      {/* Cursor glow */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), rgba(82,121,111,0.18), transparent 70%)",
        }}
      />

      <button
        type="button"
        id={buttonId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="relative flex w-full items-start gap-5 px-6 py-6 md:px-8 md:py-7 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-forest/50"
      >
        {/* Icon circle */}
        <span className="relative flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full border border-brand-forest/30 bg-brand-forest/5 transition-all duration-500 group-hover:scale-105 group-hover:border-brand-forest/50">
          <span
            className={`pointer-events-none absolute inset-0 rounded-full border border-brand-forest/40 opacity-40 ${
              isOpen && !prefersReduced ? "animate-ping" : ""
            }`}
          />
          <motion.svg
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-5 w-5 text-brand-sage"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5v14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M5 12h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.svg>
        </span>

        <div className="flex flex-1 flex-col gap-3 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h3
              className={`text-base md:text-lg font-heading font-semibold leading-snug transition-colors duration-300 ${
                isOpen ? "text-brand-sage" : "text-white"
              }`}
            >
              {item.q}
            </h3>
            {(() => {
              const Icon = metaIcon(item.meta);
              return (
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border-[1.5px] px-3 py-1 text-[10px] font-heading font-semibold uppercase tracking-[0.22em] transition-shadow duration-300 sm:ml-auto shrink-0 ${clusterStyle(metaCluster(item.meta))}`}
                >
                  <Icon
                    size={11}
                    strokeWidth={2.2}
                    aria-hidden="true"
                    className="opacity-85"
                  />
                  {item.meta}
                </span>
              );
            })()}
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
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pr-2 pt-1 text-sm md:text-[15px] leading-relaxed text-brand-sage-mist/75">
                  {item.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </li>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-24 relative overflow-hidden">
      {/* Subtle aurora backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 15% 10%, rgba(82,121,111,0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>FAQ</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl md:text-5xl font-heading font-bold leading-tight text-white mb-4"
          >
            Straight answers. No runaround.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/70 max-w-xl mx-auto">
              Everything you need to know before bringing Stroyka onto a
              jobsite — the questions real crews actually ask.
            </p>
          </FadeIn>
        </div>

        {/* FAQ list */}
        <FadeIn>
          <ul className="flex flex-col gap-4">
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
