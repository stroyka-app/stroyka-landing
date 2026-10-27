import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const REQUEST = (
  <a href="mailto:support@getstroyka.com?subject=Delete%20my%20account">
    email us
  </a>
);

export const deleteAccountEn: LegalDoc = {
  title: "Delete Your Account",
  subtitle: "How to delete your Stroyka account or your company, what gets deleted, and when. You don’t need to sign in to use this page.",
  effectiveDate: "Last Updated: 26 October 2026",
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
          <p>When you delete your account, we delete <strong>your account and the records you created</strong>: your hours, costs and material purchases, trips, requests and daily logs.</p>
          <ul>
            <li><strong>Immediately:</strong> your records disappear from the app for everyone in your company, your name is shown as &ldquo;Deleted user&rdquo;, and you can no longer sign in.</li>
            <li><strong>Within 30 days:</strong> we permanently delete from our servers your login, your contact details, your push notification tokens, your clock-in location points, and your records and their photos.</li>
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
          <li><strong>If your employer removed you</strong> (instead of you deleting your own account), the work records you created stay with that company as its business records, under your name, until the company deletes them or deletes the company. You can still ask us to delete your account.</li>
          <li><strong>Payment records</strong> held by Apple or Stripe for subscriptions are kept by them under their own policies.</li>
          <li><strong>Legal requirements.</strong> We may keep specific information longer if the law requires it.</li>
        </ul>
      ),
    },
    {
      id: "subscriptions",
      title: "6. Subscriptions",
      content: (
        <p>Deleting your account or company <strong>does not cancel a subscription</strong>. Cancel an App Store subscription in your Apple ID settings. For a subscription bought on our website, cancel it from the billing screen in the app or email {SUPPORT}.</p>
      ),
    },
    {
      id: "questions",
      title: "7. Questions",
      content: (
        <p>Our <Link href="/privacy">Privacy Policy</Link> (section 8) has the full details. For anything else, write to {SUPPORT}.</p>
      ),
    },
  ],
};
