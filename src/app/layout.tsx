import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
};

export const viewport: Viewport = {
  // Initial theme-color = the hero (dark, where the page loads). DynamicThemeColor
  // then updates it live on scroll to track the section behind the iOS Safari
  // bottom bar — see that component + tasks/lessons.md. (True transparency for
  // the bottom bar is impossible on the web; a scroll-driven theme-color is the
  // Slack-style approximation.)
  themeColor: "#2f3e46",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
