// src/components/seo/StructuredData.tsx
// Async server component. Emits four locale-aware JSON-LD blocks.
// Uses QUESTIONS/PRICING_TIERS data files for structure and numeric values;
// getTranslations() supplies all localized text (FAQ Q&A, offer descriptions, app description).
// The escapeJsonLd helper unicode-escapes <, >, & so no </script> sequence in
// any translated string can terminate this block early.

import { getLocale, getTranslations } from "next-intl/server";
import { QUESTIONS } from "@/data/faq";
import { PRICING_TIERS, type PricingTier } from "@/data/pricing";

const SITE_URL = "https://www.getstroyka.com";
const ORG_LOGO = `${SITE_URL}/social-avatar-400.png`;
const SUPPORT_EMAIL = "hello@getstroyka.com";

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
 * [pageSpecific] adds the schemas that describe THIS page rather than the
 * site: SoftwareApplication (with its price offers) and FAQPage.
 *
 * It exists because this component was mounted in the locale layout, so both
 * of those emitted on /demo, /get-started, /privacy and /terms too. Google's
 * structured-data policy requires FAQ markup to correspond to Q&A that is
 * actually visible on the page carrying it, and none of those pages shows an
 * FAQ. That is a policy violation that can cost rich-result eligibility for
 * the whole site, not just the offending URL.
 *
 * Organization and WebSite stay in the layout: they describe the site and are
 * true on every page of it.
 */
export default async function StructuredData({
  pageSpecific = false,
}: {
  pageSpecific?: boolean;
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

  return (
    <>
      <JsonLdScript schema={organization} />
      <JsonLdScript schema={website} />
      {pageSpecific && (
        <>
          <JsonLdScript schema={softwareApplication} />
          <JsonLdScript schema={faqPage} />
        </>
      )}
    </>
  );
}
