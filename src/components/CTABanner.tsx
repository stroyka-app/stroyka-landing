"use client";

import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

/**
 * CTA finale — the gradient "ramp down" into dark forest. Starts at pale
 * pistachio (continues from the FAQ section above) and deepens to forest
 * by the bottom so it merges seamlessly into the dark Footer.
 * The oversized Fraunces type is the moment.
 */
export default function CTABanner() {
  return (
    <section id="cta" className="relative overflow-hidden">
      {/* Gradient shell — pistachio top → forest bottom. Same ramp family
          as the hero, just inverted direction. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #D3DAC0 0%, #A9B68A 25%, #6B7E55 55%, #3F4E35 85%, #2A3524 100%)",
        }}
      />

      {/* Fine drafting grid — cream hairlines, very faint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #EDE6D3 1px, transparent 1px), linear-gradient(to bottom, #EDE6D3 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Soft sage glow top-right for the pistachio top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 w-[50vw] h-[50vw] opacity-30 z-[1]"
        style={{
          background: "radial-gradient(circle, #B8D4BD 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 py-32 lg:py-44">
        <FadeIn>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink mb-10 inline-flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-forest" aria-hidden />
            The invitation
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          {/* Headline spans the gradient — top lines are in dark ink on
              pistachio, bottom lines in cream on forest. The color flips
              mid-word for drama. */}
          <h2 className="font-display font-light text-[clamp(3rem,12.5vw,13rem)] leading-[0.88] tracking-[-0.035em] max-w-[14ch] mb-12 lg:mb-16">
            <span className="block text-ink">Run a</span>
            <span className="block italic font-normal text-ink">cleaner</span>
            <span className="block text-bone">jobsite.</span>
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end max-w-5xl">
          <FadeIn delay={0.15}>
            <p className="font-display italic text-xl lg:text-2xl leading-[1.4] text-bone/85 max-w-xl">
              Start free for up to five workers, or book a twenty-minute demo and we&rsquo;ll walk you through Stroyka live. No credit card either way.
            </p>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button variant="invert" size="lg" href="/#download">
                Start free
              </Button>
              <Button variant="ghost" size="lg" href="/demo" className="text-bone hover:text-brand-sage-bright">
                Book a demo →
              </Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <p className="mt-20 pt-10 border-t border-bone/15 font-mono text-[11px] tracking-[0.22em] uppercase text-bone/55">
            Free for crews up to 5
            <span className="text-bone/25 mx-3">/</span>
            $99/mo founding rate
            <span className="text-bone/25 mx-3">/</span>
            Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
