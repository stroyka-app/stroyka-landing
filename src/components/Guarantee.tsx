"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
  useInView,
} from "framer-motion";
import { Download, XCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";

interface PromiseItem {
  // Each promise renders its own stamp icon — Infinity gets a bespoke
  // stroke-draw lemniscate so we can't share a single lucide component.
  iconKind: "infinity" | "download" | "cancel";
  title: string;
  body: string;
}

const PROMISES: PromiseItem[] = [
  {
    iconKind: "infinity",
    title: "Free forever for crews up to 5",
    body: "Download the app and use it with up to 5 workers as long as you want. No trial timer, no credit card, no nagging upgrade modals.",
  },
  {
    iconKind: "download",
    title: "Free data import",
    body: "Send us your current spreadsheets or a CSV export from whatever you're using. We'll get your first job in the app for you — on us.",
  },
  {
    iconKind: "cancel",
    title: "Cancel anytime",
    body: "Paid plans are month-to-month, no contracts. Export every record as CSV or PDF before you go. 30-day grace window on your data.",
  },
];

/**
 * Infinity — bespoke lemniscate path drawn in one continuous stroke when
 * the card enters view. Reinforces "no end."
 */
function InfinityStamp({ inView }: { inView: boolean }) {
  const prefersReduced = useReducedMotion();
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <motion.path
        // Single-stroke lemniscate — both lobes drawn from one starting point
        d="M 7 12 C 7 8 17 8 17 12 C 17 16 7 16 7 12 Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={prefersReduced ? false : { pathLength: 0 }}
        animate={
          prefersReduced
            ? { pathLength: 1 }
            : inView
              ? { pathLength: 1 }
              : { pathLength: 0 }
        }
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.55 }}
      />
    </svg>
  );
}

function PromiseCard({
  promise,
  index,
}: {
  promise: PromiseItem;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const glow = useCursorGlow();
  const prefersReduced = useReducedMotion();

  // 3D parallax tilt — dialed down from the v9 6deg to 3deg so the cards
  // read SOLID, not playful. These are promises.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), {
    stiffness: 220,
    damping: 22,
  });

  const onTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
    glow.onMouseMove(e);
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    mx.set(0);
    my.set(0);
    glow.onMouseLeave(e);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onTilt}
      onMouseLeave={onLeave}
      style={
        prefersReduced
          ? undefined
          : { rotateX, rotateY, transformStyle: "preserve-3d" }
      }
      className="card-stone cursor-glow h-full flex flex-col p-8 rounded-2xl border border-ink/15 backdrop-blur-sm hover:border-brand-sage/40 transition-colors duration-500"
    >
      {/* Stamp seal — circle slams down rotated, settles upright with a
          spring overshoot. Sage ring expands at land — reads as a rubber
          stamp hitting paper. */}
      <motion.span
        className="relative flex-shrink-0 w-12 h-12 rounded-full bg-brand-sage/15 border border-brand-sage/45 text-brand-forest flex items-center justify-center mb-6"
        initial={
          prefersReduced ? false : { scale: 0, rotate: -14, opacity: 0 }
        }
        animate={
          prefersReduced || !inView
            ? prefersReduced
              ? { scale: 1, rotate: 0, opacity: 1 }
              : undefined
            : { scale: 1, rotate: 0, opacity: 1 }
        }
        transition={{
          delay: index * 0.1,
          type: "spring",
          stiffness: 380,
          damping: 14,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand-sage-bright/25 blur-md opacity-60"
        />
        {/* Stamp-impact ring — fires AT land moment */}
        {!prefersReduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-brand-sage-bright/65"
            initial={{ scale: 1, opacity: 0 }}
            animate={
              inView ? { scale: [1, 1.85], opacity: [0.8, 0] } : undefined
            }
            transition={{
              delay: index * 0.1 + 0.35,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
        <span className="relative">
          {promise.iconKind === "infinity" && <InfinityStamp inView={inView} />}
          {promise.iconKind === "download" && (
            <Download size={18} strokeWidth={2} />
          )}
          {promise.iconKind === "cancel" && (
            <XCircle size={18} strokeWidth={2} />
          )}
        </span>
      </motion.span>
      <h3 className="font-display text-[22px] leading-snug text-ink mb-3">
        {promise.title}
      </h3>
      <p className="text-[14.5px] text-ink/70 leading-relaxed">
        {promise.body}
      </p>
    </motion.div>
  );
}

export default function Guarantee() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Horizontal sage thread under the three cards — draws as the section
  // scrolls into view, anchors the three promises as one continuous
  // commitment.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 30%"],
  });
  const threadDraw = useSpring(
    useTransform(scrollYProgress, [0.15, 0.7], [0, 1]),
    { stiffness: 90, damping: 28, mass: 0.5 },
  );

  return (
    <section
      ref={sectionRef}
      id="guarantee"
      className="relative bg-gradient-to-b from-[#BFB49C] to-[#A89E85] py-24 lg:py-32"
    >
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
            <p className="text-lg text-ink/70 leading-relaxed max-w-xl">
              No trial clock. No credit card to try it. No lock-in if you decide it&rsquo;s not for you.
            </p>
          </FadeIn>
        </div>

        <div className="relative max-w-5xl">
          <div
            className="grid md:grid-cols-3 gap-5"
            style={{ perspective: "1200px" }}
          >
            {PROMISES.map((promise, i) => (
              <FadeIn key={promise.title} delay={i * 0.08}>
                <PromiseCard promise={promise} index={i} />
              </FadeIn>
            ))}
          </div>

          {/* Horizontal sage thread — draws left→right with section scroll.
              Sits ~24px below the card row to read as a "they're all part
              of one promise" connector. */}
          {!prefersReduced && (
            <svg
              aria-hidden
              className="pointer-events-none absolute -bottom-4 left-0 right-0 w-full h-2"
              viewBox="0 0 1000 4"
              preserveAspectRatio="none"
            >
              <motion.line
                x1="2"
                y1="2"
                x2="998"
                y2="2"
                stroke="#8AAA91"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ pathLength: threadDraw, opacity: 0.55 }}
              />
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
