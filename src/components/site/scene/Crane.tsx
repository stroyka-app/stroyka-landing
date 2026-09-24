"use client";

import { useMemo, type RefObject } from "react";
import * as THREE from "three";
import Lattice, { jibStruts, mastStruts, type Strut } from "./Lattice";
import { JIB_REACH, JIB_Y } from "./choreo";

const STEEL = "#D4EE5E";
const DARK = "#1C221D";

/**
 * A flat-top-ish hammerhead tower crane, built from struts.
 *
 * Only the static structure lives here. The parent owns motion: it rotates
 * `slewRef` (everything above the slewing ring) and slides `trolleyRef`
 * along the jib, straight from `craneAt(progress)` every frame. The hook and
 * cable hang in WORLD space in the parent, because the load's sway is
 * simulated in world coordinates.
 */
export default function Crane({
  slewRef,
  trolleyRef,
  beaconRef,
}: {
  slewRef: RefObject<THREE.Group | null>;
  trolleyRef: RefObject<THREE.Group | null>;
  beaconRef: RefObject<THREE.MeshStandardMaterial | null>;
}) {
  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.5, metalness: 0.25 }),
    [],
  );
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: DARK, roughness: 0.8, metalness: 0.1 }),
    [],
  );

  const mast = useMemo(() => mastStruts(1.9, JIB_Y - 0.6, 2.1), []);
  const jib = useMemo(() => jibStruts(1.2, JIB_REACH + 0.6, 1.5, 1.6, 2.2), []);
  const counterJib = useMemo(() => {
    const s = jibStruts(0, 9, 1.9, 0.01, 1.8).filter(([a, b]) => a.y === 0 && b.y === 0);
    return s.map(([a, b]) => [a.clone().setX(-a.x - 1.2), b.clone().setX(-b.x - 1.2)] as Strut);
  }, []);
  const head = useMemo(() => {
    const top = new THREE.Vector3(0, 6.2, 0);
    const out: Strut[] = [
      [new THREE.Vector3(-0.95, 0, -0.95), top],
      [new THREE.Vector3(0.95, 0, -0.95), top],
      [new THREE.Vector3(0.95, 0, 0.95), top],
      [new THREE.Vector3(-0.95, 0, 0.95), top],
    ];
    // Pendant ties: apex → jib top chord, apex → counter-jib tail.
    const pendants: Strut[] = [
      [top, new THREE.Vector3(12, 1.6, 0)],
      [top, new THREE.Vector3(JIB_REACH - 3, 1.6, 0)],
      [top, new THREE.Vector3(-9.6, 0.2, -0.7)],
      [top, new THREE.Vector3(-9.6, 0.2, 0.7)],
    ];
    return { frame: out, pendants };
  }, []);

  return (
    <group>
      {/* Footing */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 1, 5]} />
        <meshStandardMaterial color="#6D6C60" roughness={0.95} />
      </mesh>
      <group position={[0, 1, 0]}>
        <Lattice struts={mast} material={steel} thickness={0.16} />
      </group>

      {/* Everything above the slewing ring turns together. */}
      <group ref={slewRef} position={[0, JIB_Y - 0.6, 0]}>
        {/* Slewing ring + turntable */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.6, 20]} />
          <primitive object={dark} attach="material" />
        </mesh>
        <group position={[0, 0.6, 0]}>
          <Lattice struts={jib} material={steel} thickness={0.12} />
          <Lattice struts={counterJib} material={steel} thickness={0.14} />
          <Lattice struts={head.frame} material={steel} thickness={0.16} />
          <Lattice struts={head.pendants} material={dark} thickness={0.05} />

          {/* Counter-jib walkway + counterweights */}
          <mesh position={[-5.7, 0.05, 0]} receiveShadow castShadow>
            <boxGeometry args={[9, 0.1, 1.9]} />
            <primitive object={dark} attach="material" />
          </mesh>
          {[-8.4, -7.2].map((x) => (
            <mesh key={x} position={[x, -1.1, 0]} castShadow>
              <boxGeometry args={[1.05, 2.2, 2.3]} />
              <meshStandardMaterial color="#8F8D7E" roughness={0.9} />
            </mesh>
          ))}
          {/* Machinery house */}
          <mesh position={[-3.6, 0.75, 0]} castShadow>
            <boxGeometry args={[2.4, 1.3, 1.6]} />
            <primitive object={dark} attach="material" />
          </mesh>

          {/* Operator cab, hung on the jib's side */}
          <group position={[1.6, -1.1, 1.35]}>
            <mesh castShadow>
              <boxGeometry args={[1.5, 1.7, 1.3]} />
              <meshStandardMaterial color="#E9E4D3" roughness={0.6} />
            </mesh>
            <mesh position={[0.76, 0.2, 0]}>
              <boxGeometry args={[0.02, 0.9, 1.1]} />
              <meshStandardMaterial color="#2C3A3A" roughness={0.1} metalness={0.6} />
            </mesh>
          </group>

          {/* Jib-tip aviation beacon */}
          <mesh position={[JIB_REACH + 0.4, 0.2, 0]}>
            <sphereGeometry args={[0.22, 12, 8]} />
            <meshStandardMaterial ref={beaconRef} color="#3a1512" emissive="#ff4130" emissiveIntensity={2} />
          </mesh>

          {/* Trolley: rides the bottom chords. */}
          <group ref={trolleyRef} position={[17, 0, 0]}>
            <mesh position={[0, -0.25, 0]} castShadow>
              <boxGeometry args={[1.3, 0.4, 1.9]} />
              <primitive object={dark} attach="material" />
            </mesh>
            {[-0.45, 0.45].map((x) => (
              <mesh key={x} position={[x, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 1.7, 10]} />
                <meshStandardMaterial color="#9AA391" metalness={0.6} roughness={0.3} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}
