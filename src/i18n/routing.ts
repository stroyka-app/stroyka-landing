import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "ru"],
  defaultLocale: "en",
  // EN stays at "/", ES/RU get "/es" "/ru". No auto-detection — manual switch only.
  localePrefix: "as-needed",
  localeDetection: false,
  // MUST stay paired with localeDetection: false. next-intl only READS
  // NEXT_LOCALE when localeDetection is on (resolveLocale prio 2/3), but since
  // v4 it still WRITES the cookie regardless — pre-v4, localeDetection: false
  // suppressed both. A Set-Cookie on every HTML response makes it unshareable,
  // so Vercel's CDN downgraded every page to `private, no-cache, no-store` and
  // never cached a single one (x-vercel-cache: MISS on repeat hits) even though
  // all of them are prerendered SSG. Locale comes from the URL path alone.
  localeCookie: false,
  // Disable middleware-generated alternate Link headers — each indexable page
  // provides explicit generateMetadata alternates, which avoids conflicts on
  // legal pages (privacy/terms) where all locales must point to the EN URL.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
