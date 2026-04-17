import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section id="cta" className="py-20 lg:py-24 relative bg-brand-deep overflow-hidden">
      {/* Center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(82,121,111,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Subtle grid lines — architectural feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #84a98c 1px, transparent 1px), linear-gradient(to bottom, #84a98c 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 80%)",
        }}
      />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <TextReveal
          as="h2"
          className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-5"
        >
          Ready to run a cleaner jobsite?
        </TextReveal>
        <FadeIn delay={0.1}>
          <p className="text-base md:text-lg text-brand-sage-mist/75 leading-relaxed mb-10 max-w-lg mx-auto">
            Start free for up to 5 workers, or book a 20-minute demo and we&apos;ll
            walk you through Stroyka live. No credit card either way.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button variant="primary" size="lg" href="/#download">
              Download Free
            </Button>
            <Button variant="secondary" size="lg" href="/demo">
              Book a Demo
            </Button>
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-sm text-brand-sage-mist/50">
            Free for crews up to 5 · $99/mo founding rate · Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
