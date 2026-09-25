"use client";

import { useEffect, useState } from "react";

/**
 * The scene's colours, read from the same CSS tokens as the DOM
 * (globals.css → "Dusk site palettes"). three.js can't see CSS, so this
 * reads the computed custom properties and re-reads them whenever
 * <html data-palette> changes: switching palettes re-skins the crane,
 * ground, fog and light without remounting the canvas.
 */
export type ScenePalette = {
  steel: string;
  steelDark: string;
  ground: string;
  yard: string;
  pad: string;
  skyline: string;
  grid: string;
  line: string;
  hemiSky: string;
  hemiGround: string;
  sun: string;
  window: string;
  labor: string;
  machine: string;
  hazeDay: string;
  hazeNight: string;
  skyTop: string;
  skyMid: string;
  skyNightTop: string;
  skyNightMid: string;
  /** "r g b" channels */
  skySun: string;
};

const VARS: Record<keyof ScenePalette, [string, string]> = {
  steel: ["--scene-steel", "#d4ee5e"],
  steelDark: ["--scene-steel-dark", "#1c221d"],
  ground: ["--scene-ground", "#384034"],
  yard: ["--scene-yard", "#4a4f43"],
  pad: ["--scene-pad", "#6b6a5e"],
  skyline: ["--scene-skyline", "#737a68"],
  grid: ["--scene-grid", "#d4ee5e"],
  line: ["--scene-line", "#f3f0df"],
  hemiSky: ["--scene-hemi-sky", "#d5d8c2"],
  hemiGround: ["--scene-hemi-ground", "#2a2f26"],
  sun: ["--scene-sun", "#ffe6bf"],
  window: ["--scene-window", "#ffe9b0"],
  labor: ["--scene-labor", "#d4ee5e"],
  machine: ["--scene-machine", "#7d8a74"],
  hazeDay: ["--sky-haze", "#8e927e"],
  hazeNight: ["--sky-night-haze", "#343c35"],
  skyTop: ["--sky-top", "#c9d1c4"],
  skyMid: ["--sky-mid", "#d6d9cb"],
  skyNightTop: ["--sky-night-top", "#d8c9a8"],
  skyNightMid: ["--sky-night-mid", "#e0d2b3"],
  skySun: ["--sky-sun", "255 244 214"],
};

function read(): ScenePalette {
  const cs = getComputedStyle(document.documentElement);
  const out = {} as ScenePalette;
  (Object.keys(VARS) as (keyof ScenePalette)[]).forEach((k) => {
    const [name, fallback] = VARS[k];
    out[k] = cs.getPropertyValue(name).trim() || fallback;
  });
  return out;
}

/** Client-only (the scene is `ssr: false`), so reading on init is safe. */
export function useScenePalette(): ScenePalette {
  const [pal, setPal] = useState<ScenePalette>(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setPal(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });
    return () => mo.disconnect();
  }, []);
  return pal;
}
