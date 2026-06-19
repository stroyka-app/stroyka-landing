import type Lenis from "lenis";

/**
 * Module-level handle to the single Lenis instance created by SmoothScroll
 * (mounted globally in layout.tsx). Lets non-wrapping components — e.g.
 * HashScroll — drive the same smooth-scroll engine instead of fighting it
 * with native scrolling.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

export function getLenis(): Lenis | null {
  return instance;
}
