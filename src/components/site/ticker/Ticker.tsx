"use client";

import { useTranslations } from "next-intl";

/**
 * A hi-vis tape of the day on a real job, running under the Lift. Pure CSS
 * marquee (the shared `animate-marquee` keyframe), paused under reduced
 * motion and on hover so a line can actually be read.
 */
export default function Ticker() {
  const t = useTranslations("site.ticker");
  const events = t.raw("events") as string[];
  const row = (
    <div className="flex shrink-0 items-center">
      {events.map((e) => (
        <span key={e} className="flex items-center whitespace-nowrap px-6 font-mono text-[12.5px] uppercase tracking-[0.14em]">
          <span className="mr-6 inline-block h-1.5 w-1.5 rotate-45 bg-site-night" />
          {e}
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative z-10 -rotate-[1.2deg] bg-site-night py-6">
      <div className="group flex overflow-hidden bg-site-vis py-3.5 text-site-night">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
