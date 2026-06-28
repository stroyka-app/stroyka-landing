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
  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: canonicalFor(locale, route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: route.legalOnly
          ? enOnlyAlternates(route.path)
          : localeAlternates(route.path),
      },
    }))
  );
}
