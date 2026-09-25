import { test, expect } from "@playwright/test";
import {
  BLOCK_W,
  BUILDING,
  HERO_END,
  LIFTS_END,
  LIFT_SPAN,
  LOADS,
  landingProgress,
  yardSlot,
} from "../../src/components/site/scene/choreo";
import {
  DOZER,
  MIXER,
  PICKUP,
  STAGED,
  TRUCK,
  WHEEL_R,
  blockRise,
  deliveryAt,
  deliveryWindow,
  dozerAt,
  mixerAt,
  pickupAt,
} from "../../src/components/site/scene/machines";

const sweep = (a = 0, b = 1, step = 0.005) => {
  const out: number[] = [];
  for (let p = a; p <= b + 1e-9; p += step) out.push(Math.min(b, p));
  return out;
};

type Rect = { x0: number; x1: number; z0: number; z1: number };
const rectAt = (x: number, z: number, w: number, d: number): Rect => ({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2 });
const overlap = (a: Rect, b: Rect) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;
const obstacles: Rect[] = [
  ...LOADS.map((_, i) => rectAt(yardSlot(i).x, yardSlot(i).z, BLOCK_W, BLOCK_W)),
  rectAt(BUILDING.x, BUILDING.z, BLOCK_W + 3, BLOCK_W + 3),
  rectAt(0, 0, 5, 5), // crane base
];

test("staged loads sit in the yard from the start and get no truck", () => {
  for (let i = 0; i < STAGED; i++) {
    for (const p of sweep()) {
      expect(blockRise(i, p)).toBe(1);
      expect(deliveryAt(i, p).truck.visible).toBe(false);
    }
  }
});

test("every delivery finishes before the crane comes for that load", () => {
  for (let i = STAGED; i < LOADS.length; i++) {
    const liftStart = HERO_END + i * LIFT_SPAN;
    expect(deliveryWindow(i)[1]).toBeLessThanOrEqual(liftStart);
    expect(blockRise(i, 0)).toBe(0);
    expect(blockRise(i, liftStart)).toBe(1);
  }
});

test("block rise never goes backwards", () => {
  for (let i = STAGED; i < LOADS.length; i++) {
    let last = 0;
    for (const p of sweep()) {
      const r = blockRise(i, p);
      expect(r).toBeGreaterThanOrEqual(last);
      last = r;
    }
  }
});

test("the truck stands at its slot while it unloads, cargo leaves as the block rises", () => {
  for (let i = STAGED; i < LOADS.length; i++) {
    const [a, b] = deliveryWindow(i);
    for (const p of sweep(a, b, (b - a) / 200)) {
      const d = deliveryAt(i, p);
      if (d.unload > 0 && d.unload < 1) expect(d.truck.x).toBeCloseTo(yardSlot(i).x, 6);
      expect(d.cargo).toBe(d.unload < 0.5);
      expect(d.unload).toBeCloseTo(blockRise(i, p), 9);
    }
  }
});

test("no truck, mixer, pickup or dozer ever drives through a block, the pad or the crane base", () => {
  // Dozer footprint mirrors MachineYard.tsx's <Contact l={4.2} w={2.8}> for
  // the dozer group — body (3 long) plus blade reach.
  const DOZER_LENGTH = 4.2;
  const DOZER_WIDTH = 2.8;
  for (const p of sweep()) {
    const poses = [
      ...LOADS.map((_, i) => ({ pose: deliveryAt(i, p).truck, w: TRUCK.length, d: TRUCK.width })),
      { pose: mixerAt(p, 0), w: TRUCK.length, d: TRUCK.width },
      { pose: pickupAt(p), w: PICKUP.length, d: PICKUP.width },
      ...[0, 3.3, 17].map((t) => ({ pose: dozerAt(p, t), w: DOZER_LENGTH, d: DOZER_WIDTH })),
    ];
    for (const { pose, w, d } of poses) {
      if (!pose.visible) continue;
      const r = rectAt(pose.x, pose.z, w, d); // all machines drive along x, so length is along x
      for (const o of obstacles) expect(overlap(r, o)).toBe(false);
    }
  }
});

test("wheels turn in proportion to distance travelled", () => {
  const i = STAGED;
  const [a, b] = deliveryWindow(i);
  const p1 = a + (b - a) * 0.1;
  const p2 = a + (b - a) * 0.3;
  const d1 = deliveryAt(i, p1).truck;
  const d2 = deliveryAt(i, p2).truck;
  expect((d2.wheelTurn - d1.wheelTurn) * WHEEL_R).toBeCloseTo(Math.abs(d2.x - d1.x), 6);
});

test("the dozer works during the hero and parks once the lifts begin", () => {
  const xs = [0, 1.3, 4.1, 7.7, 12].map((t) => dozerAt(0, t).x);
  expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(1);
  for (const x of xs) {
    expect(x).toBeGreaterThanOrEqual(DOZER.workX - DOZER.sweep - 1e-9);
    expect(x).toBeLessThanOrEqual(DOZER.workX + DOZER.sweep + 1e-9);
  }
  for (const t of [0, 3.3, 17]) {
    const d = dozerAt(HERO_END, t);
    expect(d.x).toBe(DOZER.parkX);
    expect(d.blade).toBe(1);
  }
});

test("the mixer stands by the pad for the concrete pour, then leaves", () => {
  const pour = mixerAt(HERO_END + LIFT_SPAN * 0.5, 0);
  expect(pour.visible).toBe(true);
  expect(pour.x).toBe(MIXER.x);
  expect(mixerAt(landingProgress(0) + LIFT_SPAN, 0).visible).toBe(false);
});

test("the pickup arrives for the finale with its lights on", () => {
  expect(pickupAt(LIFTS_END - 0.001).visible).toBe(false);
  const end = pickupAt(1);
  expect(end.visible).toBe(true);
  expect(end.x).toBe(PICKUP.parkX);
  expect(end.lights).toBe(1);
});
