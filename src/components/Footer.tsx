import Link from "next/link";
import Logo from "@/components/Logo";

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
      {/* Top gradient separator — thin glowing line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-forest/50 to-transparent" />
      {/* Soft glow bleeding down from the separator */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-forest/5 to-transparent pointer-events-none" />

      <div className="bg-brand-midnight pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Logo variant="dark" size={32} />
              <p className="mt-4 text-sm text-brand-sage/60 leading-relaxed max-w-xs">
                Job costing, crew management, and supply tracking built for
                small construction teams.
              </p>
            </div>

            {/* Product column */}
            <div>
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
            <div>
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
            <div>
              <h3 className="font-heading text-sm font-semibold text-brand-sage-mist mb-4 uppercase tracking-wider">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:hello@getstroyka.com"
                    className="text-sm text-brand-sage/60 hover:text-brand-sage transition-colors duration-200"
                  >
                    hello@getstroyka.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-brand-sage/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
