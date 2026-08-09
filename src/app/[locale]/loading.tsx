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

export default function Loading() {
  const t = useTranslations("errors");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4]">
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-end gap-1.5">
          <span className="block w-2 h-2 rounded-full bg-brand-forest animate-[bounce_1.2s_ease-in-out_infinite] motion-reduce:animate-none" />
          <span className="block w-2 h-2 rounded-full bg-brand-forest animate-[bounce_1.2s_ease-in-out_0.15s_infinite] motion-reduce:animate-none" />
          <span className="block w-2 h-2 rounded-full bg-brand-forest animate-[bounce_1.2s_ease-in-out_0.3s_infinite] motion-reduce:animate-none" />
        </div>
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted">
          {t("loading")}
        </p>
      </div>
    </main>
  );
}
