import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Stroyka",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl font-heading font-bold mb-8">Terms of Service</h1>
          <p className="text-xs text-brand-sage-mist/50 mb-6">
            Effective Date: [DATE YOU LAUNCH] · Last Updated: April 2026
          </p>

          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            Welcome to Stroyka. Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using our platform. By creating an account or using any part of the Stroyka service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">1. Definitions</h2>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Stroyka,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;</strong> refers to Stroyka LLC, a Texas limited liability company, and the Stroyka software application and related services.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Service&rdquo;</strong> refers to the Stroyka cloud-based construction job costing and crew management software platform, accessible via web browser and mobile applications.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;</strong> refers to the individual or business entity that creates an account and subscribes to the Service.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Company Account&rdquo;</strong> refers to the organizational account created within the Service, under which all projects, users, and data are grouped.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Boss&rdquo;</strong> refers to a user with administrative privileges within a Company Account, including the ability to manage projects, invite workers, approve requests, and access billing.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Worker&rdquo;</strong> refers to a user invited to a Company Account by a Boss, with limited permissions to log time, submit purchase records, and complete assigned tasks.</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc"><strong>&ldquo;Content&rdquo;</strong> refers to all data, text, images, photos, files, and other information uploaded, submitted, or generated through the Service.</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">2. Account Registration and Eligibility</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">2.1. You must be at least 18 years old and have the legal authority to enter into these Terms on behalf of yourself or the business entity you represent.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">2.2. When creating an account, you must provide accurate and complete information, including a valid email address, your name, and your company name.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">2.3. You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activity that occurs under your account.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">2.4. Each Company Account is intended for a single business entity. You may not share a Company Account across multiple unrelated businesses.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">2.5. The Boss who creates the Company Account is the account owner and is responsible for all users they invite and all activity within the Company Account.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">3. Service Description</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">3.1. Stroyka provides a cloud-based platform for small construction crews to track job costs, manage crew timesheets, log material purchases, handle supply requests, assign tasks, and generate financial reports across active construction projects.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">3.2. The Service includes offline functionality. Data entered while offline is stored locally on the device and synchronized with our servers when an internet connection is restored.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">3.3. We may update, modify, or enhance the Service from time to time. We will make reasonable efforts to maintain backward compatibility, but we reserve the right to change features, APIs, or interfaces with reasonable notice.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">4. Data Ownership and Portability</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">4.1. You own your data. All Content that you or your workers upload, enter, or generate through the Service remains your property. Stroyka does not claim any ownership rights over your Content.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">4.2. You grant Stroyka a limited, non-exclusive license to store, process, transmit, and display your Content solely for the purpose of providing the Service to you.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">4.3. You may export your data at any time using the built-in CSV and PDF export features. We believe your data should always be accessible to you, without restriction.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">4.4. Upon cancellation of your subscription, your data will remain accessible and exportable for 30 days. After 30 days, your data will be permanently deleted from our servers and cannot be recovered.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">5. Data Isolation and Security</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.1. Each Company Account&apos;s data is logically isolated from all other Company Accounts. No user from one company can access, view, or modify another company&apos;s data.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.2. Data isolation is enforced at the database level through Row Level Security (RLS) policies. This is not a feature that can be toggled off — it is a fundamental architectural constraint.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.3. We use industry-standard encryption for data in transit (TLS 1.2+) and at rest. Local offline data is encrypted on device.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">5.4. While we take security seriously and implement best practices, no system is perfectly secure. We cannot guarantee absolute security and are not liable for unauthorized access resulting from factors beyond our reasonable control.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">6. Subscription, Billing, and Payments</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.1. Stroyka offers a 14-day free trial. No credit card is required to start a trial. During the trial, you have full access to all features of your selected plan.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.2. After the trial period, you must subscribe to a paid plan to continue using the Service. If you do not subscribe, your account will enter a read-only state. You will still be able to export your data for 30 days.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.3. Subscription fees are billed monthly or annually in advance, depending on the billing cycle you select. All fees are quoted and charged in US Dollars (USD).</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.4. We use Stripe as our payment processor. Your payment information is handled directly by Stripe and is never stored on our servers. Stripe&apos;s terms of service and privacy policy apply to payment processing.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">6.5. We reserve the right to change our pricing with 30 days&apos; written notice. Price changes will not apply to your current billing cycle. Grandfathered pricing (e.g., early adopter rates) will be honored for as long as your subscription remains active and in good standing.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">7. Cancellation and Refunds</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">7.1. You may cancel your subscription at any time through the billing settings in the app or by contacting us at support@getstroyka.com.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">7.2. Upon cancellation, your subscription remains active until the end of your current billing period. You will not be charged again after cancellation.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">7.3. We do not offer prorated refunds for partial billing periods. If you cancel mid-month, you retain access until the end of that month.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">7.4. After your subscription ends, your data remains accessible and exportable for 30 days. After 30 days, all data associated with your Company Account will be permanently deleted.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">8. Acceptable Use</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">You agree not to:</p>
          <ul className="mb-4">
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Use the Service for any unlawful purpose or in violation of any applicable local, state, national, or international law</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Attempt to access another Company Account&apos;s data or circumvent data isolation controls</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Use the Service to store or transmit malicious code, viruses, or harmful content</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Resell, sublicense, or redistribute access to the Service without our written consent</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Use automated means (bots, scrapers, etc.) to access the Service beyond its intended use</li>
            <li className="text-sm text-brand-sage-mist/75 leading-relaxed mb-2 ml-4 list-disc">Upload content that infringes on the intellectual property rights of others</li>
          </ul>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">9. Service Availability</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">9.1. We strive to maintain high availability of the Service but do not guarantee any specific uptime percentage. We do not offer a formal Service Level Agreement (SLA) at this time.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">9.2. The Service may be temporarily unavailable due to scheduled maintenance, updates, or unforeseen technical issues. We will make reasonable efforts to notify users of planned downtime in advance.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">9.3. The offline functionality of the Service is designed to allow continued use during internet outages. Data entered offline will sync when connectivity is restored.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">10. Intellectual Property</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">10.1. The Stroyka platform, including its software, design, logos, documentation, and all related intellectual property, is owned by Stroyka LLC and is protected by applicable copyright, trademark, and other intellectual property laws.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">10.2. These Terms grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for your internal business purposes during the term of your subscription.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">10.3. You may not copy, modify, distribute, sell, or create derivative works based on the Service or any part thereof.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">11. Limitation of Liability</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">11.1. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STROYKA LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">11.2. OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO STROYKA IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">11.3. The Service is provided for business cost-tracking and crew management purposes. It is not a substitute for professional accounting, legal, or financial advice. You are responsible for verifying the accuracy of all data and reports generated by the Service.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">12. Indemnification</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            You agree to indemnify, defend, and hold harmless Stroyka LLC, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising out of or related to your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
          </p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">13. Modifications to Terms</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">13.1. We may update these Terms from time to time. When we make material changes, we will notify you by email or through the Service at least 30 days before the changes take effect.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">13.2. Your continued use of the Service after the effective date of revised Terms constitutes your acceptance of the changes. If you do not agree with the revised Terms, you may cancel your subscription before the changes take effect.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">14. Governing Law and Dispute Resolution</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">14.1. These Terms are governed by and construed in accordance with the laws of the State of Texas, United States of America, without regard to its conflict of law provisions.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">14.2. Any dispute arising out of or relating to these Terms or the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, the dispute shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in the State of Texas.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">14.3. Nothing in this section prevents either party from seeking injunctive or other equitable relief in a court of competent jurisdiction.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">15. Termination</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">15.1. We may suspend or terminate your access to the Service if you violate these Terms, fail to pay subscription fees, or engage in activity that we reasonably believe is harmful to the Service, other users, or our business.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">15.2. Upon termination for cause, you will have 30 days to export your data unless the termination is due to illegal activity or a violation of Section 8 (Acceptable Use), in which case access may be terminated immediately.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">16. Miscellaneous</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">16.1. <strong>Entire Agreement.</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and Stroyka LLC regarding the Service.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">16.2. <strong>Severability.</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">16.3. <strong>Waiver.</strong> The failure of Stroyka to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">16.4. <strong>Assignment.</strong> You may not assign or transfer your rights under these Terms without our prior written consent. We may assign our rights and obligations without restriction.</p>

          <h2 className="text-xl font-heading font-semibold mt-10 mb-4">17. Contact Information</h2>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            If you have questions about these Terms, please contact us:
          </p>
          <p className="text-sm text-brand-sage-mist/75 leading-relaxed mb-4">
            Stroyka LLC<br />
            Email: <a href="mailto:support@getstroyka.com" className="underline">support@getstroyka.com</a><br />
            Website: <a href="https://getstroyka.com" className="underline">https://getstroyka.com</a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
