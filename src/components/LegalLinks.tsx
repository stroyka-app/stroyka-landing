"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "accessibility", href: "/accessibility" },
] as const;

/**
 * One quiet legal line (Privacy · Terms · Accessibility) for the routes that
 * deliberately skip the full site footer: /get (the ad landing) and /account.
 * Every page that loads analytics must link the privacy policy.
 */
export default function LegalLinks({ className = "" }: { className?: string }) {
  const t = useTranslations("footer");
  return (
    <nav aria-label={t("legalNavLabel")} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-site-paper/70">
        {LINKS.map((l, i) => (
          <li key={l.href} className="flex items-center gap-x-3">
            {/* A drawn dot, not a "·" glyph: decorative, so it stays faint
                without registering as low-contrast text. */}
            {i > 0 && <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-site-paper/30" />}
            <Link
              href={l.href}
              className="rounded-sm transition-colors duration-200 hover:text-site-vis focus-visible:text-site-vis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-4 focus-visible:ring-offset-site-night"
            >
              {t(l.key)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
