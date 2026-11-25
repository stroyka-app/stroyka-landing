import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import { LAST_UPDATED_EN, NOTICE_EFFECTIVE_EN, POSTAL_ADDRESS, VENUE_COUNTY } from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_EN;
const EULA = (
  <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">
    Licensed Application End User License Agreement
  </a>
);

export const termsEn: LegalDoc = {
  title: "Terms of Service",
  subtitle: "Please read these Terms of Service carefully before using the Stroyka platform.",
  effectiveDate: `Effective Date: April 2026 · Last Updated: ${LAST_UPDATED_EN} · Dated changes take effect ${DATE}`,
  sections: [
    {
      id: "definitions",
      title: "1. Definitions",
      content: (
        <ul>
          <li><strong>&ldquo;Stroyka,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;</strong> refers to Dalen Meridian LLC, a Texas limited liability company doing business as Stroyka, and the Stroyka software application and related services.</li>
          <li><strong>&ldquo;Service&rdquo;</strong> refers to the Stroyka construction job costing and crew management software, provided through our mobile apps for iPhone and Android and the related cloud services and website.</li>
          <li><strong>&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;</strong> refers to the individual or business entity that creates a Company Account and uses the Service.</li>
          <li><strong>&ldquo;Company Account&rdquo;</strong> refers to the organizational account created within the Service, under which all projects, users, and data are grouped.</li>
          <li><strong>&ldquo;Boss&rdquo;</strong> refers to a user with administrative privileges within a Company Account, including the ability to manage projects, invite workers, approve requests, and access billing.</li>
          <li><strong>&ldquo;Worker&rdquo;</strong> refers to a user invited to a Company Account by a Boss, with limited permissions to log time, record purchases, and complete assigned tasks.</li>
          <li><strong>&ldquo;Content&rdquo;</strong> refers to all data, text, images, photos, videos, files, and other information uploaded, submitted, or generated through the Service.</li>
          <li><strong>&ldquo;Data Processing Addendum&rdquo;</strong> refers to our addendum at <Link href="/dpa">getstroyka.com/dpa</Link>.</li>
        </ul>
      ),
    },
    {
      id: "account",
      title: "2. Account Registration",
      content: (
        <>
          <p>2.1. You must be at least 18 years old and have the legal authority to enter into these Terms on behalf of yourself or the business entity you represent.</p>
          <p>2.2. When creating an account, you must provide accurate and complete information, including a valid email address, your name, and your company name.</p>
          <p>2.3. You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account.</p>
          <p>2.4. Each Company Account is intended for a single business entity. You may not share a Company Account across multiple unrelated businesses.</p>
          <p>2.5. The Boss who creates the Company Account is the account owner and is responsible for all users they invite and all activity within the Company Account.</p>
          <p>2.6. <strong>Workers.</strong> If a company invites you as a Worker, you use the Service as part of that company&rsquo;s Company Account. The company, not you, is the Customer and is responsible for the Company Account and any payment. By joining, you agree to follow Sections 2.3, 8 (Acceptable Use), 9 (Sanctions and Export Controls) and 11 (Intellectual Property), and the app-store terms in 18.6. Your work arrangements, pay and the records your company keeps about your work are between you and your company.</p>
        </>
      ),
    },
    {
      id: "service",
      title: "3. Service Description",
      content: (
        <>
          <p>3.1. Stroyka provides a platform for small construction crews to track job costs, manage crew timesheets, log material purchases, keep shopping lists, assign tasks, send invoices, and generate financial reports across active construction projects.</p>
          <p>3.2. The Service includes offline functionality. Data entered while offline is stored locally on the device and synchronized with our servers when an internet connection is restored.</p>
          <p>3.3. Some features use third-party services, for example reading receipt photos with an AI provider; the app asks your permission before it first sends anything to that provider. What we share and with whom is described in our <Link href="/privacy">Privacy Policy</Link> and on our <Link href="/subprocessors">Sub-processors</Link> page.</p>
          <p>3.4. We may update, modify, or enhance the Service from time to time. We will make reasonable efforts to maintain backward compatibility, but we reserve the right to change features, APIs, or interfaces with reasonable notice.</p>
        </>
      ),
    },
    {
      id: "data-ownership",
      title: "4. Your Data and Your Responsibilities",
      content: (
        <>
          <p>4.1. <strong>You own your data.</strong> All Content that you or your workers upload, enter, or generate through the Service remains your property. Stroyka does not claim any ownership rights over your Content.</p>
          <p>4.2. You grant Stroyka a limited, non-exclusive license to store, process, transmit, and display your Content solely for the purpose of providing the Service to you.</p>
          <p>4.3. You can download a copy of your data at any time (Profile &rarr; Privacy and data &rarr; Download my data), and Bosses can export reports, for example to PDF, CSV or Excel.</p>
          <p>4.4. <strong>Personal information about other people.</strong> When you enter personal information about your workers or your clients (for example names, contact details, pay rates, hours, or locations), you are responsible for having the right to collect and use it and for telling those people where required. We process that information on your behalf to provide the Service, as described in our <Link href="/privacy">Privacy Policy</Link> and our Data Processing Addendum.</p>
          <p>4.5. Cancelling a paid plan does not delete your data (see Section 7). Deleting an account or a Company Account is covered in Sections 7.6 to 7.11.</p>
          <p>4.6. <strong>Your records and your legal duties.</strong> You decide what records to keep and for how long. Many laws require employers to keep payroll, time, expense and mileage records for several years (for example, in the US, the Fair Labor Standards Act and IRS rules). The Service helps you keep those records, but you are responsible for meeting your own record-keeping, wage-and-hour, tax and employee-notice obligations, including any notice or consent required before using the GPS time clock (for example in Connecticut, New York or Delaware, or under data protection or labor law in your country).</p>
          <p>4.7. <strong>Data Processing Addendum.</strong> Our <Link href="/dpa">Data Processing Addendum</Link> forms part of these Terms and applies whenever we process personal information on your behalf. It includes the terms that data protection laws require between a controller (or &ldquo;business&rdquo;) and its processor (or &ldquo;service provider&rdquo;), including under the GDPR and UK GDPR and US state privacy laws.</p>
        </>
      ),
    },
    {
      id: "security",
      title: "5. Data Isolation & Security",
      content: (
        <>
          <p>5.1. Each Company Account&apos;s data is logically isolated from all other Company Accounts. No user from one company can access, view, or modify another company&apos;s data.</p>
          <p>5.2. Data isolation is enforced at the database level through Row Level Security (RLS) policies. This is not a feature that can be toggled off — it is a fundamental architectural constraint.</p>
          <p>5.3. We use industry-standard encryption for data in transit (TLS) and at rest. Local offline data is encrypted on device.</p>
          <p>5.4. While we take security seriously and implement best practices, no system is perfectly secure. We cannot guarantee absolute security and are not liable for unauthorized access resulting from factors beyond our reasonable control. If a security breach affects your company&rsquo;s data, we will notify you as set out in the Data Processing Addendum.</p>
        </>
      ),
    },
    {
      id: "billing",
      title: "6. Subscription & Billing",
      content: (
        <>
          <p>6.1. Stroyka offers a free plan that is available indefinitely for crews of up to 5 workers. No credit card is required to use the free plan. Paid plans (Starter and Pro) unlock additional features and higher worker limits.</p>
          <p>6.2. Paid subscriptions are optional. If you do not subscribe to a paid plan, you may continue using the free plan for as long as you like.</p>
          <p>6.3. Subscription fees are billed monthly or annually in advance, depending on the billing cycle you select. The price and currency are shown to you before you buy.</p>
          <p>6.4. <strong>Purchases in the apps.</strong> Purchases in the iPhone app are sold and billed by Apple through the App Store, and purchases in the Android app are sold and billed by Google through Google Play. Both renew automatically until cancelled. Apple&rsquo;s or Google&rsquo;s terms govern payment, renewal, cancellation, and refunds for those purchases.</p>
          <p>6.5. <strong>Purchases on our website</strong> are billed through Stripe, our payment processor, and renew automatically at the end of each billing period until you cancel. Your payment details go directly to Stripe and are never stored on our servers.</p>
          <p>6.6. We reserve the right to change our pricing with 30 days&apos; written notice. Price changes will not apply to your current billing cycle. Grandfathered pricing (e.g., early adopter rates) will be honored for as long as your subscription remains active and in good standing.</p>
        </>
      ),
    },
    {
      id: "cancellation",
      title: "7. Cancellation, Refunds & Deletion",
      content: (
        <>
          <p>7.1. You may cancel at any time. For an App Store subscription, cancel in your Apple ID subscription settings. For a Google Play subscription, cancel in Google Play &rsaquo; Payments &amp; subscriptions &rsaquo; Subscriptions. For a website subscription, cancel from the billing screen in the app or by contacting us at {SUPPORT}.</p>
          <p>7.2. Upon cancellation, your subscription remains active until the end of your current billing period. You will not be charged again after cancellation.</p>
          <p>7.3. For website subscriptions, we do not offer prorated refunds for partial billing periods; you keep access until the end of the period. Refunds for App Store and Google Play purchases are handled by Apple or Google under their policies.</p>
          <p>7.4. When a paid plan ends, your Company Account moves to the free plan. Features exclusive to paid plans become unavailable, but <strong>your data is not deleted</strong> and remains accessible and exportable.</p>
          <h3>Deleting your account or company</h3>
          <p>7.5. Cancelling is not deleting. To delete data:</p>
          <p>7.6. <strong>A Worker</strong> can delete their account in the app (Profile &rarr; Privacy and data &rarr; Delete my account) or by emailing {SUPPORT} from the account&rsquo;s email address. This deletes the account, its login and the Worker&rsquo;s personal data: contact details (phone), push tokens, notification settings, location consent and the GPS points recorded on clock-ins and clock-outs. <strong>From {DATE}</strong>, the work records the Worker created for the company (hours, costs and material purchases, receipts, trips, requests, daily logs, task messages, photos and videos) are the company&rsquo;s business records: they stay with the Company Account, shown under the Worker&rsquo;s name, as in 7.8. <strong>Until then, deleting a Worker account also deletes the records that Worker created</strong>; they disappear from the app immediately and are permanently deleted from our servers within 30 days.
            {/* remove when min app version ≥ 1.0.62 */}
            {" "}An app version older than 1.0.62 also deletes those records, even after {DATE}, until we retire those versions.</p>
          <p>7.7. <strong>A Boss</strong> cannot delete only their own account. The Boss can delete the whole Company Account in the app (Profile &rarr; Privacy and data &rarr; Delete my company). Its data is hidden immediately and permanently deleted from our servers within 30 days.</p>
          <p>7.8. If a Company Account removes a Worker, the records that Worker created remain with the company as its business records until the company deletes them or the Company Account.</p>
          <p>7.9. Deleted data leaves our encrypted backups as those copies expire (database copies up to 6 months, file copies up to 1 year). Deleted data cannot be recovered through the app.</p>
          <p>7.10. Deleting an account or a Company Account does not cancel a subscription. Cancel it as described in Section 7.1.</p>
          <p>7.11. Full details are in our <Link href="/privacy">Privacy Policy</Link> (section 9) and at <Link href="/delete-account">getstroyka.com/delete-account</Link>.</p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "8. Acceptable Use",
      content: (
        <>
          <p>You agree not to, and not to let anyone in your Company Account:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any applicable local, state, national, or international law</li>
            <li>Attempt to access another Company Account&apos;s data or circumvent data isolation controls</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use the Service to store or transmit malicious code, viruses, or harmful content</li>
            <li>Resell, sublicense, or redistribute access to the Service without our written consent</li>
            <li>Use automated means (bots, scrapers, etc.) to access the Service beyond its intended use</li>
            <li>Upload content that infringes on the intellectual property rights of others</li>
            <li>Use the Service to track people secretly, or to collect information about people without the notice or consent the law requires</li>
          </ul>
        </>
      ),
    },
    {
      id: "sanctions",
      title: "9. Sanctions and Export Controls",
      content: (
        <>
          <p>9.1. The Service is provided from the United States and is subject to US sanctions and export control laws. You may not use or access the Service from, or for the benefit of anyone in, a country or region subject to comprehensive US sanctions, or any place where US law restricts providing the Service (&ldquo;Restricted Locations&rdquo;), and you may not export or re-export the apps in breach of those laws.</p>
          <p>9.2. You confirm that you and your company are not located in, organized under the laws of, or ordinarily resident in a Restricted Location, and that neither you nor your company is named on, or owned 50% or more by anyone named on, a US government restricted-party list.</p>
          <p>9.3. We may refuse, suspend or end access to the Service, with or without notice, where we believe that providing it could breach those laws. Where the law permits, we will give you a chance to download your data first.</p>
        </>
      ),
    },
    {
      id: "availability",
      title: "10. Service Availability",
      content: (
        <>
          <p>10.1. We strive to maintain high availability of the Service but do not guarantee any specific uptime percentage. We do not offer a formal Service Level Agreement (SLA) at this time.</p>
          <p>10.2. The Service may be temporarily unavailable due to scheduled maintenance, updates, or unforeseen technical issues. We will make reasonable efforts to notify users of planned downtime in advance.</p>
          <p>10.3. The offline functionality of the Service is designed to allow continued use during internet outages. Data entered offline will sync when connectivity is restored.</p>
        </>
      ),
    },
    {
      id: "ip",
      title: "11. Intellectual Property",
      content: (
        <>
          <p>11.1. The Stroyka platform, including its software, design, logos, documentation, and all related intellectual property, is owned by Dalen Meridian LLC and is protected by applicable copyright, trademark, and other intellectual property laws.</p>
          <p>11.2. These Terms grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for your internal business purposes during the term of your use of the Service.</p>
          <p>11.3. You may not copy, modify, distribute, sell, or create derivative works based on the Service or any part thereof.</p>
          <p>11.4. <strong>Feedback and suggestions.</strong> If you send us feedback, feature requests, ideas, or suggestions about the Service (&ldquo;Feedback&rdquo;), you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and incorporate that Feedback into the Service or any other product, without restriction, attribution, or compensation to you. Feedback is provided voluntarily and is not confidential.</p>
          <p>11.5. <strong>No obligation to implement.</strong> We welcome Feedback, but we are under no obligation to respond to, implement, or retain any Feedback, feature request, or suggestion. Nothing in these Terms — and no discussion, email, or message about a potential feature — creates a commitment to build, deliver, or maintain any particular functionality, or a timeline for doing so. Product decisions rest solely with us.</p>
        </>
      ),
    },
    {
      id: "warranties",
      title: "12. Disclaimer of Warranties",
      content: (
        <>
          <p><strong>12.1. THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong></p>
          <p><strong>12.2. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DALEN MERIDIAN LLC EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.</strong></p>
          <p>12.3. We do not warrant that the Service will be uninterrupted, timely, secure, or error-free, that any defect will be corrected, or that the Service is free of viruses or other harmful components.</p>
          <p><strong>12.4. THE SERVICE PERFORMS CALCULATIONS &mdash; INCLUDING JOB COSTS, LABOR COSTS, PAY, MARGINS, AND INVOICE TOTALS &mdash; FROM DATA THAT YOU AND YOUR USERS ENTER, AND CAN READ RECEIPTS AND LISTS AUTOMATICALLY. WE DO NOT WARRANT THE ACCURACY, COMPLETENESS, OR SUITABILITY OF ANY CALCULATION, AUTOMATIC READING, REPORT, ESTIMATE, OR INVOICE PRODUCED BY THE SERVICE.</strong> You are solely responsible for reviewing and verifying all figures before relying on them for bidding, billing, payroll, tax, or any other business or financial decision.</p>
          <p>12.5. Locations recorded at clock-in and clock-out come from the phone and can be inaccurate or missing. They are an aid for your records, not proof of where someone was.</p>
          <p>12.6. We are not your payroll provider, accountant, tax adviser or lawyer. Whether your use of the Service meets employment, wage-and-hour, tax, privacy or other laws that apply to your business is your responsibility.</p>
          <p>12.7. You are responsible for maintaining your own records and backups of your Content. While we take reasonable measures to protect and retain data, we do not warrant that Content will not be lost, corrupted, or temporarily unavailable.</p>
          <p>12.8. No advice or information, whether oral or written, obtained from us or through the Service creates any warranty not expressly stated in these Terms.</p>
          <p>12.9. Some jurisdictions do not allow the exclusion of certain implied warranties. In those jurisdictions, the exclusions above apply to the fullest extent permitted by applicable law, and the remainder of this section continues in effect.</p>
        </>
      ),
    },
    {
      id: "liability",
      title: "13. Limitation of Liability",
      content: (
        <>
          <p><strong>13.1. TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA OR GOODWILL, ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY.</strong></p>
          <p><strong>13.2. TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID US FOR THE SERVICE IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM AND (B) ONE HUNDRED US DOLLARS (US$100).</strong></p>
          <p>13.3. These limits do not apply to your payment obligations, your obligations under Section 14, or liability that cannot be limited by law (for example for fraud or, where applicable, gross negligence or wilful misconduct).</p>
          <p>13.4. The Service is provided for business cost-tracking and crew management purposes. It is not a substitute for professional accounting, legal, or financial advice.</p>
        </>
      ),
    },
    {
      id: "indemnification",
      title: "14. Indemnification",
      content: (
        <p>You will defend, indemnify and hold harmless Dalen Meridian LLC and its members, officers and agents from claims, losses and expenses (including reasonable attorneys&rsquo; fees) brought by third parties &mdash; including your Workers, your clients and government authorities &mdash; arising from (a) Content you or your users submit, (b) your collection and use of personal information about your Workers or clients, including any notice or consent required for GPS or other monitoring, (c) your pay, wage-and-hour, tax, invoicing and record-keeping practices, or (d) your breach of these Terms or the law. We will notify you promptly of a claim and let you control the defense, but you may not settle a claim that imposes obligations on us without our consent.</p>
      ),
    },
    {
      id: "modifications",
      title: "15. Modifications to Terms",
      content: (
        <>
          <p>15.1. We may update these Terms from time to time. When we make material changes, we will notify you by email or through the Service at least 30 days before the changes take effect.</p>
          <p>15.2. <strong>From {DATE}</strong>, 15.1 is replaced by this rule: changes that reduce your rights or add to your obligations take effect at least 30 days after we notify you by email or through the Service. Changes required by law, changes that fix a security problem, and changes that do not reduce your rights can take effect when we publish them. New sub-processors are notified as the Data Processing Addendum describes.</p>
          <p>15.3. Your continued use of the Service after the effective date of revised Terms constitutes your acceptance of the changes. If you do not agree with the revised Terms, you may cancel your subscription and stop using the Service before the changes take effect.</p>
          <p>15.4. <strong>This version.</strong> Published {LAST_UPDATED_EN}. It takes effect when published, except the changes in 7.6, 15.2, 16.7 and 17.3, which take effect on {DATE}. It adds the Data Processing Addendum (4.7), employers&rsquo; record-keeping duties (4.6), Google Play billing (6.4, 7.1, 7.3), Workers (2.6), sanctions and export controls (9), a liability cap of at least US$100 (13.2), a narrower, third-party-only indemnity (14), a small-claims option, fee help and an opt-out for arbitration (16), a data export window after any termination (17.4) and the app-store terms (18.6).</p>
        </>
      ),
    },
    {
      id: "governing-law",
      title: "16. Governing Law and Disputes",
      content: (
        <>
          <p>16.1. These Terms are governed by the laws of the State of Texas, United States of America, without regard to its conflict of law provisions, and, for arbitration, by the US Federal Arbitration Act.</p>
          <p>16.2. <strong>Talk to us first.</strong> Before starting a claim, email {SUPPORT} describing the dispute and what you want. We will try in good faith to resolve it within 30 days, and we will do the same before bringing a claim against you.</p>
          <p>16.3. <strong>Arbitration.</strong> If the dispute is not resolved, it will be settled by binding individual arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules or, if you are an individual using the Service mainly for personal purposes, its Consumer Arbitration Rules. Hearings may take place by video, or in Texas.</p>
          <p>16.4. <strong>Small claims.</strong> Either party may bring an individual claim in small claims court instead of arbitration.</p>
          <p>16.5. <strong>Fees.</strong> If your claim is for less than US$10,000, we will pay the AAA filing, administration and arbitrator fees, unless the arbitrator finds the claim frivolous or brought for an improper purpose.</p>
          <p>16.6. <strong>Opting out.</strong> You may opt out of arbitration by emailing {SUPPORT} from your account&rsquo;s email address with the subject &ldquo;Arbitration opt-out&rdquo; within 30 days after you first accept these Terms or, if you accepted an earlier version, by {DATE}. If you opt out, disputes go to the courts in 16.8.</p>
          <p>16.7. <strong>Mass arbitration (from {DATE}).</strong> If 25 or more similar arbitration demands are filed against us, or by us, by or with the help of the same counsel or coordinated parties, they will be administered in batches of up to 25 under the AAA&rsquo;s Mass Arbitration Supplementary Rules, and limitation periods are paused for the claims waiting their turn.</p>
          <p>16.8. <strong>Courts.</strong> Claims that are not arbitrated will be brought in the state or federal courts located in {VENUE_COUNTY.en}, Texas, and both parties consent to their jurisdiction. Either party may seek injunctive or other equitable relief in any court of competent jurisdiction.</p>
          <p><strong>16.9. CLASS ACTION WAIVER. YOU AND DALEN MERIDIAN LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.</strong> The arbitrator may not consolidate more than one party&rsquo;s claims and may not preside over any form of class or representative proceeding, except for the batching in 16.7.</p>
          <p><strong>16.10. JURY TRIAL WAIVER. TO THE EXTENT ANY CLAIM PROCEEDS IN COURT RATHER THAN ARBITRATION, YOU AND DALEN MERIDIAN LLC EACH KNOWINGLY AND VOLUNTARILY WAIVE ANY RIGHT TO TRIAL BY JURY.</strong></p>
          <p><strong>16.11. TIME LIMIT ON CLAIMS. ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE MUST BE BROUGHT WITHIN ONE (1) YEAR AFTER THE CLAIM ARISES.</strong> Claims not brought within that period are permanently barred, except where applicable law does not permit such a limitation.</p>
          <p>16.12. If the class action waiver in 16.9 is found unenforceable as to a particular claim, the agreement to arbitrate in 16.3 does not apply to that claim, and that claim proceeds in the courts in 16.8. The remainder of this section survives.</p>
          <p>16.13. Nothing in this section limits rights you have under mandatory consumer or data protection law of the country where you live, or the governing law and courts that the Standard Contractual Clauses in the Data Processing Addendum set for themselves.</p>
        </>
      ),
    },
    {
      id: "termination",
      title: "17. Suspension and Termination",
      content: (
        <>
          <p>17.1. <strong>Suspension.</strong> We may suspend access, in whole or in part, if (a) your use poses a security risk or may harm the Service or others, (b) the law, a court or a government authority requires it, including under Section 9, (c) a website subscription invoice is more than 15 days overdue, or (d) you materially breach Section 8. We will give notice in advance where reasonable, and restore access once the issue is resolved.</p>
          <p>17.2. <strong>By you.</strong> You may stop using the Service and delete your account or Company Account at any time (Section 7).</p>
          <p>17.3. <strong>By us.</strong> We may terminate these Terms for a material breach that you do not cure within 15 days of our notice, or immediately for illegal activity or a breach of Section 8 or 9. <strong>From {DATE}</strong>, we may also stop providing the Service to you, or stop offering it altogether, on at least 60 days&rsquo; notice; if we do, we refund any prepaid website subscription fees for the period after the end date.</p>
          <p>17.4. <strong>Your data after termination.</strong> Unless the termination is for illegal activity, or the law (including Section 9) does not allow it, you will have 30 days after termination to export your data. After that we delete the Company Account&rsquo;s data as described in our <Link href="/privacy">Privacy Policy</Link> (section 9), including expiry from backups.</p>
          <p>17.5. Sections 4, 11 to 14, 16, 17.4 and 18 survive termination.</p>
        </>
      ),
    },
    {
      id: "miscellaneous",
      title: "18. Miscellaneous",
      content: (
        <>
          <p>18.1. <strong>Entire Agreement.</strong> These Terms, together with the Privacy Policy and the Data Processing Addendum, constitute the entire agreement between you and Dalen Meridian LLC regarding the Service.</p>
          <p>18.2. <strong>Severability.</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
          <p>18.3. <strong>Waiver.</strong> The failure of Stroyka to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</p>
          <p>18.4. <strong>Assignment.</strong> You may not assign or transfer your rights under these Terms without our prior written consent. We may assign our rights and obligations without restriction.</p>
          <p>18.5. <strong>Translations.</strong> These Terms are also provided in Spanish and Russian for convenience. If a translation differs from the English version, the English version applies.</p>
          <p>18.6. <strong>App stores.</strong> If you downloaded the app from Apple&rsquo;s App Store, Apple&rsquo;s {EULA} also applies to your use of the app. These Terms are between you and Dalen Meridian LLC only, not Apple or Google. Apple and Google are not responsible for the app or its content and have no obligation to provide maintenance or support for it. For the iPhone app, Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.</p>
          <p>18.7. <strong>Events beyond our control.</strong> Neither party is liable for a delay or failure caused by events beyond its reasonable control, such as outages of internet or hosting providers, natural disasters, war or government action. This does not excuse payment obligations.</p>
          <p>18.8. <strong>Notices.</strong> We send notices to the email address of the account owner, or through the Service. You send notices to {SUPPORT}.</p>
          <p>18.9. <strong>Relationship.</strong> We are independent contractors. These Terms do not create a partnership, agency or employment relationship.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "19. Contact Information",
      content: (
        <>
          <p>If you have questions about these Terms, please contact us:</p>
          <p>
            Dalen Meridian LLC<br />
            {POSTAL_ADDRESS}<br />
            Email: {SUPPORT}<br />
            Website: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
        </>
      ),
    },
  ],
};
