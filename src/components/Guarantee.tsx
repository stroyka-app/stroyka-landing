"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Infinity as InfinityIcon, Download, XCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";

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

function PromiseCard({ promise }: { promise: Promise }) {
  const ref = useRef<HTMLDivElement>(null);
  const glow = useCursorGlow();
  const prefersReduced = useReducedMotion();
  const Icon = promise.icon;

  // 3D parallax tilt — subtle (max ~6deg) so it reads as depth, not gimmick
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 200, damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200, damping: 20,
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
      className="cursor-glow h-full flex flex-col p-8 rounded-sm border border-ink/15 bg-bone-soft/60 backdrop-blur-sm hover:border-brand-sage/30 transition-colors duration-500"
    >
      <span className="relative flex-shrink-0 w-12 h-12 rounded-full bg-brand-sage-bright/10 border border-brand-sage-bright/35 text-brand-sage-bright flex items-center justify-center mb-6">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand-sage-bright/20 blur-md opacity-60"
        />
        <Icon size={18} strokeWidth={2} className="relative" />
      </span>
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
            <p className="text-lg text-ink/70 leading-relaxed max-w-xl">
              No trial clock. No credit card to try it. No lock-in if you decide it&rsquo;s not for you.
            </p>
          </FadeIn>
        </div>

        <div
          className="grid md:grid-cols-3 gap-5 max-w-5xl"
          style={{ perspective: "1200px" }}
        >
          {PROMISES.map((promise, i) => (
            <FadeIn key={promise.title} delay={i * 0.08}>
              <PromiseCard promise={promise} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
