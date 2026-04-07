"use client";

import LegalPageLayout, { type LegalSection } from "@/components/LegalPageLayout";

const sections: LegalSection[] = [
  {
    id: "info-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <h3>1.1 Information You Provide Directly</h3>
        <p>When you create an account and use Stroyka, you provide us with:</p>
        <ul>
          <li><strong>Account information:</strong> your name, email address, password, company name, and phone number (optional)</li>
          <li><strong>Project data:</strong> project names, descriptions, budgets, addresses, and associated financial targets</li>
          <li><strong>Time entries:</strong> worker hours logged per project, including date, duration, and task description</li>
          <li><strong>Material and expense records:</strong> purchase descriptions, costs, vendor names, categories, and dates</li>
          <li><strong>Photos:</strong> images of receipts, materials, or job site conditions uploaded through the app</li>
          <li><strong>Supply requests:</strong> material requests submitted by workers, including item descriptions and quantities</li>
          <li><strong>Daily work logs:</strong> daily notes, weather conditions, safety observations, and crew activity summaries</li>
          <li><strong>Fuel trip records:</strong> vehicle information, mileage, fuel costs</li>
          <li><strong>Task assignments:</strong> task descriptions, priorities, statuses, and assigned workers</li>
          <li><strong>Communication data:</strong> any messages or feedback you send to us via email or in-app support</li>
        </ul>

        <h3>1.2 Information Collected Automatically</h3>
        <p>When you use the Service, we automatically collect:</p>
        <ul>
          <li><strong>Device information:</strong> device type, operating system, browser type, screen resolution</li>
          <li><strong>Usage data:</strong> pages visited, features used, actions taken, timestamps (collected via PostHog analytics)</li>
          <li><strong>Error and crash data:</strong> application errors, stack traces, and performance metrics (collected via Sentry)</li>
          <li><strong>IP address:</strong> collected as part of standard server logs and authentication</li>
        </ul>

        <h3>1.3 Information We Do NOT Collect</h3>
        <ul>
          <li>We do not collect precise GPS location data</li>
          <li>We do not collect biometric data</li>
          <li>We do not collect financial account numbers, bank details, or credit card numbers (payment processing is handled entirely by Stripe)</li>
          <li>We do not collect Social Security numbers or government-issued ID numbers</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li><strong>To provide and operate the Service:</strong> storing your project data, processing time entries, generating reports, and enabling collaboration between Boss and Worker users</li>
          <li><strong>To authenticate users:</strong> verifying your identity when you log in and managing role-based access within your Company Account</li>
          <li><strong>To send transactional emails:</strong> account verification, password resets, worker invitations, and subscription-related notifications (sent via Resend)</li>
          <li><strong>To monitor and improve the Service:</strong> analyzing usage patterns to identify bugs, improve performance, and prioritize feature development</li>
          <li><strong>To provide customer support:</strong> responding to your questions, feedback, and support requests</li>
          <li><strong>To enforce our Terms of Service:</strong> detecting and preventing abuse, fraud, or unauthorized access</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "3. How We Share Your Information",
    content: (
      <>
        <p><strong>We do not sell your personal information.</strong> We do not share your data with advertisers. We do not monetize your data in any way.</p>
        <p>We share your information only with the following categories of service providers, strictly for the purpose of operating the Service:</p>
        <ul>
          <li><strong>Supabase</strong> (infrastructure): hosts our database (PostgreSQL on AWS), authentication system, file storage, and serverless functions. Data is stored in the US region.</li>
          <li><strong>Sentry</strong> (error tracking): receives error reports and crash data to help us identify and fix bugs. Sentry does not receive your project data, financial data, or personally identifiable information beyond a user ID.</li>
          <li><strong>PostHog</strong> (analytics): receives anonymized usage analytics (user ID, company ID, role, page views, feature usage). PostHog does not receive your name, email, project data, or financial data.</li>
          <li><strong>Resend</strong> (email delivery): processes transactional emails including account verification, password resets, and worker invitations. Resend receives the recipient email address and email content.</li>
          <li><strong>Stripe</strong> (payment processing): handles all subscription billing and payment processing. Stripe receives your payment information directly. Stroyka does not store or have access to your credit card numbers.</li>
          <li><strong>Vercel</strong> (hosting): hosts the Stroyka marketing website and web application. Vercel may process standard web server logs including IP addresses.</li>
        </ul>
        <p>We may also disclose your information if required by law, legal process, or government request, or if we believe disclosure is necessary to protect the rights, property, or safety of Stroyka, our users, or the public.</p>
      </>
    ),
  },
  {
    id: "data-isolation",
    title: "4. Data Isolation Between Companies",
    content: (
      <>
        <p>Stroyka is a multi-tenant platform. Each Company Account&apos;s data is strictly isolated from all other Company Accounts at the database level through Row Level Security (RLS) policies. This means:</p>
        <ul>
          <li>No user from one company can view, access, or modify another company&apos;s data</li>
          <li>Data isolation is enforced by the database engine itself, not just application code</li>
          <li>Stroyka employees access customer data only when necessary for support purposes and only with the customer&apos;s explicit permission</li>
        </ul>
      </>
    ),
  },
  {
    id: "storage-security",
    title: "5. Data Storage & Security",
    content: (
      <>
        <p>5.1. Your data is stored on servers located in the United States, hosted by Amazon Web Services (AWS) through our infrastructure provider, Supabase.</p>
        <p>5.2. Data in transit is encrypted using TLS 1.2 or higher.</p>
        <p>5.3. Data at rest is encrypted using AES-256 encryption.</p>
        <p>5.4. Offline data stored on your device is encrypted using SQLCipher (sqlite3mc) with device-specific keys stored in secure OS storage (Keychain on iOS, Keystore on Android).</p>
        <p>5.5. Database backups are performed automatically by Supabase and are encrypted.</p>
        <p>5.6. We implement role-based access controls, rate limiting, input validation, and audit logging as part of our security practices.</p>
        <p>5.7. While we implement industry-standard security measures, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: (
      <>
        <p>6.1. <strong>Active accounts:</strong> We retain your data for as long as your account is active and your subscription is in good standing.</p>
        <p>6.2. <strong>Canceled accounts:</strong> After subscription cancellation, your data remains accessible and exportable for 30 calendar days. After 30 days, all data associated with your Company Account is permanently deleted from our servers and backups.</p>
        <p>6.3. <strong>Terminated accounts:</strong> If your account is terminated for violation of our Terms of Service, data deletion follows the same 30-day timeline unless legal preservation is required.</p>
        <p>6.4. Transactional emails and support correspondence may be retained for up to 12 months for quality assurance and legal purposes.</p>
        <p>6.5. Anonymized, aggregated analytics data (which cannot be used to identify any individual or company) may be retained indefinitely for product improvement purposes.</p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: (
      <>
        <p>Depending on your location, you may have the following rights regarding your personal information:</p>

        <h3>All Users</h3>
        <ul>
          <li><strong>Access:</strong> You can view all data stored in your account through the app at any time</li>
          <li><strong>Export:</strong> You can export your data in CSV and PDF formats at any time</li>
          <li><strong>Correction:</strong> You can update your personal information through the app settings</li>
          <li><strong>Deletion:</strong> You can request deletion of your account and all associated data by contacting <a href="mailto:support@getstroyka.com">support@getstroyka.com</a></li>
        </ul>

        <h3>California Residents (CCPA)</h3>
        <ul>
          <li><strong>Right to Know:</strong> You may request that we disclose the categories and specific pieces of personal information we have collected about you</li>
          <li><strong>Right to Delete:</strong> You may request that we delete personal information we have collected from you, subject to certain exceptions</li>
          <li><strong>Right to Opt-Out of Sale:</strong> We do not sell personal information. This right does not apply.</li>
          <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights</li>
        </ul>
        <p>To exercise your CCPA rights, contact us at <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>. We will respond to verifiable requests within 45 days.</p>

        <h3>European Users (GDPR)</h3>
        <ul>
          <li>Right to Access, Rectification, Erasure, and Portability of your personal data</li>
          <li>Right to Restrict Processing or object to processing of your personal data</li>
          <li>Right to Withdraw Consent at any time</li>
          <li>Right to Lodge a Complaint with your local data protection authority</li>
        </ul>
        <p>The legal basis for processing your data is: (a) performance of a contract (providing the Service), (b) legitimate interests (improving the Service, preventing fraud), and (c) consent (where applicable, such as marketing communications).</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "8. Cookies & Tracking",
    content: (
      <>
        <p>8.1. The Stroyka web application uses essential cookies for authentication and session management. These cookies are strictly necessary for the Service to function and cannot be disabled.</p>
        <p>8.2. Our marketing website (getstroyka.com) uses analytics cookies via PostHog to understand how visitors interact with the site. These cookies do not collect personally identifiable information.</p>
        <p>8.3. We do not use advertising cookies or tracking pixels. We do not participate in ad networks or retargeting programs.</p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "9. Third-Party Links",
    content: (
      <p>The Service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to read the privacy policies of any third-party services you access.</p>
    ),
  },
  {
    id: "children",
    title: "10. Children&apos;s Privacy",
    content: (
      <p>The Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly.</p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: (
      <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or through the Service at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes your acceptance of the updated Privacy Policy.</p>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: (
      <>
        <p>If you have questions about this Privacy Policy, want to exercise your data rights, or have concerns about how we handle your information, please contact us:</p>
        <p>
          Stroyka LLC<br />
          Email: <a href="mailto:support@getstroyka.com">support@getstroyka.com</a><br />
          Website: <a href="https://getstroyka.com">getstroyka.com</a>
        </p>
        <p>For data protection inquiries, please include &ldquo;Privacy&rdquo; in the subject line of your email.</p>
      </>
    ),
  },
];

export default function PrivacyContent() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="We respect your privacy and are committed to protecting your personal information."
      effectiveDate="Effective Date: April 2026 · Last Updated: April 2026"
      sections={sections}
    />
  );
}
