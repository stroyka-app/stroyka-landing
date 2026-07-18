import { routing } from "./routing";

// CANONICAL DOMAIN = www.getstroyka.com — Vercel's primary domain serves www
// and 307s the apex to it. Canonicals MUST match the serving domain: apex
// canonicals pointed at a redirect, so Google discarded them and filed every
// localized page as "Duplicate without user-selected canonical" (Search
// Console, fixed 2026-07-18). Do not "simplify" these back to the apex.

/**
 * Builds the alternates.languages map for a given pathname (no locale prefix).
 * EN lives at root, ES/RU are prefixed. x-default → EN.
 */
export function localeAlternates(pathname: string): Record<string, string> {
  const clean = pathname === "/" ? "" : pathname;
  return {
    en: `https://www.getstroyka.com${clean || "/"}`,
    es: `https://www.getstroyka.com/es${clean}`,
    ru: `https://www.getstroyka.com/ru${clean}`,
    "x-default": `https://www.getstroyka.com${clean || "/"}`,
  };
}

/** Returns the canonical URL for a given locale + pathname. EN is unprefixed, ES/RU are prefixed. */
export function canonicalFor(locale: string, pathname: string): string {
  const clean = pathname === "/" ? "" : pathname;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `https://www.getstroyka.com${prefix}${clean || (prefix ? "" : "/")}`;
}

/** Maps next-intl locale codes to Open Graph locale strings. */
export const ogLocale: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
};
