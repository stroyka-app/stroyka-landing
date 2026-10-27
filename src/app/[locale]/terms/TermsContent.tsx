import LegalPageLayout from "@/components/LegalPageLayout";
import type { LegalDoc } from "../privacy/content/types";
import { termsEn } from "./content/en";
import { termsEs } from "./content/es";
import { termsRu } from "./content/ru";

const DOCS: Record<string, LegalDoc> = { en: termsEn, es: termsEs, ru: termsRu };

/**
 * Server component: picks the Terms in the page's language. Section ids are
 * identical across ./content/<locale>.tsx so deep links work in every
 * language. English is the reference version (Terms §17.5) — edit it first,
 * then mirror the change in es and ru.
 */
export default function TermsContent({ locale }: { locale: string }) {
  const doc = DOCS[locale] ?? termsEn;
  return (
    <LegalPageLayout
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      sections={doc.sections}
    />
  );
}
