import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import GetContent from "./GetContent";

// Smart store link: QR codes and short links point here (getstroyka.com/get);
// the client detects the visitor's OS and forwards to the right store.
// Locale middleware rewrites the bare path to /en/get, so this lives under
// [locale] — a root-level route would be shadowed and break the document.
export const metadata: Metadata = {
  title: "Get the Stroyka app",
  description: "Download Stroyka for iPhone or Android.",
  robots: { index: false, follow: false },
};

export default async function GetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GetContent />;
}
