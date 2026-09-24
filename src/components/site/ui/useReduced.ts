"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion`, but hydration-safe.
 *
 * Motion's hook reads the media query synchronously on the client, so a
 * reduced-motion visitor's FIRST client render disagrees with the server
 * render (which can't know) — and several dusk-site sections change their
 * STRUCTURE on it (the Lift unpins, KnowEvery collapses, flap plates drop).
 * That is a hydration mismatch, and React throws the tree away.
 *
 * This returns false until mounted, then the real preference. The one
 * frame in between is covered by `<MotionConfig reducedMotion="user">` on
 * SiteHome, which already skips transform animations for those visitors.
 */
export function useReduced(): boolean {
  const pref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? !!pref : false;
}
