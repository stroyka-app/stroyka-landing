/**
 * «The strip»: where the film is, as a pure function of scroll progress.
 *
 * `stripPos(p, n)` returns a position 0‥n−1 (which screen is in the phone's
 * gate, fractional while one slides to the next). Each transition dwells:
 * the screen holds still for the first 30% of its span, slides through the
 * middle half, and settles for the last 20%, so every screen gets read.
 */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const HOLD_IN = 0.3;
export const HOLD_OUT = 0.8;

export function stripPos(p: number, n: number): number {
  if (n <= 1) return 0;
  const span = clamp01(p) * (n - 1);
  const i = Math.min(n - 2, Math.floor(span));
  const f = span - i;
  const moved = f <= HOLD_IN ? 0 : f >= HOLD_OUT ? 1 : ease((f - HOLD_IN) / (HOLD_OUT - HOLD_IN));
  return i + moved;
}

/** Which screen the caption talks about. */
export const activeAt = (pos: number) => Math.round(pos);

/** The scroll progress at which screen `k` sits squarely in the gate. */
export const progressFor = (k: number, n: number) => (n <= 1 ? 0 : k / (n - 1));
