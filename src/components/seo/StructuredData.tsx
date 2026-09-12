// src/components/seo/StructuredData.tsx
// Async server component. Emits locale-aware JSON-LD blocks, split by scope.
// Uses QUESTIONS/PRICING_TIERS data files for structure and numeric values;
// getTranslations() supplies all localized text (FAQ Q&A, offer descriptions, app description).
// The escapeJsonLd helper unicode-escapes <, >, & so no </script> sequence in
// any translated string can terminate this block early.

import { getLocale, getTranslations } from "next-intl/server";
import { QUESTIONS } from "@/data/faq";
import { PRICING_TIERS, type PricingTier } from "@/data/pricing";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";

const SITE_URL = "https://www.getstroyka.com";
const ORG_LOGO = `${SITE_URL}/social-avatar-400.png`;
const SUPPORT_EMAIL = "hello@getstroyka.com";
// A store link blanked to "#" (see appLinks) must not leak into the schema.
const STORE_URLS = [IOS_APP_URL, ANDROID_APP_URL].filter((url) => url.startsWith("http"));

type JsonLdObject = Record<string, unknown>;

// Unicode-escape <, >, & so a literal </script> sequence inside any string
// value cannot terminate this <script> block early. JSON.parse on the client
// is unaffected by these \uXXXX escapes. Same defense Next.js applies to
// __NEXT_DATA__.
function escapeJsonLd(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function JsonLdScript({ schema }: { schema: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(schema)) }}
    />
  );
}

/** Maps the PricingTier name (brand string, same across locales) to its messages key. */
const TIER_MSG_KEY: Record<PricingTier["name"], "free" | "starter" | "pro"> = {
  Free: "free",
  Starter: "starter",
  Pro: "pro",
};

/**
 * [scope] picks which blocks this mount emits, and the two scopes are
 * disjoint on purpose.
 *
 * - `"site"` (the layout): Organization + WebSite. True on every page.
 * - `"page"` (the home page): SoftwareApplication (with its price offers) +
 *   FAQPage. Google's structured-data policy requires FAQ markup to
 *   correspond to Q&A actually visible on the page carrying it, and only the
 *   home page shows the FAQ; emitting it site-wide risks rich-result
 *   eligibility for the whole site.
 *
 * The split exists because the component is mounted in BOTH places. An
 * earlier `pageSpecific` flag only ADDED the page blocks, so the home page
 * carried Organization and WebSite twice, once from each mount.
 */
export default async function StructuredData({
  scope = "site",
}: {
  scope?: "site" | "page";
} = {}) {
  const locale = await getLocale();
  const tFaq = await getTranslations("faq");
  const tPricing = await getTranslations("pricing");
  const tMeta = await getTranslations("meta");

  const organization: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stroyka",
    url: SITE_URL,
    logo: ORG_LOGO,
    email: SUPPORT_EMAIL,
    // Only profiles we can evidence: the two store listings. No social
    // accounts are claimed here until they exist.
    sameAs: STORE_URLS,
  };

  const website: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stroyka",
    url: SITE_URL,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: "Stroyka" },
  };

  const softwareApplication: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Stroyka",
    applicationCategory: "BusinessApplication",
    operatingSystem: "iOS, Android, Web",
    description: tMeta("appDescription"),
    url: SITE_URL,
    downloadUrl: STORE_URLS,
    installUrl: STORE_URLS,
    inLanguage: locale,
    offers: PRICING_TIERS.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: String(tier.monthlyPrice),
      priceCurrency: "USD",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      description: tPricing(`${TIER_MSG_KEY[tier.name]}.description` as any),
    })),
  };

  const faqPage: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((_, i) => ({
      "@type": "Question",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: tFaq(`items.${i}.q` as any),
      acceptedAnswer: {
        "@type": "Answer",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        text: tFaq(`items.${i}.a` as any),
      },
    })),
  };

  if (scope === "page") {
    return (
      <>
        <JsonLdScript schema={softwareApplication} />
        <JsonLdScript schema={faqPage} />
      </>
    );
  }

  return (
    <>
      <JsonLdScript schema={organization} />
      <JsonLdScript schema={website} />
    </>
  );
}
