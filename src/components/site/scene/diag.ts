/**
 * TEMPORARY on-device bisection for the phone-only crane flicker.
 * `?diag=a,b` on the dev server switches suspects off one at a time.
 * Dev builds only; production ignores it entirely. Remove once found.
 */
export type DiagFlag = "alpha" | "noshadow" | "nodust" | "nolog" | "noaa" | "still" | "sticky" | "dpr1" | "nohud";

export function diag(flag: DiagFlag): boolean {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return false;
  const v = new URLSearchParams(window.location.search).get("diag");
  return !!v && v.split(",").includes(flag);
}
