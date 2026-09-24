/**
 * The crane's whole performance as a pure function of scroll progress.
 *
 * Nothing in here knows about React or three.js: `craneAt(p)` takes the
 * Lift section's progress (0 → 1) and returns where the jib points, where
 * the trolley sits, how low the hook hangs, which load is on the hook and
 * which loads have already landed. The scene reads it every frame; the DOM
 * ledger reads the same numbers, so the two can never disagree about what
 * has been delivered.
 *
 * World convention: the crane mast stands at the origin. A polar pose
 * (θ, r) maps to world (cos θ · r, −sin θ · r) on the ground plane, which is
 * exactly where three.js puts local +x after `rotation.y = θ`.
 */

export type LoadId = "concrete" | "steel" | "lumber" | "labor" | "windows" | "roof";

export type Load = {
  readonly id: LoadId;
  /** Dollars. Also the block's height: the building is literally its cost. */
  readonly cost: number;
  readonly color: string;
};

/** Dollars → world units. The stack height IS the spend. */
export const UNITS_PER_DOLLAR = 0.62 / 1000;
export const BUDGET = 34_000;

export const LOADS: readonly Load[] = [
  { id: "concrete", cost: 4_280, color: "#A19F90" },
  { id: "steel", cost: 6_900, color: "#5F7079" },
  { id: "lumber", cost: 3_140, color: "#C09A69" },
  { id: "labor", cost: 7_420, color: "#D4EE5E" },
  { id: "windows", cost: 5_600, color: "#86A9A4" },
  { id: "roof", cost: 4_050, color: "#6E5242" },
] as const;

export const TOTAL_SPEND = LOADS.reduce((s, l) => s + l.cost, 0);

export const heightOf = (cost: number) => cost * UNITS_PER_DOLLAR;

/* ── Site layout ────────────────────────────────────────────────────────── */

export const JIB_Y = 26;
export const JIB_REACH = 28;
/** Hook height while travelling: every load clears the rising building. */
export const TRAVEL_Y = 24;
export const BLOCK_W = 5.6;

export const BUILDING = { x: 12, z: -8 } as const;
/** Top of the concrete pad the building stands on. */
export const PAD_TOP = 0.3;

const YARD = { x: 9, z: 13 } as const;
const YARD_SLOTS: readonly { x: number; z: number }[] = [
  { x: YARD.x - 6.6, z: YARD.z - 3.4 },
  { x: YARD.x, z: YARD.z - 3.4 },
  { x: YARD.x + 6.6, z: YARD.z - 3.4 },
  { x: YARD.x - 6.6, z: YARD.z + 3.4 },
  { x: YARD.x, z: YARD.z + 3.4 },
  { x: YARD.x + 6.6, z: YARD.z + 3.4 },
];

export const yardSlot = (i: number) => YARD_SLOTS[i];

/** Where the base of load `i` sits once landed (world y). */
export const landedBaseY = (i: number) =>
  PAD_TOP + LOADS.slice(0, i).reduce((s, l) => s + heightOf(l.cost), 0);

const polar = (x: number, z: number) => ({ theta: Math.atan2(-z, x), r: Math.hypot(x, z) });

/* ── Timeline ───────────────────────────────────────────────────────────── */

/** Progress before the first lift: the hero, crane idling. */
export const HERO_END = 0.1;
/** Progress after the last lift: the finale, pull-back, lights on. */
export const LIFTS_END = 0.86;
const LIFT_SPAN = (LIFTS_END - HERO_END) / LOADS.length;

/** Within one lift (t ∈ 0‥1): hook grabs the load here… */
const ATTACH_T = 0.36;
/** …and lets go here. */
export const RELEASE_T = 0.9;

type Pose = { theta: number; r: number; hookY: number };

const IDLE: Pose = { theta: 0.15, r: 17, hookY: TRAVEL_Y };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  theta: lerp(a.theta, b.theta, t),
  r: lerp(a.r, b.r, t),
  hookY: lerp(a.hookY, b.hookY, t),
});

type Key = { t: number; pose: Pose };

function liftKeys(i: number, from: Pose): Key[] {
  const load = LOADS[i];
  const h = heightOf(load.cost);
  const slot = yardSlot(i);
  const yard = polar(slot.x, slot.z);
  const bld = polar(BUILDING.x, BUILDING.z);
  const landTop = landedBaseY(i) + h;
  return [
    { t: 0, pose: from },
    { t: 0.22, pose: { theta: yard.theta, r: yard.r, hookY: TRAVEL_Y } },
    { t: 0.34, pose: { theta: yard.theta, r: yard.r, hookY: h } },
    { t: 0.46, pose: { theta: yard.theta, r: yard.r, hookY: TRAVEL_Y } },
    { t: 0.74, pose: { theta: bld.theta, r: bld.r, hookY: TRAVEL_Y } },
    { t: RELEASE_T - 0.02, pose: { theta: bld.theta, r: bld.r, hookY: landTop } },
    { t: 1, pose: { theta: bld.theta, r: bld.r, hookY: landTop + 3.2 } },
  ];
}

/** Precomputed: each lift starts where the previous one ended. */
const LIFT_KEYS: Key[][] = (() => {
  const out: Key[][] = [];
  let from = IDLE;
  for (let i = 0; i < LOADS.length; i++) {
    const keys = liftKeys(i, from);
    out.push(keys);
    from = keys[keys.length - 1].pose;
  }
  return out;
})();

function sampleKeys(keys: Key[], t: number): Pose {
  for (let k = 1; k < keys.length; k++) {
    if (t <= keys[k].t) {
      const a = keys[k - 1];
      const b = keys[k];
      const local = (t - a.t) / (b.t - a.t || 1);
      return lerpPose(a.pose, b.pose, easeInOut(Math.min(1, Math.max(0, local))));
    }
  }
  return keys[keys.length - 1].pose;
}

export type CraneState = Pose & {
  /** Index of the load on the hook, or −1. */
  carrying: number;
  /** How many loads have landed on the building. */
  landed: number;
  /** 1 during the hero, fading to 0 as the first lift begins. */
  idle: number;
  /** 0 → 1 across the finale. */
  finale: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function craneAt(p: number): CraneState {
  const idle = 1 - smoothstep(HERO_END * 0.4, HERO_END, p);
  const finale = smoothstep(LIFTS_END, 1, p);

  if (p <= HERO_END) {
    return { ...IDLE, carrying: -1, landed: 0, idle, finale: 0 };
  }
  if (p >= LIFTS_END) {
    const last = LIFT_KEYS[LIFT_KEYS.length - 1];
    return { ...last[last.length - 1].pose, carrying: -1, landed: LOADS.length, idle: 0, finale };
  }

  const i = Math.min(LOADS.length - 1, Math.floor((p - HERO_END) / LIFT_SPAN));
  const t = (p - HERO_END - i * LIFT_SPAN) / LIFT_SPAN;
  const pose = sampleKeys(LIFT_KEYS[i], t);
  const carrying = t >= ATTACH_T && t < RELEASE_T ? i : -1;
  const landed = i + (t >= RELEASE_T ? 1 : 0);
  return { ...pose, carrying, landed, idle, finale };
}

/** The progress value at which load `i` lands — used to jump the ledger. */
export const landingProgress = (i: number) => HERO_END + (i + RELEASE_T) * LIFT_SPAN;

/** Which story beat the captions should show: −1 hero, 0‥5 lifts, 6 finale. */
export function beatAt(p: number): number {
  if (p < HERO_END) return -1;
  if (p >= LIFTS_END) return LOADS.length;
  return Math.min(LOADS.length - 1, Math.floor((p - HERO_END) / LIFT_SPAN));
}

export const spentAfter = (landed: number) =>
  LOADS.slice(0, landed).reduce((s, l) => s + l.cost, 0);
