import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { GEO_COOKIE } from "./lib/geo";

const intlMiddleware = createMiddleware(routing);

/**
 * next-intl's middleware, plus the visitor's country in a cookie.
 *
 * WHY A COOKIE AND NOT `headers()` IN THE LAYOUT: every page here is
 * statically generated (`generateStaticParams` + `setRequestLocale`), and
 * reading headers in a Server Component opts the whole tree into dynamic
 * rendering. That would trade the paint budget the /start page was built
 * around — the one an ad click is measured against — for a pixel decision.
 * Middleware already runs on every matched request, so this is free.
 *
 * The cookie holds a two-letter country code and nothing else. It is not an
 * identifier, it is not readable by any third party, and its only purpose is
 * to stop us setting someone else's cookies where that needs consent.
 */
export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  response.cookies.set(GEO_COOKIE, country.toUpperCase().slice(0, 2), {
    httpOnly: false, // MetaPixel reads it in the browser
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24, // a day; a visitor who moves country re-resolves
  });
  return response;
}

export const config = {
  // Match everything except api, next internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
