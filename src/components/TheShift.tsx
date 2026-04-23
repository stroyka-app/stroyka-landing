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

/**
 * Before column — literally warmer/messier.
 *   - warm tan bg tint (clay-family)
 *   - crosshatch "newsprint" texture overlay
 *   - clay accent ink
 *   - cluttered, slightly tilted time labels
 */
function BeforeColumn() {
  return (
    <div className="relative">
      {/* Warm tan card with crosshatch noise */}
      <div className="texture-crosshatch rounded-sm border border-clay/25 bg-[linear-gradient(135deg,#EFE2C8_0%,#E8D7B6_100%)] p-8 lg:p-10 relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-30 blur-[60px]"
          style={{ background: "radial-gradient(circle, #C9844E 0%, transparent 70%)" }}
        />

        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-clay mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" aria-hidden />
          Before
        </p>
        <h3 className="font-display font-light text-3xl lg:text-[42px] leading-[1.05] text-ink mb-3">
          Duct-taped out of four apps.
        </h3>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-md">
          Hours in WhatsApp. Receipts in the truck. Budgets in a spreadsheet no one has opened since bid day.
        </p>

        <ul className="space-y-0 border-t border-clay/20">
          {BEFORE.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[88px_1fr] gap-5 py-5 border-b border-clay/20 relative"
              style={{
                transform: `rotate(${(i % 2 === 0 ? 0.2 : -0.15)}deg)`,
              }}
            >
              <span className="font-mono text-[12px] tracking-[0.08em] uppercase text-clay pt-1">
                {item.time}
              </span>
              <div>
                <p className="font-display text-[19px] leading-snug text-ink mb-1.5">
                  {item.title}
                </p>
                <p className="text-[13.5px] text-ink-muted leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * After column — literally cleaner/calmer.
 *   - crisp cream card (warmer than section bg so it reads raised)
 *   - sage-bright accent ink, subtle sage glow halo
 *   - tight vertical alignment, no tilt
 */
function AfterColumn() {
  return (
    <div className="relative">
      <div className="relative rounded-sm border border-brand-sage/30 bg-bone p-8 lg:p-10 overflow-hidden shadow-[0_30px_80px_-40px_rgba(63,78,53,0.35)]">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-35 blur-[60px]"
          style={{ background: "radial-gradient(circle, #B8D4BD 0%, transparent 70%)" }}
        />

        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-brand-forest mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-sage-bright" aria-hidden />
          After
        </p>
        <h3 className="font-display font-light text-3xl lg:text-[42px] leading-[1.05] text-ink mb-3">
          One app. Every number aligned.
        </h3>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-md">
          Crew clocks in. Budget moves. Materials approve. You open the phone at 6am and know exactly where Johnson Home stands.
        </p>

        <ul className="space-y-0 border-t border-brand-sage/30">
          {AFTER.map((item) => (
            <li
              key={item.title}
              className="grid grid-cols-[88px_1fr] gap-5 py-5 border-b border-brand-sage/30"
            >
              <span className="font-mono text-[12px] tracking-[0.08em] uppercase text-brand-forest pt-1">
                {item.time}
              </span>
              <div>
                <p className="font-display text-[19px] leading-snug text-ink mb-1.5">
                  {item.title}
                </p>
                <p className="text-[13.5px] text-ink-soft/80 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function TheShift() {
  return (
    <section id="the-shift" className="relative bg-bone-soft py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-20 lg:mb-24">
          <FadeIn>
            <SectionLabel>The shift</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            Tuesday morning, before and after.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
              Same crew of twelve. Same week. One of them is running on receipts and group chats; the other one is running Stroyka.
            </p>
          </FadeIn>
        </div>

        {/* Two columns — intentionally different bg, texture, and accent
            colors so the visual difference carries the story even before
            you read a line item. */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <FadeIn>
            <BeforeColumn />
          </FadeIn>
          <FadeIn delay={0.12}>
            <AfterColumn />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
