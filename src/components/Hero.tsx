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
            "linear-gradient(180deg, #34453A 0%, #3E5043 18%, #4B5F4E 35%, #6B7465 55%, #8A876B 75%, #A89E85 100%)",
        }}
      />

      {/* ── Video layer — natural tones at low opacity. No blend-luminosity
          (it was stripping color from the footage and forcing the green
          gradient onto it — reading as "obvious green video"). The video
          now plays at its real hue, muted to 28% so it reads as atmosphere
          behind the gradient rather than a tinted overlay. */}
      <motion.div
        style={prefersReduced ? undefined : { y: videoY, scale: videoScale }}
        className="absolute inset-0 z-[1] will-change-transform opacity-30"
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
            "linear-gradient(180deg, rgba(52,69,58,0.45) 0%, rgba(52,69,58,0.10) 30%, transparent 55%, rgba(168,158,133,0.45) 85%, #A89E85 100%)",
        }}
      />

      {/* Field-journal strip removed — it collided with the Navbar
          wordmark. The Navbar's "STROYKA" logo is the only top-of-page
          brand mark now; the Field Journal colophon lives in the Footer. */}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <motion.div
        style={prefersReduced ? undefined : { y: headlineY, opacity: headlineOpacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 pb-28 lg:pt-32 lg:pb-40 will-change-transform"
      >
        <FadeIn delay={0}>
          {/* Announcement eyebrow. Was three opacity-tiered text runs
              ("80 / 30 / 100 / 30 / 80") over bare video — the light runs
              washed out and the "/" separators at bone/30 were barely
              rendering. Now a slim dark-glass chip, one unified bone weight,
              amber-bright highlight on the commercial fact, and sage dot
              separators that actually register. Slightly lighter than the
              spec-tag chip below so the hierarchy stays intact (eyebrow
              first, supporting tag second). */}
          <p
            className="inline-flex items-center gap-2.5 font-mono text-[11.5px] font-medium tracking-[0.2em] uppercase text-bone mb-10 px-3 py-1.5 rounded-full bg-[rgba(14,20,15,0.32)] backdrop-blur-md border border-bone/12 shadow-[0_4px_18px_-8px_rgba(0,0,0,0.45)]"
            style={{ textShadow: "0 1px 2px rgba(10,16,12,0.7)" }}
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage-bright" />
            </span>
            <span className="text-brand-amber-bright">Start free</span>
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage-bright" />
            </span>
            <span>$99/mo founding rate</span>
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage-bright" />
            </span>
            <span className="text-brand-amber-bright">{FOUNDING_SPOTS_REMAINING} spots left</span>
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="font-display font-light text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.92] tracking-[-0.03em] text-bone mb-10 max-w-[16ch]">
            <span className="block">Construction</span>
            <span className="block">management,</span>
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
              {/* Spec tag. Was a plain bone/85 line with a soft text-shadow,
                  which washed out over bright frames of the hero video.
                  Now: dark glass chip (rgba #0e140f @ 38%, blurred) with a
                  bone-at-full-opacity medium-weight line + subtle sage dot
                  separator. Readable over any frame without fighting the
                  editorial mono-uppercase voice. */}
              <div className="mb-10 mt-6">
                <p
                  className="inline-flex items-center gap-2.5 font-mono text-[12.5px] font-medium tracking-[0.16em] uppercase text-bone px-3.5 py-1.5 rounded-full bg-[rgba(14,20,15,0.38)] backdrop-blur-md border border-bone/15 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.45)]"
                  style={{
                    textShadow: "0 1px 2px rgba(10,16,12,0.75)",
                  }}
                >
                  <span
                    aria-hidden
                    className="inline-block w-3.5 h-px bg-brand-amber"
                  />
                  For crews of 5–25
                  <span
                    aria-hidden
                    className="inline-block w-1 h-1 rounded-full bg-brand-sage-bright/80"
                  />
                  Works the day you sign up
                </p>
              </div>
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

          {/* Project Sheet — floats on the mid-stone portion of the gradient.
              Uses bone-soft bg (matches the mid-tone of the gradient around it)
              so it reads as an inset panel rather than a bright card. */}
          <FadeIn delay={0.35}>
            <aside
              className="w-full lg:w-[320px] border border-bone/40 bg-[rgba(25,32,27,0.32)] backdrop-blur-2xl rounded-2xl p-7 font-mono text-[12.5px] tracking-[0.06em] shadow-[0_30px_80px_-30px_rgba(10,18,12,0.7)]"
              style={{
                textShadow: "0 1px 10px rgba(10,18,12,0.55)",
              }}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-bone/25">
                <span className="uppercase tracking-[0.2em] text-bone/80 font-semibold">
                  Project sheet
                </span>
                <span className="flex items-center gap-1.5 text-brand-sage-bright font-semibold">
                  <span className="relative inline-flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage-bright opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage-bright" />
                  </span>
                  live
                </span>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-bone/75 uppercase">Crew</dt>
                  <dd className="tabular-nums text-bone font-semibold">12 workers</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-bone/75 uppercase">Job no.</dt>
                  <dd className="tabular-nums text-bone font-semibold">2411-JH</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-bone/75 uppercase">Labor wk</dt>
                  <dd className="tabular-nums text-bone font-semibold">428.5 h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-bone/75 uppercase">Budget</dt>
                  <dd className="tabular-nums text-bone font-semibold">
                    <span className="text-brand-sage-bright">▲</span> on plan
                  </dd>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-bone/25">
                  <dt className="text-bone/75 uppercase">Offline</dt>
                  <dd className="text-bone font-semibold">Yes — any phone</dd>
                </div>
              </dl>
            </aside>
          </FadeIn>
        </div>
      </motion.div>
    </section>
  );
}
