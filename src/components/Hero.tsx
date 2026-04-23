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
 * Hero — rich-dark editorial with video. The construction video is back
 * behind a heavy green-ink wash so the editorial type reads as the primary
 * voice, not the footage. Scroll-linked parallax on both the video and
 * the headline gives the section life without leaning on gimmicks.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax — video drifts up slowly, headline drifts slightly faster
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative overflow-hidden bg-bone min-h-[96vh]">
      {/* ── Video background with rich overlay ─────────────────────────── */}
      <motion.div
        style={prefersReduced ? undefined : { y: videoY, scale: videoScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {/* Base gradient — warm green-black, not the old blue-grey */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 70% 35%, rgba(82,121,111,0.24) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 50% at 15% 80%, rgba(21,26,22,0.7) 0%, transparent 55%)",
              "linear-gradient(180deg, #0C110E 0%, #0F1510 55%, #0C110E 100%)",
            ].join(", "),
          }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-[0.55]"
        >
          <source src="/videos/hero-construction.mp4" type="video/mp4" />
        </video>
        {/* Dark wash + grain */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,17,14,0.55) 0%, rgba(12,17,14,0.7) 65%, rgba(12,17,14,0.95) 100%)",
          }}
        />
        {/* Faint pistachio vignette glow bottom-left to give the frame life */}
        <div
          aria-hidden
          className="absolute -bottom-32 -left-20 w-[60vw] h-[60vw] rounded-full opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle, #B8D4BD 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      {/* ── Field-journal header rule ──────────────────────────────────── */}
      <div className="relative z-10 border-b border-ink/15">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink/60">
          <span>Stroyka — The Field Journal</span>
          <span className="hidden sm:inline">Vol. 01 · Est. 2026 · Austin TX</span>
          <span className="sm:hidden">Vol. 01</span>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <motion.div
        style={prefersReduced ? undefined : { y: headlineY, opacity: headlineOpacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32 will-change-transform"
      >
        <FadeIn delay={0}>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink/75 mb-10 inline-flex items-center gap-2.5">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sage-bright" />
            </span>
            Start free
            <span className="text-ink/30">/</span>
            <span className="text-ink">$99/mo founding rate</span>
            <span className="text-ink/30">/</span>
            {FOUNDING_SPOTS_REMAINING} spots left
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="font-display font-light text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.92] tracking-[-0.03em] text-ink mb-10 max-w-[16ch]">
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
              <p className="text-lg lg:text-xl text-ink/80 leading-[1.55]">
                One tool for the whole crew — boss and workers. Clock-in, job costing, reports. Works on any phone, even with no signal.
              </p>
            </FadeIn>
            <FadeIn delay={0.22}>
              <p className="font-mono text-[12px] tracking-[0.15em] uppercase text-ink/55 mb-10 mt-6">
                For crews of 5–25 · Works the day you sign up
              </p>
            </FadeIn>
            <FadeIn delay={0.28}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button variant="primary" size="lg" href="/#download">
                  Start free
                </Button>
                <Button variant="secondary" size="lg" href="/demo">
                  Book a demo
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Project Sheet — kept, Maks liked it. Upgraded with a live
              "on plan" indicator that pulses gently. */}
          <FadeIn delay={0.35}>
            <aside className="w-full lg:w-[320px] border border-ink/18 bg-bone-soft/70 backdrop-blur-md rounded-sm p-6 font-mono text-[12px] tracking-[0.06em]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/15">
                <span className="uppercase tracking-[0.2em] text-ink/60">Project sheet</span>
                <span className="flex items-center gap-1.5 text-brand-sage-bright">
                  <span className="relative inline-flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage-bright" />
                  </span>
                  live
                </span>
              </div>
              <dl className="space-y-3 text-ink/85">
                <div className="flex justify-between">
                  <dt className="text-ink/55 uppercase">Crew</dt>
                  <dd className="tabular-nums text-ink">12 workers</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55 uppercase">Job no.</dt>
                  <dd className="tabular-nums text-ink">2411-JH</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55 uppercase">Labor wk</dt>
                  <dd className="tabular-nums text-ink">428.5 h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55 uppercase">Budget</dt>
                  <dd className="tabular-nums text-ink">
                    <span className="text-brand-sage-bright">▲</span> on plan
                  </dd>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-ink/15">
                  <dt className="text-ink/55 uppercase">Offline</dt>
                  <dd className="text-ink">Yes — any phone</dd>
                </div>
              </dl>
            </aside>
          </FadeIn>
        </div>
      </motion.div>

      {/* ── Scroll hint hairline — a slow pistachio line draws across ──── */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden z-10">
        <div
          className="h-full bg-brand-sage-bright/40"
          style={{
            animation: prefersReduced ? undefined : "marquee 8s linear infinite",
            width: "200%",
          }}
        />
      </div>
    </section>
  );
}
