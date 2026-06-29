import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // Intentionally NO themeColor. A dark theme-color tints the iOS Safari
  // bottom toolbar (the URL-bar band) solid green, which clashes with the
  // light page. Leaving it unset lets Safari use its default translucent
  // chrome that adapts to the page, so the bar reads as transparent/light.
  // See tasks/lessons.md (iOS status-bar note) before re-adding it.
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
