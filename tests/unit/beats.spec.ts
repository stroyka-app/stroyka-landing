import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { BEATS, START, beatAt, hop, local, seg } from "../../src/components/site/how/beats";

test("beats split progress into four equal acts", () => {
  expect(beatAt(0)).toBe(-1);
  expect(beatAt(START)).toBe(0);
  expect(beatAt(0.3)).toBe(1);
  expect(beatAt(0.6)).toBe(2);
  expect(beatAt(0.99)).toBe(3);
  expect(beatAt(1)).toBe(BEATS - 1);
});

test("local and seg are clamped windows that finish before the next beat", () => {
  expect(local(0.125, 0)).toBeCloseTo(0.5);
  expect(local(0.6, 0)).toBe(1);
  expect(local(0.1, 1)).toBe(0);
  expect(seg(0.125, 0, 0.25, 0.75)).toBeCloseTo(0.5);
  expect(seg(0.05, 0, 0.5, 1)).toBe(0);
  expect(seg(0.26, 0, 0.5, 1)).toBe(1);
  // Every window of beat i is complete once beat i+1 starts.
  for (let i = 0; i < BEATS - 1; i++) expect(seg((i + 1) / BEATS, i, 0.8, 1)).toBe(1);
});

test("a hop starts and ends on its points and rises in between", () => {
  const a = [100, 300] as const;
  const b = [400, 280] as const;
  expect(hop(0, a, b, 80)).toEqual([100, 300]);
  const end = hop(1, a, b, 80);
  expect(end[0]).toBeCloseTo(400);
  expect(end[1]).toBeCloseTo(280);
  expect(hop(0.5, a, b, 80)[1]).toBeLessThan(280);
});

test("every locale has the day tags and board labels", () => {
  for (const loc of ["en", "es", "ru"]) {
    const m = JSON.parse(readFileSync(`messages/${loc}.json`, "utf8"));
    expect(m.site.how.days).toHaveLength(4);
    for (const k of ["invite", "task", "report", "onBudget", "geofence", "spent", "week"]) {
      expect(typeof m.site.how.board[k] === "string" && m.site.how.board[k].length > 0).toBe(true);
    }
    expect(JSON.stringify(m.howItWorks)).not.toMatch(/paystub|comprobante de pago|расчётный листок/i);
  }
});
