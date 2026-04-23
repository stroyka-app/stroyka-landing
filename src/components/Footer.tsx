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
    <footer id="footer" className="relative bg-bone text-ink">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10">
        {/* Colophon line — mono, Paysages-style */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-10 mb-16 border-b border-ink/10 font-mono text-[11px] tracking-[0.22em] uppercase text-brand-sage-mist/50">
          <span>Stroyka — The Field Journal · Vol. 01</span>
          <span>Austin, Texas · Est. 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col">
            <Logo variant="dark" size={30} />
            <p className="mt-5 text-[14px] text-brand-sage-mist/65 leading-relaxed max-w-xs">
              Job costing, crew management, and supply tracking built for small construction teams.
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-mono text-[11px] font-medium text-brand-sage-mist mb-5 tracking-[0.22em] uppercase">
              Product
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14.5px] text-brand-sage-mist/70 hover:text-ink transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-mono text-[11px] font-medium text-brand-sage-mist mb-5 tracking-[0.22em] uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14.5px] text-brand-sage-mist/70 hover:text-ink transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="download" className="scroll-mt-24 flex flex-col">
            <h3 className="font-mono text-[11px] font-medium text-brand-sage-mist mb-5 tracking-[0.22em] uppercase">
              Contact
            </h3>
            <ul className="space-y-3 mb-7">
              <li>
                <a
                  href="mailto:hello@getstroyka.com"
                  className="text-[14.5px] text-brand-sage-mist/70 hover:text-ink transition-colors duration-200"
                >
                  hello@getstroyka.com
                </a>
              </li>
            </ul>

            <h3 className="font-mono text-[11px] font-medium text-brand-sage-mist mb-5 tracking-[0.22em] uppercase">
              Get the app
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={IOS_URL}
                  aria-label="Download on the App Store"
                  className="group inline-flex items-center gap-2.5 text-[14.5px] text-brand-sage-mist/70 hover:text-ink transition-colors duration-200"
                >
                  <Apple size={15} className="shrink-0" />
                  <span>
                    App Store
                    {IOS_URL === "#" && (
                      <span className="text-brand-sage-mist/35 ml-1.5">
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
                  className="group inline-flex items-center gap-2.5 text-[14.5px] text-brand-sage-mist/70 hover:text-ink transition-colors duration-200"
                >
                  <Play size={15} className="shrink-0" />
                  <span>
                    Google Play
                    {ANDROID_URL === "#" && (
                      <span className="text-brand-sage-mist/35 ml-1.5">
                        (soon)
                      </span>
                    )}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark — editorial finale */}
        <div className="py-12 border-t border-ink/10">
          <p className="font-display text-[clamp(4rem,16vw,14rem)] leading-[0.9] tracking-[-0.04em] text-ink/85 select-none">
            Stroyka<span className="text-brand-sage-bright">.</span>
          </p>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-brand-sage-mist/45">
          <p>&copy; {new Date().getFullYear()} Stroyka — All rights reserved</p>
          <p>Made for crews who build things</p>
        </div>
      </div>
    </footer>
  );
}
