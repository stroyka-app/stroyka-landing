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
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
