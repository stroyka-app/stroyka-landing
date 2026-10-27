"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pause, Play } from "lucide-react";
import { useReduced } from "../ui/useReduced";

/**
 * A hi-vis tape of the day on a real job, running under the Lift. Pure CSS
 * marquee (the shared `animate-marquee` keyframe), paused on hover so a line
 * can actually be read.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide): it moves for longer than five seconds, so
 * it carries a real pause/play button that keyboard and touch users can reach,
 * and it does not move at all under prefers-reduced-motion (the button goes
 * with it). The loop needs the row twice; the copy is aria-hidden so a screen
 * reader hears each event once.
 */
export default function Ticker() {
  const t = useTranslations("site.ticker");
  const events = t.raw("events") as string[];
  const reduced = useReduced();
  const [paused, setPaused] = useState(false);

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {events.map((e) => (
        <span key={e} className="flex items-center whitespace-nowrap px-6 font-mono text-[12.5px] uppercase tracking-[0.14em]">
          <span aria-hidden className="mr-6 inline-block h-1.5 w-1.5 rotate-45 bg-site-on-vis" />
          {e}
        </span>
      ))}
    </div>
  );

  return (
    // The unrotated wrapper clips: a full-width band tilted 1.2° pokes its
    // corners ~30px past the viewport and gave the page a sideways scroll.
    <div className="relative z-10 overflow-hidden bg-site-night py-8">
      <div className="-mx-4 -rotate-[1.2deg]">
        <div className="group flex overflow-hidden bg-site-vis py-3.5 text-site-on-vis">
          <div
            className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={paused ? { animationPlayState: "paused" } : undefined}
          >
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? t("play") : t("pause")}
          className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-site-night text-site-paper shadow-[0_6px_16px_-8px_rgb(var(--site-paper)/0.5)] ring-1 ring-inset ring-site-paper/20 transition-colors duration-200 hover:text-site-vis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night md:right-8"
        >
          {paused ? <Play aria-hidden size={14} strokeWidth={2.5} /> : <Pause aria-hidden size={14} strokeWidth={2.5} />}
        </button>
      )}
    </div>
  );
}
