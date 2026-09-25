"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BLOCK_W, BUDGET, BUILDING, heightOf } from "./choreo";
import type { ScenePalette } from "./palette";


/** Seeded PRNG so the skyline is the same on every visit and every render. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Ground, drafting grid, the two concrete pads. */
export function Ground({ pal }: { pal: ScenePalette }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(220, 110, pal.grid, pal.grid);
    const mat = g.material as THREE.LineBasicMaterial;
    mat.transparent = true;
    mat.opacity = 0.07;
    mat.depthWrite = false;
    return g;
  }, [pal.grid]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[240, 48]} />
        <meshStandardMaterial color={pal.ground} roughness={1} />
      </mesh>
      <primitive object={grid} position={[0, 0.02, 0]} />
      {/* Laydown yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9, 0.03, 13]} receiveShadow>
        <planeGeometry args={[22, 15]} />
        <meshStandardMaterial color={pal.yard} roughness={1} />
      </mesh>
      {/* Building pad */}
      <mesh position={[BUILDING.x, 0.15, BUILDING.z]} receiveShadow>
        <boxGeometry args={[BLOCK_W + 3, 0.3, BLOCK_W + 3]} />
        <meshStandardMaterial color={pal.pad} roughness={0.95} />
      </mesh>
    </group>
  );
}

/** A far-off skyline, lost in the haze. Gives the site a horizon. */
export function Skyline({ color }: { color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const COUNT = 64;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const r = rng(20260924);
    const m = new THREE.Matrix4();
    for (let i = 0; i < COUNT; i++) {
      // Only the half of the horizon the camera faces (it sits at −x, +z),
      // and far enough out that nothing looms in front of the lens.
      const a = -Math.PI * 0.15 + r() * Math.PI * 1.25;
      const d = 150 + r() * 90;
      const w = 5 + r() * 9;
      const h = 6 + Math.pow(r(), 2.4) * 34;
      m.compose(
        // Sunk 1.5 units: a base face exactly on the ground plane is
        // coplanar with it, and at ~200 units the two z-fight (flicker).
        new THREE.Vector3(Math.cos(a) * d, h / 2 - 1.5, -Math.sin(a) * d),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * Math.PI),
        new THREE.Vector3(w, h, w * (0.6 + r() * 0.8)),
      );
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    // Without this the instanced mesh keeps the unit box's bounds at the
    // origin, so three.js frustum-culls the WHOLE skyline whenever that
    // point leaves the view — the towers blinked on scroll (phones).
    mesh.computeBoundingSphere();
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={1} />
    </instancedMesh>
  );
}

/** Slow dust in the low sun. */
export function Dust({ count = 260, animate = true, color = "#F3F0DF" }: { count?: number; animate?: boolean; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const r = rng(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (r() - 0.5) * 70;
      arr[i * 3 + 1] = r() * 30;
      arr[i * 3 + 2] = (r() - 0.5) * 70;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y += dt * 0.012;
    ref.current.position.y = Math.sin(performance.now() / 4000) * 0.6;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * The budget, drawn as a dashed wireframe box on the pad: the building the
 * money allows. The real building rises inside it, block by block.
 */
export function BudgetEnvelope({ color }: { color: string }) {
  const h = heightOf(BUDGET);
  const w = BLOCK_W + 0.8;
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, w)), [w, h]);
  const ref = useRef<THREE.LineSegments>(null);
  useLayoutEffect(() => {
    ref.current?.computeLineDistances();
  }, []);
  return (
    <lineSegments ref={ref} geometry={geo} position={[BUILDING.x, 0.3 + h / 2, BUILDING.z]}>
      <lineDashedMaterial
        color={color}
        dashSize={0.5}
        gapSize={0.35}
        transparent
        opacity={0.55}
      />
    </lineSegments>
  );
}
