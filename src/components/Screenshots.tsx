import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const SCREENSHOTS = [
  { src: "/screenshots/dashboard.png", label: "Real-time project P&L" },
  { src: "/screenshots/tasks.png", label: "Task management with priorities" },
  { src: "/screenshots/requests.png", label: "Supply request workflow" },
];

export default function Screenshots() {
  return (
    <section id="screenshots" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <SectionLabel>The App</SectionLabel>
          </FadeIn>
          <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight">
            See it in action
          </TextReveal>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SCREENSHOTS.map((shot, i) => (
            <FadeIn key={shot.label} delay={0.1 * i}>
              <div className="bg-brand-deep rounded-2xl ring-1 ring-brand-forest/25 p-3">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-brand-midnight">
                  <Image src={shot.src} alt={shot.label} fill className="object-cover" />
                </div>
                <p className="text-xs text-brand-sage uppercase tracking-wider mt-3 text-center">
                  {shot.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-brand-sage-mist/50 mt-8">
            Screenshots from the live app. Request a personalized demo to see your own projects and crew.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
