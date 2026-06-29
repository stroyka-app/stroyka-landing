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
  // Extend the web view edge-to-edge into the iOS safe areas. Without this
  // the view is inset below the status bar and Safari fills that strip with
  // the bone <body> backdrop (the "sand eyebrow"). With cover, the fixed
  // dark navbar (which pads itself by safe-area-inset-top) fills the
  // status-bar area instead. Sections keep px-6 so nothing hugs the notch.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
