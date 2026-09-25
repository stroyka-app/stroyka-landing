"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { LOADS } from "./choreo";
import { PICKUP, STAGED, TRUCK, WHEEL_R, deliveryAt, dozerAt, mixerAt, pickupAt, type MachinePose } from "./machines";
import type { ScenePalette } from "./palette";

/**
 * The supporting cast, posed every frame from `machines.ts`. Boxes and
 * cylinders on shared materials, no shadow casting (a soft contact plane
 * grounds each one instead), desktop only. Local +x is every machine's nose.
 */
type Mats = {
  body: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  lamp: THREE.MeshStandardMaterial;
  contact: THREE.MeshBasicMaterial;
  cargo: THREE.MeshStandardMaterial[];
};

function useMats(pal: ScenePalette): Mats {
  return useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: pal.machine, roughness: 0.7, metalness: 0.1 }),
      dark: new THREE.MeshStandardMaterial({ color: pal.steelDark, roughness: 0.9 }),
      glass: new THREE.MeshStandardMaterial({ color: pal.steelDark, roughness: 0.2, metalness: 0.5 }),
      lamp: new THREE.MeshStandardMaterial({ color: pal.window, emissive: pal.window, emissiveIntensity: 0 }),
      contact: new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.16, depthWrite: false }),
      cargo: LOADS.map((l) => new THREE.MeshStandardMaterial({ color: l.id === "labor" ? pal.labor : l.color, roughness: 0.8 })),
    }),
    [pal.machine, pal.steelDark, pal.window, pal.labor],
  );
}

function place(g: THREE.Object3D | null, pose: MachinePose) {
  if (!g) return;
  g.visible = pose.visible;
  if (!pose.visible) return;
  g.position.set(pose.x, 0, pose.z);
  g.rotation.y = pose.heading;
}

/** Wheels roll about their axle (local z): forward travel = negative z spin. */
function roll(wheels: (THREE.Object3D | null)[], turn: number) {
  for (const w of wheels) if (w) w.rotation.z = -turn;
}

function Wheel({ x, z, r = WHEEL_R, mat, set }: { x: number; z: number; r?: number; mat: THREE.Material; set: (g: THREE.Group | null) => void }) {
  return (
    <group position={[x, r, z]} ref={set}>
      <mesh rotation-x={Math.PI / 2} material={mat}>
        <cylinderGeometry args={[r, r, 0.4, 10]} />
      </mesh>
    </group>
  );
}

function Contact({ l, w, mat }: { l: number; w: number; mat: THREE.Material }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 0]} material={mat}>
      <planeGeometry args={[l + 0.6, w + 0.6]} />
    </mesh>
  );
}

export default function Machines({ progress, pal, reduced }: { progress: MotionValue<number>; pal: ScenePalette; reduced: boolean }) {
  const m = useMats(pal);
  const trucks = useRef<(THREE.Group | null)[]>([]);
  const cargo = useRef<(THREE.Mesh | null)[]>([]);
  const truckWheels = useRef<(THREE.Group | null)[][]>(LOADS.map(() => []));
  const dozer = useRef<THREE.Group>(null);
  const blade = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.Group>(null);
  const drum = useRef<THREE.Group>(null);
  const mixerWheels = useRef<(THREE.Group | null)[]>([]);
  const pickup = useRef<THREE.Group>(null);
  const pickupWheels = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const p = progress.get();
    const t = reduced ? 0 : state.clock.elapsedTime;

    for (let i = STAGED; i < LOADS.length; i++) {
      const d = deliveryAt(i, p);
      place(trucks.current[i], d.truck);
      roll(truckWheels.current[i], d.truck.wheelTurn);
      const c = cargo.current[i];
      if (c) c.visible = d.cargo;
    }

    const dz = dozerAt(p, t);
    place(dozer.current, dz);
    if (blade.current) blade.current.position.y = 0.55 + dz.blade * 0.45;

    const mx = mixerAt(p, t);
    place(mixer.current, mx);
    roll(mixerWheels.current, mx.wheelTurn);
    if (drum.current) drum.current.rotation.x = mx.drum;

    const pk = pickupAt(p);
    place(pickup.current, pk);
    roll(pickupWheels.current, pk.wheelTurn);
    m.lamp.emissiveIntensity = pk.lights * 2.2;
  });

  return (
    <group>
      {/* Flatbeds, one per delivered load, each carrying a crate in the load's colour. */}
      {LOADS.map((load, i) =>
        i < STAGED ? null : (
          <group key={load.id} ref={(g) => void (trucks.current[i] = g)} visible={false}>
            <Contact l={TRUCK.length} w={TRUCK.width} mat={m.contact} />
            <mesh position={[0, 0.78, 0]} material={m.dark}>
              <boxGeometry args={[TRUCK.length, 0.35, 1.8]} />
            </mesh>
            <mesh position={[2.7, 1.75, 0]} material={m.body}>
              <boxGeometry args={[2, 1.9, TRUCK.width]} />
            </mesh>
            <mesh position={[3.71, 2.05, 0]} material={m.glass}>
              <boxGeometry args={[0.05, 0.75, 1.7]} />
            </mesh>
            <mesh position={[-0.9, 1.08, 0]} material={m.body}>
              <boxGeometry args={[5, 0.25, TRUCK.width]} />
            </mesh>
            <mesh ref={(c) => void (cargo.current[i] = c)} position={[-0.9, 1.78, 0]} material={m.cargo[i]}>
              <boxGeometry args={[3.2, 1.15, 1.7]} />
            </mesh>
            {[2.6, -1.6, -2.8].flatMap((x, k) =>
              [-0.95, 0.95].map((z, s) => (
                <Wheel key={`${k}${s}`} x={x} z={z} mat={m.dark} set={(g) => void (truckWheels.current[i][k * 2 + s] = g)} />
              )),
            )}
          </group>
        ),
      )}

      {/* Dozer: body, cab, tracks, blade on a lift arm. */}
      <group ref={dozer}>
        <Contact l={4.2} w={2.8} mat={m.contact} />
        <mesh position={[0, 1.05, 0]} material={m.body}>
          <boxGeometry args={[3, 1.1, 2.1]} />
        </mesh>
        <mesh position={[-0.55, 2.25, 0]} material={m.body}>
          <boxGeometry args={[1.4, 1.3, 1.6]} />
        </mesh>
        <mesh position={[-0.1, 2.35, 0]} material={m.glass}>
          <boxGeometry args={[0.05, 0.8, 1.4]} />
        </mesh>
        {[-1.05, 1.05].map((z) => (
          <mesh key={z} position={[0, 0.4, z]} material={m.dark}>
            <boxGeometry args={[3.4, 0.8, 0.5]} />
          </mesh>
        ))}
        <group ref={blade} position={[1.95, 0.55, 0]}>
          <mesh material={m.dark}>
            <boxGeometry args={[0.25, 1.05, 2.8]} />
          </mesh>
        </group>
      </group>

      {/* Concrete mixer: cab, chassis, tilted spinning drum. */}
      <group ref={mixer}>
        <Contact l={TRUCK.length} w={TRUCK.width} mat={m.contact} />
        <mesh position={[0, 0.78, 0]} material={m.dark}>
          <boxGeometry args={[TRUCK.length, 0.35, 1.8]} />
        </mesh>
        <mesh position={[2.7, 1.75, 0]} material={m.body}>
          <boxGeometry args={[2, 1.9, TRUCK.width]} />
        </mesh>
        <mesh position={[3.71, 2.05, 0]} material={m.glass}>
          <boxGeometry args={[0.05, 0.75, 1.7]} />
        </mesh>
        <group position={[-0.9, 2.25, 0]} rotation-z={0.22}>
          <group ref={drum}>
            <mesh rotation-z={Math.PI / 2} material={m.body}>
              <cylinderGeometry args={[0.7, 1.05, 3.8, 12]} />
            </mesh>
            {/* A fin, so the spin is visible. */}
            <mesh position={[0, 1.02, 0]} material={m.dark}>
              <boxGeometry args={[3.2, 0.08, 0.12]} />
            </mesh>
          </group>
        </group>
        {[2.6, -1.6, -2.8].flatMap((x, k) =>
          [-0.95, 0.95].map((z, s) => (
            <Wheel key={`${k}${s}`} x={x} z={z} mat={m.dark} set={(g) => void (mixerWheels.current[k * 2 + s] = g)} />
          )),
        )}
      </group>

      {/* The boss's pickup, headlights on the finished job. */}
      <group ref={pickup} visible={false}>
        <Contact l={PICKUP.length} w={PICKUP.width} mat={m.contact} />
        <mesh position={[0, 0.85, 0]} material={m.body}>
          <boxGeometry args={[PICKUP.length, 0.75, PICKUP.width]} />
        </mesh>
        <mesh position={[0.35, 1.6, 0]} material={m.body}>
          <boxGeometry args={[1.8, 0.8, 1.7]} />
        </mesh>
        <mesh position={[1.27, 1.6, 0]} material={m.glass}>
          <boxGeometry args={[0.05, 0.6, 1.5]} />
        </mesh>
        {[-0.6, 0.6].map((z) => (
          <mesh key={z} position={[PICKUP.length / 2 + 0.02, 0.95, z]} material={m.lamp}>
            <boxGeometry args={[0.05, 0.22, 0.34]} />
          </mesh>
        ))}
        {[1.35, -1.35].flatMap((x, k) =>
          [-0.85, 0.85].map((z, s) => (
            <Wheel key={`${k}${s}`} x={x} z={z} r={0.42} mat={m.dark} set={(g) => void (pickupWheels.current[k * 2 + s] = g)} />
          )),
        )}
      </group>
    </group>
  );
}
