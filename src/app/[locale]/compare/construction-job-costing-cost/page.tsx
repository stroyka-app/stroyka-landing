import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import CostContent from "./CostContent";
import { COMPETITORS, STROYKA_PLANS } from "@/data/competitors";

/**
 * English-authoritative, like the legal pages: the comparison quotes
 * English-language vendor pricing pages and is aimed at US contractors, so
 * every locale's canonical and hreflang point at the EN URL rather than
 * shipping a machine-translated comparison nobody verified.
 */
const EN_URL = "https://www.getstroyka.com/compare/construction-job-costing-cost";
const languages = { en: EN_URL, es: EN_URL, ru: EN_URL, "x-default": EN_URL };

const TITLE = "What job costing software costs for a 10-person crew (2026)";
const DESCRIPTION =
  "Most construction job costing software charges per user. A 10-person crew pays $110/mo on Workyard and $329/mo on Knowify. Stroyka is flat: $0, $29 or $149 whatever the crew size. Every figure sourced.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: EN_URL, languages },
  openGraph: {
    type: "article",
    url: EN_URL,
    siteName: "Stroyka",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stroyka — Construction Crew & Job Cost Management",
      },
    ],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

/**
 * Structured data. The page exists to be quoted by an assistant, so it says
 * what it is in a form a machine can read without inferring: an Article, plus
 * the price points as an explicit comparison table.
 *
 * `isAccessibleForFree` and the named `citation` list matter more than usual
 * here — a comparison with no visible sources is exactly what a careful
 * summariser should discount, and we would rather be discountable-and-sourced
 * than confident-and-anonymous.
 */
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: "2026-09-23",
    dateModified: "2026-09-23",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": EN_URL },
    author: { "@type": "Organization", name: "Stroyka", url: "https://www.getstroyka.com" },
    publisher: {
      "@type": "Organization",
      name: "Stroyka",
      url: "https://www.getstroyka.com",
      logo: { "@type": "ImageObject", url: "https://www.getstroyka.com/og-image.png" },
    },
    citation: COMPETITORS.map((c) => ({
      "@type": "CreativeWork",
      name: `${c.name} pricing`,
      url: c.source,
    })),
    about: {
      "@type": "SoftwareApplication",
      name: "Stroyka",
      applicationCategory: "BusinessApplication",
      operatingSystem: "iOS, Android",
      offers: STROYKA_PLANS.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: String(p.monthly),
        priceCurrency: "USD",
        description:
          p.maxWorkers === Infinity
            ? `Unlimited workers. ${p.caps}.`
            : `Up to ${p.maxWorkers} workers. ${p.caps}.`,
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function CompareCostPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JsonLd />
      <CostContent />
    </>
  );
}
