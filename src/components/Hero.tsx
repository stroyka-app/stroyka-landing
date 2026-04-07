"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

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
      {/* Floating dot */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[30%] right-[20%] w-3 h-3 rounded-full bg-brand-sage/15"
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-construction.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay on video */}
        <div className="absolute inset-0 bg-brand-midnight/75" />
        {/* Gradient fallback when no video */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(82,121,111,0.18) 0%, transparent 60%)",
              "radial-gradient(ellipse 50% 50% at 20% 80%, rgba(53,79,82,0.15) 0%, transparent 50%)",
              "linear-gradient(180deg, #2f3e46 0%, #2b3940 50%, #2f3e46 100%)",
            ].join(", "),
          }}
        />
      </div>

      {/* Geometric shapes */}
      <FloatingShapes />

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-midnight to-transparent z-[3]" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32 text-center">
        {/* Announcement pill */}
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2 bg-brand-forest/15 border border-brand-forest/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-forest animate-pulse" />
            <span className="font-heading text-xs font-medium tracking-wide text-brand-sage">
              Now accepting founding members — $99/mo locked forever
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
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #84a98c 0%, #52796f 50%, #cad2c5 100%)",
              }}
            >
              for Real Crews
            </span>
          </h1>
        </FadeIn>

        {/* Subtext */}
        <FadeIn delay={0.2}>
          <p className="text-base md:text-lg text-brand-sage-mist/70 leading-relaxed max-w-xl mx-auto mb-10">
            Stop cobbling together spreadsheets, text messages, and gut feelings
            to run your jobsites. One simple tool for your whole crew — boss and
            workers — that works even without cell service.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button variant="primary" size="lg" href="/demo">
              Request a Demo
            </Button>
            <Button variant="ghost" size="lg" href="/#how-it-works">
              See How It Works
            </Button>
          </div>
        </FadeIn>

        {/* Trust signals */}
        <FadeIn delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-brand-sage-mist/50">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Offline-first
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Built for crews of 5–20
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
