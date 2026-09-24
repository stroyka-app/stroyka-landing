"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export type Strut = readonly [THREE.Vector3, THREE.Vector3];

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Every steel member of a lattice (chords, braces, diagonals) as ONE
 * instanced mesh: a unit box stretched between two points. A tower crane is
 * a few hundred struts, and drawing each as its own mesh would be a few
 * hundred draw calls for what is visually one object.
 */
export default function Lattice({
  struts,
  thickness = 0.14,
  material,
}: {
  struts: readonly Strut[];
  thickness?: number;
  material: THREE.Material;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const mid = new THREE.Vector3();
    const dir = new THREE.Vector3();
    struts.forEach(([a, b], i) => {
      dir.subVectors(b, a);
      const len = dir.length();
      q.setFromUnitVectors(UP, dir.normalize());
      mid.addVectors(a, b).multiplyScalar(0.5);
      s.set(thickness, len, thickness);
      m.compose(mid, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [struts, thickness]);

  return (
    <instancedMesh ref={ref} args={[undefined, material, struts.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** A square lattice mast: four corner legs, a K-brace zigzag on every face. */
export function mastStruts(width: number, height: number, bay: number): Strut[] {
  const h = width / 2;
  const corners = [
    [-h, -h],
    [h, -h],
    [h, h],
    [-h, h],
  ] as const;
  const out: Strut[] = corners.map(([x, z]) => [v(x, 0, z), v(x, height, z)] as Strut);
  const bays = Math.floor(height / bay);
  for (let k = 0; k < bays; k++) {
    const y0 = k * bay;
    const y1 = y0 + bay;
    for (let c = 0; c < 4; c++) {
      const [ax, az] = corners[c];
      const [bx, bz] = corners[(c + 1) % 4];
      out.push([v(ax, y1, az), v(bx, y1, bz)]);
      // Alternate the diagonal's direction per bay → the zigzag.
      out.push(k % 2 === 0 ? [v(ax, y0, az), v(bx, y1, bz)] : [v(bx, y0, bz), v(ax, y1, az)]);
    }
  }
  return out;
}

/**
 * A triangular jib running along +x from `x0` to `x1`: two bottom chords
 * (the trolley rails) and one top chord, braced every `bay`.
 */
export function jibStruts(x0: number, x1: number, width: number, depth: number, bay: number): Strut[] {
  const hz = width / 2;
  const out: Strut[] = [
    [v(x0, 0, -hz), v(x1, 0, -hz)],
    [v(x0, 0, hz), v(x1, 0, hz)],
    [v(x0, depth, 0), v(x1 - bay * 0.5, depth, 0)],
  ];
  const bays = Math.floor((x1 - x0) / bay);
  for (let k = 0; k < bays; k++) {
    const a = x0 + k * bay;
    const b = a + bay;
    // Taper the top chord into the tip on the last bay.
    const topB = k === bays - 1 ? v(b, 0, 0) : v(b, depth, 0);
    out.push([v(a, 0, -hz), v(a, 0, hz)]);
    out.push([v(a, 0, -hz), topB]);
    out.push([v(a, 0, hz), topB]);
    out.push(k % 2 === 0 ? [v(a, 0, -hz), v(b, 0, hz)] : [v(a, 0, hz), v(b, 0, -hz)]);
  }
  return out;
}
