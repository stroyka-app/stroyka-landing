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
 * Hero — vertical gradient from deep forest at the top through olive to pale
 * pistachio at the bottom. The gradient IS the transition into the next
 * section (which picks up at pistachio). Video sits inside with luminosity
 * blend so it reads as atmosphere, not a photograph to look at.
 *
 * The text hierarchy follows the gradient: cream over the dark half,
 * with the Project Sheet card landing on the pale pistachio end so it
 * becomes a moment of rest and contrast (ink text on pistachio).
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);

  return (
    <section ref={ref} id="hero" className="relative overflow-hidden min-h-[100vh]">
      {/* ── Gradient shell — forest → olive → pistachio ──────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #1F2A1C 0%, #2A3524 22%, #3F4E35 44%, #6B7E55 66%, #A9B68A 84%, #D3DAC0 100%)",
        }}
      />

      {/* ── Video layer ──────────────────────────────────────────────────── */}
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

      {/* Dark→transparent top vignette so the top of the gradient doesn't
          read grey under bright video frames */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(31,42,28,0.45) 0%, rgba(31,42,28,0.15) 40%, transparent 100%)",
        }}
      />

      {/* Soft sage glow bottom-left — gives life to the pistachio end */}
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 w-[60vw] h-[60vw] rounded-full opacity-30 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #B8D4BD 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Field-journal header rule — cream on dark top ───────────────── */}
      <div className="relative z-10 border-b border-bone/12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between font-mono text-[10.5px] tracking-[0.22em] uppercase text-bone/65">
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
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sage-bright" />
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
              management<span className="text-brand-sage-bright">,</span>
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
                  stroke="#B8D4BD"
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
                <Button variant="primary" size="lg" href="/#download">
                  Start free
                </Button>
                <Button variant="ghost" size="lg" href="/demo" className="text-bone hover:text-brand-sage-bright">
                  Book a demo →
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Project Sheet — lives on the pale pistachio end of the hero
              gradient. Flipped contrast: ink text on pistachio = moment of
              rest against the dark editorial above. */}
          <FadeIn delay={0.35}>
            <aside className="w-full lg:w-[320px] border border-ink/20 bg-bone/90 backdrop-blur-md rounded-sm p-6 font-mono text-[12px] tracking-[0.06em] shadow-[0_30px_80px_-30px_rgba(31,42,28,0.4)]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/15">
                <span className="uppercase tracking-[0.2em] text-ink-muted">Project sheet</span>
                <span className="flex items-center gap-1.5 text-brand-forest">
                  <span className="relative inline-flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-70 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage" />
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
                    <span className="text-brand-forest">▲</span> on plan
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
