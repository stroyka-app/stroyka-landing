"use client";

/**
 * PlanToDoneAnimation V2
 *
 * Real-time 3D scroll-pinned cinematic. A procedural house built with React
 * Three Fiber goes from blueprint lines → wireframe → materialized → photoreal
 * with golden-hour lighting, driven by scroll progress. DOM overlays layer
 * cost cards, telemetry, connection lines, and a final hero chip on top.
 *
 * V2 fixes (over V1):
 * - Top-down camera bug (look-from-above is degenerate with Y-up; use slight
 *   Z offset + explicit look-at orient). Beat 1 stays as a true flat plan view.
 * - Walls/Roof fully invisible during Beat 1 (was leaking edges before extrude).
 * - Beat transitions slower + orbiting camera in Beat 3 so the house gets
 *   shown from multiple angles, not just one perspective.
 * - Beat 5 hero shot pulled back wider.
 * - Bigger, more legible title block bottom-right.
 * - In-3D room labels in Beat 1 (drei <Text>).
 * - Connection lines from each cost card to its 3D anchor point on the house,
 *   projected from world space → screen space every frame.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Edges, Html } from "@react-three/drei";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * Brand palette
 * ──────────────────────────────────────────────────────────────────────── */

const COLORS = {
  sageMist:     "#cad2c5",
  sage:         "#84a98c",
  forest:       "#4B5F4E",
  // Section surface: sage-olive (was #34453A). Lighter + warmer so the
  // handoff from/to sand doesn't register as a hard "entering a room"
  // value-jump. Cards inside (midnight-dark/...) stay dark → they still
  // read as inset elements.
  deep:         "#4E6253",
  midnight:     "#4E6253",
  midnightDark: "#2B3D30",
  amber:        "#d97706",
  amberBright:  "#f59e0b",
  cedar:        "#b8865f",
  cedarDark:    "#8a5a3a",
  shingle:      "#3a3230",
  trim:         "#f5f1e8",
  glass:        "#87ceeb",
  door:         "#5c3920",
  lawn:         "#4a6a4d",
};

/* ────────────────────────────────────────────────────────────────────────────
 * House dimensions (world units)
 * ──────────────────────────────────────────────────────────────────────── */

const HW = 8;       // house width (X) — represents 32 ft
const HD = 6;       // house depth (Z) — represents 24 ft
const WALL_H = 3;   // wall height (Y)
const ROOF_H = 2.2; // roof rise above walls
const WALL_T = 0.15;

/* ────────────────────────────────────────────────────────────────────────────
 * Beat config — V2 timings (slower transitions, longer Beat 3)
 * ──────────────────────────────────────────────────────────────────────── */

type BeatName = "plan" | "wireframe" | "building" | "chart" | "photoreal" | "metric";

interface Beat {
  name: BeatName;
  start: number;
  end: number;
  headline: string;
  kicker: string;
  state: string;
}

const BEATS: Beat[] = [
  { name: "plan",      start: 0.00, end: 0.20, kicker: "MODULE · 01",      headline: "Every project starts on paper.",      state: "PLAN"      },
  { name: "wireframe", start: 0.20, end: 0.36, kicker: "MODULE · 02",      headline: "Now you can see the whole thing.",    state: "WIREFRAME" },
  { name: "building",  start: 0.36, end: 0.66, kicker: "MODULE · 03",      headline: "Every material logs itself.",         state: "BUILDING"  },
  { name: "chart",     start: 0.66, end: 0.78, kicker: "MODULE · 04",      headline: "So you always know where you stand.", state: "TRACKING"  },
  { name: "photoreal", start: 0.78, end: 0.96, kicker: "CLOSED · JOHNSON", headline: "",                                    state: "COMPLETE"  },
  { name: "metric",    start: 0.96, end: 1.00, kicker: "CLOSED · JOHNSON", headline: "",                                    state: "COMPLETE"  },
];

interface CostEntry {
  label: string;
  amount: string;
  subtitle: string;
  numericValue: number;
  showAt: number;
}

const COST_ENTRIES: CostEntry[] = [
  { label: "CONCRETE", amount: "$2,180", subtitle: "14 yards · poured 04/15",   numericValue: 2180, showAt: 0.40 },
  { label: "LUMBER",   amount: "$4,820", subtitle: "320 board-ft · oak frame",  numericValue: 4820, showAt: 0.46 },
  { label: "ROOF",     amount: "$3,640", subtitle: "Architectural shingles",    numericValue: 3640, showAt: 0.52 },
  { label: "SIDING",   amount: "$5,210", subtitle: "Cedar lap · stained",       numericValue: 5210, showAt: 0.56 },
  { label: "WINDOWS",  amount: "$3,120", subtitle: "12 units · double-pane",    numericValue: 3120, showAt: 0.60 },
];

const RUNNING_TOTAL = COST_ENTRIES.reduce((sum, e) => sum + e.numericValue, 0);

const CHART_BARS = [
  { label: "Labor",     actual: 14210, plan: 16000 },
  { label: "Materials", actual: RUNNING_TOTAL, plan: 20000 },
  { label: "Fuel",      actual: 420,   plan: 600   },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function ramp(p: number, a: number, b: number) {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return easeInOut((p - a) / (b - a));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getBeat(p: number): Beat {
  for (const b of BEATS) if (p >= b.start && p < b.end) return b;
  return BEATS[BEATS.length - 1];
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Shared refs (Canvas → DOM bridge)
 * ──────────────────────────────────────────────────────────────────────── */

type ScrollRef = React.MutableRefObject<number>;


/* ────────────────────────────────────────────────────────────────────────────
 * R3F scene components
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * Plan label — DOM div positioned in 3D world coords via drei <Html>.
 * Opacity is driven by the FloorPlan group's CSS so it fades with the plan.
 */
function PlanLabel({
  position,
  variant,
  size = "md",
  children,
}: {
  position: [number, number, number];
  variant: "room" | "dim" | "meta" | "hint";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  const sizeCls =
    size === "lg" ? "text-[15px]" : size === "md" ? "text-[13px]" : "text-[11px]";
  const variantCls = {
    // Fix 2: blueprint annotation text → sage (#84a98c)
    room: "text-brand-sage font-mono tracking-[0.18em] font-semibold",
    dim:  "text-brand-amber-bright font-mono tracking-[0.18em] font-bold text-[18px] md:text-[20px]",
    meta: "text-brand-sage/80 font-mono tracking-[0.18em]",
    hint: "text-brand-sage/90 font-mono tracking-[0.18em] font-semibold",
  }[variant];
  return (
    <Html
      position={position}
      center
      distanceFactor={14}
      occlude={false}
      style={{
        pointerEvents: "none",
        whiteSpace: "nowrap",
        opacity: "var(--ptd-label-opacity, 0)",
        transition: "opacity 80ms linear",
      }}
    >
      <div className={`${sizeCls} ${variantCls} select-none`}>
        {children}
      </div>
    </Html>
  );
}

/**
 * Floor plan — sage outline + amber dimensions + room labels.
 * Visible only during Beat 1; fades during Beat 2.
 */
function FloorPlan({ scroll }: { scroll: ScrollRef }) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const dimMatRef = useRef<THREE.LineBasicMaterial>(null);
  const labelGroupRef = useRef<THREE.Group>(null);

  // Floor-plan lines must clear the ground plane (y=0) with enough depth
  // separation for the top-down camera (~28u away) to resolve cleanly.
  // 2cm wasn't enough — it flickered. 15cm is far more than needed and still
  // visually reads as "on the floor" from bird's-eye.
  const PLAN_Y = 0.15;
  const DIM_Y = 0.17; // dims slightly above plan so they layer cleanly

  const planGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const w = HW / 2;
    const d = HD / 2;
    // Outer perimeter
    pts.push(new THREE.Vector3(-w, PLAN_Y, -d), new THREE.Vector3( w, PLAN_Y, -d));
    pts.push(new THREE.Vector3( w, PLAN_Y, -d), new THREE.Vector3( w, PLAN_Y,  d));
    pts.push(new THREE.Vector3( w, PLAN_Y,  d), new THREE.Vector3(-w, PLAN_Y,  d));
    pts.push(new THREE.Vector3(-w, PLAN_Y,  d), new THREE.Vector3(-w, PLAN_Y, -d));
    // Internal dividers — split into living/kitchen/2 bedrooms/bath
    pts.push(new THREE.Vector3(-w, PLAN_Y, 0), new THREE.Vector3( w, PLAN_Y, 0));
    pts.push(new THREE.Vector3(0, PLAN_Y, -d), new THREE.Vector3(0, PLAN_Y,  d));
    pts.push(new THREE.Vector3(0, PLAN_Y, 1.4), new THREE.Vector3( w, PLAN_Y, 1.4));
    pts.push(new THREE.Vector3(-w * 0.6, PLAN_Y, 0), new THREE.Vector3(-w * 0.6, PLAN_Y, d));
    // Door swing arcs (suggest doors)
    const arcSegs = 12;
    const drawArc = (cx: number, cz: number, r: number, start: number, end: number) => {
      for (let i = 0; i < arcSegs; i++) {
        const t1 = start + ((end - start) * i) / arcSegs;
        const t2 = start + ((end - start) * (i + 1)) / arcSegs;
        pts.push(
          new THREE.Vector3(cx + Math.cos(t1) * r, PLAN_Y, cz + Math.sin(t1) * r),
          new THREE.Vector3(cx + Math.cos(t2) * r, PLAN_Y, cz + Math.sin(t2) * r)
        );
      }
    };
    drawArc(-1.0, 0, 0.7, 0, Math.PI / 2);
    drawArc( 1.0, 0, 0.7, Math.PI / 2, Math.PI);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Amber dimension lines (top, left, right, bottom) with tick marks
  const dimGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const w = HW / 2;
    const d = HD / 2;
    const off = 0.9;
    const tick = 0.18;
    // Top: across the X axis at -d-off
    pts.push(new THREE.Vector3(-w, DIM_Y, -d - off), new THREE.Vector3( w, DIM_Y, -d - off));
    pts.push(new THREE.Vector3(-w, DIM_Y, -d - off - tick), new THREE.Vector3(-w, DIM_Y, -d - off + tick));
    pts.push(new THREE.Vector3( w, DIM_Y, -d - off - tick), new THREE.Vector3( w, DIM_Y, -d - off + tick));
    pts.push(new THREE.Vector3(0,  DIM_Y, -d - off - tick), new THREE.Vector3(0,  DIM_Y, -d - off + tick));
    // Left: along Z at -w-off
    pts.push(new THREE.Vector3(-w - off, DIM_Y, -d), new THREE.Vector3(-w - off, DIM_Y,  d));
    pts.push(new THREE.Vector3(-w - off - tick, DIM_Y, -d), new THREE.Vector3(-w - off + tick, DIM_Y, -d));
    pts.push(new THREE.Vector3(-w - off - tick, DIM_Y,  d), new THREE.Vector3(-w - off + tick, DIM_Y,  d));
    pts.push(new THREE.Vector3(-w - off - tick, DIM_Y,  0), new THREE.Vector3(-w - off + tick, DIM_Y,  0));
    // Bottom: scale bar
    pts.push(new THREE.Vector3(-w + 0.5, DIM_Y, d + off + 0.6), new THREE.Vector3(-w + 1.5, DIM_Y, d + off + 0.6));
    pts.push(new THREE.Vector3(-w + 0.5, DIM_Y, d + off + 0.5), new THREE.Vector3(-w + 0.5, DIM_Y, d + off + 0.7));
    pts.push(new THREE.Vector3(-w + 1.5, DIM_Y, d + off + 0.5), new THREE.Vector3(-w + 1.5, DIM_Y, d + off + 0.7));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(() => {
    const p = scroll.current;
    // Fade IN AFTER IntroTitle fully exits (~0.085) so lines + labels never
    // overlap the section title. Fades OUT at Beat 2 handoff.
    const fadeIn = ramp(p, 0.095, 0.15);
    const fadeOut = 1 - ramp(p, 0.20, 0.30);
    const opacity = fadeIn * fadeOut;
    if (matRef.current) matRef.current.opacity = opacity;
    if (dimMatRef.current) dimMatRef.current.opacity = opacity * 0.9;
    // Fade DOM-projected labels via shared CSS variable
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--ptd-label-opacity", String(opacity));
    }
  });

  return (
    <>
      <lineSegments geometry={planGeo}>
        <lineBasicMaterial ref={matRef} color={COLORS.sage} transparent opacity={0} />
      </lineSegments>
      <lineSegments geometry={dimGeo}>
        <lineBasicMaterial ref={dimMatRef} color={COLORS.amber} transparent opacity={0} />
      </lineSegments>

      {/* In-3D room labels + dimension numbers via drei <Html> — DOM divs
          projected to 3D positions (no workers, no troika). */}
      <group ref={labelGroupRef}>
        <PlanLabel position={[-2.0, 0.04,  1.6]} variant="room" size="lg">LIVING</PlanLabel>
        <PlanLabel position={[ 2.0, 0.04,  1.6]} variant="room" size="lg">KITCHEN</PlanLabel>
        <PlanLabel position={[-2.4, 0.04, -1.5]} variant="room" size="md">BEDROOM 1</PlanLabel>
        <PlanLabel position={[ 1.2, 0.04, -1.0]} variant="room" size="md">BEDROOM 2</PlanLabel>
        <PlanLabel position={[ 2.6, 0.04, -2.2]} variant="room" size="sm">BATH</PlanLabel>

        <PlanLabel position={[0,    0.04, -HD / 2 - 0.9 - 0.35]} variant="dim">32&apos;-0&quot;</PlanLabel>
        <PlanLabel position={[-HW / 2 - 0.9 - 0.55, 0.04, 0]}    variant="dim">24&apos;-0&quot;</PlanLabel>
        <PlanLabel position={[-HW / 2 + 1.0, 0.04, HD / 2 + 0.9 + 0.95]} variant="meta">SCALE 1/4&quot;=1&apos;</PlanLabel>
        <PlanLabel position={[ HW / 2 - 0.4, 0.04, HD / 2 + 0.9 + 0.95]} variant="hint">FLOOR PLAN · A-04</PlanLabel>
      </group>
    </>
  );
}

/**
 * Ground plane.
 */
function Ground({ scroll: _scroll }: { scroll: ScrollRef }) {
  // Ground stays at brand-midnight throughout the entire scroll — no lawn
  // transition. The previous midnight→lawn-green shift created an ugly
  // bright-green background in the photoreal section that clashed with the
  // rest of the page palette and forced the exit transition to fade from
  // green → midnight (that "huge fade" you hated).
  //
  // Unlit meshBasicMaterial renders at the exact hex we set, matching the
  // CSS bg-brand-midnight behind the transparent canvas — so the scene
  // edge is pixel-identical to the page background above and below it.
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial color={COLORS.midnight} />
    </mesh>
  );
}

/**
 * Wall slab — invisible during Beat 1, edges during Beat 2, materializes during Beat 3.
 */
function Wall({
  position,
  size,
  buildAt,
  scroll,
}: {
  position: [number, number, number];
  size: [number, number, number];
  buildAt: number;
  scroll: ScrollRef;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    const p = scroll.current;
    // Edges: appear during Beat 2 (0.20→0.32), fade during photoreal (0.78→0.90)
    const edgeIn = ramp(p, 0.20, 0.32);
    const edgeOut = 1 - ramp(p, 0.78, 0.90);
    const edgeOpacity = edgeIn * edgeOut;

    // Fill: translucent from start of Beat 2 (visible as hologram), solid at buildAt.
    // This was p=0.30→0.36 before — too late; walls appeared invisible during Beat 2.
    const translucentIn = ramp(p, 0.20, 0.32);
    const solidIn = ramp(p, buildAt, buildAt + 0.05);
    const opacity = Math.max(translucentIn * 0.45, solidIn);

    const sageColor = new THREE.Color(COLORS.sageMist);
    const wallAmber = new THREE.Color(COLORS.amber); // Fix 3: walls amber
    const colorT = ramp(p, buildAt, buildAt + 0.05);

    if (matRef.current) {
      matRef.current.color.copy(sageColor).lerp(wallAmber, colorT);
      matRef.current.emissive.set(COLORS.sage);
      matRef.current.emissiveIntensity = lerp(0.5, 0, colorT);
      matRef.current.opacity = opacity;
      matRef.current.transparent = opacity < 0.99;
      matRef.current.visible = opacity > 0.001;
    }
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = edgeOpacity;
    }
  });

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        ref={matRef}
        color={COLORS.sageMist}
        roughness={0.82}
        metalness={0.02}
        transparent
        opacity={0}
        visible={false}
      />
      <Edges threshold={15}>
        <lineBasicMaterial ref={edgeMatRef} color={COLORS.sage} transparent opacity={0} />
      </Edges>
    </mesh>
  );
}

/**
 * Gabled roof.
 */
function Roof({ scroll }: { scroll: ScrollRef }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const w = HW / 2 + 0.3;
    const d = HD / 2 + 0.3;
    const baseY = WALL_H;
    const peakY = WALL_H + ROOF_H;
    const v = new Float32Array([
      -w, baseY, -d,
       w, baseY, -d,
       w, baseY,  d,
      -w, baseY,  d,
       0, peakY, -d,
       0, peakY,  d,
    ]);
    const idx = [
      0, 3, 5,    0, 5, 4,
      1, 4, 5,    1, 5, 2,
      0, 4, 1,
      3, 2, 5,
    ];
    g.setIndex(idx);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(() => {
    const p = scroll.current;
    const edgeIn = ramp(p, 0.22, 0.34);
    const edgeOut = 1 - ramp(p, 0.78, 0.90);
    const edgeOpacity = edgeIn * edgeOut;

    // Roof appears translucent earlier (was 0.32→0.38; too late)
    const translucentIn = ramp(p, 0.22, 0.34);
    const solidIn = ramp(p, 0.52, 0.58); // ROOF cost
    const opacity = Math.max(translucentIn * 0.45, solidIn);

    const sageColor = new THREE.Color(COLORS.sageMist);
    const roofDeep = new THREE.Color(COLORS.deep); // Fix 3: roof → brand-deep
    const colorT = ramp(p, 0.52, 0.58);

    if (matRef.current) {
      matRef.current.color.copy(sageColor).lerp(roofDeep, colorT);
      matRef.current.emissive.set(COLORS.sage);
      matRef.current.emissiveIntensity = lerp(0.5, 0, colorT);
      matRef.current.opacity = opacity;
      matRef.current.transparent = opacity < 0.99;
      matRef.current.visible = opacity > 0.001;
    }
    if (edgeMatRef.current) edgeMatRef.current.opacity = edgeOpacity;
  });

  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        ref={matRef}
        color={COLORS.sageMist}
        roughness={0.9}
        metalness={0.02}
        side={THREE.DoubleSide}
        transparent
        opacity={0}
        visible={false}
      />
      <Edges geometry={geo} threshold={15}>
        <lineBasicMaterial ref={edgeMatRef} color={COLORS.sage} transparent opacity={0} />
      </Edges>
    </mesh>
  );
}

/**
 * Landscape — walkway, shrubs, and a tree. Appears during the photoreal
 * phase so the scene has real context (a "property") instead of a single
 * 3D object in a void.
 */
function Landscape({ scroll }: { scroll: ScrollRef }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    const p = scroll.current;
    const t = ramp(p, 0.66, 0.84);
    if (groupRef.current) {
      groupRef.current.visible = t > 0.001;
      groupRef.current.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.Material & { opacity?: number };
          if ("opacity" in mat) {
            mat.opacity = t;
            mat.transparent = t < 0.99;
          }
        }
      });
    }
  });

  // Shrub clusters — grouped ellipsoids so each "bush" reads as multiple
  // branch masses, not a single sphere.
  const shrubPositions: Array<[number, number, number]> = [
    // Flanking the door
    [-1.8, 0,  HD / 2 + 0.5],
    [ 1.8, 0,  HD / 2 + 0.5],
    // Corner plantings
    [-HW / 2 - 0.4, 0,  HD / 2 + 0.3],
    [ HW / 2 + 0.4, 0,  HD / 2 + 0.3],
    // Back-right corner (seen from hero cam)
    [ HW / 2 + 0.3, 0, -HD / 2 - 0.3],
  ];

  return (
    <group ref={groupRef} visible={false}>
      {/* Walkway — concrete slab from the front yard to the door */}
      <mesh position={[0, 0.02, HD / 2 + 2.2]}>
        <boxGeometry args={[1.8, 0.04, 3.2]} />
        <meshStandardMaterial
          color="#7a7468"
          roughness={0.95}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Foundation course — dark stone band at the base of all walls */}
      <mesh position={[0, 0.22, HD / 2 + WALL_T / 2 + 0.015]}>
        <boxGeometry args={[HW + WALL_T + 0.1, 0.44, 0.03]} />
        <meshStandardMaterial color="#3a332c" roughness={0.9} transparent opacity={0} />
      </mesh>
      <mesh position={[0, 0.22, -HD / 2 - WALL_T / 2 - 0.015]}>
        <boxGeometry args={[HW + WALL_T + 0.1, 0.44, 0.03]} />
        <meshStandardMaterial color="#3a332c" roughness={0.9} transparent opacity={0} />
      </mesh>
      <mesh position={[ HW / 2 + WALL_T / 2 + 0.015, 0.22, 0]}>
        <boxGeometry args={[0.03, 0.44, HD + 0.1]} />
        <meshStandardMaterial color="#3a332c" roughness={0.9} transparent opacity={0} />
      </mesh>
      <mesh position={[-HW / 2 - WALL_T / 2 - 0.015, 0.22, 0]}>
        <boxGeometry args={[0.03, 0.44, HD + 0.1]} />
        <meshStandardMaterial color="#3a332c" roughness={0.9} transparent opacity={0} />
      </mesh>

      {/* Shrubs — each is 3 overlapping ellipsoid masses */}
      {shrubPositions.map((pos, i) => (
        <group key={`shrub-${i}`} position={pos}>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.45, 12, 10]} />
            <meshStandardMaterial color="#4a6a4d" roughness={0.95} transparent opacity={0} />
          </mesh>
          <mesh position={[0.22, 0.42, 0.1]} scale={[0.75, 0.85, 0.75]}>
            <sphereGeometry args={[0.45, 12, 10]} />
            <meshStandardMaterial color="#3f5d42" roughness={0.95} transparent opacity={0} />
          </mesh>
          <mesh position={[-0.2, 0.3, -0.12]} scale={[0.7, 0.75, 0.7]}>
            <sphereGeometry args={[0.45, 12, 10]} />
            <meshStandardMaterial color="#557556" roughness={0.95} transparent opacity={0} />
          </mesh>
        </group>
      ))}

      {/* Tree — trunk cylinder + foliage cluster, placed front-left for
          scene depth and framing in the hero 3/4 shot. */}
      <group position={[-HW / 2 - 3.2, 0, HD / 2 + 1.8]}>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 2.2, 10]} />
          <meshStandardMaterial color="#3f2a1e" roughness={0.95} transparent opacity={0} />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <sphereGeometry args={[1.05, 14, 12]} />
          <meshStandardMaterial color="#3f5d42" roughness={0.95} transparent opacity={0} />
        </mesh>
        <mesh position={[0.4, 2.9, 0.25]} scale={[0.8, 0.85, 0.8]}>
          <sphereGeometry args={[1.05, 14, 12]} />
          <meshStandardMaterial color="#4a6a4d" roughness={0.95} transparent opacity={0} />
        </mesh>
        <mesh position={[-0.35, 2.75, -0.25]} scale={[0.75, 0.82, 0.75]}>
          <sphereGeometry args={[1.05, 14, 12]} />
          <meshStandardMaterial color="#557556" roughness={0.95} transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Architectural detail pass — windows on all 4 walls, door, porch overhang,
 * gutters along the long eaves, downspouts at the two front corners, and a
 * chimney on the ridge. Appears alongside siding (0.54→0.60) so these details
 * are part of the final wall-up moment, not a late-beat add-on.
 */
function WindowsAndDoor({ scroll }: { scroll: ScrollRef }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = scroll.current;
    const t = ramp(p, 0.54, 0.62);
    if (groupRef.current) {
      groupRef.current.visible = t > 0.001;
      groupRef.current.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.Material & { opacity?: number };
          if ("opacity" in mat) {
            mat.opacity = t;
            mat.transparent = t < 0.99;
          }
        }
      });
    }
  });

  // IMPORTANT — wall geometry is WALL_T (0.15) thick, centered on its face
  // axis. Front wall extends z = 2.925..3.075; east wall x = 3.925..4.075.
  // Windows/doors must sit CLEARLY outside the outer face (≥ 9cm) so the
  // depth buffer at hero-cam distance (~20u) can resolve them from the
  // foundation band at z≈3.09 that runs behind the lower part of the door.
  const OUTER_Z = HD / 2 + WALL_T / 2 + 0.09; // 3.165 — well outside front face
  const OUTER_X = HW / 2 + WALL_T / 2 + 0.09; // 4.165 — well outside east face

  // Windows on front (+Z) and back (-Z) walls
  const frontBack: Array<[number, number, number]> = [
    [-2.4, 1.5,  OUTER_Z],
    [ 2.4, 1.5,  OUTER_Z],
    [-2.4, 1.5, -OUTER_Z],
    [ 2.4, 1.5, -OUTER_Z],
  ];

  // Windows on east (+X) and west (-X) walls
  const eastWest: Array<{ pos: [number, number, number]; facingEast: boolean }> = [
    { pos: [ OUTER_X, 1.5, -1.5 ], facingEast: true  },
    { pos: [ OUTER_X, 1.5,  1.5 ], facingEast: true  },
    { pos: [-OUTER_X, 1.5, -1.5 ], facingEast: false },
    { pos: [-OUTER_X, 1.5,  1.5 ], facingEast: false },
  ];

  const WindowUnit = ({ width = 1.2, height = 1.2 }: { width?: number; height?: number }) => (
    <>
      {/* Trim — base layer */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width + 0.18, height + 0.18]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.55} transparent opacity={0} />
      </mesh>
      {/* Glass — 2cm in front of trim */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={COLORS.glass}
          roughness={0.08}
          metalness={0.55}
          emissive={COLORS.glass}
          emissiveIntensity={0.18}
          transparent
          opacity={0}
        />
      </mesh>
      {/* Muntin cross — horizontal + vertical bars, 4cm in front of glass.
          The two muntin planes are coplanar but at perpendicular orientations
          and don't overlap in screen space, so no z-fight between them. */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[width, 0.04]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.5} transparent opacity={0} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.04, height]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.5} transparent opacity={0} />
      </mesh>
    </>
  );

  return (
    <group ref={groupRef} visible={false}>
      {/* Front + back windows */}
      {frontBack.map((pos, i) => {
        const isFront = pos[2] > 0;
        return (
          <group key={`fb-${i}`} position={pos} rotation={[0, isFront ? 0 : Math.PI, 0]}>
            <WindowUnit />
          </group>
        );
      })}

      {/* Side windows (east/west) */}
      {eastWest.map((w, i) => (
        <group
          key={`ew-${i}`}
          position={w.pos}
          rotation={[0, w.facingEast ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <WindowUnit width={1.0} height={1.2} />
        </group>
      ))}

      {/* Front door + frame — offset from outer wall face.
          Layer z-offsets of 2cm each so the depth buffer can resolve them
          from the hero-shot distance (~20u). Tiny sub-mm offsets z-fight. */}
      <group position={[0, 1.2, OUTER_Z]}>
        {/* Door trim — base */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.22, 2.6]} />
          <meshStandardMaterial color={COLORS.trim} roughness={0.55} transparent opacity={0} />
        </mesh>
        {/* Door slab — 2cm in front of trim */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.0, 2.4]} />
          <meshStandardMaterial color={COLORS.door} roughness={0.6} transparent opacity={0} />
        </mesh>
        {/* Doorknob — 4cm in front of slab */}
        <mesh position={[0.35, -0.05, 0.04]}>
          <circleGeometry args={[0.04, 12]} />
          <meshStandardMaterial color="#c89b50" roughness={0.3} metalness={0.7} transparent opacity={0} />
        </mesh>
      </group>

      {/* Porch overhang — slab above the door. Y must clear the door top
          (door top at 1.2 + 1.2 = 2.4) with a small air gap. */}
      <mesh position={[0, 2.65, OUTER_Z + 0.4]}>
        <boxGeometry args={[2.0, 0.08, 0.8]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.6} transparent opacity={0} />
      </mesh>

      {/* Gutters — horizontal pipes along the long eaves, sitting just in
          front of the wall outer face and at wall-top height. */}
      <mesh
        position={[0, WALL_H + 0.05, OUTER_Z + 0.05]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.08, 0.08, HW + 0.6, 16]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.5} metalness={0.2} transparent opacity={0} />
      </mesh>
      <mesh
        position={[0, WALL_H + 0.05, -OUTER_Z - 0.05]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.08, 0.08, HW + 0.6, 16]} />
        <meshStandardMaterial color={COLORS.trim} roughness={0.5} metalness={0.2} transparent opacity={0} />
      </mesh>

      {/* Downspouts — vertical pipes at the two front corners, outside both
          the east/west wall and the front-wall outer face. */}
      {[
        [-OUTER_X - 0.08, WALL_H / 2, OUTER_Z + 0.05] as [number, number, number],
        [ OUTER_X + 0.08, WALL_H / 2, OUTER_Z + 0.05] as [number, number, number],
      ].map((p, i) => (
        <mesh key={`ds-${i}`} position={p}>
          <cylinderGeometry args={[0.06, 0.06, WALL_H + 0.1, 12]} />
          <meshStandardMaterial color={COLORS.trim} roughness={0.55} metalness={0.2} transparent opacity={0} />
        </mesh>
      ))}

      {/* Chimney — sits on the east roof slope (off-ridge), with:
           • Flashing collar at the base where it meets the roof (hides the
             slope-to-square mismatch and reads as sheet metal).
           • Brick body with an integrated stone shoulder (narrower above).
           • Two clay flue pots on top — the architectural detail that
             stops the silhouette looking like a vent pipe.
         Base Y is calculated from the ridge-side edge of the chimney so the
         bottom sits on the roof without poking through. */}
      {(() => {
        const chimX = 1.3;                      // east slope, off-ridge
        const chimZ = -0.2;                     // tiny back offset for visual depth
        const bodyW = 0.72;                     // footprint
        const bodyH = 1.25;                     // taller than wide for presence
        // Roof is a gable along Z: roofY(x) = peakY − (|x| / (HW/2)) × ROOF_H
        // Use the edge of the chimney closest to the ridge so the base
        // doesn't poke through the roof on the uphill side.
        const ridgeSideX = chimX - bodyW / 2;
        const baseY =
          WALL_H + ROOF_H - (Math.abs(ridgeSideX) / (HW / 2)) * ROOF_H;
        const centerY = baseY + bodyH / 2;
        const capY = baseY + bodyH + 0.08;
        const shoulderY = baseY + bodyH - 0.18;
        return (
          <>
            {/* Flashing collar — wider dark ring at the base */}
            <mesh position={[chimX, baseY + 0.06, chimZ]}>
              <boxGeometry args={[bodyW + 0.18, 0.12, bodyW + 0.18]} />
              <meshStandardMaterial
                color="#1b1410"
                roughness={0.7}
                metalness={0.25}
                transparent
                opacity={0}
              />
            </mesh>
            {/* Main body — brick */}
            <mesh position={[chimX, centerY, chimZ]}>
              <boxGeometry args={[bodyW, bodyH, bodyW]} />
              <meshStandardMaterial
                color="#8a4a30"
                roughness={0.9}
                transparent
                opacity={0}
              />
            </mesh>
            {/* Stone shoulder — narrower cornice near the top of the body */}
            <mesh position={[chimX, shoulderY, chimZ]}>
              <boxGeometry args={[bodyW + 0.1, 0.08, bodyW + 0.1]} />
              <meshStandardMaterial
                color="#5e3425"
                roughness={0.85}
                transparent
                opacity={0}
              />
            </mesh>
            {/* Cap slab */}
            <mesh position={[chimX, capY, chimZ]}>
              <boxGeometry args={[bodyW + 0.24, 0.14, bodyW + 0.24]} />
              <meshStandardMaterial
                color="#221611"
                roughness={0.85}
                transparent
                opacity={0}
              />
            </mesh>
            {/* Two clay flue pots — terracotta cylinders side-by-side */}
            {[-0.17, 0.17].map((dx, i) => (
              <mesh key={i} position={[chimX + dx, capY + 0.23, chimZ]}>
                <cylinderGeometry args={[0.085, 0.1, 0.32, 18]} />
                <meshStandardMaterial
                  color="#c26744"
                  roughness={0.85}
                  transparent
                  opacity={0}
                />
              </mesh>
            ))}
            {/* Flue pot rims — darker collars at the top of each pot */}
            {[-0.17, 0.17].map((dx, i) => (
              <mesh key={`rim-${i}`} position={[chimX + dx, capY + 0.4, chimZ]}>
                <cylinderGeometry args={[0.09, 0.09, 0.035, 18]} />
                <meshStandardMaterial
                  color="#3a1f12"
                  roughness={0.9}
                  transparent
                  opacity={0}
                />
              </mesh>
            ))}
          </>
        );
      })()}
    </group>
  );
}

/**
 * Foundation slab.
 */
function Foundation({ scroll }: { scroll: ScrollRef }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const p = scroll.current;
    const t = ramp(p, 0.40, 0.46);
    if (matRef.current) {
      matRef.current.opacity = t;
      matRef.current.transparent = t < 0.99;
      matRef.current.visible = t > 0.001;
    }
  });
  return (
    <mesh position={[0, 0.08, 0]}>
      <boxGeometry args={[HW + 0.4, 0.16, HD + 0.4]} />
      {/* Concrete slab color — neutral slate that reads as poured concrete
          and harmonizes with the midnight palette. Previously brand-forest
          (#52796f) which made the whole top-down scene look like a green
          rectangle was dominating the page. */}
      <meshStandardMaterial
        ref={matRef}
        color="#4d5a5f"
        roughness={0.9}
        metalness={0}
        transparent
        opacity={0}
        visible={false}
      />
    </mesh>
  );
}

function InteriorDivider({
  position,
  size,
  scroll,
}: {
  position: [number, number, number];
  size: [number, number, number];
  scroll: ScrollRef;
}) {
  const edgeRef = useRef<THREE.LineBasicMaterial>(null);
  useFrame(() => {
    const p = scroll.current;
    const edgeIn = ramp(p, 0.22, 0.34);
    const edgeOut = 1 - ramp(p, 0.62, 0.78);
    if (edgeRef.current) edgeRef.current.opacity = edgeIn * edgeOut * 0.7;
  });
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} visible={false} />
      <Edges threshold={15}>
        <lineBasicMaterial ref={edgeRef} color={COLORS.sage} transparent opacity={0} />
      </Edges>
    </mesh>
  );
}

function Walls({ scroll }: { scroll: ScrollRef }) {
  const walls: Array<{
    position: [number, number, number];
    size: [number, number, number];
    buildAt: number;
  }> = [
    { position: [0, WALL_H / 2,  HD / 2], size: [HW + WALL_T, WALL_H, WALL_T], buildAt: 0.56 },
    { position: [0, WALL_H / 2, -HD / 2], size: [HW + WALL_T, WALL_H, WALL_T], buildAt: 0.56 },
    { position: [-HW / 2, WALL_H / 2, 0], size: [WALL_T, WALL_H, HD],          buildAt: 0.56 },
    { position: [ HW / 2, WALL_H / 2, 0], size: [WALL_T, WALL_H, HD],          buildAt: 0.56 },
  ];
  return (
    <>
      {walls.map((w, i) => (
        <Wall key={i} position={w.position} size={w.size} buildAt={w.buildAt} scroll={scroll} />
      ))}
      <InteriorDivider position={[0, WALL_H / 2, 0]} size={[HW - 0.4, WALL_H, WALL_T]} scroll={scroll} />
      <InteriorDivider position={[-0.01, WALL_H / 2, -1.2]} size={[WALL_T, WALL_H, HD - 2]} scroll={scroll} />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Camera rig — extended Beat 1, orbit in Beat 3, wider hero shot
 * ──────────────────────────────────────────────────────────────────────── */

function CameraRig({ scroll }: { scroll: ScrollRef }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);

  // Orbit radius/elevation for Beat 3 — camera circles the house.
  // Radius bumped slightly so the house reads smaller in frame (user
  // requested a touch more breathing room). lookAt target Y is also
  // raised (1.2 → 2.2) which pulls the viewing center up and pushes the
  // rendered house lower in the viewport — gives the cost cards and
  // title block more top-of-frame air.
  const ORBIT_R = 15.5;
  const ORBIT_Y = 7;
  const LOOK_Y = 2.2;

  useFrame(() => {
    if (!camRef.current) return;
    const p = scroll.current;

    // Beat 1: true top-down. Use slight Z offset from origin so look-at isn't
    // degenerate; force camera UP to Z-back so "north" reads correctly.
    if (p < 0.18) {
      const t = ramp(p, 0.0, 0.18);
      const camY = lerp(30, 26, t);
      const fov = lerp(24, 26, t);
      camRef.current.position.set(0.001, camY, 0.001);
      camRef.current.up.set(0, 0, -1);
      camRef.current.lookAt(0, 0, 0);
      camRef.current.fov = fov;
      camRef.current.updateProjectionMatrix();
      return;
    }

    // Beat 2: lift up and rotate from top-down to 3-quarter (0.18 → 0.36)
    if (p < 0.36) {
      const t = easeInOut(ramp(p, 0.18, 0.36));
      const cx = lerp(0.001, 13, t);
      const cy = lerp(26, 9.5, t);
      const cz = lerp(0.001, 13, t);
      const ty = lerp(0, LOOK_Y, t);
      const fov = lerp(26, 34, t);
      const upY = lerp(0, 1, t);
      const upZ = lerp(-1, 0, t);
      camRef.current.position.set(cx, cy, cz);
      camRef.current.up.set(0, upY, upZ).normalize();
      camRef.current.lookAt(0, ty, 0);
      camRef.current.fov = fov;
      camRef.current.updateProjectionMatrix();
      return;
    }

    // Beat 3: orbit around the house (0.36 → 0.66) — half-revolution + elevation drift
    if (p < 0.66) {
      const t = easeInOut(ramp(p, 0.36, 0.66));
      const angle = lerp(Math.PI * 0.25, Math.PI * 1.45, t);
      const r = lerp(ORBIT_R, ORBIT_R - 1, t);
      const cx = Math.cos(angle) * r;
      const cz = Math.sin(angle) * r;
      const cy = lerp(ORBIT_Y, 6.5, t);
      const fov = lerp(34, 36, t);
      camRef.current.position.set(cx, cy, cz);
      camRef.current.up.set(0, 1, 0);
      camRef.current.lookAt(0, LOOK_Y, 0);
      camRef.current.fov = fov;
      camRef.current.updateProjectionMatrix();
      return;
    }

    // Beat 4 (chart): slight pull-back, settled angle (0.66 → 0.78)
    if (p < 0.78) {
      const t = easeInOut(ramp(p, 0.66, 0.78));
      const angle = lerp(Math.PI * 1.45, Math.PI * 1.7, t);
      const r = lerp(ORBIT_R - 1, ORBIT_R + 2.5, t);
      const cx = Math.cos(angle) * r;
      const cz = Math.sin(angle) * r;
      const cy = lerp(6.5, 7.5, t);
      const fov = 34;
      camRef.current.position.set(cx, cy, cz);
      camRef.current.up.set(0, 1, 0);
      camRef.current.lookAt(0, LOOK_Y, 0);
      camRef.current.fov = fov;
      camRef.current.updateProjectionMatrix();
      return;
    }

    // Beat 5 + 6: cinematic wide hero shot (0.78 → 1.0).
    const t = easeInOut(ramp(p, 0.78, 1.0));
    const angle = lerp(Math.PI * 1.7, Math.PI * 0.30, t);
    const r = lerp(ORBIT_R + 2.5, ORBIT_R + 7, t);
    const cx = Math.cos(angle) * r;
    const cz = Math.sin(angle) * r;
    const cy = lerp(7.5, 6, t);
    const fov = lerp(34, 30, t);
    camRef.current.position.set(cx, cy, cz);
    camRef.current.up.set(0, 1, 0);
    camRef.current.lookAt(0, LOOK_Y, 0);
    camRef.current.fov = fov;
    camRef.current.updateProjectionMatrix();
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={26}
      near={0.1}
      far={120}
      position={[0.001, 28, 0.001]}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Lighting
 * ──────────────────────────────────────────────────────────────────────── */

function Lights({ scroll }: { scroll: ScrollRef }) {
  const ambRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);

  useFrame(() => {
    const p = scroll.current;
    const earlyToNeutral = ramp(p, 0.20, 0.50);
    const goldenT = ramp(p, 0.66, 0.92);

    if (ambRef.current) {
      const col = new THREE.Color(COLORS.forest)
        .lerp(new THREE.Color("#f6e7c8"), earlyToNeutral)
        .lerp(new THREE.Color("#ffb978"), goldenT);
      ambRef.current.color.copy(col);
      ambRef.current.intensity = lerp(0.45, 0.6, earlyToNeutral);
    }
    if (sunRef.current) {
      const sx = lerp(5, 16, goldenT);
      const sy = lerp(20, 5, goldenT);
      const sz = lerp(10, -5, goldenT);
      sunRef.current.position.set(sx, sy, sz);
      const sunCol = new THREE.Color("#ffffff").lerp(new THREE.Color("#ff955a"), goldenT);
      sunRef.current.color.copy(sunCol);
      sunRef.current.intensity = lerp(0.85, 1.7, goldenT);
    }
    if (hemiRef.current) {
      const skyCol = new THREE.Color(COLORS.midnight).lerp(new THREE.Color("#ffb978"), goldenT);
      const gndCol = new THREE.Color(COLORS.midnightDark).lerp(new THREE.Color("#6b4a2a"), goldenT);
      hemiRef.current.color.copy(skyCol);
      hemiRef.current.groundColor.copy(gndCol);
      hemiRef.current.intensity = lerp(0.3, 0.55, goldenT);
    }
  });

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.45} color={COLORS.forest} />
      <directionalLight
        ref={sunRef}
        position={[5, 20, 10]}
        intensity={0.85}
        color="#ffffff"
      />
      <hemisphereLight
        ref={hemiRef}
        color={COLORS.midnight}
        groundColor={COLORS.midnightDark}
        intensity={0.3}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Scene composition
 * ──────────────────────────────────────────────────────────────────────── */

function SceneBackground({ scroll: _scroll }: { scroll: ScrollRef }) {
  // Canvas is alpha:true — sticky container's CSS bg-brand-midnight shows
  // through. Fog stays at midnight throughout so anything that fades to fog
  // distance also fades to the same midnight as the page background.
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.Fog(COLORS.midnight, 22, 60), []);
  useEffect(() => {
    scene.background = null;
    scene.fog = fog;
  }, [scene, fog]);
  return null;
}

function HouseScene({
  scroll,
}: {
  scroll: ScrollRef;
}) {
  return (
    <>
      <SceneBackground scroll={scroll} />
      <Lights scroll={scroll} />
      <CameraRig scroll={scroll} />
      <Ground scroll={scroll} />
      <FloorPlan scroll={scroll} />
      <Foundation scroll={scroll} />
      <Walls scroll={scroll} />
      <Roof scroll={scroll} />
      <WindowsAndDoor scroll={scroll} />
      <Landscape scroll={scroll} />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * DOM overlays
 * ──────────────────────────────────────────────────────────────────────── */

function CADFrame({ progress }: { progress: MotionValue<number> }) {
  // Held invisible during IntroTitle window (the crosshair + crop marks +
  // title block would otherwise form a busy frame behind the opening card).
  // Appears with Beat 1, then dims during photoreal to let the house breathe.
  const opacity = useTransform(
    progress,
    [0.095, 0.14, 0.78, 0.90],
    [0, 1, 1, 0.35]
  );
  return (
    <motion.div
      style={{ opacity }}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-20"
    >
      {/* Corner crop marks */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g stroke={COLORS.sage} strokeWidth="0.18" fill="none" opacity="0.6">
          <path d="M2 2 L2 7 M2 2 L7 2" />
          <path d="M98 2 L98 7 M98 2 L93 2" />
          <path d="M2 98 L2 93 M2 98 L7 98" />
          <path d="M98 98 L98 93 M98 98 L93 98" />
        </g>
        <g stroke={COLORS.sage} strokeWidth="0.08" fill="none" opacity="0.18">
          <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="0.6 1.2" />
          <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="0.6 1.2" />
        </g>
      </svg>

      {/* Title block bottom-right — bigger, more legible.
          Hidden on mobile where it would collide with the cost-card stack. */}
      <div className="hidden md:block absolute bottom-6 right-6 md:bottom-8 md:right-10 font-mono text-[12px] md:text-[13px] tracking-[0.12em] text-brand-sage-mist/85 leading-[1.55] bg-brand-midnight-dark/55 backdrop-blur-md border-l-[3px] border-brand-amber pl-4 pr-5 py-3 rounded-sm shadow-xl shadow-black/40">
        <div className="text-[10px] tracking-[0.22em] text-brand-amber font-bold mb-1.5">JOHNSON RESIDENCE</div>
        <div><span className="text-brand-amber/90 font-semibold">DWG</span> &nbsp; A-04 · REV 03</div>
        <div><span className="text-brand-amber/90 font-semibold">DATE</span> &nbsp; 04 / 15 / 2026</div>
        <div><span className="text-brand-amber/90 font-semibold">SCALE</span> 1/4&quot; = 1&apos;-0&quot;</div>
        <div><span className="text-brand-amber/90 font-semibold">SHEET</span> 04 / 10</div>
      </div>

      {/* Side ruler (left edge) */}
      <div className="hidden md:block absolute left-3 top-1/4 bottom-1/4 w-px bg-brand-sage/15">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <div
            key={t}
            className="absolute -left-1 w-2 h-px bg-brand-sage/40"
            style={{ top: `${t * 100}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function TelemetryPill({
  frame,
  state,
  progress,
}: {
  frame: number;
  state: string;
  progress: MotionValue<number>;
}) {
  const padded = String(frame).padStart(2, "0");
  // Held at 0 opacity during the IntroTitle window so it doesn't
  // crowd the opening title card. Appears AFTER title has fully exited.
  const opacity = useTransform(progress, [0.095, 0.14], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="hidden md:flex absolute top-6 left-1/2 -translate-x-1/2 items-center gap-2.5 z-30 font-mono text-[10px] tracking-[0.12em] text-brand-sage-mist/85 bg-brand-midnight-dark/70 border border-brand-forest/30 px-3.5 py-1.5 rounded-sm backdrop-blur-md shadow-lg shadow-black/30"
    >
      <span className="text-brand-sage-mist/45">FRAME</span>
      <span className="text-brand-amber-bright font-semibold tabular-nums">{padded} / 60</span>
      <span className="text-brand-forest/40">·</span>
      <span className="text-brand-sage-mist/45">STATE</span>
      <span className="text-brand-amber-bright font-semibold">{state}</span>
      <span className="text-brand-forest/40">·</span>
      <div className="w-24 h-[2px] bg-brand-forest/20 relative overflow-hidden rounded-full">
        <div
          className="absolute left-0 top-0 bottom-0 bg-brand-amber-bright"
          style={{ width: `${(frame / 60) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}

function HeadlineOverlay({
  kicker,
  headline,
  progress,
}: {
  kicker: string;
  headline: string;
  progress: MotionValue<number>;
}) {
  // Top-left anchored so it lives ABOVE the house in every beat (top-down plan,
  // 3/4-view wireframe, photoreal) rather than crossing over dimensions/labels.
  // Held at 0 opacity for the first ~10% of scroll while IntroTitle is the
  // star of the frame — fades in AFTER the intro title fully exits so the
  // two headlines never stack.
  const opacity = useTransform(progress, [0.095, 0.14], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute top-14 md:top-16 left-6 md:left-12 lg:left-20 z-20 max-w-[75%] md:max-w-[42%] pointer-events-none"
    >
      <motion.div
        key={kicker + headline}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] text-brand-amber font-semibold mb-2 md:mb-2.5">
          {kicker}
        </div>
        <h3
          className="text-[24px] md:text-[38px] lg:text-[44px] font-heading font-bold tracking-tight text-white leading-[1.05]"
          style={{ textShadow: "0 6px 32px rgba(0,0,0,0.65)" }}
        >
          {headline || " "}
        </h3>
        {headline && (
          <div className="mt-3 h-[2px] w-12 bg-brand-amber rounded-full" />
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * IntroTitle — the section's opening card. Lives INSIDE the sticky 3D
 * container and fades out as Beat 1's headline takes over, so the
 * section's title and its animation read as one unified experience
 * instead of a text block + a dead bridge + an animation.
 */
/**
 * IntroVeil — solid dark-sage surface that sits above the R3F canvas and
 * grid overlay during the opening title. Fades out as IntroTitle exits so
 * Beat 1 elements appear on a clean handoff. Layered below IntroTitle
 * (z-20) but above the canvas (default z) and grid overlay (z-[1]).
 */
function IntroVeil({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.0, 0.06, 0.095], [1, 1, 0]);
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity, backgroundColor: "#4E6253" }}
      className="absolute inset-0 z-[15] pointer-events-none"
    />
  );
}

function IntroTitle({ progress }: { progress: MotionValue<number> }) {
  // Fully visible until 0.05, fully gone by 0.085 — gives Beat 1 a clean
  // dark canvas to fade into with no text-on-text crowding.
  const opacity = useTransform(progress, [0.0, 0.05, 0.085], [1, 1, 0]);
  const y = useTransform(progress, [0.0, 0.085], [0, -24]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 z-30 flex items-center pointer-events-none px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-[640px] md:max-w-[680px]">
        <p className="font-mono text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-brand-sage-mist/85 mb-5 inline-flex items-center gap-2.5">
          <span className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sage" />
          </span>
          How Stroyka Sees Your Project
        </p>
        <h2
          className="font-display font-light text-[clamp(2.25rem,6vw,4.75rem)] leading-[0.98] tracking-[-0.025em] text-bone mb-5"
          style={{ textShadow: "0 8px 40px rgba(0,0,0,0.7)" }}
        >
          From plan to done — every dollar tracked.
        </h2>
        <p
          className="text-base md:text-lg text-bone/80 leading-relaxed max-w-lg"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
        >
          Scroll to see a project unfold in Stroyka — every material, every
          cost, in real time.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-brand-sage-mist/70">
          <span className="w-6 h-px bg-brand-amber" aria-hidden />
          Scroll to begin
          <span className="inline-block animate-bounce text-brand-amber">↓</span>
        </div>
      </div>
    </motion.div>
  );
}

function CostCard({
  entry,
  index,
  progress,
}: {
  entry: CostEntry;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [entry.showAt - 0.02, entry.showAt + 0.025, 0.72, 0.78],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [entry.showAt - 0.02, entry.showAt + 0.05], [20, 0]);
  const topPx = 92 + index * 104;

  return (
    <motion.div
      style={{ opacity, y, top: `${topPx}px` }}
      className="hidden md:block absolute right-6 lg:right-10 w-[272px] z-20 font-heading"
    >
      <div
        className="relative rounded-[4px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,21,24,0.90) 0%, rgba(26,36,40,0.84) 100%)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          boxShadow:
            "0 26px 60px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand-amber" />
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-mono text-[10px] tracking-[0.18em] text-brand-amber font-semibold">
              + {entry.label}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-sage shadow-[0_0_8px_#84a98c]" />
          </div>
          <div className="text-white text-[28px] font-bold tracking-tighter leading-none tabular-nums">
            {entry.amount}
          </div>
          <div className="text-[12px] text-brand-sage-mist/65 mt-2">{entry.subtitle}</div>
          <div className="mt-3 pt-2.5 border-t border-brand-forest/15 flex justify-between font-mono text-[10px] text-brand-sage-mist/50">
            <span>JOB · #204</span>
            <span className="text-brand-sage">▲ logged</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RunningTotalCard({
  total,
  progress,
}: {
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0.36, 0.42, 0.74, 0.80], [0, 1, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="hidden md:block absolute bottom-8 md:left-12 lg:left-20 z-20"
    >
      <div
        className="rounded-[3px] px-6 py-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(82,121,111,0.22), rgba(82,121,111,0.10))",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(132,169,140,0.4)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        }}
      >
        {/* Fix 5: 48px × 1px amber rule above label */}
        <div
          aria-hidden="true"
          className="mb-2"
          style={{ width: "48px", height: "1px", background: "#d97706" }}
        />
        <div className="font-mono text-[10px] tracking-[0.18em] text-brand-sage font-semibold">
          SPENT TO DATE
        </div>
        {/* Fix 5: 56–64px amber number with glow */}
        <div
          className="font-heading font-bold tracking-tighter leading-none mt-2 tabular-nums"
          style={{
            color: "#d97706",
            fontSize: "clamp(42px, 5vw, 64px)",
            textShadow: "0 0 40px rgba(217, 119, 6, 0.4)",
          }}
        >
          {formatCurrency(total)}
        </div>
        <div className="flex gap-1 mt-3">
          {COST_ENTRIES.map((e, i) => {
            const shown =
              total >=
              COST_ENTRIES.slice(0, i + 1).reduce((s, x) => s + x.numericValue, 0);
            return (
              <div
                key={e.label}
                className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                  shown ? "bg-brand-amber" : "bg-brand-forest/25"
                }`}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function ChartBar({
  bar,
  fill,
}: {
  bar: { label: string; actual: number; plan: number };
  fill: MotionValue<number>;
}) {
  const targetPct = (bar.actual / bar.plan) * 100;
  const width = useTransform(fill, (v) => `${v * targetPct}%`);
  return (
    <div>
      <div className="flex justify-between text-[12px] text-brand-sage-mist/90 mb-1.5 font-heading">
        <span className="font-medium">{bar.label}</span>
        <span className="font-mono tabular-nums">
          ${(bar.actual / 1000).toFixed(1)}k / ${(bar.plan / 1000).toFixed(1)}k
        </span>
      </div>
      <div className="h-[7px] bg-brand-forest/15 rounded-sm relative overflow-hidden">
        <motion.div
          style={{ width }}
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-brand-sage to-brand-forest rounded-sm"
        />
      </div>
    </div>
  );
}

function ChartCard({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.66, 0.70, 0.76, 0.80], [0, 1, 1, 0]);
  const x = useTransform(progress, [0.66, 0.70], [40, 0]);
  const fill = useTransform(progress, [0.70, 0.76], [0, 1]);
  return (
    <motion.div
      style={{ opacity, x }}
      className="hidden md:block absolute top-1/2 -translate-y-1/2 right-6 lg:right-10 z-20 w-[340px]"
    >
      <div
        className="rounded-[4px] p-5 font-heading"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,21,24,0.92) 0%, rgba(26,36,40,0.86) 100%)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          border: "1px solid rgba(132,169,140,0.3)",
          boxShadow:
            "0 28px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        <div className="flex justify-between items-baseline mb-4">
          <div className="font-mono text-[11px] tracking-[0.16em] text-brand-sage font-semibold">
            PLAN VS ACTUAL
          </div>
          <div className="font-mono text-[10px] text-brand-amber tracking-wider">JOB #204</div>
        </div>
        <div className="flex flex-col gap-3.5">
          {CHART_BARS.map((bar) => (
            <ChartBar key={bar.label} bar={bar} fill={fill} />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-brand-forest/15 flex justify-between font-mono text-[10px] text-brand-sage-mist/65">
          <span>ON BUDGET</span>
          <span className="text-brand-sage">● 89% TRACK</span>
        </div>
      </div>
    </motion.div>
  );
}

function HeroChip({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.94, 0.98], [0, 1]);
  const scale = useTransform(progress, [0.94, 0.98], [0.86, 1]);
  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-full"
        style={{
          background: "rgba(15, 21, 24, 0.88)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          border: "1px solid rgba(132, 169, 140, 0.4)",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
        }}
      >
        <span className="relative flex w-2.5 h-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-sage opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-sage" />
        </span>
        <span className="font-heading text-sm md:text-base font-semibold text-white tracking-tight">
          Johnson Home
        </span>
        <span className="text-brand-sage/40">·</span>
        <span className="font-heading text-xs md:text-sm text-brand-sage-mist/85">On time</span>
        <span className="text-brand-sage/40">·</span>
        <span className="font-heading text-xs md:text-sm text-brand-sage-mist/85">On budget</span>
      </div>
    </motion.div>
  );
}

function MobileCostRow({
  entry,
  progress,
}: {
  entry: CostEntry;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [entry.showAt - 0.02, entry.showAt + 0.025, 0.72, 0.78],
    [0, 1, 1, 0]
  );
  return (
    <motion.div
      style={{ opacity }}
      className="flex items-center justify-between bg-brand-midnight-dark/85 border-l-2 border-brand-amber px-3 py-2 rounded-sm backdrop-blur-md"
    >
      <span className="font-mono text-[9px] tracking-[0.14em] text-brand-amber font-semibold">
        + {entry.label}
      </span>
      <span className="text-white text-sm font-heading font-bold tracking-tighter tabular-nums">
        {entry.amount}
      </span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Static fallback (reduced-motion)
 * ──────────────────────────────────────────────────────────────────────── */

function StaticFallback() {
  return (
    <section
      id="plan-to-done"
      aria-label="Construction project lifecycle visualization"
      className="relative bg-[#4E6253] py-16 lg:py-24"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="font-heading text-xs font-semibold tracking-[0.2em] uppercase text-brand-forest mb-3">
            How Stroyka Sees Your Project
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white leading-tight max-w-2xl mx-auto">
            From plan to done — every dollar tracked.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {COST_ENTRIES.map((entry) => (
            <div
              key={entry.label}
              className="bg-brand-midnight-dark/70 border border-brand-forest/25 border-l-[2px] border-l-brand-amber rounded-sm px-4 py-3"
            >
              <div className="font-mono text-[9px] tracking-[0.18em] text-brand-amber font-semibold mb-1">
                + {entry.label}
              </div>
              <div className="text-white text-xl font-heading font-bold tracking-tighter">
                {entry.amount}
              </div>
              <div className="text-[11px] text-brand-sage-mist/55 mt-0.5">{entry.subtitle}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 bg-brand-forest/15 border border-brand-forest/35 px-5 py-2.5 rounded-full backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-sage" />
            <span className="font-heading text-sm font-semibold text-white">Johnson Home</span>
            <span className="text-brand-sage/40">·</span>
            <span className="text-sm text-brand-sage-mist/85">On time · On budget</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Main component
 * ──────────────────────────────────────────────────────────────────────── */

export default function PlanToDoneAnimation() {
  const prefersReduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const scrollYProgress = useMotionValue(0);

  const [beat, setBeat] = useState<Beat>(BEATS[0]);
  const [frame, setFrame] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Manual scroll progress via bounding-rect math. Bulletproof against
  // framer-motion's useScroll target-resolution flakiness (container-
  // position warnings, dynamic-import hydration timing, etc.).
  useEffect(() => {
    let raf = 0;
    let lastP = -1;
    let lastBeatName: BeatName | null = null;
    let lastFrame = -1;
    let lastTotal = -1;

    const tick = () => {
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const past = -rect.top;
        const p = scrollable > 0 ? Math.max(0, Math.min(1, past / scrollable)) : 0;

        if (p !== lastP) {
          lastP = p;
          scrollRef.current = p;
          scrollYProgress.set(p);

          const f = Math.min(60, Math.floor(p * 60));
          if (f !== lastFrame) {
            lastFrame = f;
            setFrame(f);
          }

          const next = getBeat(p);
          if (next.name !== lastBeatName) {
            lastBeatName = next.name;
            setBeat(next);
          }

          // Sync with CostCard appearances: each entry contributes its
          // full numericValue during the 0.04-scroll window that starts
          // at its own `showAt`. This keeps the Spent-To-Date number
          // stepping up in lockstep with the cost cards that appear.
          let running = 0;
          for (const e of COST_ENTRIES) {
            const w = clamp01((p - e.showAt) / 0.04);
            running += w * e.numericValue;
          }
          // Hold at RUNNING_TOTAL through the chart beat, fade with cards
          // (handled by card opacity — total value itself stays stable).
          const total = Math.round(running);
          if (total !== lastTotal) {
            lastTotal = total;
            setTotalSpent(total);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  if (prefersReduced) return <StaticFallback />;

  return (
    <>
      {/* 3D canvas on dark teal-sage. The section's intro title + kicker
          now live INSIDE the sticky container as IntroTitle — so the
          headline, the animation, and the scroll all read as one
          continuous experience instead of a text block, a dead bridge,
          and a separate animation. */}
      <section
        id="plan-to-done"
        aria-label="How Stroyka sees your project — interactive scroll animation"
        className="relative bg-[#4E6253]"
        style={{ overflow: "clip" }}
      >
      <div
        ref={wrapperRef}
        style={{ position: "relative", height: "500vh" }}
      >
        <div
          className="sticky top-16 h-[calc(100vh-4rem)] min-h-[560px] bg-[#4E6253]"
          style={{ overflow: "clip" }}
        >
          <div className="absolute inset-0 z-0">
            <Canvas
              dpr={[1, 2]}
              flat
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              camera={{ fov: 26, near: 0.1, far: 120, position: [0.001, 28, 0.001] }}
            >
              <HouseScene scroll={scrollRef} />
            </Canvas>
          </div>

          {/* Top seam feather — hides any sub-pixel rendering difference
              between the bridge gradient above and the canvas below. Pure
              sage-olive at top → transparent so it dissolves into the
              scene within 80px. */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-20 z-[2] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, #4E6253 0%, rgba(78,98,83,0) 100%)",
            }}
          />

          {/* CAD grid backdrop — Fix 2: forest at 20% opacity */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(82,121,111,0.20) 1px, transparent 1px), linear-gradient(90deg, rgba(82,121,111,0.20) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at center, #000 0%, #000 50%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 0%, #000 50%, transparent 85%)",
            }}
          />
          {/* Vignette removed — the ground plane is already exact-match
              brand-midnight. Any extra darkening overlay re-introduced the
              seam with the page background. */}

          {/* Intro veil — covers the R3F canvas + grid with a solid dark
              surface during the opening title, then fades out as the title
              exits so Beat 1 elements can appear. This is simpler and more
              robust than individually gating every mesh's intro opacity. */}
          <IntroVeil progress={scrollYProgress} />

          <CADFrame progress={scrollYProgress} />
          <TelemetryPill
            frame={frame}
            state={beat.state}
            progress={scrollYProgress}
          />
          <IntroTitle progress={scrollYProgress} />
          <HeadlineOverlay
            kicker={beat.kicker}
            headline={beat.headline}
            progress={scrollYProgress}
          />

          {COST_ENTRIES.map((entry, i) => (
            <CostCard
              key={entry.label}
              entry={entry}
              index={i}
              progress={scrollYProgress}
            />
          ))}

          <RunningTotalCard total={totalSpent} progress={scrollYProgress} />
          <ChartCard progress={scrollYProgress} />
          <HeroChip progress={scrollYProgress} />

          <div className="md:hidden absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-1.5">
            {COST_ENTRIES.map((entry) => (
              <MobileCostRow key={entry.label} entry={entry} progress={scrollYProgress} />
            ))}
          </div>

        </div>
      </div>
      </section>
    </>
  );
}
