// src/components/AccountPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";

type PageState = "loading" | "success" | "error" | "direct";

function LoadingDots() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className="text-brand-forest text-2xl">...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-brand-forest"
          animate={{ opacity: [0.3, 1, 0.3] }}
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

function SuccessCheckmark() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="w-16 h-16 mx-auto mb-6">
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="#52796f"
          strokeWidth="3"
          fill="none"
          initial={prefersReduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M20 32 L28 40 L44 24"
          stroke="#84a98c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={prefersReduced ? {} : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">{children}</div>
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
          <Logo variant="dark" size={40} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          Manage your subscription
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
          To access billing, open the Stroyka app and tap{" "}
          <span className="text-brand-sage-mist font-medium">Manage</span> on
          your subscription card.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="flex flex-col items-center gap-4">
          <Button variant="primary" size="md" href="https://app.getstroyka.com">
            Open Stroyka
          </Button>
          <a
            href="mailto:hello@getstroyka.com"
            className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors"
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
          <Logo variant="dark" size={40} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex justify-center mb-6">
          <LoadingDots />
        </div>
        <p className="text-base text-brand-sage-mist/75">
          Redirecting to billing portal...
        </p>
      </FadeIn>
    </PageShell>
  );
}

function SuccessView() {
  return (
    <PageShell>
      <FadeIn>
        <SuccessCheckmark />
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          You&apos;re all set
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
          Your billing changes have been saved.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="flex flex-col items-center gap-4">
          <Button variant="primary" size="md" href="https://app.getstroyka.com">
            Open Stroyka
          </Button>
          <a
            href="/"
            className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors"
          >
            Back to getstroyka.com
          </a>
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
          <Logo variant="dark" size={40} showWordmark={false} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          We couldn&apos;t verify your session
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
          Please try again from the Stroyka app, or contact us at{" "}
          <a
            href="mailto:hello@getstroyka.com"
            className="text-brand-sage hover:text-brand-sage-mist underline underline-offset-2 transition-colors"
          >
            hello@getstroyka.com
          </a>
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <Button variant="primary" size="md" href="https://app.getstroyka.com">
          Open Stroyka
        </Button>
      </FadeIn>
    </PageShell>
  );
}

export default function AccountPage() {
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("direct");

  useEffect(() => {
    const token = searchParams.get("token");
    const status = searchParams.get("status");

    // Clear sensitive params from URL immediately
    if (token || status) {
      window.history.replaceState({}, "", "/account");
    }

    // Determine initial state
    if (status === "success") {
      setPageState("success");
      return;
    }

    if (!token) {
      setPageState("direct");
      return;
    }

    // Token present — attempt portal redirect
    setPageState("loading");

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
