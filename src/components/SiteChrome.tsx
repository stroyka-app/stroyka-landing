"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

/**
 * The page chrome that is pure enhancement: lenis smooth scroll, the cursor
 * dot, the top progress bar and the scroll-to-top button. All four pull
 * framer-motion (and lenis) into the first-load bundle of every route that
 * renders them, which is fine for the home page (it needs framer anyway)
 * and wrong for `/start`, the paid landing whose whole point is painting in
 * under a second on a phone inside the Facebook browser.
 *
 * They are imported with `next/dynamic` so each lives in its own chunk, and
 * the chunk is only referenced from routes that actually render it. On a
 * bare route the HTML carries no script tag for any of them. `usePathname`
 * is safe for static prerendering: each locale route is rendered once with
 * its own path.
 */
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"));
const CursorDot = dynamic(() => import("@/components/CursorDot"));
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"));

/** Routes that render with no motion chrome at all. Locale prefix optional. */
const BARE_ROUTES = /^\/(?:[a-z]{2}\/)?start\/?$/;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.test(pathname)) return <>{children}</>;

  return (
    <>
      <ScrollProgress />
      <SmoothScroll>
        <CursorDot />
        {children}
        <ScrollToTop />
      </SmoothScroll>
    </>
  );
}
