import LegalPageLayout from "@/components/LegalPageLayout";
import type { LegalDoc } from "../privacy/content/types";
import { subprocessorsEn } from "./content/en";
import { subprocessorsEs } from "./content/es";
import { subprocessorsRu } from "./content/ru";

const DOCS: Record<string, LegalDoc> = { en: subprocessorsEn, es: subprocessorsEs, ru: subprocessorsRu };

/**
 * Server component: the sub-processor list in the page's language. The DPA
 * (section 6) makes this page its Annex III and promises owners 30 days'
 * email notice before a provider in section 1 is added or replaced — update
 * this page AND send that email. Mirror Privacy Policy section 5.
 */
export default function SubprocessorsContent({ locale }: { locale: string }) {
  const doc = DOCS[locale] ?? subprocessorsEn;
  return (
    <LegalPageLayout
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      sections={doc.sections}
    />
  );
}
