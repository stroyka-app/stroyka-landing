"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";

const INTRO_STYLE_ID = "faq-signal-animations";

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
    a: "Stroyka runs on Supabase (enterprise-grade PostgreSQL) with row-level security — meaning your company's data is completely isolated from other companies at the database level. We don't share or sell your data. See our Privacy Policy for full details.",
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

function SignalPill({ ready }: { ready: boolean }) {
  return (
    <div
      className={`faq-signal-intro ${ready ? "faq-signal-intro--active" : ""}`}
    >
      <span className="faq-signal-intro__beam" aria-hidden="true" />
      <span className="faq-signal-intro__pulse" aria-hidden="true" />
      <span className="faq-signal-intro__label">Crew Q&amp;A</span>
      <span className="faq-signal-intro__meter" aria-hidden="true" />
      <span className="faq-signal-intro__tick" aria-hidden="true" />
    </div>
  );
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
            <span className="inline-flex w-fit items-center rounded-full border border-brand-forest/20 bg-brand-forest/5 px-2.5 py-0.5 text-[10px] font-heading font-semibold uppercase tracking-[0.25em] text-brand-sage-mist/60 sm:ml-auto shrink-0">
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
  const [introReady, setIntroReady] = useState(false);

  // Inject keyframes once on mount
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(INTRO_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes faq-signal-beam-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes faq-signal-pulse {
        0% { transform: scale(0.7); opacity: 0.55; }
        60% { opacity: 0.1; }
        100% { transform: scale(1.25); opacity: 0; }
      }
      @keyframes faq-signal-meter {
        0%, 20% { transform: scaleX(0); transform-origin: left; }
        45%, 60% { transform: scaleX(1); transform-origin: left; }
        80%, 100% { transform: scaleX(0); transform-origin: right; }
      }
      @keyframes faq-signal-tick {
        0%, 30% { transform: translateX(-6px); opacity: 0.4; }
        50% { transform: translateX(2px); opacity: 1; }
        100% { transform: translateX(20px); opacity: 0; }
      }
      .faq-signal-intro {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.65rem 1.25rem;
        border-radius: 9999px;
        overflow: hidden;
        border: 1px solid rgba(82, 121, 111, 0.3);
        background: rgba(53, 79, 82, 0.35);
        color: rgba(202, 210, 197, 0.85);
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 0.65rem;
        min-width: 18rem;
        max-width: 22rem;
        backdrop-filter: blur(12px);
        opacity: 0;
        transform: translate3d(0, 12px, 0);
        filter: blur(8px);
        transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
        isolation: isolate;
      }
      .faq-signal-intro--active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        filter: blur(0);
      }
      .faq-signal-intro__beam,
      .faq-signal-intro__pulse {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
      }
      .faq-signal-intro__beam {
        background: conic-gradient(from 160deg, rgba(132, 169, 140, 0.28), transparent 32%, rgba(82, 121, 111, 0.25) 58%, transparent 78%, rgba(132, 169, 140, 0.22));
        animation: faq-signal-beam-spin 18s linear infinite;
        opacity: 0.6;
      }
      .faq-signal-intro__pulse {
        border: 1px solid rgba(132, 169, 140, 0.5);
        opacity: 0.25;
        animation: faq-signal-pulse 3.4s ease-out infinite;
      }
      .faq-signal-intro__label {
        position: relative;
        z-index: 1;
        font-weight: 600;
        letter-spacing: 0.4em;
        white-space: nowrap;
      }
      .faq-signal-intro__meter {
        position: relative;
        z-index: 1;
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(132, 169, 140, 0.8) 35%, transparent 85%);
        transform: scaleX(0);
        transform-origin: left;
        animation: faq-signal-meter 5.8s ease-in-out infinite;
        opacity: 0.8;
      }
      .faq-signal-intro__tick {
        position: relative;
        z-index: 1;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 9999px;
        background: #84a98c;
        box-shadow: 0 0 0 4px rgba(132, 169, 140, 0.18);
        animation: faq-signal-tick 3.2s ease-in-out infinite;
        flex-shrink: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        .faq-signal-intro__beam,
        .faq-signal-intro__pulse,
        .faq-signal-intro__meter,
        .faq-signal-intro__tick {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
        {/* Signal pill */}
        <div className="flex justify-center mb-10">
          <SignalPill ready={introReady} />
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 mb-12 text-center md:text-left md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-xl mx-auto md:mx-0">
            <p className="text-xs font-heading font-semibold uppercase tracking-[0.35em] text-brand-sage-mist/50">
              Questions
            </p>
            <TextReveal
              as="h2"
              className="text-4xl md:text-5xl font-heading font-bold leading-tight text-white"
            >
              Straight answers. No runaround.
            </TextReveal>
            <p className="text-base text-brand-sage-mist/70">
              Everything you need to know before bringing Stroyka onto a
              jobsite — the questions real crews actually ask.
            </p>
          </div>
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
