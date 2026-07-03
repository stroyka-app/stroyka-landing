/**
 * Authentic app-store brand glyphs — the real Apple mark and Google Play
 * triangle, not lucide's generic `Apple`/`Play` icons. Kept monochrome
 * (`currentColor`) so they inherit the surrounding link/badge colour and fit
 * the site's understated style. Shared by the Footer and the get-started
 * success page so the marks never drift.
 */

interface GlyphProps {
  className?: string;
}

export function AppleGlyph({ className = "" }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function GooglePlayGlyph({ className = "" }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.18 23.67c-.37-.2-.68-.57-.68-1.06V1.39c0-.49.31-.86.68-1.06L13.54 12 3.18 23.67zm1.38-24l11.54 11.54 3.33-3.33L5.75.11a.96.96 0 00-.58-.17l-.61.73zm16.52 10.61l-3.66 3.66 3.66 3.66c.7-.4 1.18-1.08 1.18-1.89V12.3c0-.81-.48-1.49-1.18-1.89v-.13zM4.56 24.27l13.68-7.77-3.33-3.33L4.56 24.27z" />
    </svg>
  );
}
