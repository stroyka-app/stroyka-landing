import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import { LAST_UPDATED_EN, NOTICE_EFFECTIVE_EN } from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_EN;
const REQUEST = (
  <a href="mailto:support@getstroyka.com?subject=Delete%20my%20account">
    email us
  </a>
);

export const deleteAccountEn: LegalDoc = {
  title: "Delete Your Stroyka Account",
  subtitle: "How to delete your Stroyka account or your company, what gets deleted, and when. You don’t need to sign in to use this page.",
  effectiveDate: `Last Updated: ${LAST_UPDATED_EN}`,
  sections: [
    {
      id: "in-the-app",
      title: "1. Delete It in the App",
      content: (
        <>
          <p>The fastest way is in the Stroyka app on your phone:</p>
          <ul>
            <li><strong>Workers:</strong> open <strong>Profile &rarr; Privacy and data &rarr; Delete my account</strong>, then confirm.</li>
            <li><strong>Company owners:</strong> open <strong>Profile &rarr; Privacy and data &rarr; Delete my company</strong>, then confirm. An owner&rsquo;s account can&rsquo;t be deleted on its own &mdash; deleting the company deletes it too.</li>
          </ul>
          <p>You are signed out as soon as the deletion is done.</p>
        </>
      ),
    },
    {
      id: "by-email",
      title: "2. Or Ask Us by Email",
      content: (
        <>
          <p>If you can&rsquo;t use the app, {REQUEST} at {SUPPORT}:</p>
          <ul>
            <li>Send it <strong>from the email address on your Stroyka account</strong>, so we know the request is yours.</li>
            <li>Use the subject <strong>&ldquo;Delete my account&rdquo;</strong>.</li>
            <li>Tell us your company&rsquo;s name. If you own the company, say whether you want the whole company deleted.</li>
            <li>If you signed in with Apple or Google, write from that Apple ID or Google email. If you can&rsquo;t, say so in your email and we&rsquo;ll find another way to confirm it&rsquo;s you.</li>
          </ul>
          <p>We reply to confirm, and we complete the deletion within 30 days of confirming the request.</p>
        </>
      ),
    },
    {
      id: "what-is-deleted",
      title: "3. What Is Deleted, and When",
      content: (
        <>
          <p>Deleting your account deletes your sign-in and your personal details. From {DATE}, the work you did for your company stays with your company, under your name.</p>
          <ul>
            <li><strong>Deleted:</strong> your account and login, your contact details (phone), your push notification tokens, your notification settings, your location consent, and the GPS points recorded on your clock-ins and clock-outs. In the app this happens at once: you are signed out and can no longer sign in.</li>
            <li><strong>From {DATE}, kept by your company, for its business and legal records:</strong> the work records you created for it &mdash; hours, costs and material purchases, receipts, trips, requests, daily logs, task messages, photos and videos. They stay with it, shown under your name, until your company deletes them or deletes the company; employers often have to keep work and pay records by law. Your company is responsible for them. To have them deleted, ask your company: it can delete them in the app, and at its request we&rsquo;ll remove them from our servers permanently.</li>
            <li><strong>Until {DATE}:</strong> deleting your account also deletes the work records you created. They disappear from the app at once and are permanently deleted from our servers within 30 days.</li>
            {/* remove when min app version ≥ 1.0.62 */}
            <li><strong>Older app versions:</strong> an app version older than 1.0.62 also deletes the records you created, even after {DATE}. To keep them with your company, update the app first.</li>
          </ul>
        </>
      ),
    },
    {
      id: "company",
      title: "4. Deleting a Whole Company",
      content: (
        <p>When a company owner deletes the company, everything in it is hidden from everyone immediately, and within 30 days we permanently delete all of the company&rsquo;s data and files &mdash; including its projects, work records, photos, clients and invoices.</p>
      ),
    },
    {
      id: "what-we-keep",
      title: "5. What We Keep, and for How Long",
      content: (
        <ul>
          <li><strong>Backups.</strong> Our encrypted backups are not changed after the fact. Deleted data leaves them as the copies expire: database copies within 6 months, copies of files within 1 year.</li>
          <li><strong>If your employer removed you</strong>, the work records you created stay with that company as its business records, under your name, until the company deletes them or deletes the company &mdash; from {DATE}, the same as when you delete your own account. You can still ask us to delete your account.</li>
          <li><strong>Payment records</strong> held by Apple, Google or Stripe for subscriptions are kept by them under their own policies.</li>
          <li><strong>Legal requirements.</strong> We may keep specific information longer if the law requires it.</li>
        </ul>
      ),
    },
    {
      id: "subscriptions",
      title: "6. Subscriptions",
      content: (
        <p>Deleting your account or company <strong>does not cancel a subscription</strong>. Cancel an App Store subscription in your Apple ID settings, and a Google Play subscription in Google Play &rsaquo; Payments &amp; subscriptions &rsaquo; Subscriptions. For a subscription bought on our website, cancel it from the billing screen in the app or email {SUPPORT}.</p>
      ),
    },
    {
      id: "questions",
      title: "7. Questions",
      content: (
        <p>Our <Link href="/privacy">Privacy Policy</Link> (section 9) has the full details. For anything else, write to {SUPPORT}.</p>
      ),
    },
  ],
};
