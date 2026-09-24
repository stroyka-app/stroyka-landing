/**
 * A tiny 2D physics step for the receipt pile. Not a general engine: bodies
 * collide as circles (a receipt pile is SUPPOSED to overlap at the corners),
 * walls see each body's rotated bounding box, and the floor spins things a
 * little when they land. Deterministic and allocation-free per step.
 */

export type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number; // angle, radians
  va: number;
  w: number;
  h: number;
  r: number; // collision radius
  held: boolean;
};

export type World = { width: number; height: number };

const GRAVITY = 2400; // px/s²
const RESTITUTION = 0.28;
const FRICTION = 0.9;
const AIR = 0.995;

export function makeBody(x: number, y: number, w: number, h: number, a: number): Body {
  return { x, y, vx: 0, vy: 0, a, va: 0, w, h, r: Math.min(w, h) * 0.62, held: false };
}

function halfExtents(b: Body) {
  const c = Math.abs(Math.cos(b.a));
  const s = Math.abs(Math.sin(b.a));
  return { hx: (b.w * c + b.h * s) / 2, hy: (b.w * s + b.h * c) / 2 };
}

export function step(bodies: Body[], world: World, dt: number): void {
  for (const b of bodies) {
    if (b.held) continue;
    b.vy += GRAVITY * dt;
    b.vx *= AIR;
    b.vy *= AIR;
    b.va *= 0.985;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.a += b.va * dt;
  }

  // Pairwise circle separation, a few relaxation passes.
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const A = bodies[i];
        const B = bodies[j];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const min = A.r + B.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const push = (min - d) / 2;
        const wa = A.held ? 0 : B.held ? 1 : 0.5;
        const wb = B.held ? 0 : A.held ? 1 : 0.5;
        A.x -= nx * push * 2 * wa;
        A.y -= ny * push * 2 * wa;
        B.x += nx * push * 2 * wb;
        B.y += ny * push * 2 * wb;
        // Exchange the normal component of velocity (inelastic).
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
        if (rv < 0) {
          const imp = -(1 + RESTITUTION) * rv * 0.5;
          if (!A.held) {
            A.vx -= imp * nx;
            A.vy -= imp * ny;
            A.va -= imp * 0.004 * (nx > 0 ? 1 : -1);
          }
          if (!B.held) {
            B.vx += imp * nx;
            B.vy += imp * ny;
            B.va += imp * 0.004 * (nx > 0 ? 1 : -1);
          }
        }
      }
    }
  }

  for (const b of bodies) {
    if (b.held) continue;
    const { hx, hy } = halfExtents(b);
    if (b.y + hy > world.height) {
      b.y = world.height - hy;
      if (b.vy > 0) b.vy = -b.vy * RESTITUTION;
      b.vx *= FRICTION;
      // Landing tips the card toward lying flat-ish, and rolling spins it.
      b.va = b.va * 0.8 + b.vx * 0.0009;
      if (Math.abs(b.vy) < 30) b.vy = 0;
    }
    if (b.y - hy < 0 && b.vy < 0) {
      b.y = hy;
      b.vy = -b.vy * RESTITUTION;
    }
    if (b.x - hx < 0) {
      b.x = hx;
      if (b.vx < 0) b.vx = -b.vx * RESTITUTION;
    }
    if (b.x + hx > world.width) {
      b.x = world.width - hx;
      if (b.vx > 0) b.vx = -b.vx * RESTITUTION;
    }
  }
}
