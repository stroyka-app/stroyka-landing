// src/components/AccountPage.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";

type PageState = "loading" | "success" | "error" | "direct";

/* ────────────────────────────────────────────────────────────────────────────
 * Bone-editorial palette pieces — sage atoms used across the four states.
 * ──────────────────────────────────────────────────────────────────────── */

function LoadingDots() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return (
      <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted">
        loading
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-forest"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Sage stamp seal — circular, "DELIVERED" style. Reused for the success
 * page payoff. Fits the v9–v11 stamp language (Guarantee, Beat 5).
 */
function StampSeal({ label }: { label: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className="relative w-32 h-32 mx-auto"
      initial={prefersReduced ? false : { scale: 0, rotate: -12, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 14, mass: 0.45 }}
    >
      {!prefersReduced && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-brand-sage-bright/65"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.85], opacity: [0.8, 0] }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M5 12.5 L10 17.5 L19 7.5"
            stroke="#B8D4BD"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          />
        </svg>
        <div className="mt-1.5 font-mono text-[9px] tracking-[0.28em] text-brand-sage-bright font-bold">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Shell + state views
 * ──────────────────────────────────────────────────────────────────────── */

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        {/* Soft sage vignette top-right — matches Guarantee/FAQ ambience */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-xl mx-auto px-6 text-center">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

function DirectVisitView() {
  return (
    <PageShell>
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Logo variant="light" size={42} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.05}>
        <SectionLabel>Account</SectionLabel>
      </FadeIn>
      <TextReveal
        as="h1"
        className="font-display font-light text-4xl lg:text-5xl leading-[0.98] tracking-[-0.02em] text-ink mb-5"
      >
        Manage your subscription
      </TextReveal>
      <FadeIn delay={0.15}>
        <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
          To access billing, open the Stroyka app and tap{" "}
          <span className="text-ink font-medium">Manage</span> on your
          subscription card.
        </p>
      </FadeIn>
      <FadeIn delay={0.22}>
        <div className="flex flex-col items-center gap-5">
          <Button variant="primary" size="lg" href="https://app.getstroyka.com">
            Open Stroyka
          </Button>
          <a
            href="mailto:hello@getstroyka.com"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted hover:text-brand-forest transition-colors"
          >
            Need help? hello@getstroyka.com
          </a>
        </div>
      </FadeIn>
    </PageShell>
  );
}

function LoadingView() {
  return (
    <PageShell>
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Logo variant="light" size={42} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.05}>
        <SectionLabel>Account</SectionLabel>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="font-display font-light text-3xl lg:text-4xl leading-tight text-ink mb-6">
          Redirecting to billing
        </h1>
      </FadeIn>
      <FadeIn delay={0.18}>
        <div className="flex justify-center mb-4">
          <LoadingDots />
        </div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted">
          Verifying your session
        </p>
      </FadeIn>
    </PageShell>
  );
}

function SuccessView() {
  return (
    <PageShell>
      <FadeIn>
        <StampSeal label="UPDATED" />
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="mt-10">
          <SectionLabel>Account</SectionLabel>
        </div>
      </FadeIn>
      <TextReveal
        as="h1"
        className="font-display font-light text-4xl lg:text-5xl leading-[0.98] tracking-[-0.02em] text-ink mb-5"
      >
        You&rsquo;re all set
      </TextReveal>
      <FadeIn delay={0.18}>
        <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
          Your billing changes have been saved.
        </p>
      </FadeIn>
      <FadeIn delay={0.25}>
        <div className="flex flex-col items-center gap-5">
          <Button variant="primary" size="lg" href="https://app.getstroyka.com">
            Open Stroyka
          </Button>
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted hover:text-brand-forest transition-colors"
          >
            ← Back to getstroyka.com
          </Link>
        </div>
      </FadeIn>
    </PageShell>
  );
}

function ErrorView() {
  return (
    <PageShell>
      <FadeIn>
        <div className="flex justify-center mb-8">
          <Logo variant="light" size={42} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.05}>
        <SectionLabel>Account</SectionLabel>
      </FadeIn>
      <TextReveal
        as="h1"
        className="font-display font-light text-4xl lg:text-5xl leading-[0.98] tracking-[-0.02em] text-ink mb-5"
      >
        We couldn&rsquo;t verify your session
      </TextReveal>
      <FadeIn delay={0.15}>
        <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
          Please try again from the Stroyka app, or contact us at{" "}
          <a
            href="mailto:hello@getstroyka.com"
            className="text-brand-forest hover:text-brand-deep underline underline-offset-2 transition-colors"
          >
            hello@getstroyka.com
          </a>
          .
        </p>
      </FadeIn>
      <FadeIn delay={0.22}>
        <Button variant="primary" size="lg" href="https://app.getstroyka.com">
          Open Stroyka
        </Button>
      </FadeIn>
    </PageShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Page orchestration — unchanged logic
 * ──────────────────────────────────────────────────────────────────────── */

export default function AccountPage() {
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("direct");
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Only process params once — replaceState triggers re-renders
    // with empty params which would reset state to "direct"
    if (hasProcessed.current) return;

    const token = searchParams.get("token");
    const status = searchParams.get("status");

    // Nothing to process — stay on direct visit state
    if (!token && !status) return;

    hasProcessed.current = true;

    // Determine state BEFORE clearing URL
    if (status === "success") {
      setPageState("success");
      window.history.replaceState({}, "", "/account");
      return;
    }

    if (!token) {
      setPageState("direct");
      return;
    }

    // Token present — attempt portal redirect
    setPageState("loading");
    window.history.replaceState({}, "", "/account");

    fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Portal session failed");
        return res.json();
      })
      .then((data: { url: string }) => {
        window.location.href = data.url;
      })
      .catch(() => {
        setPageState("error");
      });
  }, [searchParams]);

  switch (pageState) {
    case "loading":
      return <LoadingView />;
    case "success":
      return <SuccessView />;
    case "error":
      return <ErrorView />;
    case "direct":
    default:
      return <DirectVisitView />;
  }
}
