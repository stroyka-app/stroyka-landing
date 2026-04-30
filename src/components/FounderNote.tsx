"use client";

import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * FounderNote — the editorial letter.
 *
 * Treated like a letter-from-the-editor in a magazine: centered single column,
 * dateline at top, an oversized italic opening line, drop-capped first letter,
 * and a hand-feel signature (Fraunces italic, slight rotation). Paper, not UI.
 */
const FOUNDER = {
  name: "Maks Dalen",
  title: "Founder, Stroyka",
  location: "Austin, Texas",
  signatureName: "Maks",
  dateline: "A letter from the founder · Vol. 01",
};

export default function FounderNote() {
  return (
    <section id="founder" className="relative bg-gradient-to-b from-[#D4CBB4] to-[#E3DCC9] py-28 lg:py-36">
      <div className="max-w-2xl mx-auto px-6">
        <FadeIn>
          <SectionLabel>A letter</SectionLabel>
        </FadeIn>

        {/* Dateline */}
        <FadeIn delay={0.05}>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted mb-10 pb-6 border-b border-ink/12">
            {FOUNDER.location} <span className="text-ink-muted/50">·</span> {FOUNDER.dateline}
          </p>
        </FadeIn>

        {/* Opening pull line — oversized italic Fraunces */}
        <FadeIn delay={0.1}>
          <p className="font-display italic font-light text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.12] tracking-[-0.01em] text-ink mb-12">
            I grew up on jobsites.
          </p>
        </FadeIn>

        {/* Body */}
        <FadeIn delay={0.16}>
          <div className="space-y-6 text-[17px] leading-[1.7] text-ink/85">
            <p>
              <span className="font-display float-left text-7xl leading-[0.85] pr-3 pt-1 text-brand-forest">M</span>
              y family ran a framing crew out of a spreadsheet, a clipboard, and
              a group chat nobody had the energy to keep clean by the end of the
              week. Budgets drifted. Receipts vanished. The answer to
              &ldquo;where are we on Johnson Home?&rdquo; was usually a shrug.
            </p>
            <p>
              Stroyka is the tool I wanted to hand my old man. Flat pricing.
              Works offline. Takes an afternoon to learn. Built for the crew,
              not the back office. Nothing more, nothing less.
            </p>
            <p className="font-display italic text-[22px] text-ink leading-snug">
              If it doesn&rsquo;t make your Tuesday easier, it has no business
              being on your phone.
            </p>
          </div>
        </FadeIn>

        {/* Signature */}
        <FadeIn delay={0.24}>
          <div className="mt-14 pt-10 border-t border-ink/12">
            <p
              className="font-display italic text-4xl text-ink mb-3"
              style={{ transform: "rotate(-2deg)", transformOrigin: "left center" }}
            >
              — {FOUNDER.signatureName}
            </p>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
              {FOUNDER.name} <span className="text-ink-muted/50">·</span> {FOUNDER.title}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
