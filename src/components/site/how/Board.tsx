"use client";

import { useTranslations } from "next-intl";
import { motion, useTransform, type MotionValue } from "motion/react";
import { LOADS } from "../scene/choreo";
import { hop, seg, type Pt } from "./beats";

/**
 * The drafting board: the first week of Job 204 as one drawing that builds
 * itself from a single progress value (0‥1, four beats).
 *
 *  0  the lot and the building footprint are drawn, the job tag stamps on
 *  1  a phone slides in, invites fly out, three hard hats pop in at the street
 *  2  the geofence is drawn, the crew walks on site and clocks in, a flatbed
 *     drives in and drops lumber, the first task gets its check
 *  3  the report sheet slides over, the day's costs fly into its rows, the
 *     bars grow and it's stamped ON BUDGET
 *
 * Everything is a transform of `progress` (opacity / transform / pathLength
 * only), so it scrubs both ways with the scroll and a jump lands exactly.
 * The same figures as the crane ledger above: labor, lumber, concrete.
 */

const INK = "rgb(var(--site-paper) / 0.85)";
const SOFT = "rgb(var(--site-paper) / 0.45)";
const FAINT = "rgb(var(--site-paper) / 0.12)";
const VIS = "rgb(var(--site-vis))";
const NIGHT = "rgb(var(--site-night))";
const ON_VIS = "rgb(var(--site-on-vis))";
const FILL_BOX = { transformBox: "fill-box", transformOrigin: "center" } as const;

const load = (id: string) => LOADS.find((l) => l.id === id)!;
const LABOR = load("labor");
const LUMBER = load("lumber");
const CONCRETE = load("concrete");
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Crew: where they wait at the street, where they clock in, their initials. */
const CREW: readonly { from: Pt; to: Pt; tag: string; time: string }[] = [
  { from: [236, 384], to: [222, 300], tag: "MR", time: "7:02" },
  { from: [292, 390], to: [272, 314], tag: "JL", time: "7:04" },
  { from: [348, 384], to: [322, 300], tag: "AK", time: "7:05" },
];
const PHONE_OUT: Pt = [556, 212];
/** Report rows: the day's costs, landing from where they happened. */
const ROWS: readonly { name: string; amount: number; ratio: number; from: Pt; color: string }[] = [
  { name: "labor", amount: LABOR.cost, ratio: 0.82, from: [272, 286], color: "rgb(var(--site-vis))" },
  { name: "lumber", amount: LUMBER.cost, ratio: 0.7, from: [478, 352], color: LUMBER.color },
  { name: "concrete", amount: CONCRETE.cost, ratio: 0.9, from: [266, 196], color: CONCRETE.color },
];
const SPENT = LABOR.cost + LUMBER.cost + CONCRETE.cost;

function useSeg(p: MotionValue<number>, beat: number, a: number, b: number) {
  return useTransform(p, (v) => seg(v, beat, a, b));
}

/** A stamp-land: 0 → overshoot → settle, as scale, with the rotation easing in. */
const stampScale = (s: number) => (s <= 0 ? 0 : s < 0.6 ? (s / 0.6) * 1.12 : 1.12 - ((s - 0.6) / 0.4) * 0.12);

export default function Board({
  progress,
  className = "",
  decorative = false,
  id,
}: {
  progress: MotionValue<number>;
  className?: string;
  /** Hidden from assistive tech: the step text says it all. */
  decorative?: boolean;
  /** Unique per board on the page (the grid pattern needs a stable, SSR-safe id). */
  id: string;
}) {
  const t = useTranslations("site.how.board");
  const tl = useTranslations("site.lift.loads");
  const tj = useTranslations("site.lift.ledger");
  const grid = `how-grid-${id}`;

  /* ── beat 0: the drawing ─────────────────────────────────────────────── */
  const lot = useSeg(progress, 0, 0, 0.45);
  const footprint = useSeg(progress, 0, 0.25, 0.65);
  const hatch = useSeg(progress, 0, 0.55, 0.8);
  const dims = useSeg(progress, 0, 0.5, 0.72);
  const tag = useSeg(progress, 0, 0.68, 0.92);
  const tagScale = useTransform(tag, stampScale);
  const tagRotate = useTransform(tag, [0, 1], [-14, -4]);

  /* ── beat 1: the crew ────────────────────────────────────────────────── */
  const phone = useSeg(progress, 1, 0, 0.22);
  const phoneX = useTransform(phone, (v) => Math.round((1 - v) * 180));
  const invites = [useSeg(progress, 1, 0.22, 0.5), useSeg(progress, 1, 0.36, 0.64), useSeg(progress, 1, 0.5, 0.78)];
  const pops = [useSeg(progress, 1, 0.48, 0.62), useSeg(progress, 1, 0.62, 0.76), useSeg(progress, 1, 0.76, 0.9)];

  /* ── beat 2: the day ─────────────────────────────────────────────────── */
  const fence = useSeg(progress, 2, 0, 0.3);
  const walk = useSeg(progress, 2, 0.15, 0.45);
  const clocks = [useSeg(progress, 2, 0.42, 0.58), useSeg(progress, 2, 0.48, 0.64), useSeg(progress, 2, 0.54, 0.7)];
  const drive = useSeg(progress, 2, 0.42, 0.72);
  const drop = useSeg(progress, 2, 0.72, 0.88);
  const truckX = useTransform(drive, (v) => Math.round(720 - (720 - 470) * (1 - Math.pow(1 - v, 3))));
  const task = useSeg(progress, 2, 0.78, 0.9);
  const check = useSeg(progress, 2, 0.85, 1);

  /* ── beat 3: the numbers ─────────────────────────────────────────────── */
  const sheet = useSeg(progress, 3, 0, 0.28);
  const sheetY = useTransform(sheet, (v) => Math.round((1 - (1 - Math.pow(1 - v, 3))) * 470));
  const flights = [useSeg(progress, 3, 0.18, 0.45), useSeg(progress, 3, 0.26, 0.53), useSeg(progress, 3, 0.34, 0.61)];
  const landed = [
    useTransform(flights[0], (v) => (v >= 1 ? 1 : 0)),
    useTransform(flights[1], (v) => (v >= 1 ? 1 : 0)),
    useTransform(flights[2], (v) => (v >= 1 ? 1 : 0)),
  ];
  const bars = [useSeg(progress, 3, 0.45, 0.7), useSeg(progress, 3, 0.53, 0.78), useSeg(progress, 3, 0.61, 0.86)];
  const total = useSeg(progress, 3, 0.7, 0.85);
  const stamp = useSeg(progress, 3, 0.82, 0.96);
  const stampS = useTransform(stamp, stampScale);
  const ring = useTransform(stamp, (v) => (v <= 0 ? 0 : 1 + v * 0.85));
  const ringO = useTransform(stamp, (v) => (v <= 0 ? 0 : 0.7 * (1 - v)));

  return (
    <svg
      viewBox="0 0 640 460"
      className={`block h-auto w-full ${className}`}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": tj("job") })}
    >
      <defs>
        <pattern id={grid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={FAINT} strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* The sheet */}
      <rect x="0" y="0" width="640" height="460" rx="26" fill="rgb(var(--site-slab))" />
      <rect x="0" y="0" width="640" height="460" rx="26" fill={`url(#${grid})`} />
      {/* Street, with its centre line */}
      <rect x="0" y="396" width="640" height="36" fill="rgb(var(--site-paper) / 0.06)" />
      <path d="M0 414 H640" stroke="rgb(var(--site-paper) / 0.18)" strokeWidth="1.5" strokeDasharray="10 12" />
      {/* Title block */}
      <text x="24" y="448" className="font-mono" fontSize="10" letterSpacing="2" fill={SOFT}>
        SITE PLAN · A-101
      </text>

      {/* ── 0 · lot, footprint, dimension, tag ── */}
      <motion.path d="M86 74 L438 62 L452 346 L74 356 Z" fill="none" stroke={VIS} strokeWidth="2" strokeLinejoin="round" style={{ pathLength: lot, opacity: useTransform(lot, (v) => (v > 0 ? 1 : 0)) }} />
      <motion.path d="M180 136 H352 V258 H180 Z" fill="rgb(var(--site-paper) / 0.07)" stroke="none" style={{ opacity: hatch }} />
      <motion.path d="M180 136 H352 V258 H180 Z" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" style={{ pathLength: footprint, opacity: useTransform(footprint, (v) => (v > 0 ? 1 : 0)) }} />
      <motion.g style={{ opacity: dims }}>
        <path d="M180 116 H352 M180 108 V124 M352 108 V124" stroke={SOFT} strokeWidth="1.2" />
        <text x="266" y="104" textAnchor="middle" className="font-mono" fontSize="14" fill={INK}>
          {"32'-0\""}
        </text>
      </motion.g>
      <motion.g style={{ x: 478, y: 72, scale: tagScale, rotate: tagRotate, opacity: useTransform(tag, (v) => (v > 0 ? 1 : 0)), ...FILL_BOX }}>
        <rect width="138" height="72" rx="12" fill={NIGHT} stroke={VIS} strokeWidth="2" />
        <text x="14" y="24" className="font-mono" fontSize="10" letterSpacing="1.5" fill={VIS}>
          JOB 204
        </text>
        <text x="14" y="45" className="font-flex" fontSize="16" fontWeight="600" fill={INK}>
          Johnson House
        </text>
        <text x="14" y="62" className="font-mono" fontSize="11" fill={SOFT}>
          {tj("budget")} $34,000
        </text>
      </motion.g>

      {/* ── 1 · phone + invites + crew ── */}
      <motion.g style={{ x: phoneX, opacity: phone }}>
        <rect x="520" y="150" width="76" height="136" rx="14" fill={INK} />
        <rect x="526" y="160" width="64" height="112" rx="8" fill={NIGHT} />
        <rect x="532" y="224" width="52" height="20" rx="10" fill={VIS} />
        <text x="558" y="238" textAnchor="middle" fontSize="8.5" fontWeight="600" fill={ON_VIS}>
          {t("invite")}
        </text>
        <path d="M534 176 H582 M534 186 H566 M534 196 H574" stroke={FAINT} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      {CREW.map((c, k) => (
        <Invite key={c.tag} t={invites[k]} to={[c.from[0], c.from[1] - 10]} />
      ))}
      {CREW.map((c, k) => (
        <Worker key={c.tag} c={c} pop={pops[k]} walk={walk} clock={clocks[k]} />
      ))}

      {/* ── 2 · geofence, flatbed + lumber, task ── */}
      <motion.circle cx="266" cy="206" r="150" fill="none" stroke={VIS} strokeWidth="1.6" style={{ pathLength: fence, opacity: useTransform(fence, (v) => (v > 0 ? 0.9 : 0)), rotate: -90, ...FILL_BOX }} />
      <motion.text x="266" y="48" textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="2" fill={VIS} style={{ opacity: fence }}>
        {t("geofence").toUpperCase()}
      </motion.text>
      <Flatbed truckX={truckX} drop={drop} drive={drive} />
      <motion.g style={{ opacity: task, y: useTransform(task, (v) => Math.round((1 - v) * 10)) }}>
        <rect x="200" y="182" width="132" height="30" rx="15" fill={NIGHT} stroke={FAINT} />
        <rect x="210" y="190" width="14" height="14" rx="4" fill="none" stroke={VIS} strokeWidth="1.8" />
        <motion.path d="M213 197 L216.5 200.5 L222 193" fill="none" stroke={VIS} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: check }} />
        <text x="232" y="201.5" fontSize="12" fontWeight="600" fill={INK}>
          {t("task")}
        </text>
      </motion.g>

      {/* ── 3 · the report ── */}
      <motion.g style={{ y: sheetY }}>
        <rect x="394" y="34" width="224" height="392" rx="16" fill={NIGHT} stroke="rgb(var(--site-paper) / 0.14)" />
        <text x="412" y="62" className="font-mono" fontSize="10" letterSpacing="1.5" fill={VIS}>
          {`${t("report").toUpperCase()} · ${t("week").toUpperCase()}`}
        </text>
        <text x="412" y="84" className="font-flex" fontSize="17" fontWeight="600" fill={INK}>
          Johnson House
        </text>
        {ROWS.map((r, k) => (
          <g key={r.name} transform={`translate(412 ${118 + k * 62})`}>
            <motion.g style={{ opacity: landed[k] }}>
              <circle cx="4" cy="-4" r="4" fill={r.color} />
              <text x="14" y="0" fontSize="12.5" fontWeight="600" fill={INK}>
                {tl(`${r.name}.name`)}
              </text>
              <text x="188" y="0" textAnchor="end" className="font-mono" fontSize="12" fill={INK}>
                {usd(r.amount)}
              </text>
            </motion.g>
            <rect x="0" y="12" width="188" height="8" rx="4" fill="rgb(var(--site-paper) / 0.1)" />
            <motion.rect x="0" y="12" width={188 * r.ratio} height="8" rx="4" fill={VIS} style={{ scaleX: bars[k], transformBox: "fill-box", transformOrigin: "0% 50%" }} />
          </g>
        ))}
        <motion.g style={{ opacity: total }}>
          <path d="M412 312 H600" stroke={FAINT} />
          <text x="412" y="336" className="font-mono" fontSize="10" letterSpacing="1.5" fill={SOFT}>
            {t("spent").toUpperCase()}
          </text>
          <text x="600" y="337" textAnchor="end" className="font-flex" fontSize="18" fontWeight="600" fill={INK}>
            {usd(SPENT)}
          </text>
        </motion.g>
        <motion.g style={{ x: 506, y: 380, scale: stampS, rotate: -9, opacity: useTransform(stamp, (v) => (v > 0 ? 1 : 0)), ...FILL_BOX }}>
          <rect x="-64" y="-17" width="128" height="34" rx="7" fill={NIGHT} stroke={VIS} strokeWidth="2.5" />
          <text x="0" y="5.5" textAnchor="middle" className="font-flex" fontSize="15" fontWeight="800" letterSpacing="1" fill={VIS}>
            {t("onBudget").toUpperCase()}
          </text>
        </motion.g>
        <motion.rect x="442" y="363" width="128" height="34" rx="7" fill="none" stroke={VIS} strokeWidth="2" style={{ scale: ring, rotate: -9, opacity: ringO, ...FILL_BOX }} />
      </motion.g>
      {/* The day's costs, flying from where they happened into the report. */}
      {ROWS.map((r, k) => (
        <CostChip key={r.name} t={flights[k]} from={r.from} to={[416, 114 + k * 62]} color={r.color} label={tl(`${r.name}.name`)} />
      ))}
    </svg>
  );
}

/** A paper-plane invite on a hop from the phone to a crew member. */
function Invite({ t, to }: { t: MotionValue<number>; to: Pt }) {
  const x = useTransform(t, (v) => hop(v, PHONE_OUT, to, 90)[0]);
  const y = useTransform(t, (v) => hop(v, PHONE_OUT, to, 90)[1]);
  const opacity = useTransform(t, (v) => (v > 0 && v < 1 ? 1 : 0));
  return (
    <motion.g style={{ x, y, opacity }}>
      <path d="M-8 -4 L8 0 L-8 4 L-4 0 Z" fill={VIS} />
    </motion.g>
  );
}

/** A hard hat: pops in at the street, walks into the fence, clocks in. */
function Worker({ c, pop, walk, clock }: { c: (typeof CREW)[number]; pop: MotionValue<number>; walk: MotionValue<number>; clock: MotionValue<number> }) {
  const x = useTransform(walk, (v) => Math.round(c.from[0] + (c.to[0] - c.from[0]) * v));
  // A small gait bob while walking; whole pixels keep the initials crisp.
  const y = useTransform(walk, (v) => Math.round(c.from[1] + (c.to[1] - c.from[1]) * v - (v > 0 && v < 1 ? Math.abs(Math.sin(v * Math.PI * 6)) * 4 : 0)));
  const scale = useTransform(pop, stampScale);
  const clockY = useTransform(clock, (v) => Math.round(-30 - Math.sin(v * Math.PI) * 14 + (1 - v) * 10));
  return (
    <motion.g style={{ x, y }}>
      <motion.g style={{ scale, opacity: useTransform(pop, (v) => (v > 0 ? 1 : 0)), ...FILL_BOX }}>
        <path d="M-14 2 A14 14 0 0 1 14 2 Z" fill={VIS} />
        <rect x="-18" y="1" width="36" height="5" rx="2.5" fill={VIS} />
        <text x="0" y="22" textAnchor="middle" className="font-mono" fontSize="11" fill={INK}>
          {c.tag}
        </text>
      </motion.g>
      <motion.g style={{ y: clockY, opacity: clock }}>
        <rect x="-24" y="-12" width="48" height="20" rx="10" fill={INK} />
        <text x="0" y="2" textAnchor="middle" className="font-mono" fontSize="10.5" fill={NIGHT}>
          {c.time}
        </text>
      </motion.g>
    </motion.g>
  );
}

/** Top-down flatbed: drives in along the street and drops a pallet of lumber in the yard. */
function Flatbed({ truckX, drive, drop }: { truckX: MotionValue<number>; drive: MotionValue<number>; drop: MotionValue<number> }) {
  const shown = useTransform(drive, (v) => (v > 0 ? 1 : 0));
  // The pallet rides the bed, then hops off to the yard.
  const palletX = useTransform([truckX, drop] as MotionValue<number>[], ([tx, d]: number[]) => (d > 0 ? hop(d, [tx - 38, 414], [478, 352], 40)[0] : tx - 38));
  const palletY = useTransform(drop, (d) => (d > 0 ? hop(d, [0, 414], [0, 352], 40)[1] : 414));
  return (
    <>
      <motion.g style={{ x: truckX, y: 414, opacity: shown }}>
        <rect x="-78" y="-15" width="70" height="30" rx="4" fill="rgb(var(--site-paper) / 0.3)" />
        <rect x="-6" y="-14" width="26" height="28" rx="6" fill={INK} />
        <rect x="14" y="-11" width="4" height="22" rx="2" fill="rgb(var(--site-paper) / 0.35)" />
      </motion.g>
      <motion.g style={{ x: palletX, y: palletY, opacity: shown }}>
        {[-8, 0, 8].map((dy) => (
          <rect key={dy} x="-24" y={dy - 3} width="48" height="6" rx="1.5" fill={LUMBER.color} stroke="rgb(var(--site-paper) / 0.35)" strokeWidth="0.6" />
        ))}
      </motion.g>
    </>
  );
}

/** A cost pill hopping from the spot it happened to its report row. */
function CostChip({ t, from, to, color, label }: { t: MotionValue<number>; from: Pt; to: Pt; color: string; label: string }) {
  const x = useTransform(t, (v) => Math.round(hop(v, from, to, 70)[0]));
  const y = useTransform(t, (v) => Math.round(hop(v, from, to, 70)[1]));
  const opacity = useTransform(t, (v) => (v > 0 && v < 1 ? 1 : 0));
  return (
    <motion.g style={{ x, y, opacity }}>
      <rect x="-4" y="-13" width="82" height="22" rx="11" fill={NIGHT} stroke={color} strokeWidth="1.5" />
      <circle cx="8" cy="-2" r="4" fill={color} />
      <text x="17" y="2" fontSize="11" fontWeight="600" fill={INK}>
        {label}
      </text>
    </motion.g>
  );
}
