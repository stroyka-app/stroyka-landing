"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import FlapText from "../ui/FlapText";

const COUNT = 9;

/**
 * FAQ as a numbered list. One answer open at a time; the row's plus turns
 * into a cross, and the answer opens with a grid-rows transition (no
 * measured heights, no layout thrash on resize).
 */
export default function Answers() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-site-night py-24 text-site-paper md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("eyebrow")}</p>
          <FlapText
            lines={[t("heading")]}
            className="font-flex text-[clamp(2.2rem,4.2vw,4rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
          />
          <p className="mt-6 max-w-sm text-[15.5px] leading-relaxed text-site-paper/65">{t("subhead")}</p>
        </div>

        <ul className="border-t border-site-paper/10">
          {Array.from({ length: COUNT }).map((_, i) => {
            const isOpen = open === i;
            const id = `faq-answer-${i}`;
            return (
              <li key={i} className="border-b border-site-paper/10">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start gap-5 py-6 text-left md:gap-8 md:py-7"
                  >
                    <span className={`mt-1 font-mono text-[11px] tabular-nums tracking-[0.1em] transition-colors ${isOpen ? "text-site-vis" : "text-site-paper/40"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-flex text-[19px] font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-site-vis md:text-[23px]">
                      {t(`items.${i}.q`)}
                    </span>
                    <span
                      className={`mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full ring-1 ring-inset transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-45 bg-site-vis text-site-on-vis ring-site-vis" : "text-site-paper/70 ring-site-paper/20"}`}
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={id}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-[calc(11px*2+1.25rem)] text-[15.5px] leading-relaxed text-site-paper/70 md:pl-[calc(11px*2+2rem)]">
                      {t(`items.${i}.a`)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
