import type { MetadataRoute } from "next";
import { localeAlternates, canonicalFor } from "@/i18n/alternates";

const LOCALES = ["en", "es", "ru"] as const;

type RouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  /** Legal pages are English-authoritative — all locale alternates point to EN. */
  legalOnly?: boolean;
};

const ROUTES: RouteConfig[] = [
  { path: "/",            changeFrequency: "weekly",  priority: 1.0 },
  { path: "/get-started", changeFrequency: "monthly", priority: 0.9 },
  { path: "/demo",        changeFrequency: "monthly", priority: 0.8 },
  { path: "/privacy",     changeFrequency: "yearly",  priority: 0.3, legalOnly: true },
  { path: "/terms",       changeFrequency: "yearly",  priority: 0.3, legalOnly: true },
];

/** Returns alternates where every locale maps to the EN URL (English-authoritative). */
function enOnlyAlternates(path: string): Record<string, string> {
  const enUrl = canonicalFor("en", path);
  return { en: enUrl, es: enUrl, ru: enUrl, "x-default": enUrl };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.flatMap((route) => {
    // An English-authoritative page must be submitted ONCE, as its English
    // URL. Emitting /es/privacy and /ru/privacy here told Google to index
    // them while each of those pages' own canonical said "I am /privacy" —
    // a direct contradiction, which Google resolved by indexing neither and
    // reporting "Duplicate, Google chose different canonical than user"
    // (Search Console, 2026-08-20). The localized pages still exist, still
    // render, and are still reachable; they simply fold into the EN URL,
    // which is what `legalOnly` meant in the first place.
    const locales = route.legalOnly ? (["en"] as const) : LOCALES;
    return locales.map((locale) => ({
      url: canonicalFor(locale, route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: route.legalOnly
          ? enOnlyAlternates(route.path)
          : localeAlternates(route.path),
      },
    }));
  });
}
