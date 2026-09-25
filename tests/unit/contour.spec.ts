import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { LINE_H, NODE_X, contourPath, reachedCount } from "../../src/components/site/how/contour";

const r = (n: number) => Math.round(n * 10) / 10;

test("the contour starts at the left edge and ends at the right edge", () => {
  const d = contourPath(1200, LINE_H);
  expect(d.startsWith("M0,")).toBe(true);
  const last = d.trim().split(" ").pop()!;
  expect(Number(last.split(",")[0])).toBe(1200);
});

test("the contour passes through every step node at mid-height", () => {
  for (const w of [768, 1200, 1400]) {
    const d = contourPath(w, LINE_H);
    for (const f of NODE_X) expect(d).toContain(` ${r(f * w)},${r(LINE_H / 2)}`);
  }
});

test("the contour is smooth through each node (incoming and outgoing tangents line up)", () => {
  const w = 1200;
  const nums = contourPath(w, LINE_H).replace(/[MC]/g, " ").trim().split(/\s+/).map((p) => p.split(",").map(Number));
  // Layout: M p0, then per segment: c1 c2 end → points at index 1 + 3k (c1), 2 + 3k (c2), 3 + 3k (end).
  for (let k = 0; k < NODE_X.length; k++) {
    const c2 = nums[2 + 3 * k];
    const node = nums[3 + 3 * k];
    const c1next = nums[1 + 3 * (k + 1)];
    const inSlope = (node[1] - c2[1]) / (node[0] - c2[0]);
    const outSlope = (c1next[1] - node[1]) / (c1next[0] - node[0]);
    expect(inSlope).toBeCloseTo(outSlope, 1);
  }
});

test("reachedCount counts the marks the line tip has passed", () => {
  const marks = NODE_X;
  expect(reachedCount(0, marks)).toBe(0);
  expect(reachedCount(0.124, marks)).toBe(0);
  expect(reachedCount(0.125, marks)).toBe(1);
  expect(reachedCount(0.5, marks)).toBe(2);
  expect(reachedCount(1, marks)).toBe(4);
  let last = 0;
  for (let v = 0; v <= 1; v += 0.01) {
    const n = reachedCount(v, marks);
    expect(n).toBeGreaterThanOrEqual(last);
    last = n;
  }
});

test("every locale has the four day tags", () => {
  for (const loc of ["en", "es", "ru"]) {
    const m = JSON.parse(readFileSync(`messages/${loc}.json`, "utf8"));
    expect(Array.isArray(m.site.how.days)).toBe(true);
    expect(m.site.how.days).toHaveLength(4);
    for (const d of m.site.how.days) expect(typeof d === "string" && d.length > 0).toBe(true);
    expect(Object.keys(m.howItWorks.steps)).toHaveLength(4);
  }
});
