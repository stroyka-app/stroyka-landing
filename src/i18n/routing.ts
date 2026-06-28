import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "ru"],
  defaultLocale: "en",
  // EN stays at "/", ES/RU get "/es" "/ru". No auto-detection — manual switch only.
  localePrefix: "as-needed",
  localeDetection: false,
  // Disable middleware-generated alternate Link headers — each indexable page
  // provides explicit generateMetadata alternates, which avoids conflicts on
  // legal pages (privacy/terms) where all locales must point to the EN URL.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
