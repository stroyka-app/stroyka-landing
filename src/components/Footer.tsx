import Link from "next/link";
import { Apple, Play } from "lucide-react";
import Logo from "@/components/Logo";

const IOS_URL = process.env.NEXT_PUBLIC_IOS_APP_URL ?? "#";
const ANDROID_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL ?? "#";

const PRODUCT_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const COMPANY_LINKS = [
  { label: "Request Demo", href: "/demo" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer id="footer" className="relative">
      {/* Subtle top blend into the CTA section above — no hard divider line,
          just a soft shadow fading into midnight so the eye slides from the
          CTA band into the footer without a visible seam. */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

      <div className="bg-brand-midnight pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main grid — each column centers its own content so the footer
              reads as balanced across the bottom divider line, rather than
              left-hugging with ragged whitespace in each 25% slot. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-center md:text-left lg:text-center">
            {/* Brand column */}
            <div className="flex flex-col items-center md:items-start lg:items-center">
              <Logo variant="dark" size={32} />
              <p className="mt-4 text-sm text-brand-sage/60 leading-relaxed max-w-xs">
                Job costing, crew management, and supply tracking built for
                small construction teams.
              </p>
            </div>

            {/* Product column */}
            <div className="flex flex-col items-center md:items-start lg:items-center">
              <h3 className="font-heading text-sm font-semibold text-brand-sage-mist mb-4 uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div className="flex flex-col items-center md:items-start lg:items-center">
              <h3 className="font-heading text-sm font-semibold text-brand-sage-mist mb-4 uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div id="download" className="scroll-mt-24 flex flex-col items-center md:items-start lg:items-center">
              <h3 className="font-heading text-sm font-semibold text-brand-sage-mist mb-4 uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-3 mb-6">
                <li>
                  <a
                    href="mailto:hello@getstroyka.com"
                    className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors duration-200"
                  >
                    hello@getstroyka.com
                  </a>
                </li>
              </ul>

              <h3 className="font-heading text-sm font-semibold text-brand-sage-mist mb-3 uppercase tracking-wider">
                Get the app
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={IOS_URL}
                    aria-label="Download on the App Store"
                    className="group inline-flex items-center gap-2 text-sm text-brand-sage/60 hover:text-brand-sage transition-colors duration-200"
                  >
                    <Apple size={16} className="shrink-0" />
                    <span>
                      App Store
                      {IOS_URL === "#" && (
                        <span className="text-brand-sage/40 ml-1.5">
                          (soon)
                        </span>
                      )}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={ANDROID_URL}
                    aria-label="Get it on Google Play"
                    className="group inline-flex items-center gap-2 text-sm text-brand-sage/60 hover:text-brand-sage transition-colors duration-200"
                  >
                    <Play size={16} className="shrink-0" />
                    <span>
                      Google Play
                      {ANDROID_URL === "#" && (
                        <span className="text-brand-sage/40 ml-1.5">
                          (soon)
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar — stacked and centered so the divider above reads as
              the anchor line for the whole footer rather than a left-to-right
              "stretched" line with two distant endpoints. */}
          <div className="border-t border-brand-sage/10 pt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-brand-sage/40">
              &copy; {new Date().getFullYear()} Stroyka. All rights reserved.
            </p>
            <p className="text-xs text-brand-sage/40">
              Made for crews who build things
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
