import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // No themeColor: iOS Safari's bottom bar is a frosted material that shows the
  // page behind it. Letting it be (no theme-color tint) keeps it transparent
  // over light/textured sections. Flat dark sections (3D house, footer) frost
  // to pale sage — an iOS limitation no web API can override. See
  // tasks/lessons.md before touching this again.
  //
  // viewportFit:"cover" lets the page extend UNDER the iOS bars so that
  // env(safe-area-inset-*) become non-zero. This is what makes the surgical
  // "bone bar-zone" band in Footer.tsx (and the notch padding in Navbar.tsx)
  // do anything on-device; on desktop every inset is 0 → zero visual change.
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
