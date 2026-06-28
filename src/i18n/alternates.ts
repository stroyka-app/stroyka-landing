import { routing } from "./routing";

/**
 * Builds the alternates.languages map for a given pathname (no locale prefix).
 * EN lives at root, ES/RU are prefixed. x-default → EN.
 */
export function localeAlternates(pathname: string): Record<string, string> {
  const clean = pathname === "/" ? "" : pathname;
  return {
    en: `https://getstroyka.com${clean || "/"}`,
    es: `https://getstroyka.com/es${clean}`,
    ru: `https://getstroyka.com/ru${clean}`,
    "x-default": `https://getstroyka.com${clean || "/"}`,
  };
}

/** Returns the canonical URL for a given locale + pathname. EN is unprefixed, ES/RU are prefixed. */
export function canonicalFor(locale: string, pathname: string): string {
  const clean = pathname === "/" ? "" : pathname;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `https://getstroyka.com${prefix}${clean || "/"}`;
}

/** Maps next-intl locale codes to Open Graph locale strings. */
export const ogLocale: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
};
