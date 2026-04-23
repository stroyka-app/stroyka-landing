"use client";

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
 * Editorial hero — bone paper, ink type, pistachio accent.
 *
 * The old dark video-hero is retired. The new hero leads with typography the
 * way a cover page leads a magazine: oversized Fraunces display, left-aligned,
 * mixed weight + italic for voice. A small mono "spec card" to the right
 * carries the contractor/field-journal metaphor without leaning on stock
 * imagery or jobsite clichés.
 */
export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-bone">
      {/* Thin top hairline + mono filing header — sets the journal tone */}
      <div className="relative z-10 border-b border-ink/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3 flex items-center justify-between font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
          <span>Stroyka — The Field Journal</span>
          <span className="hidden sm:inline">Vol. 01 · Est. 2026 · Austin TX</span>
          <span className="sm:hidden">Vol. 01</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Announcement pill — minimalist, with pistachio marker */}
        <FadeIn delay={0}>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft mb-10 inline-flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-sage" aria-hidden />
            Start free
            <span className="text-ink-muted/60">/</span>
            <span className="text-ink">$99/mo founding rate</span>
            <span className="text-ink-muted/60">/</span>
            {FOUNDING_SPOTS_REMAINING} spots left
          </p>
        </FadeIn>

        {/* Editorial headline — mixed weights + italic, Fraunces display */}
        <FadeIn delay={0.08}>
          <h1 className="font-display font-light text-[clamp(3.5rem,10vw,9.5rem)] leading-[0.92] tracking-[-0.03em] text-ink mb-10 max-w-[16ch]">
            <span className="block">Construction</span>
            <span className="block">
              management<span className="text-brand-forest">,</span>
            </span>
            <span className="block italic font-normal relative">
              for real crews.
              {/* Hand-drawn pistachio underline on the last phrase */}
              <svg
                aria-hidden
                className="absolute left-0 -bottom-3 lg:-bottom-5 w-[62%] h-auto"
                viewBox="0 0 400 16"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10 Q 100 2, 200 8 T 398 6"
                  stroke="#84a98c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="draw-underline"
                />
              </svg>
            </span>
          </h1>
        </FadeIn>

        {/* Split: left = body + CTAs, right = spec card */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end">
          {/* Left */}
          <div className="max-w-xl">
            <FadeIn delay={0.18}>
              <p className="text-lg lg:text-xl text-ink-soft leading-[1.55] mb-2">
                One tool for the whole crew — boss and workers. Clock-in, job costing, reports. Works on any phone, even with no signal.
              </p>
            </FadeIn>
            <FadeIn delay={0.22}>
              <p className="font-mono text-[12px] tracking-[0.15em] uppercase text-ink-muted mb-10 mt-6">
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

          {/* Right — Spec card, reads like a jobsite cover sheet */}
          <FadeIn delay={0.35}>
            <aside className="w-full lg:w-[320px] border border-ink/15 bg-bone-soft/70 rounded-sm p-6 font-mono text-[12px] tracking-[0.06em]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/12">
                <span className="uppercase tracking-[0.2em] text-ink-muted">Project sheet</span>
                <span className="text-brand-forest">●</span>
              </div>
              <dl className="space-y-3 text-ink-soft">
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Crew</dt>
                  <dd className="tabular-nums text-ink">12 workers</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Job no.</dt>
                  <dd className="tabular-nums text-ink">2411-JH</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Labor wk</dt>
                  <dd className="tabular-nums text-ink">428.5 h</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted uppercase">Budget</dt>
                  <dd className="tabular-nums text-ink">
                    <span className="text-brand-forest">▲</span> on plan
                  </dd>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-ink/12">
                  <dt className="text-ink-muted uppercase">Offline</dt>
                  <dd className="text-ink">Yes — any phone</dd>
                </div>
              </dl>
            </aside>
          </FadeIn>
        </div>
      </div>

      {/* Thin bottom hairline — transitions into next (ink) section */}
      <div className="relative z-10 border-t border-ink/10" />
    </section>
  );
}
