"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import FlapText from "../ui/FlapText";
import { useReduced } from "../ui/useReduced";
import { LINE_H, NODE_X, contourPath, reachedCount } from "./contour";

// SSR-safe layout effect: measures before paint on the client (no flash of
// the unmeasured width={1200} default), but doesn't warn on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const STEPS = [0, 1, 2, 3] as const;
/** Phone rail insets inside the list (px): top-3 / bottom-12. */
const RAIL_TOP = 12;
const RAIL_BOTTOM = 48;
/** Node centre from the top of its step on phones (h-6 node). */
const NODE_Y = 12;
const STAMP = { type: "spring", stiffness: 380, damping: 14 } as const;

/**
 * HOW IT WORKS — the first week with Stroyka, as four stamps on a contour.
 *
 * One scroll progress drives both layouts. Desktop: a survey-contour line
 * runs across four columns and draws itself (pathLength); each column's node
 * stamps when the tip reaches it. Phones: a rail down the left fills
 * (scaleY) and each step stamps as the fill passes its node. The same
 * `marks` array decides both the stamp and where the tip is, so a node is
 * never stamped ahead of the line. Reduced motion: all drawn, all stamped.
 */
export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const tn = useTranslations("nav");
  const td = useTranslations("site.how");
  const days = td.raw("days") as string[];
  const reduced = useReduced();

  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.8", "end 0.6"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  // Desktop line width (px) and the stamp thresholds for the current layout.
  const [width, setWidth] = useState(1200);
  const [marks, setMarks] = useState<readonly number[]>(NODE_X);
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    const list = listRef.current;
    if (!track || !list) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const measure = () => {
      setWidth(Math.round(track.clientWidth));
      if (!mq.matches) {
        setMarks(NODE_X);
        return;
      }
      const rail = list.offsetHeight - RAIL_TOP - RAIL_BOTTOM;
      const items = Array.from(list.querySelectorAll<HTMLLIElement>("li[data-step]"));
      setMarks(items.map((li) => Math.min(1, Math.max(0, (li.offsetTop + NODE_Y - RAIL_TOP) / rail))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, []);

  const [reached, setReached] = useState(0);
  // The spring fires every frame; only re-render when the stamped count moves.
  const lastReached = useRef(0);
  useMotionValueEvent(drawn, "change", (v) => {
    const n = reachedCount(v, marks);
    if (n === lastReached.current) return;
    lastReached.current = n;
    setReached(n);
  });
  useEffect(() => {
    const n = reachedCount(drawn.get(), marks);
    lastReached.current = n;
    setReached(n);
  }, [marks, drawn]);
  const shown = reduced ? STEPS.length : reached;
  const d = contourPath(width, LINE_H);

  return (
    // md:pt-24, not the usual 36: FeatureStack above ends on a sticky
    // 88vh card slot (~20vh of empty tail), so a full 36 read as a void.
    <section id="how-it-works" className="relative bg-site-night pb-24 pt-24 text-site-paper md:pb-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{tn("howItWorks")}</p>
        <FlapText
          lines={[t("heading")]}
          className="max-w-[18ch] font-flex text-[clamp(2.3rem,4.8vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
        />
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-site-paper/70">{t("subhead")}</p>

        <div ref={trackRef} className="relative mt-16 overflow-x-clip md:mt-24">
          {/* Desktop contour: two faint echoes (a site plan's neighbouring
              contours), a dotted guide, and the forest line that draws. */}
          <svg
            aria-hidden
            width={width}
            height={LINE_H}
            viewBox={`0 0 ${width} ${LINE_H}`}
            className="pointer-events-none absolute left-0 top-0 hidden overflow-visible md:block"
          >
            {[-14, 14].map((dy) => (
              <path key={dy} d={d} transform={`translate(0 ${dy})`} fill="none" stroke="rgb(var(--site-paper) / 0.07)" strokeWidth={1} />
            ))}
            <path d={d} fill="none" stroke="rgb(var(--site-paper) / 0.18)" strokeWidth={1.5} strokeDasharray="2 6" strokeLinecap="round" />
            <motion.path
              d={d}
              fill="none"
              stroke="rgb(var(--site-vis))"
              strokeWidth={2.25}
              strokeLinecap="round"
              style={{ pathLength: reduced ? 1 : drawn }}
            />
          </svg>

          <ol ref={listRef} className="relative grid md:grid-cols-4 md:pt-[88px]">
            {/* Phone rail: 2px track + forest fill, behind the nodes (centred on the 24px node). */}
            <span aria-hidden className="absolute bottom-12 left-[11px] top-3 w-0.5 bg-site-paper/15 md:hidden">
              <motion.span className="block h-full w-full origin-top bg-site-vis" style={{ scaleY: reduced ? 1 : drawn }} />
            </span>
            {STEPS.map((i) => (
              <Step
                key={i}
                i={i}
                on={i < shown}
                reduced={reduced}
                day={days[i]}
                title={t(`steps.${i}.title`)}
                body={t(`steps.${i}.body`)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ i, on, reduced, day, title, body }: { i: number; on: boolean; reduced: boolean; day: string; title: string; body: string }) {
  return (
    <li data-step={i} data-reached={on ? "1" : "0"} className="relative pb-12 pl-12 last:pb-0 md:px-6 md:pb-0 md:text-center">
      <Node on={on} reduced={reduced} />
      <motion.div
        initial={false}
        animate={{ opacity: on ? 1 : 0.4, y: on ? 0 : 8 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-vis">{day}</p>
        <h3 className="mt-3 font-flex text-[22px] font-semibold leading-tight tracking-[-0.015em] [font-variation-settings:'wdth'_108] md:text-[24px]">
          {title}
        </h3>
        <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-site-paper/70 md:mx-auto md:max-w-[28ch]">{body}</p>
      </motion.div>
    </li>
  );
}

/** A survey node: an empty ring until the line arrives, then it stamps. */
function Node({ on, reduced }: { on: boolean; reduced: boolean }) {
  const spring = reduced ? { duration: 0 } : STAMP;
  return (
    <span
      aria-hidden
      className="absolute left-0 top-0 grid h-6 w-6 place-items-center md:left-1/2 md:top-[-44px] md:-translate-x-1/2 md:-translate-y-1/2"
    >
      <span className="absolute inset-0 rounded-full bg-site-night ring-2 ring-inset ring-site-paper/20" />
      <motion.span
        className="absolute inset-0 rounded-full ring-2 ring-inset ring-site-vis"
        initial={false}
        animate={{ scale: on ? 1 : 0, rotate: on ? 0 : -12, opacity: on ? 1 : 0 }}
        transition={spring}
      />
      <motion.span className="relative h-2 w-2 rounded-full bg-site-vis" initial={false} animate={{ scale: on ? 1 : 0 }} transition={spring} />
      <AnimatePresence>
        {on && !reduced && (
          <motion.span
            key="impact"
            className="absolute inset-0 rounded-full ring-2 ring-site-vis"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.85, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}
