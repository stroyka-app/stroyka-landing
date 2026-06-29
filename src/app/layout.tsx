import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // theme-color tints the iOS Safari bottom toolbar (the URL-bar band). A dark
  // value painted it green; REMOVING it made the bar translucent, which then
  // showed the dark green footer through it. Pinning it to the bone page color
  // (#E3DCC9, == bg-bone) gives a solid light bar everywhere — never green,
  // and it matches the top status bar (which samples the same bone backdrop).
  // See tasks/lessons.md (iOS status-bar note).
  themeColor: "#E3DCC9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
