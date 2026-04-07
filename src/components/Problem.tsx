import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const PAIN_CARDS = [
  {
    icon: "💸",
    title: "Budget surprises",
    body: "You only know you went over budget after the project ends.",
  },
  {
    icon: "📵",
    title: "No cell service, no updates",
    body: "Workers can't log time or submit requests when they're underground or in remote areas.",
  },
  {
    icon: "👔",
    title: "Tools built for enterprise",
    body: "Procore costs $500+/month and requires an onboarding team. You need something that works on day one.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <FadeIn>
          <SectionLabel>The Problem</SectionLabel>
        </FadeIn>
        <TextReveal as="h2" className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6">
          Construction runs on chaos
        </TextReveal>
        <FadeIn delay={0.1}>
          <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-16">
            Your current system: a group chat for requests, a spreadsheet for budgets, a whiteboard for tasks, and hope that someone remembers to update it. When a worker buys materials, you find out at month-end. When a project goes over budget, you find out too late.
          </p>
        </FadeIn>
      </div>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        {PAIN_CARDS.map((card, i) => (
          <FadeIn key={card.title} delay={0.1 * i}>
            <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-8">
              <span className="text-3xl mb-4 block">{card.icon}</span>
              <h3 className="font-heading font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-brand-sage-mist/70 text-sm leading-relaxed">{card.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
