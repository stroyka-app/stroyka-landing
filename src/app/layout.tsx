import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // Slack-style transparent Safari chrome = page edge-to-edge under the bars
  // (viewport-fit=cover) + NO opaque theme-color, so the bars go translucent
  // and show the real page behind them. Pages handle the insets themselves:
  // Navbar pads top by safe-area-inset-top, Footer pads bottom by
  // safe-area-inset-bottom, so the dark chrome extends to the very edges and
  // nothing important hides under the notch / home indicator. (No themeColor,
  // no html background — either would paint an OPAQUE band and defeat this.)
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
