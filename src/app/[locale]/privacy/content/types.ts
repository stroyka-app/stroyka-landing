import type { LegalSection } from "@/components/LegalPageLayout";

/** One legal document in one language. Shared by privacy, terms and delete-account. */
export interface LegalDoc {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: LegalSection[];
}
