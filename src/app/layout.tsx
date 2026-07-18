import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getstroyka.com"),
};

export const viewport: Viewport = {
  // iOS 26 ("Liquid Glass") Safari IGNORES theme-color and instead tints its
  // toolbars from the background-color of position:fixed/sticky elements near
  // the screen edges. viewport-fit=cover is REQUIRED for the bottom-bar tint to
  // work at all (and for env(safe-area-*)). The bottom tint is driven by the
  // fixed #safari-bottom-tint sliver (see globals.css + [locale]/layout.tsx);
  // the top bar is tinted by the fixed Navbar. See tasks/lessons.md.
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
