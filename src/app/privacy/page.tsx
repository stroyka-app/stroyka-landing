import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Stroyka",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl font-heading font-bold mb-8">Privacy Policy</h1>
          <p className="text-xs text-brand-sage-mist/50 mb-6">
            Effective Date: [DATE YOU LAUNCH] · Last Updated: April 2026
          </p>

          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            Stroyka LLC (&ldquo;Stroyka,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what information we collect, how we use it, who we share it with, and your rights regarding your data.
          </p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            This policy applies to the Stroyka cloud-based construction job costing and crew management platform, accessible via web browser and mobile applications, and the Stroyka website at getstroyka.com.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">1. Information We Collect</h2>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-3">1.1 Information You Provide Directly</h3>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            When you create an account and use Stroyka, you provide us with:
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Account information: your name, email address, password, company name, and phone number (optional)</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Project data: project names, descriptions, budgets, addresses, and associated financial targets</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Time entries: worker hours logged per project, including date, duration, and task description</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Material and expense records: purchase descriptions, costs, vendor names, categories, and dates</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Photos: images of receipts, materials, or job site conditions uploaded through the app</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Supply requests: material requests submitted by workers, including item descriptions and quantities</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Daily work logs: daily notes, weather conditions, safety observations, and crew activity summaries</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Fuel trip records: vehicle information, mileage, fuel costs</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Task assignments: task descriptions, priorities, statuses, and assigned workers</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Communication data: any messages or feedback you send to us via email or in-app support</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-3">1.2 Information Collected Automatically</h3>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            When you use the Service, we automatically collect:
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Device information: device type, operating system, browser type, screen resolution</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Usage data: pages visited, features used, actions taken, timestamps (collected via PostHog analytics)</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Error and crash data: application errors, stack traces, and performance metrics (collected via Sentry)</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">IP address: collected as part of standard server logs and authentication</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-3">1.3 Information We Do NOT Collect</h3>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">We do not collect precise GPS location data</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">We do not collect biometric data</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">We do not collect financial account numbers, bank details, or credit card numbers (payment processing is handled entirely by Stripe)</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">We do not collect Social Security numbers or government-issued ID numbers</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">2. How We Use Your Information</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">To provide and operate the Service: storing your project data, processing time entries, generating reports, and enabling collaboration between Boss and Worker users</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">To authenticate users: verifying your identity when you log in and managing role-based access within your Company Account</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">To send transactional emails: account verification, password resets, worker invitations, and subscription-related notifications (sent via Resend)</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">To monitor and improve the Service: analyzing usage patterns to identify bugs, improve performance, and prioritize feature development</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">To provide customer support: responding to your questions, feedback, and support requests</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">To enforce our Terms of Service: detecting and preventing abuse, fraud, or unauthorized access</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">3. How We Share Your Information</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            We do not sell your personal information. We do not share your data with advertisers. We do not monetize your data in any way.
          </p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            We share your information only with the following categories of service providers, strictly for the purpose of operating the Service:
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Supabase</strong> (infrastructure): hosts our database (PostgreSQL on AWS), authentication system, file storage, and serverless functions. Data is stored in the US region.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Sentry</strong> (error tracking): receives error reports and crash data to help us identify and fix bugs. Sentry does not receive your project data, financial data, or personally identifiable information beyond a user ID.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>PostHog</strong> (analytics): receives anonymized usage analytics (user ID, company ID, role, page views, feature usage). PostHog does not receive your name, email, project data, or financial data.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Resend</strong> (email delivery): processes transactional emails including account verification, password resets, and worker invitations. Resend receives the recipient email address and email content.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Stripe</strong> (payment processing): handles all subscription billing and payment processing. Stripe receives your payment information directly. Stroyka does not store or have access to your credit card numbers.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Vercel</strong> (hosting): hosts the Stroyka marketing website and web application. Vercel may process standard web server logs including IP addresses.</li>
          </ul>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            We may also disclose your information if required by law, legal process, or government request, or if we believe disclosure is necessary to protect the rights, property, or safety of Stroyka, our users, or the public.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">4. Data Isolation Between Companies</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            Stroyka is a multi-tenant platform. Each Company Account&apos;s data is strictly isolated from all other Company Accounts at the database level through Row Level Security (RLS) policies. This means:
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">No user from one company can view, access, or modify another company&apos;s data</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Data isolation is enforced by the database engine itself, not just application code</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Stroyka employees access customer data only when necessary for support purposes and only with the customer&apos;s explicit permission</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">5. Data Storage and Security</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.1. Your data is stored on servers located in the United States, hosted by Amazon Web Services (AWS) through our infrastructure provider, Supabase.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.2. Data in transit is encrypted using TLS 1.2 or higher.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.3. Data at rest is encrypted using AES-256 encryption.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.4. Offline data stored on your device is encrypted using SQLCipher (sqlite3mc) with device-specific keys stored in secure OS storage (Keychain on iOS, Keystore on Android).</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.5. Database backups are performed automatically by Supabase and are encrypted.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.6. We implement role-based access controls, rate limiting, input validation, and audit logging as part of our security practices.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.7. While we implement industry-standard security measures, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">6. Data Retention</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.1. Active accounts: We retain your data for as long as your account is active and your subscription is in good standing.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.2. Canceled accounts: After subscription cancellation, your data remains accessible and exportable for 30 calendar days. After 30 days, all data associated with your Company Account is permanently deleted from our servers and backups.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.3. Terminated accounts: If your account is terminated for violation of our Terms of Service, data deletion follows the same 30-day timeline unless legal preservation is required.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.4. Transactional emails and support correspondence may be retained for up to 12 months for quality assurance and legal purposes.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.5. Anonymized, aggregated analytics data (which cannot be used to identify any individual or company) may be retained indefinitely for product improvement purposes.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">7. Your Rights</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-3">7.1 All Users</h3>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Access:</strong> You can view all data stored in your account through the app at any time</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Export:</strong> You can export your data in CSV and PDF formats at any time</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Correction:</strong> You can update your personal information through the app settings</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Deletion:</strong> You can request deletion of your account and all associated data by contacting support@getstroyka.com</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-3">7.2 California Residents (CCPA Rights)</h3>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Right to Know:</strong> You may request that we disclose the categories and specific pieces of personal information we have collected about you</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Right to Delete:</strong> You may request that we delete personal information we have collected from you, subject to certain exceptions</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Right to Opt-Out of Sale:</strong> We do not sell personal information. This right does not apply.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights</li>
          </ul>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            To exercise your CCPA rights, contact us at support@getstroyka.com. We will respond to verifiable requests within 45 days.
          </p>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-3">7.3 European Users (GDPR)</h3>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            If you are located in the European Economic Area (EEA) or the United Kingdom, you have additional rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Right to Access, Rectification, Erasure, and Portability of your personal data</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Right to Restrict Processing or object to processing of your personal data</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Right to Withdraw Consent at any time</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Right to Lodge a Complaint with your local data protection authority</li>
          </ul>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            The legal basis for processing your data is: (a) performance of a contract (providing the Service), (b) legitimate interests (improving the Service, preventing fraud), and (c) consent (where applicable, such as marketing communications).
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">8. Cookies and Tracking</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">8.1. The Stroyka web application uses essential cookies for authentication and session management. These cookies are strictly necessary for the Service to function and cannot be disabled.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">8.2. Our marketing website (getstroyka.com) uses analytics cookies via PostHog to understand how visitors interact with the site. These cookies do not collect personally identifiable information.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">8.3. We do not use advertising cookies or tracking pixels. We do not participate in ad networks or retargeting programs.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">9. Third-Party Links</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            The Service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to read the privacy policies of any third-party services you access.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">10. Children&apos;s Privacy</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            The Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or through the Service at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes your acceptance of the updated Privacy Policy.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">12. Contact Us</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            If you have questions about this Privacy Policy, want to exercise your data rights, or have concerns about how we handle your information, please contact us:
          </p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            Stroyka LLC<br />
            Email: <a href="mailto:support@getstroyka.com" className="underline">support@getstroyka.com</a><br />
            Website: <a href="https://getstroyka.com" className="underline">https://getstroyka.com</a>
          </p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            For data protection inquiries, please include &ldquo;Privacy&rdquo; in the subject line of your email.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
