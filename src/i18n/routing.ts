import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "ru"],
  defaultLocale: "en",
  // EN stays at "/", ES/RU get "/es" "/ru". No auto-detection — manual switch only.
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
