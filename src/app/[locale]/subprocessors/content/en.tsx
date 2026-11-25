import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import { LAST_UPDATED_EN } from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;

export const subprocessorsEn: LegalDoc = {
  title: "Sub-processors",
  subtitle: "The companies that process data for Stroyka: what each one does, what it receives, and where.",
  effectiveDate: `Last Updated: ${LAST_UPDATED_EN}`,
  sections: [
    {
      id: "customer-data",
      title: "1. Providers That Handle Your Company’s Records",
      content: (
        <>
          <p>These sub-processors process the records your company keeps in Stroyka, on your company&rsquo;s behalf, under our <Link href="/dpa">Data Processing Addendum</Link>.</p>
          <ul>
            <li><strong>Supabase</strong> &mdash; database, sign-in, file storage and server functions. Receives: all app data and files. Location: data stored in Frankfurt, Germany; US company.</li>
            <li><strong>Amazon Web Services</strong> &mdash; the cloud infrastructure Supabase runs on. Receives: all app data and files, stored for Supabase. Location: Frankfurt, Germany.</li>
            <li><strong>Anthropic</strong> &mdash; reads receipt photos and shopping lists, only when a user chooses to scan and has allowed it. Receives: the photo or list text being scanned. Location: United States.</li>
            <li><strong>Resend</strong> &mdash; sends email: invoices and payment reminders to your clients, worker invitations, sign-in emails. Receives: recipient addresses and the email content. Location: United States.</li>
            <li><strong>Sentry</strong> &mdash; error and crash reports from the apps. Receives: error details, device information and user, company and role IDs; an error report can include part of the record involved. Location: United States.</li>
            <li><strong>Google (Firebase Cloud Messaging)</strong> &mdash; delivers push notifications to Android phones. Receives: the device&rsquo;s push token and the notification text. Location: United States and global.</li>
            <li><strong>Apple (Apple Push Notification service)</strong> &mdash; delivers push notifications to iPhones. Receives: the device&rsquo;s push token and the notification text. Location: United States and global.</li>
            <li><strong>Cloudflare</strong> &mdash; stores our encrypted backups. Receives: encrypted copies of the database and files (the keys stay with us). Location: United States and global.</li>
          </ul>
        </>
      ),
    },
    {
      id: "our-data",
      title: "2. Providers We Use for Our Own Purposes",
      content: (
        <>
          <p>For these, Stroyka decides what is processed and why, as our <Link href="/privacy">Privacy Policy</Link> describes. They do not receive the contents of your company&rsquo;s records.</p>
          <ul>
            <li><strong>PostHog</strong> &mdash; usage analytics for the apps and the website, only with consent. Receives: screens and features used, user, company and role IDs, IP address. Location: United States.</li>
            <li><strong>Stripe</strong> &mdash; checkout and billing for subscriptions bought on our website. Receives: billing details and payment information. Location: United States.</li>
            <li><strong>RevenueCat</strong> &mdash; subscription status for purchases in the iPhone and Android apps. Receives: company ID and purchase information from Apple or Google. Location: United States.</li>
            <li><strong>Apple</strong> &mdash; App Store subscriptions and Sign in with Apple. Location: United States.</li>
            <li><strong>Google</strong> &mdash; Google Play subscriptions and Sign in with Google. Location: United States.</li>
            <li><strong>Cloudflare</strong> &mdash; our domain, DNS and the forwarding of email sent to our addresses. Location: United States and global.</li>
            <li><strong>Vercel</strong> &mdash; hosts our website; web logs including IP addresses; page-view counts without cookies. Location: United States and global.</li>
            <li><strong>Meta</strong> &mdash; the Meta pixel on our website, only if a visitor accepts cookies and never in the EU, the EEA or the UK. Location: United States.</li>
            <li><strong>Telegram</strong> &mdash; notifies our team when someone submits the demo form on our website. Receives: the details entered in the form. Location: United Arab Emirates and global.</li>
          </ul>
        </>
      ),
    },
    {
      id: "safeguards",
      title: "3. Safeguards",
      content: (
        <>
          <p>Each provider in section 1 may use the data only to provide its service to us, under data protection terms that protect it at least as well as our Privacy Policy and Data Processing Addendum. So may those in section 2, except Apple and Google for purchases and sign-in made through them, Meta and Telegram, which act under their own terms and privacy policies. For providers outside the EEA, the UK and Switzerland, transfers rely on the European Commission&rsquo;s Standard Contractual Clauses (with the UK Addendum) in that provider&rsquo;s terms, or on the EU&ndash;US Data Privacy Framework where the provider is certified under it.</p>
        </>
      ),
    },
    {
      id: "changes",
      title: "4. Changes to This List",
      content: (
        <>
          <p>We email company owners at least 30 days before we add or replace a provider in section 1, and update this page. A company can object as our <Link href="/dpa">Data Processing Addendum</Link> (section 6) describes.</p>
          <p>To be told about changes even if you are not a company owner, email {SUPPORT} with the subject &ldquo;Sub-processor updates&rdquo;.</p>
        </>
      ),
    },
  ],
};
