import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { GEO_COOKIE } from "./lib/geo";

const intlMiddleware = createMiddleware(routing);

// Built from the filesystem in next.config.ts.
const PAGE_PATTERNS: string[][] = (
  JSON.parse(process.env.PAGE_PATHS ?? "[]") as string[]
).map((p) => p.split("/").filter(Boolean));
const LOCALES: readonly string[] = routing.locales;

function matches(pattern: string[], segments: string[]): boolean {
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "**") return segments.length > i;
    if (i >= segments.length) return false;
    if (pattern[i] !== "*" && pattern[i] !== segments[i]) return false;
  }
  return pattern.length === segments.length;
}

/**
 * The locale-relative path when no page exists for it, else null.
 *
 * Misses land in [locale]/[...rest], which calls notFound(), but by then
 * [locale]/loading.tsx has streamed the shell with a 200, so unknown URLs
 * answered 200 with the 404 page (a soft 404). The status has to be decided
 * here, before rendering starts.
 */
function missingPage(pathname: string): { locale: string; rest: string[] } | null {
  if (PAGE_PATTERNS.length === 0) return null;
  const segments = pathname.split("/").filter(Boolean);
  const prefixed = segments.length > 0 && LOCALES.includes(segments[0]);
  // /en/... is redirected to the unprefixed URL by next-intl; judge it there.
  if (prefixed && segments[0] === routing.defaultLocale) return null;
  const locale = prefixed ? segments[0] : routing.defaultLocale;
  const rest = prefixed ? segments.slice(1) : segments;
  if (PAGE_PATTERNS.some((p) => matches(p, rest))) return null;
  return { locale, rest };
}

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
  const missing = missingPage(request.nextUrl.pathname);
  const response = missing
    ? NextResponse.rewrite(
        new URL(`/${missing.locale}/${missing.rest.join("/")}`, request.url),
        { status: 404 }
      )
    : intlMiddleware(request);
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
