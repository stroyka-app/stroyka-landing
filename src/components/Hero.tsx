"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

function GeometricOverlay() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div ref={ref} className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[15%] right-[10%] w-24 h-24 border-l-4 border-t-4 border-brand-sage-mist/20 rounded-tl-md"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[40%] right-[25%] w-16 h-10 bg-brand-forest/15 rounded-lg"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[25%] right-[5%] w-4 h-4 rounded-full bg-brand-sage/20"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[20%] right-[15%] w-20 h-20 border-r-4 border-b-4 border-brand-forest/20 rounded-br-md"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[60%] right-[8%] w-32 h-2 bg-brand-deep/40 rounded-full"
      />
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-8">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 75% 50%, rgba(82,121,111,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-20">
        <div>
          <FadeIn delay={0}>
            <SectionLabel>Built for Small Crews</SectionLabel>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.05] text-balance mb-6">
              Construction<br />
              Management<br />
              <span className="text-brand-sage">for Real Crews</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-brand-sage-mist/75 leading-relaxed mb-8 max-w-lg">
              Stop cobbling together spreadsheets, text messages, and gut feelings
              to run your jobsites. Stroyka gives your whole crew — boss and
              workers — one simple tool that works even without cell service.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary" size="lg" href="/demo">
                Request a Demo
              </Button>
              <Button variant="ghost" size="lg" href="#how-it-works">
                See How It Works
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap gap-6 text-sm text-brand-sage-mist/60">
              <span>⚡ Offline-first</span>
              <span>👷 Built for crews of 5–20</span>
              <span>💳 Flat monthly pricing</span>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="right" delay={0.2} className="relative">
          <div className="relative rounded-2xl overflow-hidden bg-brand-deep ring-1 ring-brand-forest/30 rotate-1 shadow-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[400px] lg:h-[500px] object-cover opacity-40 blur-[1px]"
              poster=""
            >
              <source src="/videos/hero-construction.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-br from-brand-midnight via-brand-deep to-brand-forest/30" />

            <GeometricOverlay />

            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-brand-midnight/80 backdrop-blur-sm rounded-2xl p-8 text-center">
                <svg width="48" height="48" viewBox="0 0 56 56" fill="none" className="mx-auto mb-4">
                  <path d="M6 28 L6 6 L28 6" stroke="#cad2c5" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"/>
                  <path d="M50 28 L50 50 L28 50" stroke="#52796f" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"/>
                  <circle cx="6" cy="6" r="4" fill="#84a98c"/>
                  <circle cx="50" cy="50" r="4" fill="#52796f"/>
                </svg>
                <p className="font-heading text-sm text-brand-sage tracking-wider uppercase">Coming Soon</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
