import { notFound } from "next/navigation";

/**
 * Catch-all for any path under a locale that no route matches.
 *
 * Without it, `/en/some-missing-page` never reached `[locale]/not-found.tsx`
 * (that file only renders when a page calls `notFound()`); Next fell through
 * to the ROOT not-found, and the root layout renders no <html>/<body>
 * (next-intl's pattern), so visitors got a broken page instead of the 404.
 * Specific routes always win over a catch-all, so this only ever sees misses.
 */
export default function CatchAll() {
  notFound();
}
