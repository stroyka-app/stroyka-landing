"use client";

import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

interface ShiftItem {
  time: string;
  title: string;
  caption: string;
}

const BEFORE: ShiftItem[] = [
  {
    time: "06:15",
    title: "Timesheet dispute in WhatsApp",
    caption: "Jose logged 9h. The foreman remembers 7. Someone is getting shorted.",
  },
  {
    time: "07:12",
    title: "Material request buried in a thread",
    caption: "“need 20 QUIKRETE” scrolled past the morning check-in messages.",
  },
  {
    time: "Thu.",
    title: "Budget drift caught days late",
    caption: "Johnson Home is 18% over and no one noticed until Friday payroll.",
  },
  {
    time: "Month-end",
    title: "Receipts unaccounted",
    caption: "A $340 concrete receipt lived in the truck’s center console.",
  },
];

const AFTER: ShiftItem[] = [
  {
    time: "06:15",
    title: "Timesheets sign themselves",
    caption: "Crew taps to clock in. Boss approves the day in one swipe. No thread.",
  },
  {
    time: "07:12",
    title: "Requests approved in two taps",
    caption: "Photo, quantity, approve — the line item attaches itself to the job.",
  },
  {
    time: "Anytime",
    title: "Budget moves in real time",
    caption: "Every labor hour and bag of QUIKRETE updates the dashboard live.",
  },
  {
    time: "One click",
    title: "Monthly report, ready",
    caption: "Labor, materials, fuel — exportable, for your bookkeeper.",
  },
];

function Column({
  label,
  heading,
  subtitle,
  items,
  accent,
}: {
  label: string;
  heading: string;
  subtitle: string;
  items: ShiftItem[];
  accent: "muted" | "sage";
}) {
  const accentText = accent === "sage" ? "text-brand-sage" : "text-brand-sage-mist/50";
  const rule = accent === "sage" ? "border-brand-sage/30" : "border-brand-sage-mist/15";

  return (
    <div>
      <p className={`font-mono text-[11px] tracking-[0.22em] uppercase ${accentText} mb-4`}>
        {label}
      </p>
      <h3 className="font-display font-light text-3xl lg:text-[42px] leading-[1.05] text-bone mb-3">
        {heading}
      </h3>
      <p className="text-[15px] text-brand-sage-mist/60 leading-relaxed mb-10 max-w-md">
        {subtitle}
      </p>

      <ul className={`border-t ${rule}`}>
        {items.map((item) => (
          <li
            key={item.title}
            className={`grid grid-cols-[72px_1fr] gap-6 py-5 border-b ${rule}`}
          >
            <span className={`font-mono text-[12px] tracking-[0.08em] uppercase ${accentText} pt-1`}>
              {item.time}
            </span>
            <div>
              <p className="font-display text-[19px] leading-snug text-bone mb-1.5">
                {item.title}
              </p>
              <p className="text-[13.5px] text-brand-sage-mist/55 leading-relaxed">
                {item.caption}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TheShift() {
  return (
    <section id="the-shift" className="relative bg-ink text-bone py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-20 lg:mb-24">
          <FadeIn>
            <SectionLabel tone="invert">The shift</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-bone mb-6"
          >
            Tuesday morning, before and after.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-brand-sage-mist/65 leading-relaxed max-w-xl">
              Same crew of twelve. Same week. One of them is running on receipts and group chats; the other one is running Stroyka.
            </p>
          </FadeIn>
        </div>

        {/* Two editorial columns */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <FadeIn>
            <Column
              label="Before"
              heading="Duct-taped out of four apps."
              subtitle="Hours in WhatsApp. Receipts in the truck. Budgets in a spreadsheet no one has opened since bid day."
              items={BEFORE}
              accent="muted"
            />
          </FadeIn>
          <FadeIn delay={0.12}>
            <Column
              label="After"
              heading="One app. Every number aligned."
              subtitle="Crew clocks in. Budget moves. Materials approve. You open the phone at 6am and know exactly where Johnson Home stands."
              items={AFTER}
              accent="sage"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
