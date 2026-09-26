import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { activeAt, progressFor, stripPos } from "../../src/components/site/showcase/strip";

const N = 6;

test("the strip starts on the first screen and ends on the last", () => {
  expect(stripPos(0, N)).toBe(0);
  expect(stripPos(1, N)).toBe(N - 1);
  expect(stripPos(-1, N)).toBe(0);
  expect(stripPos(2, N)).toBe(N - 1);
});

test("each screen sits squarely in the gate at its own progress point", () => {
  for (let k = 0; k < N; k++) expect(stripPos(progressFor(k, N), N)).toBeCloseTo(k, 9);
});

test("screens dwell: small scrolls around a screen's point don't move the film", () => {
  const step = 1 / (N - 1);
  for (let k = 1; k < N - 1; k++) {
    expect(stripPos(progressFor(k, N) + step * 0.25, N)).toBe(k);
    expect(stripPos(progressFor(k, N) - step * 0.15, N)).toBe(k);
  }
});

test("the film only ever moves forward as you scroll down", () => {
  let last = 0;
  for (let p = 0; p <= 1; p += 0.001) {
    const v = stripPos(p, N);
    expect(v).toBeGreaterThanOrEqual(last - 1e-12);
    last = v;
  }
});

test("the caption follows the screen that fills the gate", () => {
  expect(activeAt(2.4)).toBe(2);
  expect(activeAt(2.6)).toBe(3);
});

test("six screens on disk and six captions in every locale", () => {
  for (const f of ["01-jobs", "02-job-costs", "03-my-day", "04-materials", "05-requests", "06-report"]) {
    expect(existsSync(`public/screenshots/strip/${f}.webp`)).toBe(true);
  }
  for (const loc of ["en", "es", "ru"]) {
    const m = JSON.parse(readFileSync(`messages/${loc}.json`, "utf8"));
    expect(m.site.strip.items).toHaveLength(N);
    for (const it of m.site.strip.items) expect(it.title.length > 0 && it.line.length > 0 && it.alt.length > 0).toBe(true);
  }
});
