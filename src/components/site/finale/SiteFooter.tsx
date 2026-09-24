"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import ProximityText from "../ui/ProximityText";

/** Same crawlable locale roots as the shared Footer (see its note). */
const LOCALE_ROOTS = [
  { locale: "en", href: "/", label: "English" },
  { locale: "es", href: "/es", label: "Español" },
  { locale: "ru", href: "/ru", label: "Русский" },
] as const;

const PRODUCT = [
  { key: "features", hash: "features" },
  { key: "howItWorks", hash: "how-it-works" },
  { key: "pricing", hash: "pricing" },
  { key: "faq", hash: "faq" },
] as const;

const COMPANY = [
  { key: "requestDemo", href: "/demo" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
] as const;

const head = "mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-site-paper/45";
const link = "text-[15px] text-site-paper/75 transition-colors duration-200 hover:text-site-vis";

/**
 * The site footer (every route — `@/components/Footer` re-exports it): the
 * product/company/contact links, store badges with tracking, the crawlable
 * locale roots, and a full-width STROYKA whose letters swell under the
 * cursor.
 */
export default function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const active = useLocale();
  const track = useCtaTracker("footer");
  const homeHash = (hash: string) => (active === "en" ? `/#${hash}` : `/${active}#${hash}`);

  return (
    <footer id="footer" className="relative overflow-hidden bg-site-night text-site-paper">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16">
          <div>
            <Logo variant="light" size={30} />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-site-paper/60">{t("tagline")}</p>
          </div>
          <div>
            <h3 className={head}>{t("product")}</h3>
            <ul className="space-y-3">
              {PRODUCT.map((l) => (
                <li key={l.hash}>
                  <a href={homeHash(l.hash)} className={link}>
                    {tn(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={head}>{t("company")}</h3>
            <ul className="space-y-3">
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={head}>{t("contact")}</h3>
            <a href="mailto:hello@getstroyka.com" className={link}>
              hello@getstroyka.com
            </a>
            <h3 className={`${head} mt-8`}>{t("getTheApp")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={IOS_APP_URL}
                  aria-label="Download on the App Store"
                  className={`inline-flex items-center gap-2.5 ${link}`}
                  onClick={() => track("store_badge_clicked", { store: "app_store" })}
                >
                  <AppleGlyph className="h-[15px] w-[15px] shrink-0" />
                  {t("appStore")}
                </a>
              </li>
              <li>
                <a
                  href={ANDROID_APP_URL}
                  aria-label="Get it on Google Play"
                  className={`inline-flex items-center gap-2.5 ${link}`}
                  onClick={() => track("store_badge_clicked", { store: "google_play" })}
                >
                  <GooglePlayGlyph className="h-[15px] w-[15px] shrink-0" />
                  {t("googlePlay")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-site-paper/10 pt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-site-paper/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Stroyka — {t("rights")}</p>
          <div className="flex items-center gap-5">
            <LanguageSwitcher placement="top" align="left" />
            <nav aria-label={t("languagesNavLabel")} className="hidden gap-3 sm:flex">
              {LOCALE_ROOTS.map(({ locale, href, label }) => (
                <a key={locale} href={href} hrefLang={locale} className="transition-colors hover:text-site-vis">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="mt-10 select-none whitespace-nowrap px-3 text-center font-flex text-[18.5vw] leading-[0.78] tracking-[-0.03em] text-site-vis md:mt-14"
      >
        <ProximityText text="STROYKA" base={220} peak={1000} radius={340} wdth={120} />
      </p>
    </footer>
  );
}
