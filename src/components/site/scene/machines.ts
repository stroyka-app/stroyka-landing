/**
 * The supporting cast on the site, as pure functions of the Lift's
 * progress `p` (and the clock `t` for the hero's idle loops).
 *
 * The crane is the story; these are the job around it — a dozer grading
 * the yard edge while the hero is up, flatbeds delivering the later loads
 * a beat before the crane needs them, the mixer standing by for the
 * concrete pour, and the boss's pickup rolling in with its lights on at
 * the close. Like `craneAt`, nothing here knows about React or three.js,
 * so a scroll jump to any `p` lands on the right frame.
 *
 * Heading follows choreo's convention: `rotation.y = heading` points the
 * machine's nose (local +x) at world (cos h, −sin h). Math.PI = toward −x.
 */
import { HERO_END, LIFTS_END, LIFT_SPAN, craneAt, landingProgress, yardSlot } from "./choreo";

export type MachinePose = { visible: boolean; x: number; z: number; heading: number; wheelTurn: number };

/** Loads 0‥STAGED−1 wait in the yard from the start; the rest are delivered. */
export const STAGED = 3;
export const WHEEL_R = 0.5;

/** Delivery road: in front of the yard's back row, driven toward −x. */
export const ROAD = { z: 21, xIn: 52, xOut: -34 } as const;
/** Footprint after the 0.85 scale: a flatbed stays smaller than a storey block. */
export const TRUCK = { length: 6.4, width: 1.7, scale: 0.85 } as const;
/** Grading a berm on the far side of the pad; parks at parkX. */
export const DOZER = { parkX: 26, workX: 27, sweep: 3, z: -1.5 } as const;
/** Stands by the mast foot for the pour — screen-left of the mast, clear of the
 *  pad and the building — then leaves toward −x. */
export const MIXER = { x: -3.5, z: -5.5, exitX: -34 } as const;
/** Phones frame the site from much further back: the cast is drawn this much
 *  bigger there so it still reads (collision tests cover both scales). */
export const PHONE_SCALE = 1.25;
/** Rolls in on its own lane and stops facing the finished building. */
export const PICKUP = { parkX: 17.5, z: 4.5, length: 4.2, width: 1.8 } as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Arrive → stand & unload → leave, as fractions of the delivery window. */
const ARRIVE = 0.35;
const UNLOADED = 0.62;

/** Load i (i ≥ STAGED) is delivered during lift i − STAGED. */
export function deliveryWindow(i: number): [number, number] {
  const k = i - STAGED;
  return [HERO_END + k * LIFT_SPAN, HERO_END + (k + 1) * LIFT_SPAN];
}

const offRoad = (x: number): MachinePose => ({ visible: false, x, z: ROAD.z, heading: Math.PI, wheelTurn: 0 });

export function deliveryAt(i: number, p: number): { truck: MachinePose; cargo: boolean; unload: number } {
  if (i < STAGED) return { truck: offRoad(ROAD.xIn), cargo: false, unload: 1 };
  const [a, b] = deliveryWindow(i);
  if (p <= a) return { truck: offRoad(ROAD.xIn), cargo: true, unload: 0 };
  if (p >= b) return { truck: offRoad(ROAD.xOut), cargo: false, unload: 1 };
  const u = (p - a) / (b - a);
  const stopX = yardSlot(i).x;
  const x =
    u < ARRIVE
      ? lerp(ROAD.xIn, stopX, smooth(u / ARRIVE))
      : u < UNLOADED
        ? stopX
        : lerp(stopX, ROAD.xOut, smooth((u - UNLOADED) / (1 - UNLOADED)));
  const unload = smooth(clamp01((u - ARRIVE) / (UNLOADED - ARRIVE)));
  return {
    // x only ever decreases, so distance travelled is xIn − x.
    truck: { visible: true, x, z: ROAD.z, heading: Math.PI, wheelTurn: (ROAD.xIn - x) / WHEEL_R },
    cargo: unload < 0.5,
    unload,
  };
}

/** How much of load i stands in its yard slot (0 = not delivered yet). */
export const blockRise = (i: number, p: number) => deliveryAt(i, p).unload;

const DOZE_W = 0.4; // rad/s of the push–reverse cycle

/**
 * `alwaysWorking`: keep grading whatever the progress. The phone hero loops the
 * lifts from HERO_END on, so without it the dozer would never leave park.
 */
export function dozerAt(p: number, t: number, alwaysWorking = false): MachinePose & { blade: number } {
  const idle = alwaysWorking ? 1 : craneAt(p).idle;
  if (idle <= 0) return { visible: true, x: DOZER.parkX, z: DOZER.z, heading: 0, wheelTurn: 0, blade: 1 };
  const phase = t * DOZE_W;
  const working = DOZER.workX + DOZER.sweep * Math.sin(phase);
  // Blade down while pushing forward (cos > 0), up while reversing.
  const blade = 0.5 - 0.5 * Math.tanh(4 * Math.cos(phase));
  return {
    visible: true,
    x: lerp(DOZER.parkX, working, idle),
    z: DOZER.z,
    heading: 0,
    wheelTurn: 0,
    blade: lerp(1, blade, idle),
  };
}

export function mixerAt(p: number, t: number): MachinePose & { drum: number } {
  const leave = landingProgress(0); // the concrete is poured
  const gone = leave + LIFT_SPAN * 0.5;
  const drum = t * 1.1;
  if (p >= gone) return { visible: false, x: MIXER.exitX, z: MIXER.z, heading: Math.PI, wheelTurn: 0, drum };
  const x = lerp(MIXER.x, MIXER.exitX, smooth(clamp01((p - leave) / (gone - leave))));
  return { visible: true, x, z: MIXER.z, heading: Math.PI, wheelTurn: (MIXER.x - x) / WHEEL_R, drum };
}

export function pickupAt(p: number): MachinePose & { lights: number } {
  const a = LIFTS_END;
  const b = LIFTS_END + 0.06;
  if (p <= a) return { visible: false, x: ROAD.xIn, z: PICKUP.z, heading: Math.PI, wheelTurn: 0, lights: 0 };
  const x = lerp(ROAD.xIn, PICKUP.parkX, smooth(clamp01((p - a) / (b - a))));
  return {
    visible: true,
    x,
    z: PICKUP.z,
    heading: Math.PI,
    wheelTurn: (ROAD.xIn - x) / WHEEL_R,
    lights: clamp01((p - a) / 0.03),
  };
}
