"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useScroll, useTime, useTransform, type MotionValue } from "motion/react";
import { useReduced } from "@/components/site/ui/useReduced";

/**
 * The compare page's close: a bulldozer drives across the forest band as it
 * scrolls through the viewport, the way the crane crosses the home's Finale.
 *
 * Everything is tied to one progress value: the dozer's x, its tracks
 * (a tread pattern whose dash offset is the distance travelled), the road
 * wheels (spun at the matching rate), the receipts scattered along the lane
 * (each one vanishes as the blade reaches it) and the pile in front of the
 * blade (grows with every receipt scraped up). Exhaust puffs run on time.
 * Only transform / opacity / strokeDashoffset animate.
 *
 * Reduced motion: parked mid-lane, drawn statically, half the receipts
 * already in the pile.
 */

// Lane geometry, in % of the band width. The dozer is wider relative to the
// lane on phones; `w` is its width in % and the blade tip is x + w.
const RECEIPTS = [8, 17, 29, 38, 47, 58, 66, 77, 86, 94];

function useDozerWidth(): number {
  const [w, setW] = useState(26);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setW(mq.matches ? 46 : 26);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return w;
}

export default function DozerPass({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduced = useReduced();
  const w = useDozerWidth();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const pos = useTransform(scrollYProgress, [0.12, 0.92], [-w - 4, 104], { clamp: true });
  const parked = useTransform(scrollYProgress, () => 34);
  const x = reduced ? parked : pos;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] md:h-[210px]">
      {/* Ground: a graded lane with survey ticks. */}
      <div className="absolute inset-x-0 bottom-[22px] h-px bg-site-on-vis/25 md:bottom-[30px]" />
      <div
        className="absolute inset-x-0 bottom-[14px] h-2 md:bottom-[20px]"
        style={{
          backgroundImage: "linear-gradient(90deg, rgb(var(--site-on-vis) / 0.18) 1px, transparent 1px)",
          backgroundSize: "48px 100%",
        }}
      />

      {RECEIPTS.map((at, i) => (
        <Receipt key={at} at={at} index={i} x={x} w={w} />
      ))}

      <Dozer x={x} w={w} reduced={reduced} />
    </div>
  );
}

/** A receipt on the lane; gone once the blade's leading edge passes it. */
function Receipt({ at, index, x, w }: { at: number; index: number; x: MotionValue<number>; w: number }) {
  // Blade tip ≈ dozer left + its width.
  const opacity = useTransform(x, (v) => (v + w - 1 < at ? 1 : 0));
  const y = useTransform(x, (v) => (v + w - 1 < at ? 0 : -10));
  return (
    <motion.div
      className="absolute bottom-[23px] md:bottom-[31px]"
      style={{ left: `${at}%`, opacity, y, rotate: ((index * 47) % 50) - 25 }}
    >
      <div className="h-[14px] w-[11px] rounded-[1.5px] bg-site-on-vis/45 md:h-[18px] md:w-[14px]">
        <div className="mx-auto mt-[3px] h-px w-[70%] bg-site-vis/60" />
        <div className="mx-auto mt-[2px] h-px w-[55%] bg-site-vis/60" />
      </div>
    </motion.div>
  );
}

function Dozer({ x, w, reduced }: { x: MotionValue<number>; w: number; reduced: boolean }) {
  // translateX in % of a FULL-WIDTH track = % of the lane (transform only).
  const shift = useTransform(x, (v) => `${v}%`);
  // Distance travelled → tread offset and wheel spin (1% of lane ≈ 14 units).
  const tread = useTransform(x, (v) => -v * 14);
  const spin = useTransform(x, (v) => v * 40);
  // Receipts scraped so far → the pile in front of the blade grows.
  const scraped = useTransform(x, (v) => RECEIPTS.filter((r) => v + w - 1 >= r).length);
  const pile = useTransform(scraped, (n) => 0.35 + (n / RECEIPTS.length) * 0.9);
  const time = useTime();

  return (
    <motion.div className="absolute inset-x-0 bottom-[10px] md:bottom-[16px]" style={{ x: shift }}>
      <div style={{ width: `${w}%`, maxWidth: 380 }}>
      <svg viewBox="0 0 420 190" className="h-auto w-full overflow-visible">
        <g fill="rgb(var(--site-on-vis))" stroke="rgb(var(--site-on-vis))">
          {/* Exhaust puffs */}
          {!reduced && [0, 1, 2].map((i) => <Puff key={i} i={i} time={time} />)}

          {/* Exhaust stack */}
          <rect x="120" y="30" width="10" height="42" rx="2" fillOpacity="0.55" strokeWidth="0" />
          <rect x="116" y="26" width="18" height="7" rx="2" fillOpacity="0.55" strokeWidth="0" />

          {/* Cab (ROPS frame + glass) */}
          <path d="M150 34 H236 L248 96 H150 Z" fillOpacity="0.12" strokeOpacity="0.55" strokeWidth="5" strokeLinejoin="round" />
          <path d="M162 46 H226 L234 86 H162 Z" fillOpacity="0.06" strokeOpacity="0.35" strokeWidth="2" />
          {/* Engine hood */}
          <path d="M40 72 H150 V118 H34 Z" fillOpacity="0.4" strokeWidth="0" />
          <g fillOpacity="0.28" strokeWidth="0">
            {[52, 66, 80, 94].map((gx) => (
              <rect key={gx} x={gx} y="82" width="7" height="26" rx="1.5" />
            ))}
          </g>
          {/* Body */}
          <path d="M30 112 H280 V138 H30 Z" fillOpacity="0.5" strokeWidth="0" />

          {/* Blade arm + blade (front = right) */}
          <path d="M262 118 L322 106" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* Concave to the front (top and cutting edge lead the middle),
              the way a real blade rolls the load forward. */}
          <path d="M328 48 Q308 106 336 164 L350 164 Q322 106 342 48 Z" fillOpacity="0.62" strokeWidth="0" />
          <path d="M334 164 L354 164" strokeOpacity="0.85" strokeWidth="4" strokeLinecap="round" />
          <path d="M326 48 L344 48" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />

          {/* Track: frame, tread belt (rolls), road wheels (spin) */}
          <rect x="18" y="136" width="286" height="48" rx="24" fillOpacity="0.22" strokeWidth="0" />
          <motion.rect
            x="18"
            y="136"
            width="286"
            height="48"
            rx="24"
            fill="none"
            strokeOpacity="0.75"
            strokeWidth="6"
            strokeDasharray="10 7"
            style={{ strokeDashoffset: tread }}
          />
          {[44, 96, 148, 200, 252, 280].map((cx, i) => (
            <motion.g
              key={cx}
              style={{ rotate: spin, transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={cx} cy="160" r={i === 0 || i === 5 ? 17 : 12} fillOpacity="0.45" strokeWidth="0" />
              <path
                d={`M${cx - 8} 160 H${cx + 8} M${cx} ${160 - 8} V${160 + 8}`}
                strokeOpacity="0.8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </motion.g>
          ))}
        </g>

        {/* The pile of scraped-up receipts, pushed ahead of the blade. */}
        <motion.g style={{ scale: pile, transformBox: "fill-box", transformOrigin: "left bottom" }}>
          <path d="M348 164 Q364 112 394 124 Q416 138 414 164 Z" fill="rgb(var(--site-on-vis))" fillOpacity="0.32" />
          {[
            [362, 142, -18],
            [376, 132, 12],
            [390, 146, -6],
            [398, 134, 24],
          ].map(([rx, ry, r], i) => (
            <rect
              key={i}
              x={rx}
              y={ry}
              width="11"
              height="14"
              rx="1.5"
              fill="rgb(var(--site-on-vis))"
              fillOpacity="0.6"
              transform={`rotate(${r} ${rx + 5} ${ry + 7})`}
            />
          ))}
        </motion.g>
      </svg>
      </div>
    </motion.div>
  );
}

/** One exhaust puff: rises, drifts back, grows and fades, on a 1.8s loop. */
function Puff({ i, time }: { i: number; time: MotionValue<number> }) {
  const phase = useTransform(time, (t) => ((t / 1800 + i / 3) % 1));
  const cy = useTransform(phase, (p) => 22 - p * 30);
  const cx = useTransform(phase, (p) => 125 - p * 26);
  const r = useTransform(phase, (p) => 5 + p * 9);
  const opacity = useTransform(phase, (p) => 0.35 * (1 - p));
  return <motion.circle cx={cx} cy={cy} r={r} style={{ opacity }} strokeWidth="0" />;
}
