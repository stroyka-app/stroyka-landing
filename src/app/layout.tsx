import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // Hint for browsers that DO honor it (Android Chrome, PWA). iOS Safari with
  // the bottom URL bar ignores it for the top status bar — see the note in
  // tasks/lessons.md before attempting to "fix" the sand status bar again.
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
