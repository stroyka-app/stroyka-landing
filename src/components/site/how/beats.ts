/**
 * Timing for the «How it works» board: one progress value (0‥1) split into
 * four beats — the project is drawn, the crew is invited, the day runs, the
 * numbers come in. Pure, so every frame of the board is a function of
 * progress and a scroll jump always lands on the right picture.
 */
export const BEATS = 4;
/** Below this the board is still blank (nothing has started). */
export const START = 0.01;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0‥1 progress through beat `i`. */
export const local = (p: number, i: number) => clamp01(p * BEATS - i);

/** 0‥1 progress through the [a, b] window of beat `i`. */
export const seg = (p: number, i: number, a: number, b: number) => clamp01((local(p, i) - a) / (b - a));

/** The beat on stage: −1 before anything starts, then 0‥3. */
export const beatAt = (p: number) => (p < START ? -1 : Math.min(BEATS - 1, Math.floor(p * BEATS)));

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type Pt = readonly [number, number];

/** A point on a hop from `a` to `b` that rises `lift` units at its midpoint. */
export function hop(t: number, a: Pt, b: Pt, lift: number): Pt {
  const u = ease(clamp01(t));
  const cx = (a[0] + b[0]) / 2;
  const cy = Math.min(a[1], b[1]) - lift;
  const x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * cx + u * u * b[0];
  const y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * cy + u * u * b[1];
  return [x, y];
}

/** Where each beat happens on the board (fractions of its box): the day tag starts here, then jumps to the text. */
export const FOCUS: readonly Pt[] = [
  [0.85, 0.23],
  [0.72, 0.56],
  [0.42, 0.62],
  [0.79, 0.17],
];
