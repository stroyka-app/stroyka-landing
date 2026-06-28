"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="relative max-w-md text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-sage/15 border border-brand-sage/45 text-brand-forest flex items-center justify-center shadow-[0_8px_24px_-10px_rgba(63,78,53,0.45)]">
            <AlertTriangle size={26} strokeWidth={1.7} />
          </div>
        </div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft mb-4">
          • Something went off plan
        </p>
        <h1 className="font-display font-light text-3xl lg:text-4xl leading-tight text-ink mb-4">
          Something went wrong
        </h1>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-sm mx-auto">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="md" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted hover:text-brand-forest transition-colors self-center"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
