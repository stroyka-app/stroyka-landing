import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getstroyka.com"),
};

export const viewport: Viewport = {
  // iOS 26 ("Liquid Glass") Safari ignores theme-color. On device, the TOP
  // status-bar zone paints with the root background-color (see globals.css —
  // #485348, hero-matched) and the BOTTOM bar frosts the real page pixels
  // behind it (needs viewport-fit=cover + env(safe-area-*)). No tint slivers:
  // Safari latches sampled fixed-element colors (see tasks/lessons.md).
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
