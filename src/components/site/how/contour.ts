/**
 * The «How it works» contour: a survey-style line through the four steps.
 *
 * Desktop draws it across four equal columns (no gap), so the step nodes
 * sit exactly at the column centres. Between nodes the line bends like a
 * contour on a site plan, alternating up and down, and stays smooth
 * through every node: each node's outgoing handle mirrors its incoming one
 * (same horizontal reach, opposite vertical offset). Pure, so it's
 * unit-tested and SSR-safe.
 */
export const NODE_X = [0.125, 0.375, 0.625, 0.875] as const;
/** Desktop SVG height in px; nodes sit on its mid-line. */
export const LINE_H = 88;

const r = (n: number) => Math.round(n * 10) / 10;

export function contourPath(width: number, height: number): string {
  const mid = height / 2;
  const pts = [
    { x: 0, y: height * 0.72 },
    ...NODE_X.map((f) => ({ x: f * width, y: mid })),
    { x: width, y: height * 0.3 },
  ];
  // One handle reach for every segment (a third of the node spacing), so
  // the in/out handles at each node are exact mirrors -> C1-smooth nodes.
  const dx = ((NODE_X[1] - NODE_X[0]) * width) / 3;
  const bump = (i: number) => (i % 2 === 0 ? -1 : 1) * height * 0.38;
  let d = `M${r(pts[0].x)},${r(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    // Leave `a` mirroring how the previous segment arrived; arrive at `b`
    // on this segment's own bend.
    const c1y = i === 1 ? a.y : a.y - bump(i - 1);
    d += ` C${r(a.x + dx)},${r(c1y)} ${r(b.x - dx)},${r(b.y + bump(i))} ${r(b.x)},${r(b.y)}`;
  }
  return d;
}

/** How many of `marks` (0‥1 along the line) the drawn tip `v` has reached. */
export function reachedCount(v: number, marks: readonly number[]): number {
  let n = 0;
  for (const m of marks) if (v >= m - 1e-6) n++;
  return n;
}
