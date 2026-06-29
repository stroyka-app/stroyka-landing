import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // Matches the dark navbar chrome that sits under the iOS status bar in
  // every scroll state (transparent over the dark hero, dark-glass when
  // scrolled), and the footer (#2B3D30) for the bottom safe area.
  themeColor: "#2B3D30",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
