"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * First-paint curtain — a deep teal-sage panel that covers the viewport
 * on mount, then slides upward to reveal the page underneath. Mounted at
 * the top of HomeClient so it overlays everything (z-[100]) without
 * blocking pointer events after it leaves. Reduced-motion users skip the
 * curtain entirely — it never mounts.
 *
 * Color (#34453A) is the EXACT top stop of the hero gradient, so the
 * curtain is visually continuous with the hero's deepest tone — when it
 * lifts, the page peels open from the same forest crown rather than
 * cutting from a neutral "loading screen" color. Faster now (500ms +
 * 100ms delay = clears at 600ms) so the hero word-reveal choreography
 * lands fully *after* the curtain has cleared, not behind it.
 */
export default function LoadingCurtain() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(!prefersReduced);

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
          onAnimationComplete={() => setVisible(false)}
          className="fixed inset-0 z-[100] pointer-events-none"
        >
          {/* Color on a child, NOT the fixed element: iOS 26 hit-tests fixed
              elements at the screen edges at initial render and adopts their
              background-color as the toolbar tint — this full-screen curtain
              would hijack both bars at load. A bg-less fixed parent is
              ignored by the sampler; the child paints identically. */}
          <div className="absolute inset-0" style={{ background: "#34453A" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
