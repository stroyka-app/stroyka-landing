"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ScenePalette } from "./palette";

/**
 * The sky, drawn by WebGL as a full-screen quad behind everything, so the
 * canvas is fully OPAQUE.
 *
 * It used to be a CSS gradient behind a transparent canvas. On iOS Safari a
 * transparent WebGL canvas moved by the scroll-driven pin (Lift's
 * .lift-stage) is re-blended with the page behind it on every composite:
 * the crane standing against the sky shimmered and looked washed out, while
 * the sticky pin (no transform) didn't — Maks's on-device bisection,
 * 2026-09-24. An opaque canvas has nothing to blend.
 *
 * Same stops as the old CSS: top → mid (26%) → haze (46%) → haze, a warm
 * sun glow at (18%, 46%), crossfading to the night set as `night` → 1.
 */
const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uTop, uMid, uHaze, uNTop, uNMid, uNHaze, uSun;
uniform float uNight, uAspect;
varying vec2 vUv;

vec3 ramp(vec3 top, vec3 mid, vec3 haze, float y) {
  // y: 0 at the top of the screen, 1 at the bottom
  vec3 c = mix(top, mid, smoothstep(0.0, 0.26, y));
  return mix(c, haze, smoothstep(0.26, 0.46, y));
}

void main() {
  float y = 1.0 - vUv.y;
  vec3 day = ramp(uTop, uMid, uHaze, y);
  // radial-gradient(60% 40% at 18% 46%): an ellipse, 42% strength
  vec2 d = vec2((vUv.x - 0.18) / 0.6, (y - 0.46) / 0.4);
  float glow = 0.42 * (1.0 - smoothstep(0.0, 0.7, length(d)));
  day = mix(day, uSun, glow);
  vec3 night = ramp(uNTop, uNMid, uNHaze, y);
  gl_FragColor = vec4(mix(day, night, uNight), 1.0);
  #include <colorspace_fragment>
}
`;

export type SkyUniforms = { uNight: { value: number } };

export default function Sky({ pal, uniformsRef }: { pal: ScenePalette; uniformsRef: (u: SkyUniforms) => void }) {
  const material = useMemo(() => {
    const c = (hex: string) => new THREE.Color(hex);
    const sun = pal.skySun.split(/\s+/).map((n) => Number(n) / 255);
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: c(pal.skyTop) },
        uMid: { value: c(pal.skyMid) },
        uHaze: { value: c(pal.hazeDay) },
        uNTop: { value: c(pal.skyNightTop) },
        uNMid: { value: c(pal.skyNightMid) },
        uNHaze: { value: c(pal.hazeNight) },
        uSun: { value: new THREE.Color(sun[0] ?? 1, sun[1] ?? 0.95, sun[2] ?? 0.84) },
        uNight: { value: 0 },
        uAspect: { value: 1 },
      },
    });
    uniformsRef(m.uniforms as unknown as SkyUniforms);
    return m;
  }, [pal, uniformsRef]);

  return (
    <mesh renderOrder={-1000} frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
