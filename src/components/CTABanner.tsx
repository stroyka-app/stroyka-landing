import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section id="cta" className="py-24 lg:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(82,121,111,0.1) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6">
          Ready to stop guessing and start knowing?
        </TextReveal>
        <FadeIn delay={0.1}>
          <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
            Book a 20-minute demo. We&apos;ll show you Stroyka live with a real project and real crew data.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button variant="primary" size="lg" href="/demo">Book Your Demo →</Button>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-sm text-brand-sage-mist/50 mt-6">
            No commitment. No credit card. Just a conversation.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
