"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const PAIN_CARDS = [
  {
    icon: "💸",
    title: "Budget surprises",
    body: "You only know you went over budget after the project ends.",
    back: "Stroyka tracks every dollar in real time. You see budget vs. actual the moment a worker submits — not at month-end.",
    stat: "37%",
    statLabel: "of projects go over budget",
  },
  {
    icon: "📵",
    title: "No cell service, no updates",
    body: "Workers can\u2019t log time or submit requests when they\u2019re underground or in remote areas.",
    back: "Stroyka works offline. Everything syncs automatically when signal returns. Zero data loss, zero frustration.",
    stat: "4hrs",
    statLabel: "lost per worker per week",
  },
  {
    icon: "👔",
    title: "Tools built for enterprise",
    body: "Procore costs $500+/month and requires an onboarding team. You need something that works on day one.",
    back: "Stroyka is built for crews of 5\u201325. One flat price, no per-seat fees, works the day you sign up.",
    stat: "$500+",
    statLabel: "per month for enterprise tools",
  },
];

function FlipCard({
  card,
  index,
}: {
  card: (typeof PAIN_CARDS)[0];
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-[280px]"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-8 flex flex-col justify-between border border-brand-deep bg-gradient-to-br from-brand-deep/80 to-brand-midnight/80 backdrop-blur-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="w-14 h-14 rounded-xl bg-brand-forest/15 flex items-center justify-center text-3xl mb-5">
              {card.icon}
            </div>
            <h3 className="font-heading font-semibold text-lg mb-3">
              {card.title}
            </h3>
            <p className="text-brand-sage-mist/70 text-sm leading-relaxed">
              {card.body}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-heading font-bold text-brand-sage">
                {card.stat}
              </span>
              <p className="text-xs text-brand-sage-mist/40 mt-0.5">
                {card.statLabel}
              </p>
            </div>
            <span className="text-xs text-brand-forest/60 font-heading uppercase tracking-wider">
              Hover for fix →
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-8 flex flex-col justify-center border border-brand-forest/40 bg-gradient-to-br from-brand-forest/20 to-brand-deep/90 backdrop-blur-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-brand-forest/30 flex items-center justify-center text-lg mb-4">
            ✓
          </div>
          <h3 className="font-heading font-semibold text-lg mb-3 text-brand-sage">
            The Stroyka fix
          </h3>
          <p className="text-brand-sage-mist/80 text-sm leading-relaxed">
            {card.back}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Problem() {
  return (
    <section id="problem" className="py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <FadeIn>
          <SectionLabel>The Problem</SectionLabel>
        </FadeIn>
        <TextReveal
          as="h2"
          className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6"
        >
          Construction runs on chaos
        </TextReveal>
        <FadeIn delay={0.1}>
          <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-12">
            Your current system: a group chat for requests, a spreadsheet for
            budgets, a whiteboard for tasks, and hope that someone remembers to
            update it. When a worker buys materials, you find out at month-end.
            When a project goes over budget, you find out too late.
          </p>
        </FadeIn>
      </div>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        {PAIN_CARDS.map((card, i) => (
          <FlipCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}
