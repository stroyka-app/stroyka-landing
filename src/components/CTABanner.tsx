"use client";

import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

/**
 * CTA finale — the biggest typographic moment on the page. Full-bleed ink,
 * Fraunces display pushed to the edge of the viewport, one italic line for
 * voice, two buttons. Everything else is hairline detail.
 */
export default function CTABanner() {
  return (
    <section id="cta" className="relative bg-ink text-bone overflow-hidden">
      {/* Fine grid backdrop — barely visible, evokes a drafting sheet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #eee8db 1px, transparent 1px), linear-gradient(to bottom, #eee8db 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-28 lg:py-40">
        {/* Tiny pistachio marker */}
        <FadeIn>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-brand-sage-mist/60 mb-10 inline-flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-sage" aria-hidden />
            The invitation
          </p>
        </FadeIn>

        {/* Oversized Fraunces — bleed-scale. Leading cranked down so the lines
            touch, serif style for editorial cover-page feel. */}
        <FadeIn delay={0.05}>
          <h2 className="font-display font-light text-[clamp(3rem,12.5vw,13rem)] leading-[0.88] tracking-[-0.035em] text-bone max-w-[14ch] mb-12 lg:mb-16">
            Run a <span className="italic font-normal">cleaner</span> jobsite.
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end max-w-5xl">
          <FadeIn delay={0.15}>
            <p className="font-display italic text-xl lg:text-2xl leading-[1.4] text-brand-sage-mist/85 max-w-xl">
              Start free for up to five workers, or book a twenty-minute demo and we&rsquo;ll walk you through Stroyka live. No credit card either way.
            </p>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button variant="invert" size="lg" href="/#download">
                Start free
              </Button>
              <Button variant="ghost" size="lg" href="/demo" className="text-bone hover:text-brand-sage">
                Book a demo →
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Footer microprint — mono, spaced */}
        <FadeIn delay={0.3}>
          <p className="mt-20 pt-10 border-t border-bone/10 font-mono text-[11px] tracking-[0.22em] uppercase text-brand-sage-mist/50">
            Free for crews up to 5
            <span className="text-bone/30 mx-3">/</span>
            $99/mo founding rate
            <span className="text-bone/30 mx-3">/</span>
            Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
