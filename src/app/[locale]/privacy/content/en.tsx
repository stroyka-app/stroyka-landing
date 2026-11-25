import Link from "next/link";
import type { LegalDoc } from "./types";
import {
  LAST_UPDATED_EN,
  NOTICE_EFFECTIVE_EN,
  POSTAL_ADDRESS,
  REPRESENTATIVES_INTERIM,
  RETENTION,
} from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_EN;
const R = RETENTION.en;
const REPS = REPRESENTATIVES_INTERIM.en;

export const privacyEn: LegalDoc = {
  title: "Privacy Policy",
  subtitle: "What Stroyka collects, why, where it goes, how long we keep it, and how to delete it.",
  effectiveDate: `Effective Date: April 2026 · Last Updated: ${LAST_UPDATED_EN} · Dated changes take effect ${DATE}`,
  sections: [
    {
      id: "who-we-are",
      title: "1. Who We Are and What This Covers",
      content: (
        <>
          <p>Stroyka is run by Dalen Meridian LLC, a Texas limited liability company (&ldquo;Stroyka&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), {POSTAL_ADDRESS}. This policy covers the Stroyka mobile apps for iPhone and Android and our website, getstroyka.com.</p>
          <p>Stroyka is a business tool. A company owner (the &ldquo;Boss&rdquo;) sets up a company account and invites their crew (&ldquo;Workers&rdquo;). The company also enters information about its own clients, such as names and email addresses for invoices.</p>
          <ul>
            <li><strong>Your company decides about its records.</strong> For what a company enters about its workers and its clients &mdash; hours, pay rates, clock-in locations, costs, receipts, photos, messages, client details and invoices &mdash; the company decides what to collect and why. In privacy law it is the &ldquo;controller&rdquo; (in some countries the &ldquo;responsable&rdquo;, &ldquo;operator&rdquo; or &ldquo;data fiduciary&rdquo;). We are its processor: we handle that information only to run the service for it, under our <Link href="/dpa">Data Processing Addendum</Link>. The company is responsible for having the right to store and use it and for telling its people where the law requires.</li>
            <li><strong>We decide about our own data.</strong> For your account and sign-in, billing, usage analytics, crash reports, security logs, our emails to you and our website, Stroyka is the controller.</li>
          </ul>
          <p><strong>Privacy contact.</strong> Our founder is responsible for privacy at Stroyka. Write to {SUPPORT} with &ldquo;Privacy&rdquo; in the subject line. This is also our Data Protection Officer for the Philippine Data Privacy Act and our person in charge of the protection of personal information under Quebec law. We are appointing representatives in the EU and the UK (section 16).</p>
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
            <li><strong>Photos, videos and files:</strong> receipt photos, job-site photos, videos (including their sound) and other attachments you upload.</li>
            <li><strong>Your company&rsquo;s clients:</strong> client names, email addresses, phone numbers, addresses and notes, and the invoices sent to them.</li>
            <li><strong>Messages to us:</strong> anything you send us by email or through the app.</li>
          </ul>

          <h3>2.2 Information collected automatically</h3>
          <ul>
            <li><strong>Device information:</strong> device model, operating system, app version and language.</li>
            <li><strong>Push notification token:</strong> an identifier that lets us send notifications to your device.</li>
            <li><strong>Usage analytics (PostHog), only if you agree.</strong> From app version 1.0.62 the app asks you once, and analytics stay off until you say yes. You can change your answer any time in Profile &rarr; Settings &rarr; Privacy and data &rarr; Share usage analytics. Older app versions send usage analytics unless you switch them off in the same place. When on, we receive which screens and features are used, linked to your user ID, your company ID and your role; your IP address is received and an approximate location (city and country) is derived from it.</li>
            <li><strong>Error and crash reports (Sentry), always on:</strong> error details, device, operating system and app version, linked to your user ID, company ID and role. We need these to find and fix faults and keep the app secure, so they are not switchable.</li>
            <li><strong>Server logs:</strong> IP addresses and request details, as part of normal operation and security.</li>
          </ul>

          <h3>2.3 Location</h3>
          <p>If your company turns on the GPS time clock, Stroyka records your phone&rsquo;s precise location <strong>only at the moment you clock in or clock out</strong>, to check you are at the job site:</p>
          <ul>
            <li>Location is captured only at clock-in and clock-out &mdash; never continuously, and never in the background.</li>
            <li>Each captured point (latitude, longitude and accuracy) is stored with that time entry and is visible to your company&rsquo;s managers.</li>
            <li>Your company decides whether to use the GPS time clock, and is responsible for having a lawful reason and for telling you about it.</li>
            <li>Whatever your company decides, you choose: Stroyka asks you in the app and your phone asks for its permission. You can say no, and you can turn it off at any time in the app (Profile &rarr; Settings &rarr; Privacy and data &rarr; Location at clock-in) or in your phone&rsquo;s settings. You can still clock in and out; the entry is just recorded without a location. We record when you turned it on and off.</li>
            <li>We never use your location for advertising or to track you across other apps or websites.</li>
          </ul>

          <h3>2.4 Our website</h3>
          <ul>
            <li><strong>Analytics:</strong> only if you accept cookies in our cookie banner &mdash; pages viewed, referrer and button clicks (PostHog). We do not record your screen or session. Our host, Vercel, also counts page views and measures page speed without cookies.</li>
            <li><strong>Forms:</strong> if you ask for a demo, we receive your name, company, crew size, email, and optionally your phone number and message.</li>
            <li><strong>Purchases:</strong> if you subscribe on the website, checkout is handled by Stripe (see section 5).</li>
          </ul>

          <h3>2.5 What we do not collect</h3>
          <ul>
            <li>Your location in the background, or at any time other than clock-in and clock-out.</li>
            <li>Biometric data, or sensitive personal data such as health, religion or ethnic origin. We do not ask for it, and the service is not designed to hold it.</li>
            <li>Card or bank account numbers. Payments are handled by Apple, Google or Stripe, and we do not see your full card number.</li>
            <li>Social Security numbers or copies of ID documents. (A company may enter its own business tax ID to print on its invoices; please don&rsquo;t enter a personal Social Security number there.)</li>
          </ul>

          <h3>2.6 What you have to give us</h3>
          <p>To have an account you need to give your name and an email address (or use Apple or Google sign-in); without them we cannot provide the service. Everything else is optional, or is up to your company.</p>
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
          <li><strong>To read receipts and shopping lists, if you allow it.</strong> From app version 1.0.62, the first time you scan, the app tells you that the photo is sent to our AI provider, Anthropic, and asks your permission. If you say no, nothing is sent and you can enter the items by hand. Older app versions send it when you choose to scan, without that separate notice. Anthropic returns the items and amounts it reads, and you check them before saving. Under its commercial terms, Anthropic does not use this content to train its models, and it deletes it after a limited period.</li>
          <li><strong>To send email:</strong> sign-in and password emails, worker invitations, and invoices and payment reminders that a company sends to its own clients through Stroyka. After you sign up we also send a welcome email from our founder, and we may write to you personally about your experience. Reply &ldquo;stop&rdquo; and we will stop.</li>
          <li><strong>To send push notifications</strong> about work in your company. You can turn them off in your phone&rsquo;s settings.</li>
          <li><strong>To improve the service:</strong> usage analytics (if you agree) and error reports help us find bugs and decide what to build.</li>
          <li><strong>To support you</strong> and answer your messages.</li>
          <li><strong>To keep the service safe:</strong> prevent abuse, fraud and unauthorized access, enforce our Terms, and meet legal obligations.</li>
        </ul>
      ),
    },
    {
      id: "legal-bases",
      title: "4. Why We May Use It, and How Long We Keep It",
      content: (
        <>
          <p>For each purpose: the legal basis we rely on (this matters most under EU and UK law) and how long we keep the information.</p>
          <ul>
            <li><strong>Your account and sign-in.</strong> Basis: our contract with you. Kept: while your account exists; deleted when you delete it (section 9).</li>
            <li><strong>Your company&rsquo;s records</strong> (work records, clients, invoices, clock-in locations). We process these on your company&rsquo;s behalf; your company chooses the legal basis. Kept: as long as your company keeps them, and deleted within 31 days after the company is deleted (plus backup expiry, 9.7).</li>
            <li><strong>Billing and subscriptions.</strong> Basis: our contract; and legal obligations for tax and accounting records. Kept: while the subscription runs, then as long as tax law requires. Apple, Google and Stripe keep their own payment records.</li>
            <li><strong>Usage analytics (PostHog).</strong> Basis: your consent. Kept: usage events {R.posthog}; the analytics profile they are linked to (your user ID, company ID and role) until we delete it, which we do when you ask. You can withdraw consent at any time (section 10).</li>
            <li><strong>Crash reports (Sentry).</strong> Basis: our legitimate interest in keeping the app working and secure. Kept: {R.sentry}.</li>
            <li><strong>Security logs and rate limiting.</strong> Basis: our legitimate interest in preventing abuse. Kept: rate-limit hashes 24 hours; server logs no longer than 90 days.</li>
            <li><strong>Welcome and founder follow-up emails.</strong> Basis: our legitimate interest in helping new customers get started. Kept: until you object (reply &ldquo;stop&rdquo;) or delete your account.</li>
            <li><strong>Reading receipts and lists (Anthropic).</strong> On your company&rsquo;s behalf, and only after you allow it in the app. The result is saved in your company&rsquo;s records; Anthropic keeps the content only for a limited period under its commercial terms.</li>
            <li><strong>Support messages.</strong> Basis: our contract, or our legitimate interest in answering you. Kept: as long as we need them to help you and to keep a record of what we agreed.</li>
            <li><strong>Demo requests from the website.</strong> Basis: steps you asked us to take before a contract, and our legitimate interest in answering. Kept: while we are in touch about your request; we delete leads we no longer need.</li>
            <li><strong>Website analytics and the Meta pixel.</strong> Basis: your consent in the cookie banner. Kept: see section 12.</li>
            <li><strong>Legal claims and obligations.</strong> Basis: legal obligation, or our legitimate interest in defending claims. Kept: only as long as needed (9.9).</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "5. Who We Share It With",
      content: (
        <>
          <p><strong>We do not sell your personal information,</strong> and we do not share app data with advertisers. Our website (not the app) can use the Meta pixel to measure our ads, only if you accept cookies and only outside the EU and UK (section 12); some US state laws call that &ldquo;sharing&rdquo;.</p>
          <p><strong>Inside your company:</strong> what you enter is visible to others in your company according to their role. Managers can see workers&rsquo; hours, costs, pay and clock-in locations.</p>
          <p><strong>Service providers</strong> that run parts of Stroyka for us, each receiving only what it needs for its job. The full list, with locations, is on our <Link href="/subprocessors">Sub-processors</Link> page:</p>
          <ul>
            <li><strong>Supabase</strong> &mdash; our database, sign-in, file storage and server functions. Hosted on Amazon Web Services in Frankfurt, Germany. Holds all app data and files.</li>
            <li><strong>Anthropic</strong> (US) &mdash; reads photos of receipts and shopping lists when you use that feature and have allowed it.</li>
            <li><strong>PostHog</strong> (US) &mdash; usage analytics for the app and website, only with your consent.</li>
            <li><strong>Sentry</strong> (US) &mdash; error and crash reports.</li>
            <li><strong>Resend</strong> (US) &mdash; sends our emails, including invoices and reminders to a company&rsquo;s clients. It receives the recipient&rsquo;s address and the email content.</li>
            <li><strong>Google</strong> &mdash; Sign in with Google, Google Play subscriptions bought in the Android app, and Firebase Cloud Messaging, which delivers push notifications using your device&rsquo;s push token.</li>
            <li><strong>Apple</strong> &mdash; Sign in with Apple, App Store subscriptions bought in the iPhone app, and delivery of notifications to iPhones.</li>
            <li><strong>RevenueCat</strong> (US) &mdash; tracks the status of subscriptions bought in the iPhone and Android apps. It receives your company&rsquo;s ID and purchase information from Apple or Google.</li>
            <li><strong>Stripe</strong> (US) &mdash; checkout and billing for subscriptions bought on our website. Stripe receives your payment details directly.</li>
            <li><strong>Cloudflare</strong> &mdash; our domain and DNS, forwarding of email sent to our addresses, and storage for our encrypted backups.</li>
            <li><strong>GitHub</strong> (Microsoft, US) &mdash; runs our backup jobs. Each night for the database, and each week for uploaded files, the copy is made on a temporary GitHub-hosted machine, encrypted there and stored with Cloudflare; no backup copy is kept on GitHub after the job ends.</li>
            <li><strong>Vercel</strong> (US) &mdash; hosts our website, processes standard web logs including IP addresses, and counts page views without cookies.</li>
            <li><strong>Telegram</strong> &mdash; tells our team that someone submitted the demo form on our website. It receives no personal data: the details of the request reach us only by email.</li>
            <li><strong>Meta</strong> &mdash; the Meta pixel on our website only, as above. It is not in the app. <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a></li>
          </ul>
          <p>Our service providers may use your information only to provide their service to us, under contract terms that require them to protect it at least as well as this policy does, and none of them may use it for its own advertising. The exceptions act under their own terms and privacy policies: Apple and Google for purchases and sign-in made through them, and Meta for the website pixel.</p>
          <p>We may also disclose information if the law, a court or a government authority requires it, or if we believe it is necessary to protect the rights, property or safety of Stroyka, our users or the public.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "6. Where Your Data Is Processed",
      content: (
        <>
          <p>Your app data and files are stored in Germany (Supabase, on Amazon Web Services in Frankfurt). Stroyka is a US company, and several providers in section 5 are in the United States, so information is also accessed and processed in the US.</p>
          <p>For transfers from the EU, the EEA, Switzerland and the UK, we rely on the European Commission&rsquo;s Standard Contractual Clauses and the UK International Data Transfer Addendum, which are part of our <Link href="/dpa">Data Processing Addendum</Link> and of our providers&rsquo; data processing terms, and on the EU&ndash;US Data Privacy Framework (and its UK Extension) where a provider is certified under it. You can ask us for a copy at {SUPPORT}.</p>
          <p>When information is in another country, the courts, law enforcement and national security authorities of that country may be able to access it under its laws.</p>
          <p>Stroyka is not offered in countries or regions under comprehensive US sanctions (see our <Link href="/terms">Terms</Link>, section 9).</p>
        </>
      ),
    },
    {
      id: "data-isolation",
      title: "7. Who Can See Your Company’s Data",
      content: (
        <>
          <p>Each company&rsquo;s data is kept separate from every other company&rsquo;s at the database level, using Row Level Security policies:</p>
          <ul>
            <li>No user of one company can view or change another company&rsquo;s data.</li>
            <li>The separation is enforced by the database itself, not only by app code.</li>
          </ul>
          <p><strong>At Stroyka</strong>, we don&rsquo;t look at the contents of your company&rsquo;s records &mdash; for example entries, photos, messages or client details &mdash; except to help you when you ask us for support, to keep the service secure or fix a fault, or where the law requires. To run and improve Stroyka we do use account-level information about each company: its plan, sign-up date, how many records it has and when the app was last used, together with usage analytics if you agreed to them (section 2.2).</p>
        </>
      ),
    },
    {
      id: "storage-security",
      title: "8. Security, Backups and Breaches",
      content: (
        <>
          <p>8.1. Data is encrypted in transit (TLS) and encrypted at rest by our hosting provider.</p>
          <p>8.2. The database the app keeps on your phone for offline use is encrypted (SQLCipher / sqlite3mc), with keys kept in the phone&rsquo;s secure storage (Keychain on iPhone, Keystore on Android). Photos and videos waiting to upload are kept as ordinary files until they are sent, protected by your phone&rsquo;s own encryption.</p>
          <p>8.3. We make our own backups of the database (every night) and of uploaded files (every week). The backup jobs run on GitHub Actions: each copy is made on a temporary GitHub-hosted machine in the US, encrypted there, and stored only in encrypted form with Cloudflare. No backup copy is kept on GitHub after the job ends.</p>
          <p>8.4. We use role-based access, rate limiting, input validation and audit logging.</p>
          <p>8.5. No method of storage or transmission is completely secure, and we cannot guarantee absolute security.</p>
          <p>8.6. <strong>If something goes wrong.</strong> If we learn of a security breach affecting personal information we hold, we tell the companies affected without undue delay, and within 72 hours of becoming aware of it. We tell affected people and the authorities where the law requires &mdash; for example the data protection authorities within 72 hours where we are the controller under EU or UK law. We keep a record of every security incident.</p>
        </>
      ),
    },
    {
      id: "retention",
      title: "9. How Long We Keep Data, and Deleting It",
      content: (
        <>
          <p>9.1. <strong>While you use Stroyka</strong>, we keep your data for as long as your account and your company exist. Section 4 lists how long we keep each kind of information.</p>
          <p>9.2. <strong>Cancelling a paid plan does not delete anything.</strong> Your company moves to the Free plan and your data stays.</p>
          <p>9.3. <strong>Deleting your account (workers).</strong> In the app go to Profile &rarr; Settings &rarr; Privacy and data &rarr; Delete my account, or email {SUPPORT} from your account&rsquo;s email address (see <Link href="/delete-account">getstroyka.com/delete-account</Link>). Either way you are signed out and can no longer sign in. What else happens depends on the date.</p>
          <p><strong>From {DATE}, the work records you created for your company stay with your company.</strong> Your account and login, your contact details (phone), your push tokens, your notification settings, your location consent, and the GPS points recorded on your clock-ins and clock-outs are deleted at once. Your hours, costs and material purchases, receipts, trips, requests, daily logs, task messages, photos and videos are your company&rsquo;s business records: they stay with the company, shown under your name, the same as when a company removes a worker (9.6). Your company is responsible for them; employers often have to keep work and pay records by law. To have them deleted, ask your company: it can delete them in the app, and at its request we will remove them from our servers permanently.</p>
          <p><strong>Until {DATE}</strong> (in the app or by email):</p>
          <ul>
            <li><strong>At once:</strong> your login is removed (your email address and any Apple or Google sign-in), your name is replaced with &ldquo;Deleted user&rdquo;, your phone number and your in-app notifications are deleted, and your hours (with the GPS points recorded on them), costs and material purchases, trips, requests and daily logs disappear from the app.</li>
            <li><strong>Within 31 days:</strong> those records and the photos attached to them are permanently deleted from our servers, together with your push tokens, notification settings, pay rate and location consent.</li>
            <li><strong>Not deleted:</strong> receipts and their photos, your task messages and their photos and videos, and your days off. They stay with your company, shown as &ldquo;Deleted user&rdquo;, until the company deletes them or deletes the company. To have them deleted, ask your company, or ask us and we will pass your request to it (section 10).</li>
          </ul>
          <p>
            {/* remove when min app version ≥ 1.0.62 */}
            An app version older than 1.0.62 deletes as described under &ldquo;Until {DATE}&rdquo;, even after that date, until we retire those versions; to keep your records with your company, update the app first.</p>
          <p>9.4. <strong>Company owners.</strong> A company owner cannot delete only their own account. The owner deletes the whole company instead (9.5), or contacts us at {SUPPORT}.</p>
          <p>9.5. <strong>Deleting a company.</strong> The owner can delete the company in the app (Profile &rarr; Settings &rarr; Privacy and data &rarr; Delete my company). Everything is hidden from everyone in the company immediately, and within 31 days we permanently delete all of the company&rsquo;s data and files. Deleting a company does not cancel a subscription; cancel it separately (see our <Link href="/terms">Terms</Link>, section 7).</p>
          <p>9.6. <strong>If a company removes a worker</strong>, the work records that worker created stay with the company as its business records, shown under the worker&rsquo;s name, until the company deletes them or deletes the company. From {DATE} the same applies when a worker deletes their own account. A removed worker can still ask us to delete their account as in 9.3.</p>
          <p>9.7. <strong>Backups.</strong> Deleted data is not removed from existing backups straight away. It leaves them as those copies expire: database copies are kept for up to 7 months, and copies of files for up to 13 months.</p>
          <p>9.8. <strong>Analytics and error data</strong> are kept for {R.posthog} (PostHog) and {R.sentry} (Sentry). Support emails are kept for as long as we need them to help you and to keep a record of what we agreed.</p>
          <p>9.9. We may keep specific information longer where the law requires it, or to resolve a dispute or enforce our Terms, and only for as long as that need lasts.</p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "10. Your Choices and Rights",
      content: (
        <>
          <h3>Everyone</h3>
          <ul>
            <li><strong>See and correct:</strong> you can view your data in the app and update your details in Profile.</li>
            <li><strong>Download:</strong> Profile &rarr; Settings &rarr; Privacy and data &rarr; Download my data gives you a copy of your data. Bosses can also export reports (for example to PDF, CSV or Excel).</li>
            <li><strong>Delete:</strong> see section 9 and <Link href="/delete-account">getstroyka.com/delete-account</Link>.</li>
            <li><strong>Analytics:</strong> Profile &rarr; Settings &rarr; Privacy and data &rarr; Share usage analytics. On the website: Cookie settings at the bottom of any page.</li>
            <li><strong>Location:</strong> turn off Location at clock-in in the same screen, or in your phone&rsquo;s settings.</li>
            <li><strong>Emails from our founder:</strong> reply &ldquo;stop&rdquo;.</li>
          </ul>
          <p>Wherever you live, you can ask us to access, correct, delete or export your personal information, to stop using it for a purpose, or to withdraw a consent you gave. Write to {SUPPORT} with &ldquo;Privacy&rdquo; in the subject. It is free. We may ask you to confirm it is you. We answer within one month at the latest, or sooner where your local law sets a shorter time (section 11).</p>
          <p><strong>Records your company holds.</strong> If you are a worker or a client of a company that uses Stroyka and your request is about records that company keeps, you can ask the company directly. If you ask us, we pass your request to the company promptly (within 5 working days) and tell you we have done so; the company decides, and we help it carry out its decision.</p>
          <p><strong>Your right to object.</strong> Where we rely on our legitimate interests (section 4), you can object at any time, and we will stop unless we have compelling reasons that override your interests, or need the information for a legal claim. You can always stop our founder&rsquo;s emails by replying &ldquo;stop&rdquo;, and switch off analytics as above.</p>
          <p>We do not make decisions about you based solely on automated processing that have legal or similarly significant effects on you.</p>

          <h3>California residents (CCPA)</h3>
          <ul>
            <li><strong>Right to know:</strong> you may ask what personal information we have collected about you.</li>
            <li><strong>Right to delete:</strong> you may ask us to delete it, subject to legal exceptions.</li>
            <li><strong>Right to correct</strong> inaccurate information.</li>
            <li><strong>Sale and sharing:</strong> we do not sell personal information. The website Meta pixel (section 12) loads only if you accept it, and Reject or a Global Privacy Control signal turns it off.</li>
            <li><strong>Non-discrimination:</strong> we will not treat you differently for using these rights.</li>
          </ul>
          <p>To use these rights, email {SUPPORT}. We respond to verifiable requests within 45 days.</p>

          <h3>Users in the EU, EEA, Switzerland and the UK (GDPR)</h3>
          <ul>
            <li>Rights of access, correction, erasure and portability.</li>
            <li>Rights to restrict or object to processing.</li>
            <li>Right to withdraw consent at any time (for example to usage analytics), without affecting what was done before.</li>
            <li>Right to complain to your data protection authority (section 11).</li>
          </ul>
          <p>The legal basis for each purpose is in section 4. We answer within one month; for a complex request we may extend this by up to two more months and will tell you why.</p>
        </>
      ),
    },
    {
      id: "country",
      title: "11. Information for Specific Countries",
      content: (
        <>
          <ul>
            <li><strong>EU and EEA.</strong> {REPS} You can complain to the data protection authority where you live or work (<a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">list of authorities</a>).</li>
            <li><strong>United Kingdom.</strong> If you are unhappy with how we handled your information, write to us first: we acknowledge complaints within 30 days and tell you what we will do. You can also complain to the Information Commissioner&rsquo;s Office (<a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a>).</li>
            <li><strong>United States.</strong> We do not sell personal information. If a breach affects you, we notify you as your state&rsquo;s law requires. California rights are in section 10.</li>
            <li><strong>Mexico.</strong> This policy is our full privacy notice (<em>aviso de privacidad integral</em>). You can exercise your ARCO rights (access, rectification, cancellation and opposition) and revoke consent as in section 10; we reply within 20 days and carry out what we decided within 15 days after that. Authority: Secretaría Anticorrupción y Buen Gobierno.</li>
            <li><strong>Philippines.</strong> Our Data Protection Officer is the privacy contact in section 1. You can complain to the National Privacy Commission (<a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">privacy.gov.ph</a>).</li>
            <li><strong>Canada.</strong> We answer access requests within 30 days. You can complain to the Office of the Privacy Commissioner of Canada and, in Quebec, to the Commission d&rsquo;accès à l&rsquo;information. Information may be processed and accessed outside Canada (section 6).</li>
            <li><strong>India.</strong> We answer grievances within 90 days at the contact in section 1, and you can then complain to the Data Protection Board of India. You may nominate another person to exercise your rights if you die or become unable to.</li>
            <li><strong>Uruguay.</strong> You can complain to the Unidad Reguladora y de Control de Datos Personales.</li>
            <li><strong>Everywhere else.</strong> You can contact your local data protection authority.</li>
          </ul>
          <p><strong>Companies&rsquo; own duties.</strong> Where local law treats your company as the controller or operator of its workers&rsquo; and clients&rsquo; information, the company is responsible for the notices, consents and registrations that law requires &mdash; for example written consent from workers to use an outside service, or telling the data protection authority about location records. Our <Link href="/dpa">Data Processing Addendum</Link> sets out how we help.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "12. Cookies and Tracking",
      content: (
        <>
          <p>12.1. <strong>The app</strong> contains no advertising and does not track you across other companies&rsquo; apps or websites. Usage analytics in the app need your consent (section 2.2).</p>
          <p>12.2. <strong>Our website</strong> asks before it sets any optional cookie. Until you choose Accept in the cookie banner, neither PostHog nor the Meta pixel loads. Reject is as easy as Accept, and you can change your choice at any time with Cookie settings at the bottom of every page. If your browser sends a Global Privacy Control signal, we treat it as Reject unless you choose Accept yourself in Cookie settings.</p>
          <p>12.3. What the website sets:</p>
          <ul>
            <li><strong>sx_consent</strong> (necessary) &mdash; remembers your cookie choice. 180 days.</li>
            <li><strong>sx_geo</strong> (necessary) &mdash; your two-letter country code, used only to keep the Meta pixel off in the EU, the EEA and the UK. 1 day.</li>
            <li><strong>PostHog cookies (ph_&hellip;)</strong> (analytics, only after Accept) &mdash; tell visits apart so we can see how the site is used. Up to 1 year.</li>
            <li><strong>Meta pixel cookies (_fbp)</strong> (advertising, only after Accept, and never in the EU, the EEA, the UK, or when we cannot tell your country) &mdash; tell Meta that a visit or a sign-up click happened, so we can measure our ads. Up to 90 days.</li>
            <li>Vercel&rsquo;s page-view counting and speed measurement use no cookies.</li>
          </ul>
          <p>12.4. Browser tracking protection or an ad blocker will also stop the optional tools, and the site works normally without them.</p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "13. Third-Party Links",
      content: (
        <p>The service may link to other websites or services. We are not responsible for their privacy practices; please read their privacy policies.</p>
      ),
    },
    {
      id: "children",
      title: "14. Children’s Privacy",
      content: (
        <p>Stroyka is not intended for anyone under 18, and we do not knowingly collect personal information from children under 18. If we learn that we have, we will delete it.</p>
      ),
    },
    {
      id: "changes",
      title: "15. Changes to This Policy",
      content: (
        <>
          <p>15.1. We may update this policy. For material changes we will notify you by email or in the app at least 30 days before they take effect. If you keep using Stroyka after that date, the updated policy applies.</p>
          <p>15.2. <strong>From {DATE}</strong>, 15.1 is replaced by this rule: changes that reduce your rights or expand how we use your information still take effect at least 30 days after we notify you by email or in the app. Changes that the law requires, that fix a security problem, or that do not reduce your rights can take effect when we publish them; we still tell you about material ones. If you do not agree to a change, you can delete your account before it takes effect.</p>
          <p>15.3. <strong>This version.</strong> Published {LAST_UPDATED_EN}. It takes effect when published, except two changes that take effect on {DATE}: what deleting a worker account keeps (9.3 and 9.6) and the change-notice rule in 15.2. It adds: a table of legal bases and retention (4), how usage analytics now ask first (2.2), the notice before receipts are read by AI (3), our address and how to reach us from the EU and the UK (1, 11, 16), international transfers (6), who at Stroyka sees company data (7), breach notice (8.6), response times and complaint routes by country (10, 11), and the website cookie banner (12).</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "16. Contact Us",
      content: (
        <>
          <p>Questions, requests about your data, or concerns:</p>
          <p>
            Dalen Meridian LLC (d/b/a Stroyka)<br />
            {POSTAL_ADDRESS}<br />
            Email: {SUPPORT} (put &ldquo;Privacy&rdquo; in the subject line)<br />
            Website: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
          <p>{REPS}</p>
        </>
      ),
    },
  ],
};
