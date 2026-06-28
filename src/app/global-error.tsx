"use client";

// INTENTIONALLY English-only — no i18n here.
// global-error.tsx sits OUTSIDE the [locale] segment and replaces the root
// layout entirely on a catastrophic crash. There is no middleware locale
// header, no NextIntlClientProvider, and no request context available at
// this point, so useTranslations / getTranslations cannot be used.
// This is a last-resort crash screen; keeping it in plain English is correct.

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
          justifyContent: "center",
          background: "linear-gradient(180deg, #E3DCC9 0%, #D4CBB4 100%)",
          color: "#2E261C",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              fontSize: "11px",
              color: "#52796F",
              marginBottom: "1.25rem",
            }}
          >
            Something broke
          </p>
          <h1
            style={{
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              margin: "0 0 1.5rem",
            }}
          >
            We hit a snag.
          </h1>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "13px",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              background: "#2f3e46",
              color: "#E3DCC9",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
