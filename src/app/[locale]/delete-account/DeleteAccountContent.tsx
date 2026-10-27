import LegalPageLayout from "@/components/LegalPageLayout";
import type { LegalDoc } from "../privacy/content/types";
import { deleteAccountEn } from "./content/en";
import { deleteAccountEs } from "./content/es";
import { deleteAccountRu } from "./content/ru";

const DOCS: Record<string, LegalDoc> = {
  en: deleteAccountEn,
  es: deleteAccountEs,
  ru: deleteAccountRu,
};

/**
 * The public account-deletion page Google Play's Data safety form links to.
 * It must stay reachable WITHOUT signing in and must stay indexable — do not
 * add `robots: noindex` or a robots.txt Disallow for it. The rule it states
 * mirrors Privacy Policy section 8; change both together.
 */
export default function DeleteAccountContent({ locale }: { locale: string }) {
  const doc = DOCS[locale] ?? deleteAccountEn;
  return (
    <LegalPageLayout
      title={doc.title}
      subtitle={doc.subtitle}
      effectiveDate={doc.effectiveDate}
      sections={doc.sections}
    />
  );
}
