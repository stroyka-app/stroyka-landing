"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import Crane from "./Crane";
import { BudgetEnvelope, Dust, Ground, Skyline } from "./Site";
import { useScenePalette, type ScenePalette } from "./palette";
import Sky, { type SkyUniforms } from "./Sky";
import {
  BLOCK_W,
  BUDGET,
  BUILDING,
  JIB_Y,
  LOADS,
  PAD_TOP,
  craneAt,
  heightOf,
  landedBaseY,
  yardSlot,
} from "./choreo";

/**
 * DOM elements the scene positions every frame by projecting a 3D anchor
 * to the screen. Owned by the Lift section, written here, never re-rendered.
 */
export type SceneBridge = {
  hook: HTMLDivElement | null;
  budget: HTMLDivElement | null;
  stack: HTMLDivElement | null;
};

type Props = {
  progress: MotionValue<number>;
  bridge: MutableRefObject<SceneBridge>;
  reduced: boolean;
  compact: boolean;
  /** Push the site to the right while the hero headline owns the left. */
  heroShift: boolean;
  active: boolean;
  /** Keep the hero camera framing whatever the progress (the phone hero
   *  runs the lifts behind its headline). */
  heroCamera?: boolean;
};

export default function CraneScene(props: Props) {
  return (
    <Canvas
      shadows
      // Phones up to 2x (was 1.5): the crane's lattice needs the pixels, or its
      // thinnest members fall between them and shimmer on scroll.
      dpr={[1, 2]}
      frameloop={props.active ? "always" : "never"}
      // logarithmicDepthBuffer: iPhone WebGL can hand us a coarse depth buffer,
      // and at ~200 units nearly-touching surfaces (the skyline) resolved to
      // the same depth and flickered on scroll. Log depth keeps precision at
      // distance on every device; the scene is small enough not to notice.
      // alpha: false — the sky is drawn in WebGL (Sky.tsx), so the canvas is
      // opaque; a transparent canvas moved by the scroll-driven pin shimmered
      // on iOS where the crane stood against the sky.
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", logarithmicDepthBuffer: true }}
      // near 10: nothing in the scene comes within ~50 units of the camera;
      // a far-out near plane is the other half of depth precision.
      camera={{ position: [-40, 21, 62], fov: 36, near: 10, far: 400 }}
    >
      <Contents {...props} />
    </Canvas>
  );
}

/* ── helpers ──────────────────────────────────────────────────────────── */

const UP = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

/** Stretch a unit-height cylinder between two world points. */
function span(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) {
  tmpDir.subVectors(b, a);
  const len = tmpDir.length();
  mesh.position.addVectors(a, b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, tmpDir.normalize());
  mesh.scale.set(1, Math.max(len, 0.001), 1);
}

const proj = new THREE.Vector3();
function pin(
  el: HTMLDivElement | null,
  world: THREE.Vector3,
  camera: THREE.Camera,
  size: { width: number; height: number },
  visible: boolean,
) {
  if (!el) return;
  proj.copy(world).project(camera);
  const x = Math.round((proj.x * 0.5 + 0.5) * size.width);
  const y = Math.round((-proj.y * 0.5 + 0.5) * size.height);
  el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  el.dataset.visible = visible && proj.z < 1 ? "1" : "0";
}

const lerp = THREE.MathUtils.lerp;


/* ── scene ────────────────────────────────────────────────────────────── */

function Contents({ progress, bridge, reduced, compact, heroShift, heroCamera = false }: Props) {
  const slewRef = useRef<THREE.Group>(null);
  const trolleyRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.MeshStandardMaterial>(null);
  const hookRef = useRef<THREE.Group>(null);
  const cableRef = useRef<THREE.Mesh>(null);
  const slingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const blockRefs = useRef<(THREE.Group | null)[]>([]);
  const windowMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const floodRef = useRef<THREE.PointLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const { camera, size, scene } = useThree();
  const pal = useScenePalette();
  const skyU = useRef<SkyUniforms | null>(null);
  const setSkyU = useCallback((u: SkyUniforms) => void (skyU.current = u), []);
  const haze = useMemo(
    () => ({ day: new THREE.Color(pal.hazeDay), night: new THREE.Color(pal.hazeNight) }),
    [pal.hazeDay, pal.hazeNight],
  );

  // Parallax reads the pointer from the WINDOW: the hero copy and HUD sit
  // above the canvas, so the canvas itself rarely receives pointer events.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Pendulum state for the hook: world-space offset + velocity.
  const sim = useRef({
    last: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    sway: new THREE.Vector3(),
    swayVel: new THREE.Vector3(),
    look: new THREE.Vector3(5, 12, 0),
    par: new THREE.Vector2(),
    primed: false,
  });

  const trolleyWorld = useMemo(() => new THREE.Vector3(), []);
  const hookWorld = useMemo(() => new THREE.Vector3(), []);
  const envelopeTop = useMemo(
    () => new THREE.Vector3(BUILDING.x + (BLOCK_W + 0.8) / 2, PAD_TOP + heightOf(BUDGET), BUILDING.z + (BLOCK_W + 0.8) / 2),
    [],
  );
  const stackTop = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const t = state.clock.elapsedTime;
    const p = progress.get();
    const c = craneAt(p);
    const s = sim.current;

    /* crane pose — plus a lazy idle drift while the hero is up */
    const still = reduced;
    const idleSwing = still ? 0 : c.idle * Math.sin(t * 0.22) * 0.28;
    const theta = c.theta + idleSwing;
    const r = c.r + (still ? 0 : c.idle * Math.sin(t * 0.31 + 1) * 2.5);
    if (slewRef.current) slewRef.current.rotation.y = theta;
    if (trolleyRef.current) trolleyRef.current.position.x = r;

    trolleyWorld.set(Math.cos(theta) * r, JIB_Y - 0.55, -Math.sin(theta) * r);

    /* hook sway: a damped pendulum driven by the trolley's acceleration */
    if (!s.primed) {
      s.last.copy(trolleyWorld);
      s.primed = true;
    }
    tmpA.subVectors(trolleyWorld, s.last).divideScalar(Math.max(dt, 1e-4));
    const accel = tmpA.clone().sub(s.vel).divideScalar(Math.max(dt, 1e-4));
    s.vel.copy(tmpA);
    s.last.copy(trolleyWorld);
    if (!reduced) {
      // x'' = −k·x − c·x' − g·a_trolley : the load lags the trolley, then settles.
      const k = 7;
      const damp = 2.2;
      accel.y = 0;
      accel.clampLength(0, 40);
      const a = accel.multiplyScalar(-0.07).addScaledVector(s.sway, -k).addScaledVector(s.swayVel, -damp);
      s.swayVel.addScaledVector(a, dt);
      s.sway.addScaledVector(s.swayVel, dt);
      s.sway.clampLength(0, 1.6);
      // A breath of wind so nothing is ever perfectly still.
      s.sway.x += Math.sin(t * 0.9) * 0.0015;
    } else {
      s.sway.set(0, 0, 0);
    }

    hookWorld.set(trolleyWorld.x + s.sway.x, c.hookY + 0.9, trolleyWorld.z + s.sway.z);
    if (hookRef.current) hookRef.current.position.copy(hookWorld);
    if (cableRef.current) span(cableRef.current, trolleyWorld, hookWorld);

    /* loads */
    LOADS.forEach((load, i) => {
      const g = blockRefs.current[i];
      if (!g) return;
      const h = heightOf(load.cost);
      if (i < c.landed) {
        g.position.set(BUILDING.x, landedBaseY(i) + h / 2, BUILDING.z);
        g.rotation.set(0, 0, 0);
      } else if (i === c.carrying) {
        g.position.set(hookWorld.x, c.hookY - h / 2, hookWorld.z);
        g.rotation.set(s.sway.z * 0.05, 0, -s.sway.x * 0.05);
      } else {
        const slot = yardSlot(i);
        g.position.set(slot.x, h / 2, slot.z);
        g.rotation.set(0, 0, 0);
      }
      const wm = windowMats.current[i];
      if (wm) wm.emissiveIntensity = i < c.landed ? 0.12 + c.finale * 1.6 : 0.04;
    });

    /* slings: hook → the carried load's top corners */
    const carried = c.carrying >= 0 ? blockRefs.current[c.carrying] : null;
    slingRefs.current.forEach((m, k) => {
      if (!m) return;
      m.visible = !!carried;
      if (!carried) return;
      const hw = BLOCK_W / 2 - 0.3;
      tmpA.set(k < 2 ? -hw : hw, c.hookY, k % 2 === 0 ? -hw : hw).add(new THREE.Vector3(hookWorld.x, 0, hookWorld.z));
      span(m, new THREE.Vector3(hookWorld.x, hookWorld.y - 0.6, hookWorld.z), tmpA);
    });

    /* beacon + flood */
    if (beaconRef.current) {
      // A slow breathing glow (2.8s), not a strobe: the hard on/off blink
      // (sin > 0.55 → 4 else 0.25, ~2 flashes a second) read on phones as the
      // top of the crane flickering.
      beaconRef.current.emissiveIntensity = reduced ? 1.6 : 1 + 0.9 * (0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 2.8));
    }
    if (floodRef.current) floodRef.current.intensity = c.finale * 220;

    /* the day ends as the job closes: haze cools, sun drops, windows glow */
    const night = c.finale * 0.85;
    if (skyU.current) skyU.current.uNight.value = night;
    if (scene.fog) (scene.fog as THREE.Fog).color.lerpColors(haze.day, haze.night, night);
    if (hemiRef.current) hemiRef.current.intensity = lerp(1.1, 0.4, night);
    if (sunRef.current) sunRef.current.intensity = lerp(2.6, 0.7, night);

    /* camera: hero → lifts → pull-back, with a slow orbit and pointer parallax */
    const lift = heroCamera ? 0 : 1 - c.idle;
    const fin = heroCamera ? 0 : c.finale;
    const orbit = heroCamera ? 0 : (p - 0.1) * 0.32;
    // Phone hero loop: the whole site (crane top to yard) has to fit the band
    // under the CTAs, so the camera stands further back.
    const reach = compact ? (heroCamera ? 1.7 : 1.25) : 1;
    const base = new THREE.Vector3(
      lerp(lerp(-40, -44, lift), -58, fin),
      lerp(lerp(21, 27, lift), 36, fin),
      lerp(lerp(62, 60, lift), 70, fin),
    );
    const look = new THREE.Vector3(
      lerp(lerp(4, 7, lift), 8, fin),
      lerp(lerp(14, 11, lift), 10, fin),
      lerp(lerp(0, 1, lift), -1, fin),
    );
    const off = base.sub(look).applyAxisAngle(UP, reduced ? 0 : orbit).multiplyScalar(reach);
    if (!reduced) {
      s.par.x = lerp(s.par.x, pointer.current.x, 0.04);
      s.par.y = lerp(s.par.y, pointer.current.y, 0.04);
    }
    camera.position.copy(look).add(off);
    camera.position.x += s.par.x * 2.2;
    camera.position.y += s.par.y * 1.2;
    s.look.lerp(look, reduced ? 1 : 0.2);
    camera.lookAt(s.look);

    const cam = camera as THREE.PerspectiveCamera;
    // Hero: push the site right of the headline. Lifts: nudge it left of the
    // ledger card. Phones keep it centred.
    // Reduced motion shows the finished job BEHIND the hero, so it keeps
    // the hero framing even though progress is pinned to the end.
    const heroW = reduced || heroCamera ? 1 : c.idle;
    const shift = heroShift ? -0.24 * heroW + 0.1 * (1 - heroW) : 0;
    // Phones: the hero copy owns the top, so drop the site into the lower
    // half while it's up; the lifts centre it between caption and ledger.
    const lower = compact ? (heroCamera ? -0.08 : -0.24 * heroW + 0.04 * (1 - heroW)) : 0;
    if (shift !== 0 || lower !== 0) {
      cam.setViewOffset(size.width, size.height, size.width * shift, size.height * lower, size.width, size.height);
    } else if (cam.view) {
      cam.clearViewOffset();
    }
    const fov = compact ? 47 : 36;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    /* DOM pins */
    const b = bridge.current;
    pin(b.hook, hookWorld.clone().setY(c.hookY - 0.2), camera, size, c.carrying >= 0);
    pin(b.budget, envelopeTop, camera, size, p > 0.08);
    const top = landedBaseY(c.landed);
    // Screen-right corner of the pad (camera sits at −x,+z), just outside the
    // dashed budget outline, so the mast never passes in front of the tag.
    stackTop.set(BUILDING.x + (BLOCK_W + 0.8) / 2, top, BUILDING.z + (BLOCK_W + 0.8) / 2);
    pin(b.stack, stackTop, camera, size, c.landed > 0);
  });

  return (
    <>
      <fog attach="fog" args={[pal.hazeDay, 90, 250]} />
      <Sky pal={pal} uniformsRef={setSkyU} />
      <hemisphereLight ref={hemiRef} args={[pal.hemiSky, pal.hemiGround, 1.1]} color={pal.hemiSky} groundColor={pal.hemiGround} />
      <ambientLight intensity={0.15} />
      <directionalLight
        ref={sunRef}
        position={[-42, 34, 26]}
        intensity={2.6}
        color={pal.sun}
        castShadow
        shadow-mapSize={compact ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
      />
      <pointLight ref={floodRef} position={[BUILDING.x - 8, 6, BUILDING.z + 10]} color="#F4F7D9" intensity={0} distance={60} />

      <Ground pal={pal} />
      {/* Phones: no 3D skyline. On a phone GPU the distant towers flickered
          on scroll however their depth was set up (sunk bases, log depth,
          spacing — none fully cured it on device), and at phone size they
          were faint shapes in the haze anyway. Desktop keeps them. */}
      {!compact && <Skyline color={pal.skyline} />}
      <Dust count={compact ? 140 : 260} animate={!reduced} color={pal.line} />
      <BudgetEnvelope color={pal.line} />

      <Crane slewRef={slewRef} trolleyRef={trolleyRef} beaconRef={beaconRef} pal={pal} compact={compact} />

      {/* Hook block */}
      <group ref={hookRef}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.1, 0.5]} />
          <meshStandardMaterial color={pal.steelDark} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.1, 0.26]}>
          <boxGeometry args={[0.8, 0.22, 0.02]} />
          <meshStandardMaterial color={pal.steel} emissive={pal.steel} emissiveIntensity={0.4} />
        </mesh>
      </group>
      <mesh ref={cableRef}>
        <cylinderGeometry args={compact ? [0.09, 0.09, 1, 6] : [0.045, 0.045, 1, 6]} />
        <meshStandardMaterial color="#20261F" />
      </mesh>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} ref={(m) => void (slingRefs.current[k] = m)} visible={false}>
          <cylinderGeometry args={compact ? [0.06, 0.06, 1, 5] : [0.03, 0.03, 1, 5]} />
          <meshStandardMaterial color="#20261F" />
        </mesh>
      ))}

      {LOADS.map((load, i) => (
        <LoadBlock
          key={load.id}
          index={i}
          pal={pal}
          groupRef={(g) => void (blockRefs.current[i] = g)}
          windowRef={(m) => void (windowMats.current[i] = m)}
        />
      ))}
    </>
  );
}

/**
 * One cost, as a storey. Concrete is the foundation and the roof caps it;
 * everything between carries a band of windows that light up at the end.
 */
function LoadBlock({
  index,
  pal,
  groupRef,
  windowRef,
}: {
  index: number;
  pal: ScenePalette;
  groupRef: (g: THREE.Group | null) => void;
  windowRef: (m: THREE.MeshStandardMaterial | null) => void;
}) {
  const load = LOADS[index];
  const h = heightOf(load.cost);
  const glazed = load.id !== "concrete" && load.id !== "roof";
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(BLOCK_W, h, BLOCK_W)), [h]);
  const slot = yardSlot(index);

  return (
    <group ref={groupRef} position={[slot.x, h / 2, slot.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BLOCK_W, h, BLOCK_W]} />
        <meshStandardMaterial color={load.id === "labor" ? pal.labor : load.color} roughness={0.75} metalness={load.id === "steel" ? 0.35 : 0.05} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={pal.line} transparent opacity={0.35} />
      </lineSegments>
      {glazed && <Windows h={h} materialRef={windowRef} glow={pal.window} />}
      {load.id === "roof" && (
        <mesh position={[0, h / 2 + 0.35, 0]} castShadow>
          <boxGeometry args={[BLOCK_W * 0.4, 0.7, BLOCK_W * 0.4]} />
          <meshStandardMaterial color="#3E4A42" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
}

const PANE_X = [-2.1, -1.05, 0, 1.05, 2.1];

/** A ring of window panes around one storey: 5 per face, one draw call. */
function Windows({
  h,
  materialRef,
  glow,
}: {
  h: number;
  materialRef: (m: THREE.MeshStandardMaterial | null) => void;
  glow: string;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const paneH = Math.min(h * 0.46, 1.25);
  const count = PANE_X.length * 4;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const d = BLOCK_W / 2 + 0.02;
    let k = 0;
    for (let face = 0; face < 4; face++) {
      q.setFromAxisAngle(UP, (face * Math.PI) / 2);
      for (const x of PANE_X) {
        const pos = new THREE.Vector3(x, 0, d).applyQuaternion(q);
        m.compose(pos, q, new THREE.Vector3(0.72, paneH, 0.05));
        mesh.setMatrixAt(k++, m);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere(); // real instance bounds, or it gets culled wrongly
  }, [paneH]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#243030"
        emissive={glow}
        emissiveIntensity={0.05}
        roughness={0.2}
        metalness={0.4}
      />
    </instancedMesh>
  );
}
