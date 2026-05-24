// src/components/seo/StructuredData.tsx
// Server component. Emits four JSON-LD blocks to give Google a clear
// entity + product + content picture of the site in a single render.
// Imports data modules so the FAQ and Pricing components remain the
// single source of truth for the content they describe.

import { QUESTIONS } from "@/data/faq";
import { PRICING_TIERS } from "@/data/pricing";

const SITE_URL = "https://getstroyka.com";
const ORG_LOGO = `${SITE_URL}/social-avatar-400.png`;
const SUPPORT_EMAIL = "hello@getstroyka.com";

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stroyka",
    url: SITE_URL,
    logo: ORG_LOGO,
    email: SUPPORT_EMAIL,
    sameAs: [],
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Stroyka",
    url: SITE_URL,
    publisher: { "@type": "Organization", name: "Stroyka" },
  };
}

function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Stroyka",
    applicationCategory: "BusinessApplication",
    operatingSystem: "iOS, Android",
    description:
      "Construction crew and job cost management app for small US contractors. Track time, assign tasks, and monitor job costs offline.",
    url: SITE_URL,
    offers: PRICING_TIERS.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: String(tier.monthlyPrice),
      priceCurrency: "USD",
      description: tier.description,
    })),
  };
}

function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function JsonLdScript({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema is a static, server-built object — no user input. Safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function StructuredData() {
  return (
    <>
      <JsonLdScript schema={organizationSchema()} />
      <JsonLdScript schema={websiteSchema()} />
      <JsonLdScript schema={softwareApplicationSchema()} />
      <JsonLdScript schema={faqPageSchema()} />
    </>
  );
}
