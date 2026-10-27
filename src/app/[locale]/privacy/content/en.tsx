import Link from "next/link";
import type { LegalDoc } from "./types";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;

export const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  subtitle: "What Stroyka collects, where it goes, how long we keep it, and how to delete it.",
  effectiveDate: "Effective Date: April 2026 · Last Updated: 26 October 2026",
  sections: [
    {
      id: "who-we-are",
      title: "1. Who We Are and What This Covers",
      content: (
        <>
          <p>Stroyka is run by Dalen Meridian LLC, a Texas limited liability company (&ldquo;Stroyka&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy covers the Stroyka mobile apps for iPhone and Android and our website, getstroyka.com.</p>
          <p>Stroyka is a business tool. A company owner (the &ldquo;Boss&rdquo;) sets up a company account and invites their crew (&ldquo;Workers&rdquo;). The company also enters information about its own clients, such as names and email addresses for invoices. For information a company enters about its workers and its clients, the company decides what to collect and why, and we process it on the company&rsquo;s behalf to run the service. The company is responsible for having the right to store and use that information.</p>
        </>
      ),
    },
    {
      id: "info-collect",
      title: "2. Information We Collect",
      content: (
        <>
          <h3>2.1 Information you or your company enter</h3>
          <ul>
            <li><strong>Account information:</strong> your name, email address, phone number (optional), and your password or your Apple or Google sign-in.</li>
            <li><strong>Company information:</strong> company name, and optionally a business address, phone, email, logo, tax ID and license details that appear on invoices.</li>
            <li><strong>Work records:</strong> projects and budgets, hours and time entries, pay rates and pay basis set by the company, material purchases and other costs, receipts, trips and mileage, shopping lists, tasks and comments, daily logs, and days off.</li>
            <li><strong>Photos and files:</strong> receipt photos, job-site photos and other attachments you upload.</li>
            <li><strong>Your company&rsquo;s clients:</strong> client names, email addresses, phone numbers, addresses and notes, and the invoices sent to them.</li>
            <li><strong>Messages to us:</strong> anything you send us by email or through the app.</li>
          </ul>

          <h3>2.2 Information collected automatically</h3>
          <ul>
            <li><strong>Device information:</strong> device model, operating system, app version and language.</li>
            <li><strong>Push notification token:</strong> an identifier that lets us send notifications to your device.</li>
            <li><strong>Usage data (PostHog):</strong> which screens and features are used, linked to your user ID, your company ID and your role. Your IP address is received, and an approximate location (city and country) is derived from it. You can switch this off in the app (see section 9).</li>
            <li><strong>Error and crash reports (Sentry):</strong> error details, device and operating system, linked to your user ID, company ID and role.</li>
            <li><strong>Server logs:</strong> IP addresses and request details, as part of normal operation and security.</li>
          </ul>

          <h3>2.3 Location</h3>
          <p>If your company turns on the GPS time clock, Stroyka records your phone&rsquo;s precise location <strong>only at the moment you clock in or clock out</strong>, to check you are at the job site:</p>
          <ul>
            <li>Location is captured only at clock-in and clock-out &mdash; never continuously, and never in the background.</li>
            <li>Each captured point (latitude, longitude and accuracy) is stored with that time entry and is visible to your company&rsquo;s managers.</li>
            <li>It needs both your consent in Stroyka and your phone&rsquo;s permission. You can decline, and you can turn it off at any time in the app (Profile &rarr; Privacy and data &rarr; Location at clock-in) or in your phone&rsquo;s settings. You can still clock in and out; the entry is just recorded without a location.</li>
            <li>We record when you gave and when you withdrew consent.</li>
            <li>We never use your location for advertising or to track you across other apps or websites.</li>
          </ul>

          <h3>2.4 Our website</h3>
          <ul>
            <li><strong>Analytics:</strong> pages viewed, referrer and button clicks (PostHog). We do not record your screen or session.</li>
            <li><strong>Forms:</strong> if you ask for a demo, we receive your name, company, crew size, email, and optionally your phone number and message.</li>
            <li><strong>Purchases:</strong> if you subscribe on the website, checkout is handled by Stripe (see section 4).</li>
          </ul>

          <h3>2.5 What we do not collect</h3>
          <ul>
            <li>Your location in the background, or at any time other than clock-in and clock-out.</li>
            <li>Biometric data.</li>
            <li>Card or bank account numbers. Payments are handled by Apple or Stripe, and we do not see your full card number.</li>
            <li>Social Security numbers or copies of ID documents. (A company may enter its own business tax ID to print on its invoices.)</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "3. How We Use Information",
      content: (
        <ul>
          <li><strong>To run the service:</strong> store and sync your company&rsquo;s records, calculate costs and pay, build reports and invoices, and let bosses and workers work together.</li>
          <li><strong>To sign you in</strong> and to give each person the access their role allows.</li>
          <li><strong>To check job-site attendance</strong> when the GPS time clock is on.</li>
          <li><strong>To read receipts and shopping lists for you:</strong> when you use this feature, the photo (or the list text) is sent to our AI provider, Anthropic, which returns the items and amounts it reads. The result is shown to you to check and save.</li>
          <li><strong>To send email:</strong> sign-in and password emails, worker invitations, and invoices and payment reminders that a company sends to its own clients through Stroyka. After you sign up we also send a welcome email from our founder, and we may write to you personally about your experience. Reply and ask us to stop and we will.</li>
          <li><strong>To send push notifications</strong> about work in your company. You can turn them off in your phone&rsquo;s settings.</li>
          <li><strong>To improve the service:</strong> usage analytics and error reports help us find bugs and decide what to build.</li>
          <li><strong>To support you</strong> and answer your messages.</li>
          <li><strong>To keep the service safe:</strong> prevent abuse, fraud and unauthorized access, and enforce our Terms.</li>
        </ul>
      ),
    },
    {
      id: "sharing",
      title: "4. Who We Share It With",
      content: (
        <>
          <p><strong>We do not sell your personal information,</strong> and we do not share your app data with advertisers.</p>
          <p><strong>Inside your company:</strong> what you enter is visible to others in your company according to their role. Managers can see workers&rsquo; hours, costs, pay and clock-in locations.</p>
          <p><strong>Service providers</strong> that run parts of Stroyka for us, each receiving only what it needs for its job:</p>
          <ul>
            <li><strong>Supabase</strong> &mdash; our database, sign-in, file storage and server functions. Hosted on Amazon Web Services in Frankfurt, Germany. Holds all app data and files.</li>
            <li><strong>Anthropic</strong> (US) &mdash; reads receipt photos and shopping-list photos or text when you use that feature.</li>
            <li><strong>PostHog</strong> (US) &mdash; usage analytics for the app and website, as described in section 2.</li>
            <li><strong>Sentry</strong> (US) &mdash; error and crash reports.</li>
            <li><strong>Resend</strong> (US) &mdash; sends our emails, including invoices and reminders to a company&rsquo;s clients. It receives the recipient&rsquo;s address and the email content.</li>
            <li><strong>Google</strong> &mdash; Sign in with Google, and Firebase Cloud Messaging, which delivers push notifications using your device&rsquo;s push token.</li>
            <li><strong>Apple</strong> &mdash; Sign in with Apple, App Store subscriptions, and delivery of notifications to iPhones.</li>
            <li><strong>RevenueCat</strong> &mdash; tracks the status of subscriptions bought in the iPhone app. It receives your company&rsquo;s ID and purchase information from Apple.</li>
            <li><strong>Stripe</strong> &mdash; checkout and billing for subscriptions bought on our website. Stripe receives your payment details directly.</li>
            <li><strong>Cloudflare</strong> &mdash; our domain and DNS, forwarding of email sent to our addresses, and storage for our encrypted backups.</li>
            <li><strong>Vercel</strong> &mdash; hosts our website and processes standard web logs, including IP addresses.</li>
            <li><strong>Rate limiting</strong> &mdash; our website forms and checkout are rate-limited in our own database (Supabase, above). It keeps only one-way hashes of your IP address and, for the demo form, of the email address entered, and deletes them after 24 hours.</li>
            <li><strong>Telegram</strong> &mdash; notifies our team when someone submits the demo form, including the details in the form.</li>
            <li><strong>Meta</strong> &mdash; the Meta pixel on our website only (see section 10). It is not in the app. <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a></li>
          </ul>
          <p>We may also disclose information if the law, a court or a government authority requires it, or if we believe it is necessary to protect the rights, property or safety of Stroyka, our users or the public.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "5. Where Your Data Is Processed",
      content: (
        <>
          <p>Your app data and files are stored in Germany (Supabase, on Amazon Web Services in Frankfurt). Several of the providers listed in section 4 are in the United States, so some of your information is also processed in the US. Wherever you are, your information may be processed outside your country.</p>
        </>
      ),
    },
    {
      id: "data-isolation",
      title: "6. Data Isolation Between Companies",
      content: (
        <>
          <p>Each company&rsquo;s data is kept separate from every other company&rsquo;s at the database level, using Row Level Security policies:</p>
          <ul>
            <li>No user of one company can view or change another company&rsquo;s data.</li>
            <li>The separation is enforced by the database itself, not only by app code.</li>
            <li>Our team looks at a company&rsquo;s data only when needed to provide support and with the company&rsquo;s permission.</li>
          </ul>
        </>
      ),
    },
    {
      id: "storage-security",
      title: "7. Security and Backups",
      content: (
        <>
          <p>7.1. Data is encrypted in transit (TLS) and encrypted at rest by our hosting provider.</p>
          <p>7.2. Data the app keeps on your phone for offline use is encrypted (SQLCipher / sqlite3mc), with keys kept in the phone&rsquo;s secure storage (Keychain on iPhone, Keystore on Android).</p>
          <p>7.3. We make our own backups of the database and of uploaded files. They are encrypted before they leave our systems and are stored with Cloudflare.</p>
          <p>7.4. We use role-based access, rate limiting, input validation and audit logging.</p>
          <p>7.5. No method of storage or transmission is completely secure, and we cannot guarantee absolute security.</p>
        </>
      ),
    },
    {
      id: "retention",
      title: "8. How Long We Keep Data, and Deleting It",
      content: (
        <>
          <p>8.1. <strong>While you use Stroyka</strong>, we keep your data for as long as your account and your company exist.</p>
          <p>8.2. <strong>Cancelling a paid plan does not delete anything.</strong> Your company moves to the Free plan and your data stays.</p>
          <p>8.3. <strong>Deleting your account (workers).</strong> In the app go to Profile &rarr; Privacy and data &rarr; Delete my account, or email {SUPPORT} from your account&rsquo;s email address (see <Link href="/delete-account">getstroyka.com/delete-account</Link>). This deletes your account <strong>and the records you created</strong> &mdash; your hours, costs and material purchases, trips, requests and daily logs. They disappear from the app immediately, and your name is shown as &ldquo;Deleted user&rdquo;. Within 30 days we permanently delete from our servers your login, your contact details, your push tokens, your location points, and your records and their photos.</p>
          <p>8.4. <strong>Company owners.</strong> A company owner cannot delete only their own account. The owner deletes the whole company instead (8.5), or contacts us at {SUPPORT}.</p>
          <p>8.5. <strong>Deleting a company.</strong> The owner can delete the company in the app (Profile &rarr; Privacy and data &rarr; Delete my company). Everything is hidden from everyone in the company immediately, and within 30 days we permanently delete all of the company&rsquo;s data and files. Deleting a company does not cancel a subscription; cancel it separately (see our <Link href="/terms">Terms</Link>, section 7).</p>
          <p>8.6. <strong>If a company removes a worker</strong> (rather than the worker deleting their own account), the work records that worker created stay with the company as its business records, shown under the worker&rsquo;s name, until the company deletes them or deletes the company. The worker can still ask us to delete their account as in 8.3.</p>
          <p>8.7. <strong>Backups.</strong> Deleted data is not removed from existing backups straight away. It leaves them as those copies expire: database copies are kept for up to 6 months, and copies of files for up to 1 year.</p>
          <p>8.8. <strong>Analytics and error data</strong> are kept by PostHog and Sentry for their retention periods. Support emails are kept for as long as we need them to help you and to keep our records.</p>
          <p>8.9. We may keep information longer where the law requires it, or to resolve a dispute or enforce our Terms.</p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "9. Your Choices and Rights",
      content: (
        <>
          <h3>Everyone</h3>
          <ul>
            <li><strong>See and correct:</strong> you can view your data in the app and update your details in Profile.</li>
            <li><strong>Download:</strong> Profile &rarr; Privacy and data &rarr; Download my data gives you a copy of your data. Bosses can also export reports (for example to PDF, CSV or Excel).</li>
            <li><strong>Delete:</strong> see section 8 and <Link href="/delete-account">getstroyka.com/delete-account</Link>.</li>
            <li><strong>Analytics:</strong> turn off Profile &rarr; Privacy and data &rarr; Share usage analytics.</li>
            <li><strong>Location:</strong> turn off Location at clock-in in the same screen, or in your phone&rsquo;s settings.</li>
          </ul>
          <p>If a company holds information about you &mdash; for example you are its worker or its client &mdash; you can ask that company directly. You can also write to us and we will help.</p>

          <h3>California residents (CCPA)</h3>
          <ul>
            <li><strong>Right to know:</strong> you may ask what personal information we have collected about you.</li>
            <li><strong>Right to delete:</strong> you may ask us to delete it, subject to legal exceptions.</li>
            <li><strong>Right to correct</strong> inaccurate information.</li>
            <li><strong>Sale:</strong> we do not sell personal information.</li>
            <li><strong>Non-discrimination:</strong> we will not treat you differently for using these rights.</li>
          </ul>
          <p>To use these rights, email {SUPPORT}. We respond to verifiable requests within 45 days.</p>

          <h3>Users in the EU and UK (GDPR)</h3>
          <ul>
            <li>Rights of access, correction, erasure and portability.</li>
            <li>Rights to restrict or object to processing.</li>
            <li>Right to withdraw consent at any time (for example to location capture).</li>
            <li>Right to complain to your local data protection authority.</li>
          </ul>
          <p>We rely on: (a) performance of a contract, to provide the service; (b) legitimate interests, to improve and secure the service and to send our welcome and follow-up emails; and (c) consent, where we ask for it, such as location at clock-in.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "10. Cookies and Tracking",
      content: (
        <>
          <p>10.1. <strong>The app</strong> contains no advertising and does not track you across other companies&rsquo; apps or websites.</p>
          <p>10.2. <strong>Our website</strong> uses PostHog analytics cookies to understand how visitors use the site. We do not record your screen or session.</p>
          <p>10.3. Our website also loads the Meta (Facebook) advertising pixel, which sets third-party cookies and tells Meta that a visit or a sign-up click happened, so we can measure our ads. It is not loaded for visitors in the European Economic Area, the UK, or when we cannot tell the visitor&rsquo;s country. Browser tracking protection or an ad blocker will also stop it, and the site works normally without it.</p>
          <p>10.4. To make that decision, the website stores a cookie with your two-letter country code for one day.</p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "11. Third-Party Links",
      content: (
        <p>The service may link to other websites or services. We are not responsible for their privacy practices; please read their privacy policies.</p>
      ),
    },
    {
      id: "children",
      title: "12. Children’s Privacy",
      content: (
        <p>Stroyka is not intended for anyone under 18, and we do not knowingly collect personal information from children under 18. If we learn that we have, we will delete it.</p>
      ),
    },
    {
      id: "changes",
      title: "13. Changes to This Policy",
      content: (
        <p>We may update this policy. For material changes we will notify you by email or in the app at least 30 days before they take effect. If you keep using Stroyka after that date, the updated policy applies.</p>
      ),
    },
    {
      id: "contact",
      title: "14. Contact Us",
      content: (
        <>
          <p>Questions, requests about your data, or concerns:</p>
          <p>
            Dalen Meridian LLC (d/b/a Stroyka)<br />
            Email: {SUPPORT}<br />
            Website: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
          <p>For privacy requests, please put &ldquo;Privacy&rdquo; in the subject line.</p>
        </>
      ),
    },
  ],
};
