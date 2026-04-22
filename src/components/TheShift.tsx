"use client";

import {
  Clock,
  DollarSign,
  CheckCheck,
  LineChart,
  MessageSquare,
  Search,
  Receipt,
  TrendingDown,
} from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

/**
 * Before / After rows are paired 1:1 so the reader can scan laterally and
 * see exactly which pain each feature solves. Order matters — keep parallel.
 */

interface Item {
  icon: typeof Clock;
  title: string;
  caption: string;
}

const BEFORE: Item[] = [
  {
    icon: MessageSquare,
    title: "Timesheet dispute in WhatsApp",
    caption: "6:15 AM · Jose logged 9h, foreman remembers 7",
  },
  {
    icon: TrendingDown,
    title: "Budget drift caught days late",
    caption: "Thursday · Johnson Home is already 18% over",
  },
  {
    icon: Search,
    title: "Material request buried in a thread",
    caption: "7:12 AM · \"need 20 QUIKRETE\" scrolled past",
  },
  {
    icon: Receipt,
    title: "Receipts unaccounted at month close",
    caption: "Month end · $340 concrete receipt lost in the truck",
  },
];

const AFTER: Item[] = [
  {
    icon: Clock,
    title: "Timesheets sign themselves",
    caption: "Crew taps to clock, boss approves in a swipe",
  },
  {
    icon: DollarSign,
    title: "Budget updates in real time",
    caption: "Every hour, every bag of QUIKRETE, on the bar",
  },
  {
    icon: CheckCheck,
    title: "Requests approved in two taps",
    caption: "Photo, qty, approve — attached to the job",
  },
  {
    icon: LineChart,
    title: "Monthly reports, one click",
    caption: "Labor, materials, fuel — exportable for your bookkeeper",
  },
];

function Row({
  icon: Icon,
  title,
  caption,
  tone,
}: Item & { tone: "bad" | "good" }) {
  // Warm-amber "bad" tone keeps the problem/solution visual hierarchy but
  // stays inside the brand palette (brand-amber is the existing accent).
  // Previously pure Tailwind red which clashed with the rest of the site.
  const container =
    tone === "bad"
      ? "bg-amber-950/25 border-amber-400/15"
      : "bg-brand-midnight/60 border-brand-forest/15";
  const iconBox =
    tone === "bad"
      ? "bg-amber-500/15 text-amber-300"
      : "bg-brand-forest/20 text-brand-sage";
  const captionCls =
    tone === "bad"
      ? "text-amber-200/65"
      : "text-brand-sage-mist/55";

  return (
    <div className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${container}`}>
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBox}`}
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-[14.5px] font-medium text-white leading-tight">
          {title}
        </p>
        <p className={`mt-1 text-[12.5px] leading-snug ${captionCls}`}>
          {caption}
        </p>
      </div>
    </div>
  );
}

export default function TheShift() {
  return (
    <section id="the-shift" className="relative py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header — aligned left, matching the rest of the site's rhythm */}
        <div className="max-w-2xl mb-14 lg:mb-16">
          <FadeIn>
            <SectionLabel>The shift</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            Tuesday morning looks different.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75">
              Before and after Stroyka, with the same crew of twelve.
            </p>
          </FadeIn>
        </div>

        {/* Two cards, one narrative */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ── Before ─────────────────────────────────────────────── */}
          {/* FadeIn wrapper handles the scroll-reveal. The inner div is a
              plain container — previously a second motion.div with its own
              whileInView created a double-stutter. */}
          <FadeIn>
            <div className="relative overflow-hidden h-full rounded-2xl p-8 lg:p-10 border border-amber-400/15 bg-gradient-to-br from-amber-950/20 via-brand-deep/70 to-brand-midnight/80 backdrop-blur-sm">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-amber-500/15 blur-[80px]"
              />
              <span className="inline-flex items-center gap-2 mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Before
              </span>
              <h3 className="text-2xl lg:text-[28px] font-heading font-bold text-white mb-4 leading-snug">
                Duct-taped out of four apps.
              </h3>
              <p className="text-brand-sage-mist/75 text-[15px] leading-relaxed mb-7 max-w-md">
                Hours in WhatsApp. Receipts in the truck. Budgets in a
                spreadsheet no one&rsquo;s opened since bid day. One rainy
                Tuesday and the week slips.
              </p>

              <div className="flex flex-col gap-2.5">
                {BEFORE.map((item) => (
                  <Row key={item.title} {...item} tone="bad" />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* ── After ──────────────────────────────────────────────── */}
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden h-full rounded-2xl p-8 lg:p-10 border border-brand-forest/25 bg-gradient-to-br from-brand-forest/20 via-brand-deep/70 to-brand-midnight/80 backdrop-blur-sm">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-brand-sage/25 blur-[80px]"
              />
              <span className="inline-flex items-center gap-2 mb-4 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-sage">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
                After
              </span>
              <h3 className="text-2xl lg:text-[28px] font-heading font-bold text-white mb-4 leading-snug">
                One app. Every number aligned.
              </h3>
              <p className="text-brand-sage-mist/75 text-[15px] leading-relaxed mb-7 max-w-md">
                Crew clocks in. Budget moves. Materials approve. You open the
                phone at 6am and know exactly where Johnson Home stands.
              </p>

              <div className="flex flex-col gap-2.5">
                {AFTER.map((item) => (
                  <Row key={item.title} {...item} tone="good" />
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
