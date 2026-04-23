"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

const FOUNDING_SPOTS_TOTAL = 20;
const FOUNDING_SPOTS_TAKEN = Number(
  process.env.NEXT_PUBLIC_FOUNDING_SPOTS_TAKEN ?? 6,
);
const FOUNDING_SPOTS_REMAINING = Math.max(
  0,
  FOUNDING_SPOTS_TOTAL - FOUNDING_SPOTS_TAKEN,
);

/**
 * Hero — continuous warm-stone gradient from deepest earth at the top
 * down to mid stone at the bottom (where it will seamlessly meet the
 * next section's top color). Video sits inside at reduced opacity with
 * NORMAL blending (no mix-blend-luminosity greening), so footage reads
 * in its natural tones, just muted.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  return (
    <section ref={ref} id="hero" className="relative overflow-hidden min-h-[100vh]">
      {/* ── Gradient shell: teal-sage dark at top (close to main's #2f3e46)
          → warm stone at bottom. Integrates the original-hero feel with
          the stone palette. Bottom stop (#A89E85) matches TheShift's top
          — seamless. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #2A3842 0%, #2F3E46 18%, #3E4C51 35%, #5E605B 55%, #7A6E5B 75%, #A89E85 100%)",
        }}
      />

      {/* ── Video layer — mix-blend-luminosity restores the green-cast
          footage feel Maks originally liked. Desaturated into the green
          gradient above, natural motion through the scene. */}
      <motion.div
        style={prefersReduced ? undefined : { y: videoY, scale: videoScale }}
        className="absolute inset-0 z-[1] will-change-transform mix-blend-luminosity opacity-55"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-construction.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Top/bottom washes so the headline reads clearly and the bottom
          ramps smoothly into the stone next-section color without the
          video fighting the transition pixels. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(42,56,66,0.45) 0%, rgba(42,56,66,0.10) 30%, transparent 55%, rgba(168,158,133,0.45) 85%, #A89E85 100%)",
        }}
      />

      {/* Field-journal header rule — hairline removed per feedback; the
          nav & field-journal strip now breathe directly into the hero. */}
      <div className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between font-mono text-[10.5px] tracking-[0.22em] uppercase text-bone/55">
          <span>Stroyka — The Field Journal</span>
          <span className="hidden sm:inline">Vol. 01 · Est. 2026 · Austin TX</span>
          <span className="sm:hidden">Vol. 01</span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <motion.div
        style={prefersReduced ? undefined : { y: headlineY, opacity: headlineOpacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-28 lg:pt-24 lg:pb-40 will-change-transform"
      >
        <FadeIn delay={0}>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-bone/80 mb-10 inline-flex items-center gap-2.5">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-clay opacity-55 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-clay" />
            </span>
            Start free
            <span className="text-bone/30">/</span>
            <span className="text-bone">$99/mo founding rate</span>
            <span className="text-bone/30">/</span>
            {FOUNDING_SPOTS_REMAINING} spots left
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="font-display font-light text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.92] tracking-[-0.03em] text-bone mb-10 max-w-[16ch]">
            <span className="block">Construction</span>
            <span className="block">
              management<span className="text-clay">,</span>
            </span>
            <span className="block italic font-normal relative">
              for real crews.
              <svg
                aria-hidden
                className="absolute left-0 -bottom-3 lg:-bottom-5 w-[62%] h-auto"
                viewBox="0 0 400 16"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10 Q 100 2, 200 8 T 398 6"
                  stroke="#CDA07A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="draw-underline"
                />
              </svg>
            </span>
          </h1>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end">
          <div className="max-w-xl">
            <FadeIn delay={0.18}>
              <p className="text-lg lg:text-xl text-bone/85 leading-[1.55]">
                One tool for the whole crew — boss and workers. Clock-in, job costing, reports. Works on any phone, even with no signal.
              </p>
            </FadeIn>
            <FadeIn delay={0.22}>
              <p className="font-mono text-[12px] tracking-[0.15em] uppercase text-bone/55 mb-10 mt-6">
                For crews of 5–25 · Works the day you sign up
              </p>
            </FadeIn>
            <FadeIn delay={0.28}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button variant="invert" size="lg" href="/#download">
                  Start free
                </Button>
                <Button variant="ghost" size="lg" href="/demo" className="text-bone hover:text-clay-soft">
                  Book a demo →
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Project Sheet — floats on the mid-stone portion of the gradient.
              Uses bone-soft bg (matches the mid-tone of the gradient around it)
              so it reads as an inset panel rather than a bright card. */}
          <FadeIn delay={0.35}>
            <aside className="w-full lg:w-[320px] border border-ink/20 bg-bone/90 backdrop-blur-md rounded-sm p-6 font-mono text-[12px] tracking-[0.06em] shadow-[0_30px_80px_-30px_rgba(31,26,20,0.5)]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/15">
                <span className="uppercase tracking-[0.2em] text-ink-muted">Project sheet</span>
                <span className="flex items-center gap-1.5 text-clay">
                  <span className="relative inline-flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-clay opacity-70 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-clay" />
                  </span>
                  live
                </span>
              </div>
              <dl className="space-y-3 text-ink-soft">
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Crew</dt>
                  <dd className="tabular-nums text-ink">12 workers</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Job no.</dt>
                  <dd className="tabular-nums text-ink">2411-JH</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Labor wk</dt>
                  <dd className="tabular-nums text-ink">428.5 h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Budget</dt>
                  <dd className="tabular-nums text-ink">
                    <span className="text-clay">▲</span> on plan
                  </dd>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-ink/15">
                  <dt className="text-ink-muted uppercase">Offline</dt>
                  <dd className="text-ink">Yes — any phone</dd>
                </div>
              </dl>
            </aside>
          </FadeIn>
        </div>
      </motion.div>
    </section>
  );
}
