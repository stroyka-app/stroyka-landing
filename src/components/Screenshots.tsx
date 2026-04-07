import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

export default function Screenshots() {
  return (
    <section id="screenshots" className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>The App</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight"
          >
            See it in action
          </TextReveal>
        </div>

        <FadeIn delay={0.1}>
          <div className="max-w-2xl mx-auto bg-brand-deep/50 border border-brand-deep rounded-2xl p-12 text-center">
            <div className="text-5xl mb-5">📱</div>
            <h3 className="font-heading font-semibold text-xl mb-3">
              App screenshots coming soon
            </h3>
            <p className="text-brand-sage-mist/60 text-sm leading-relaxed max-w-md mx-auto">
              We&apos;re putting the finishing touches on the UI. Request a demo
              to see the app live with your own project data.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
