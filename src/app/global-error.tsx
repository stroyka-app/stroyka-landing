"use client";

// INTENTIONALLY English-only — no i18n here.
// global-error.tsx sits OUTSIDE the [locale] segment and replaces the root
// layout entirely on a catastrophic crash. There is no middleware locale
// header, no NextIntlClientProvider, and no request context available at
// this point, so useTranslations / getTranslations cannot be used.
// This is a last-resort crash screen; keeping it in plain English is correct.
//
// SELF-CONTAINED on purpose: the root layout (and with it globals.css, the
// Tailwind build, the --site-* tokens and the next/font variables) is gone
// by the time this renders. Every value below is inline and mirrors the
// Morning Bone palette by hand — the one file where literal hexes belong.

const BONE = "#ECE6D8"; // --site-night
const INK = "#1F1C16"; // --site-paper
const FOREST = "#2F5B45"; // --site-vis
const FOREST_HOVER = "#264C39"; // --site-vis-hover
const ON_FOREST = "#F1ECDF"; // --site-on-vis

const SANS =
  "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, 'JetBrains Mono', monospace";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          background: BONE,
          color: INK,
          fontFamily: SANS,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <style>{`
          .ge-btn { transition: background-color 200ms ease-out, transform 200ms ease-out; }
          .ge-btn:hover { background: ${FOREST_HOVER} !important; }
          .ge-btn:active { transform: scale(0.97); }
          .ge-btn:focus-visible { outline: 2px solid ${FOREST}; outline-offset: 3px; }
          .ge-knob svg { transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1); }
          .ge-btn:hover .ge-knob svg { transform: rotate(-200deg); }
          @media (prefers-reduced-motion: reduce) {
            .ge-btn, .ge-knob svg { transition: none; }
          }
        `}</style>
        <main
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "6rem clamp(20px, 3vw, 40px)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "42rem" }}>
            {/* Barricade tape — the same mark as the 404 and error pages. */}
            <div
              aria-hidden
              style={{
                width: "12rem",
                height: "14px",
                borderRadius: "9999px",
                boxShadow: `inset 0 0 0 1px ${FOREST}66`,
                backgroundImage: `repeating-linear-gradient(-45deg, ${FOREST} 0 12px, transparent 12px 24px)`,
                marginBottom: "2.5rem",
              }}
            />
            <p
              style={{
                fontFamily: MONO,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                fontSize: "11px",
                color: FOREST,
                margin: "0 0 1.5rem",
              }}
            >
              Something broke
            </p>
            <h1
              style={{
                fontWeight: 650,
                fontSize: "clamp(2.4rem, 5.6vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                margin: "0 0 2.5rem",
              }}
            >
              We hit a snag.
            </h1>
            <button
              type="button"
              className="ge-btn"
              onClick={() => reset()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                height: "56px",
                padding: "0 8px 0 28px",
                borderRadius: "9999px",
                border: "none",
                background: FOREST,
                color: ON_FOREST,
                fontFamily: SANS,
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "-0.005em",
                cursor: "pointer",
              }}
            >
              <span>Try again</span>
              <span
                className="ge-knob"
                aria-hidden
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  background: ON_FOREST,
                  color: FOREST,
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </span>
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
