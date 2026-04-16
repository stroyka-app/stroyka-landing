"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Smartphone, Download } from "lucide-react";
import Logo from "@/components/Logo";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const prefersReduced = useReducedMotion();

  const planLabel =
    plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "";

  const stagger = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  const wrap = (i: number, children: React.ReactNode) =>
    prefersReduced ? (
      <div>{children}</div>
    ) : (
      <motion.div
        custom={i}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        {wrap(
          0,
          <div className="flex justify-center mb-10">
            <Link href="/">
              <Logo variant="dark" size={40} showWordmark />
            </Link>
          </div>
        )}

        {/* Checkmark */}
        {wrap(
          1,
          <div className="flex justify-center mb-6">
            {prefersReduced ? (
              <CheckCircle2 size={64} className="text-green-500" />
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <CheckCircle2 size={64} className="text-green-500" />
              </motion.div>
            )}
          </div>
        )}

        {/* Heading */}
        {wrap(
          2,
          <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-3">
            You&apos;re in. Welcome to Stroyka.
          </h1>
        )}

        {/* Plan confirmation */}
        {wrap(
          3,
          <p className="text-lg text-brand-sage-mist/75 mb-10">
            {planLabel
              ? `Your ${planLabel} plan is active.`
              : "Your plan is active."}
          </p>
        )}

        {/* Two-column instruction cards */}
        {wrap(
          4,
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {/* Existing users */}
            <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-brand-forest/10 flex items-center justify-center mb-4">
                <Smartphone size={20} className="text-brand-forest" />
              </div>
              <h3 className="font-heading font-semibold text-base mb-2">
                Already have the app?
              </h3>
              <p className="text-sm text-brand-sage-mist/70 leading-relaxed">
                Open Stroyka and sign in — your plan is already upgraded.
              </p>
            </div>

            {/* New users */}
            <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-brand-forest/10 flex items-center justify-center mb-4">
                <Download size={20} className="text-brand-forest" />
              </div>
              <h3 className="font-heading font-semibold text-base mb-2">
                New to Stroyka?
              </h3>
              <p className="text-sm text-brand-sage-mist/70 leading-relaxed mb-4">
                Download the app and sign up with the same email address. Your
                plan activates automatically.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://apps.apple.com/app/stroyka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-deep border border-brand-deep hover:border-brand-forest/40 rounded-lg px-4 py-2 text-sm font-heading font-semibold text-brand-sage-mist/90 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.stroyka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-deep border border-brand-deep hover:border-brand-forest/40 rounded-lg px-4 py-2 text-sm font-heading font-semibold text-brand-sage-mist/90 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.67c-.37-.2-.68-.57-.68-1.06V1.39c0-.49.31-.86.68-1.06L13.54 12 3.18 23.67zm1.38-24l11.54 11.54 3.33-3.33L5.75.11a.96.96 0 00-.58-.17l-.61.73zm16.52 10.61l-3.66 3.66 3.66 3.66c.7-.4 1.18-1.08 1.18-1.89V12.3c0-.81-.48-1.49-1.18-1.89v-.13zM4.56 24.27l13.68-7.77-3.33-3.33L4.56 24.27z"/></svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footnote */}
        {wrap(
          5,
          <p className="text-sm text-brand-sage-mist/40">
            Questions? Email us at{" "}
            <a
              href="mailto:hello@getstroyka.com"
              className="text-brand-forest hover:text-brand-sage transition-colors duration-200 underline"
            >
              hello@getstroyka.com
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
