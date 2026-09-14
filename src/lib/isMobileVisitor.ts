/**
 * Phone or tablet, judged from the UA. Client-only.
 *
 * iPadOS 13+ ships a desktop UA string ("Macintosh") by default, so the
 * obvious /ipad/ test misses every modern iPad — including the iPad Air
 * App Review used. Multi-touch on a "Mac" is the standard tell.
 */
export function isMobileVisitor(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/android|iphone|ipod|ipad/i.test(ua)) return true;
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
}
