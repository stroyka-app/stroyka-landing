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

function FloatingShapes() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);

  if (prefersReduced) return null;

  return (
    <div ref={ref} className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
      {/* Top-left bracket — echoes Cornerstone mark */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[12%] left-[8%] w-20 h-20 border-l-[3px] border-t-[3px] border-brand-sage-mist/10 rounded-tl-sm"
      />
      {/* Bottom-right bracket */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[15%] right-[12%] w-16 h-16 border-r-[3px] border-b-[3px] border-brand-forest/15 rounded-br-sm"
      />
      {/* Subtle line accent */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[30%] right-[20%] w-12 h-px bg-brand-sage/10 rounded-full"
      />
      {/* Horizontal bar */}
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-[30%] left-[15%] w-24 h-1 bg-brand-forest/10 rounded-full"
      />
      {/* Small square */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[55%] right-[8%] w-8 h-8 bg-brand-deep/30 rounded-md rotate-12"
      />
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* ── Video background ── */}
      <div className="absolute inset-0 z-0">
        {/* Gradient base (behind video, visible as fallback) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(82,121,111,0.18) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 50% at 20% 80%, rgba(53,79,82,0.15) 0%, transparent 50%)",
              "linear-gradient(180deg, #2f3e46 0%, #2b3940 50%, #2f3e46 100%)",
            ].join(", "),
          }}
        />
        {/* Video layer */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        >
          <source src="/videos/hero-construction.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay on top of video */}
        <div className="absolute inset-0 bg-brand-midnight/70 z-[2]" />
      </div>

      {/* Geometric shapes */}
      <FloatingShapes />

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-midnight to-transparent z-[3]" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32 text-center">
        {/* Announcement pill */}
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2.5 bg-brand-forest/15 border border-brand-forest/30 backdrop-blur-sm rounded-full pl-3 pr-4 py-2 mb-8 shadow-lg shadow-brand-forest/10">
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-forest opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-forest" />
            </span>
            <span className="font-heading text-[13px] md:text-sm font-semibold tracking-wide text-white/90 flex items-center gap-2">
              <span>Start free</span>
              <span className="text-brand-sage-mist/30">·</span>
              <span className="text-amber-300/90">$99/mo founding rate</span>
              <span className="text-brand-sage-mist/30 hidden sm:inline">·</span>
              <span className="hidden sm:inline">{FOUNDING_SPOTS_REMAINING} spots left</span>
            </span>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.1}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-tight mb-6">
            Construction
            <br />
            Management
            <br />
            {/* Two-stop gradient (sage → sage-mist) — reads cleaner on the
                video than the previous 3-stop version, which dipped through
                the darker forest token mid-phrase and lost contrast. */}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #84a98c 0%, #cad2c5 100%)",
              }}
            >
              for Real Crews
            </span>
          </h1>
        </FadeIn>

        {/* Subtext */}
        <FadeIn delay={0.2}>
          <p className="text-base md:text-lg text-brand-sage-mist/70 leading-relaxed max-w-xl mx-auto mb-4">
            One tool for the whole crew — boss and workers. Clock-in, job
            costing, reports. Works on any phone, even with no signal.
          </p>
        </FadeIn>

        {/* Who this is for */}
        <FadeIn delay={0.25}>
          <p className="text-sm font-heading font-medium text-brand-sage/80 mb-10">
            For crews of 5–25. Works the day you sign up.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button variant="primary" size="lg" href="/#download">
              Start free
            </Button>
            <Button variant="secondary" size="lg" href="/demo">
              Book a demo
            </Button>
          </div>
        </FadeIn>

        {/* Trust signals */}
        <FadeIn delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-2 bg-brand-deep/40 border border-brand-forest/20 backdrop-blur-sm rounded-full px-4 py-2 text-[13px] md:text-sm font-heading font-medium text-brand-sage-mist/85">
              <svg className="w-[18px] h-[18px] text-brand-forest shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Offline-first
            </span>
            <span className="inline-flex items-center gap-2 bg-brand-deep/40 border border-brand-forest/20 backdrop-blur-sm rounded-full px-4 py-2 text-[13px] md:text-sm font-heading font-medium text-brand-sage-mist/85">
              <svg className="w-[18px] h-[18px] text-brand-forest shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Free for crews up to 5
            </span>
            <span className="inline-flex items-center gap-2 bg-brand-deep/40 border border-brand-forest/20 backdrop-blur-sm rounded-full px-4 py-2 text-[13px] md:text-sm font-heading font-medium text-brand-sage-mist/85">
              <svg className="w-[18px] h-[18px] text-brand-forest shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Flat monthly pricing
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
