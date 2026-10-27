import LegalPageLayout from "@/components/LegalPageLayout";
import type { LegalDoc } from "./content/types";
import { privacyEn } from "./content/en";
import { privacyEs } from "./content/es";
import { privacyRu } from "./content/ru";

const DOCS: Record<string, LegalDoc> = { en: privacyEn, es: privacyEs, ru: privacyRu };

/**
 * Server component: picks the policy in the page's language and hands it to
 * the (client) legal layout. Each language lives in ./content/<locale>.tsx and
 * keeps the same section ids, so a deep link like #retention works in all
 * three. The English text is the reference version — change it first, then
 * mirror the change in es and ru.
 */
export default function PrivacyContent({ locale }: { locale: string }) {
  const doc = DOCS[locale] ?? privacyEn;
  return (
    <LegalPageLayout
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      sections={doc.sections}
    />
  );
}
