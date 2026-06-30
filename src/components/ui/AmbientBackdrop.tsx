interface AmbientBackdropProps {
  /** Optional extra classes for per-page positioning nudges. */
  className?: string;
}

/**
 * Decorative ambient layer for the warm utility pages (/demo, /get-started):
 * a slow-drifting forest-tint drafting grid + one floating sage bloom. Pure
 * CSS motion (off the main thread) so it never janks the form's LCP. Sits
 * behind page content; never the LCP element. Reduced motion stops the drift
 * via globals.css (texture stays). Page content must sit above this at z-10.
 * Spec: docs/superpowers/specs/2026-06-30-ambient-backdrop-design.md
 */
export default function AmbientBackdrop({ className = "" }: AmbientBackdropProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* Drafting grid — forest-tint hairlines, mask-faded toward the bottom.
          Oversized by 72px on every side so the diagonal drift never reveals
          an edge (it loops every one 72px cell). */}
      <div
        className="ambient-grid absolute -inset-[72px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(52,69,58,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(52,69,58,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 80%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 80%)",
        }}
      />
      {/* Sage bloom — soft pistachio glow, lazily floating top-right. */}
      <div
        className="ambient-bloom absolute -top-40 right-0 w-[55vw] h-[55vw] opacity-30"
        style={{
          background: "radial-gradient(circle, #B8D4BD 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
