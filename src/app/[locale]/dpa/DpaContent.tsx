import LegalPageLayout from "@/components/LegalPageLayout";
import type { LegalDoc } from "../privacy/content/types";
import { dpaEn } from "./content/en";
import { dpaEs } from "./content/es";
import { dpaRu } from "./content/ru";

const DOCS: Record<string, LegalDoc> = { en: dpaEn, es: dpaEs, ru: dpaRu };

/**
 * Server component: the Data Processing Addendum in the page's language.
 * Terms 4.7 incorporates it by reference and Privacy section 1 links it, so
 * its section ids are deep-link targets — keep them stable across locales.
 * English is the reference version; change it first, then es and ru.
 */
export default function DpaContent({ locale }: { locale: string }) {
  const doc = DOCS[locale] ?? dpaEn;
  return (
    <LegalPageLayout
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      sections={doc.sections}
    />
  );
}
