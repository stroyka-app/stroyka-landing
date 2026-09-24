"use client";

// MUST stay a client component — same reason error.tsx and not-found.tsx are.
// loading.tsx gets no `params`, so setRequestLocale can't be called here, and a
// server-side getTranslations() then falls back to reading the locale from
// headers(). headers() is a dynamic API and loading.tsx is part of the STATIC
// SHELL of every route in this segment, so that single call opted all 27 locale
// pages out of prerendering: zero HTML emitted at build, `revalidate: 0` ->
// `Cache-Control: private, no-cache, no-store` -> the CDN never cached a page.
// useTranslations (client) reads from the NextIntlClientProvider in the layout
// above instead, which costs no dynamic API.
import { useTranslations } from "next-intl";

/**
 * A bone curtain: the page colour, one forest load travelling a hairline
 * rail, a mono label. Pure CSS on purpose — this file ships in the static
 * shell of every route (including the bare, speed-first /start), so it must
 * not pull the motion runtime in. Reduced motion parks the load mid-rail via
 * the media query, which cannot disagree with the server render.
 */
export default function Loading() {
  const t = useTranslations("errors");

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-site-night text-site-paper"
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes stroyka-load { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
        .stroyka-load { animation: stroyka-load 1.1s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .stroyka-load { animation: none; transform: translateX(100%); }
        }
      `}</style>
      <div className="flex flex-col items-center gap-5">
        <div
          aria-hidden
          className="relative h-[2px] w-40 overflow-hidden rounded-full bg-site-paper/10"
        >
          <span className="stroyka-load absolute inset-y-0 left-0 w-1/3 rounded-full bg-site-vis" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-site-paper/50">
          {t("loading")}
        </p>
      </div>
    </main>
  );
}
