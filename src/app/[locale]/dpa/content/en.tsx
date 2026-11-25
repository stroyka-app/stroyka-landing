import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import {
  LAST_UPDATED_EN,
  NOTICE_EFFECTIVE_EN,
  POSTAL_ADDRESS,
  REPRESENTATIVES_INTERIM,
} from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_EN;
const REPS = REPRESENTATIVES_INTERIM.en;
const SCC = (
  <a href="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj" target="_blank" rel="noopener noreferrer">
    Standard Contractual Clauses
  </a>
);
const UK_ADDENDUM = (
  <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/international-data-transfer-agreement-and-guidance/" target="_blank" rel="noopener noreferrer">
    International Data Transfer Addendum
  </a>
);

export const dpaEn: LegalDoc = {
  title: "Data Processing Addendum",
  subtitle: "How we handle the personal information your company puts into Stroyka. It is part of our Terms of Service; there is nothing to sign.",
  effectiveDate: `Last Updated: ${LAST_UPDATED_EN} · Section 4.3 changes ${DATE}`,
  sections: [
    {
      id: "scope",
      title: "1. Who This Is Between and When It Applies",
      content: (
        <>
          <p>1.1. This Data Processing Addendum (&ldquo;DPA&rdquo;) is between Dalen Meridian LLC, d/b/a Stroyka, {POSTAL_ADDRESS} (&ldquo;Stroyka&rdquo;, &ldquo;we&rdquo;), and the Customer that holds a Company Account (&ldquo;you&rdquo;). It forms part of our <Link href="/terms">Terms of Service</Link> (Section 4.7) and you accept it when you accept the Terms. No signature is needed.</p>
          <p>1.2. It applies whenever we process personal information on your behalf through the Service (&ldquo;Customer Personal Data&rdquo;). For that information you are the controller (or &ldquo;business&rdquo;, &ldquo;responsable&rdquo;, &ldquo;operator&rdquo;, &ldquo;data fiduciary&rdquo;, as your law calls it) and we are your processor (or &ldquo;service provider&rdquo;, &ldquo;encargado&rdquo;). If you are yourself a processor for someone else, we are your sub-processor.</p>
          <p>1.3. It does not cover information we handle for our own purposes as a controller &mdash; your users&rsquo; accounts and sign-in, billing, usage analytics, crash reports, security logs and our own emails. Our <Link href="/privacy">Privacy Policy</Link> covers those.</p>
          <p>1.4. If this DPA and the Terms conflict, this DPA wins for Customer Personal Data. If the Standard Contractual Clauses (section 11) conflict with either, the Clauses win.</p>
        </>
      ),
    },
    {
      id: "details",
      title: "2. Details of the Processing",
      content: (
        <ul>
          <li><strong>Subject matter and purpose:</strong> providing the Service under the Terms: storing, syncing, calculating, displaying, sending and deleting your company&rsquo;s records.</li>
          <li><strong>Duration:</strong> while you use the Service, then until deletion under section 12.</li>
          <li><strong>Nature:</strong> collection through the apps, storage, organisation, retrieval, calculation, transmission (for example invoices and notifications), backup and deletion.</li>
          <li><strong>People the data is about:</strong> your Bosses and Workers (employees and subcontractors), your clients and their contact people, and anyone else you enter.</li>
          <li><strong>Types of data:</strong> names, contact details, roles; hours and time entries; pay rates and pay basis; locations recorded at clock-in and clock-out (if you use the GPS time clock); material purchases, costs, receipts and their photos; trips and mileage; requests, tasks, task messages, daily logs; photos, videos (with sound) and files; client details, notes and invoices.</li>
          <li><strong>Sensitive data:</strong> none is needed for the Service. Please do not enter health information, government ID numbers of individuals or similar sensitive data.</li>
        </ul>
      ),
    },
    {
      id: "our-duties",
      title: "3. What We Promise",
      content: (
        <>
          <p>3.1. We process Customer Personal Data only on your documented instructions (section 4), including with regard to transfers to other countries, unless the law requires otherwise; in that case we tell you first unless the law forbids it.</p>
          <p>3.2. We tell you promptly if we believe an instruction breaks data protection law.</p>
          <p>3.3. Everyone at Stroyka who can access Customer Personal Data is bound to keep it confidential, and only accesses it as described in our Privacy Policy, section 7.</p>
          <p>3.4. We do not sell Customer Personal Data, do not use it for advertising, and do not use it for our own purposes beyond running, securing and supporting the Service for you.</p>
        </>
      ),
    },
    {
      id: "instructions",
      title: "4. Your Instructions",
      content: (
        <>
          <p>4.1. Your instructions are these Terms and this DPA, and what you and your users do in the Service: what you enter, the settings you choose, and the actions you take (for example exporting, deleting, sending an invoice). You may give further written instructions to {SUPPORT} if they are consistent with the Terms.</p>
          <p>4.2. <strong>GPS time clock.</strong> You decide whether to turn it on. When it is on, we record a Worker&rsquo;s location only at clock-in and clock-out, and only if that Worker has allowed it in the app and on their phone. A Worker can turn it off at any time and still clock in.</p>
          <p>4.3. <strong>When a Worker deletes their own account.</strong> You instruct us that we delete the Worker&rsquo;s login, contact details, push tokens, notification settings, location consent, and the locations recorded on their clock-ins and clock-outs. <strong>From {DATE}</strong>, you also instruct us to keep the other records that Worker created in your Company Account &mdash; hours, costs and purchases, receipts, trips, requests, daily logs, task messages, photos and videos &mdash; shown under their name, until you delete them or the Company Account. Until {DATE} (and from app versions older than 1.0.62), the Worker&rsquo;s deletion also deletes, within 31 days, the Worker&rsquo;s hours, costs and purchases, trips, requests and daily logs and the photos attached to them; the Worker&rsquo;s receipts, task messages and their photos and videos, and days off stay in your Company Account.</p>
          <p>4.4. <strong>When you remove a Worker,</strong> you instruct us to keep the records that Worker created in your Company Account until you delete them or the Company Account.</p>
          <p>4.5. <strong>Reading receipts and lists.</strong> You instruct us to send a photo of a receipt or shopping list to our AI sub-processor when one of your users chooses to scan and has allowed it in the app.</p>
          <p>4.6. <strong>Deleting your company.</strong> When the owner deletes the Company Account, you instruct us to delete all Customer Personal Data as in section 12.</p>
        </>
      ),
    },
    {
      id: "security",
      title: "5. Security",
      content: (
        <>
          <p>We keep technical and organisational measures appropriate to the risk, including:</p>
          <ul>
            <li>encryption in transit (TLS) and at rest; an encrypted offline database on phones (SQLCipher / sqlite3mc, keys in Keychain or Keystore);</li>
            <li>separation of every company&rsquo;s data in the database itself (Row Level Security), and role-based access inside each company;</li>
            <li>our own encrypted backups, stored separately (database copies kept up to 7 months, file copies up to 13 months);</li>
            <li>access to production systems limited to the people who run the Service, with strong authentication;</li>
            <li>rate limiting, input validation and audit logging; and</li>
            <li>a written incident procedure and a record of every security incident.</li>
          </ul>
          <p>We may improve these measures over time, but will not reduce the overall level of protection.</p>
        </>
      ),
    },
    {
      id: "subprocessors",
      title: "6. Sub-processors",
      content: (
        <>
          <p>6.1. You give us general authorisation to use the sub-processors listed on our <Link href="/subprocessors">Sub-processors</Link> page.</p>
          <p>6.2. We will email the account owner at least 30 days before we add or replace a sub-processor that processes Customer Personal Data, and update the page; where a sub-processor must be replaced urgently for security or to keep the Service running, we tell you as soon as we can, and you may object in the same way. You may object in writing within that time on reasonable data protection grounds. We will then try to find a solution; if we cannot, you may end the affected Service, and we will refund any prepaid website subscription fees for the period after it ends. Purchases made through Apple or Google are cancelled and refunded under their policies.</p>
          <p>6.3. We impose on each sub-processor data protection terms that protect Customer Personal Data at least as well as this DPA, and we remain responsible to you for its performance.</p>
        </>
      ),
    },
    {
      id: "requests",
      title: "7. Requests From People",
      content: (
        <p>If a person asks us to access, correct, delete or export Customer Personal Data, or objects to its use, we pass the request to you within 5 working days and tell the person we have done so. We do not answer it ourselves unless you ask us to. The Service lets you view, correct, export and delete your records yourself; where it cannot, we help you on request.</p>
      ),
    },
    {
      id: "breaches",
      title: "8. Security Breaches",
      content: (
        <>
          <p>8.1. If we become aware of a breach of security that leads to the accidental or unlawful destruction, loss, change, unauthorised disclosure of, or access to, Customer Personal Data, we notify the account owner by email without undue delay, and in any case within 72 hours after we become aware of it.</p>
          <p>8.2. We tell you, as far as we know them: what happened; the kinds and rough number of people and records affected; the likely consequences; what we have done and will do; and a contact. We send updates as we learn more.</p>
          <p>8.3. We help you meet your own duties to notify authorities and people. Notifying you is not an admission of fault.</p>
        </>
      ),
    },
    {
      id: "assistance",
      title: "9. Help With Your Compliance",
      content: (
        <p>We give you the information you reasonably need, taking into account the nature of the processing and what we know, for data protection impact assessments (for example before you use the GPS time clock for workers in the EU or UK) and for consultations with an authority.</p>
      ),
    },
    {
      id: "audits",
      title: "10. Audits",
      content: (
        <p>We make available the information needed to show we meet this DPA. You can send us a written questionnaire once a year, and we answer it within 30 days. If an authority requires it, or after a breach affecting your data, you may audit us on 30 days&rsquo; notice, during business hours, at your cost, with an auditor bound to confidentiality, and without access to other customers&rsquo; data.</p>
      ),
    },
    {
      id: "transfers",
      title: "11. International Transfers",
      content: (
        <>
          <p>11.1. Customer Personal Data is stored in Frankfurt, Germany. Stroyka is in the United States and some sub-processors are in the United States or elsewhere, so the data is also accessed and processed outside the EEA, the UK and Switzerland.</p>
          <p>11.2. <strong>EU and EEA.</strong> Where the GDPR applies to a transfer of Customer Personal Data to us, the European Commission&rsquo;s {SCC} (Decision (EU) 2021/914) are incorporated into this DPA by reference: Module Two (controller to processor) where you are a controller, and Module Three (processor to processor) where you are a processor. You are the data exporter and we are the data importer. For the Clauses: Clause 7 (docking) applies; in Clause 9, Option 2 (general authorisation) applies with the notice period in section 6.2; the optional wording in Clause 11 does not apply; in Clause 13, the supervisory authority is the one determined by Clause 13(a): where you have no EU establishment but have appointed a representative under Article 27(1) GDPR, the authority of the member state where your representative is established, and otherwise the authority of one of the member states where the people whose data is transferred are located; Clauses 17 and 18 choose the law and courts of Ireland. Annex I is section 2 of this DPA and the parties&rsquo; details in sections 1 and 15; Annex II is section 5; Annex III is our Sub-processors page.</p>
          <p>11.3. <strong>United Kingdom.</strong> For transfers under UK data protection law, the UK Information Commissioner&rsquo;s {UK_ADDENDUM} to the EU Standard Contractual Clauses (version B1.0) is incorporated by reference. Its Tables 1 to 3 are completed with the information in 11.2 and in this DPA, and either party may end it as its Section 19 allows.</p>
          <p>11.4. <strong>Switzerland.</strong> The Clauses in 11.2 apply with the changes the Swiss Federal Data Protection Act needs: the competent authority is the Federal Data Protection and Information Commissioner, and people in Switzerland can bring claims there.</p>
          <p>11.5. Where a sub-processor is certified under the EU&ndash;US Data Privacy Framework (or its UK Extension or the Swiss&ndash;US framework), we may rely on that certification for onward transfers to it; otherwise we use the Standard Contractual Clauses with it.</p>
          <p>11.6. For other countries, this DPA is the contract that requires protection of the data wherever it is processed.</p>
        </>
      ),
    },
    {
      id: "end",
      title: "12. Return and Deletion",
      content: (
        <p>You can export your data at any time (Terms, Section 4.3) and for 30 days after termination (Terms, Section 17.4). When the Company Account is deleted, we delete Customer Personal Data from the live Service within 31 days. It then leaves our encrypted backups as they expire (database copies within 7 months, file copies within 13 months), and until then it is kept isolated and not used. We confirm deletion in writing if you ask. We keep data longer only where the law requires it.</p>
      ),
    },
    {
      id: "us-laws",
      title: "13. US State Privacy Laws",
      content: (
        <p>Where the California Consumer Privacy Act or another US state privacy law applies, we act as your service provider or processor. We will not sell or share Customer Personal Data; will not keep, use or disclose it for any purpose other than providing the Service to you, or outside our direct business relationship with you; will not combine it with personal information we get from others except as those laws allow; will comply with those laws and give the same level of privacy protection they require; and will tell you if we can no longer meet them. You may take reasonable steps to stop and fix any unauthorised use.</p>
      ),
    },
    {
      id: "other-laws",
      title: "14. Other Countries",
      content: (
        <p>This DPA is also the written contract between a controller and its processor that other laws require &mdash; for example the Mexican LFPDPPP (<em>encargado</em>), the Philippine Data Privacy Act (personal information processor), Canada&rsquo;s PIPEDA and Quebec&rsquo;s private-sector privacy law (written mandate), India&rsquo;s DPDP Act and Uruguay&rsquo;s Ley 18.331. If your local law requires you to notify an authority, get written consent from your workers to use an outside service, or carry out an assessment before sending data abroad, that is your responsibility; we will give you the information about us that you need.</p>
      ),
    },
    {
      id: "general",
      title: "15. General",
      content: (
        <>
          <p>15.1. This DPA lasts as long as we process Customer Personal Data for you.</p>
          <p>15.2. Each party&rsquo;s liability under this DPA is subject to the limits in the Terms (Section 13), except where the Standard Contractual Clauses or the law do not allow that.</p>
          <p>15.3. We may update this DPA as the Terms (Section 15) describe, and we will not reduce the protection it gives Customer Personal Data without at least 30 days&rsquo; notice.</p>
          <p>15.4. Contact: {SUPPORT}, with &ldquo;DPA&rdquo; in the subject line. {REPS}</p>
        </>
      ),
    },
  ],
};
