"use client";

import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";

/**
 * FounderNote — the editorial letter.
 *
 * Treated like a letter-from-the-editor in a magazine: centered single column,
 * dateline at top, an oversized italic opening line, drop-capped first letter,
 * and a hand-feel signature (Fraunces italic, slight rotation). Paper, not UI.
 */
export default function FounderNote() {
  const t = useTranslations("founderNote");
  const para1 = t("para1");

  return (
    <section id="founder" className="relative bg-gradient-to-b from-[#D4CBB4] to-[#E3DCC9] py-28 lg:py-36">
      <div className="max-w-2xl mx-auto px-6">
        {/* Dateline */}
        <FadeIn delay={0.05}>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted mb-10 pb-6 border-b border-ink/12">
            {t("location")} <span className="text-ink-muted/50">·</span> {t("eyebrow")}
          </p>
        </FadeIn>

        {/* Opening pull line — oversized italic Fraunces */}
        <FadeIn delay={0.1}>
          <p className="font-display italic font-light text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.12] tracking-[-0.01em] text-ink mb-12 pb-[0.12em]">
            {t("openingLine")}
          </p>
        </FadeIn>

        {/* Body */}
        <FadeIn delay={0.16}>
          <div className="space-y-6 text-[17px] leading-[1.7] text-ink/85">
            <p>
              <span className="font-display float-left text-7xl leading-[0.85] pr-3 pt-1 text-brand-forest">{para1.charAt(0)}</span>
              {para1.slice(1)}
            </p>
            <p>
              {t("para2")}
            </p>
            <p className="font-display italic text-[22px] text-ink leading-snug pb-[0.12em]">
              {t("para3italic")}
            </p>
          </div>
        </FadeIn>

        {/* Signature */}
        <FadeIn delay={0.24}>
          <div className="mt-14 pt-10 border-t border-ink/12">
            <p
              className="font-display italic text-4xl text-ink mb-3 pb-[0.12em]"
              style={{ transform: "rotate(-2deg)", transformOrigin: "left center" }}
            >
              {t("signature")}
            </p>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-muted">
              {t("name")} <span className="text-ink-muted/50">·</span> {t("role")}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
