"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Smartphone, Download, Crown, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const prefersReduced = useReducedMotion();

  const planLabel =
    plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "";

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          {/* Logo */}
          <FadeIn>
            <div className="flex justify-center mb-10">
              <Link href="/">
                <Logo variant="light" size={42} showWordmark />
              </Link>
            </div>
          </FadeIn>

          {/* Sage stamp seal — DELIVERED · WELCOME — reuses the v11 stamp
              language from Guarantee + Beat 5 + AccountPage success. */}
          <FadeIn delay={0.05}>
            <motion.div
              className="relative w-32 h-32 mx-auto mb-10"
              initial={prefersReduced ? false : { scale: 0, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 14,
                mass: 0.45,
                delay: 0.15,
              }}
            >
              {!prefersReduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-brand-sage-bright/65"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.85], opacity: [0.8, 0] }}
                  transition={{
                    delay: 0.5,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              )}
              <div
                className="relative w-full h-full rounded-full flex flex-col items-center justify-center text-center"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(132,169,140,0.18) 0%, rgba(43,61,48,0.92) 65%)",
                  border: "2.5px solid #8AAA91",
                  boxShadow:
                    "0 0 60px rgba(132,169,140,0.35), inset 0 0 20px rgba(132,169,140,0.15)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-2.5 rounded-full border border-brand-sage-bright/40"
                />
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M5 12.5 L10 17.5 L19 7.5"
                    stroke="#B8D4BD"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={prefersReduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                  />
                </svg>
                <div className="mt-1.5 font-mono text-[9px] tracking-[0.28em] text-brand-sage-bright font-bold">
                  WELCOME
                </div>
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <SectionLabel>Subscription active</SectionLabel>
          </FadeIn>

          <TextReveal
            as="h1"
            className="font-display font-light text-4xl lg:text-6xl leading-[0.95] tracking-[-0.02em] text-ink mb-4"
          >
            You&rsquo;re in. Welcome to Stroyka.
          </TextReveal>

          <FadeIn delay={0.25}>
            <div className="flex items-center justify-center gap-2 mb-12">
              {planLabel === "Pro" && (
                <Crown size={16} className="text-brand-sage-bright" />
              )}
              {planLabel === "Starter" && (
                <Zap size={16} className="text-brand-forest" />
              )}
              <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-ink-soft">
                {planLabel
                  ? `Your ${planLabel} plan is active`
                  : "Your plan is active"}
              </p>
            </div>
          </FadeIn>

          {/* Two-card stone grid — matches landing card-stone language */}
          <FadeIn delay={0.32}>
            <div className="grid sm:grid-cols-2 gap-4 mb-12 text-left">
              {/* Existing users */}
              <div className="card-stone border border-ink/15 rounded-2xl p-6 hover:border-brand-sage/45 transition-colors">
                <div className="w-11 h-11 rounded-full bg-brand-sage/15 border border-brand-sage/40 text-brand-forest flex items-center justify-center mb-4">
                  <Smartphone size={18} strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-[18px] leading-snug text-ink mb-2">
                  Already have the app?
                </h3>
                <p className="text-[14px] text-ink-soft leading-relaxed">
                  Open Stroyka and sign in — your plan is already upgraded.
                </p>
              </div>

              {/* New users */}
              <div className="card-stone border border-ink/15 rounded-2xl p-6 hover:border-brand-sage/45 transition-colors">
                <div className="w-11 h-11 rounded-full bg-brand-sage/15 border border-brand-sage/40 text-brand-forest flex items-center justify-center mb-4">
                  <Download size={18} strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-[18px] leading-snug text-ink mb-2">
                  New to Stroyka?
                </h3>
                <p className="text-[14px] text-ink-soft leading-relaxed mb-4">
                  Download the app and sign up with the same email. Your plan
                  activates automatically.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://apps.apple.com/app/stroyka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-ink text-bone hover:bg-brand-deep transition-colors rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    App Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.stroyka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-ink text-bone hover:bg-brand-deep transition-colors rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.18 23.67c-.37-.2-.68-.57-.68-1.06V1.39c0-.49.31-.86.68-1.06L13.54 12 3.18 23.67zm1.38-24l11.54 11.54 3.33-3.33L5.75.11a.96.96 0 00-.58-.17l-.61.73zm16.52 10.61l-3.66 3.66 3.66 3.66c.7-.4 1.18-1.08 1.18-1.89V12.3c0-.81-.48-1.49-1.18-1.89v-.13zM4.56 24.27l13.68-7.77-3.33-3.33L4.56 24.27z" />
                    </svg>
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted">
              Questions?{" "}
              <a
                href="mailto:hello@getstroyka.com"
                className="text-brand-forest hover:text-brand-deep transition-colors"
              >
                hello@getstroyka.com
              </a>
            </p>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
