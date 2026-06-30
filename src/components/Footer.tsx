"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Apple, Play } from "lucide-react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const IOS_URL = process.env.NEXT_PUBLIC_IOS_APP_URL ?? "#";
const ANDROID_URL = process.env.NEXT_PUBLIC_ANDROID_APP_URL ?? "#";

type NavKey = "features" | "howItWorks" | "pricing" | "faq";
type FooterCompanyKey = "requestDemo" | "privacy" | "terms";

const PRODUCT_LINKS: Array<{ key: NavKey; hash: string }> = [
  { key: "features", hash: "features" },
  { key: "howItWorks", hash: "how-it-works" },
  { key: "pricing", hash: "pricing" },
  { key: "faq", hash: "faq" },
];

const COMPANY_LINKS: Array<{ key: FooterCompanyKey; href: string }> = [
  { key: "requestDemo", href: "/demo" },
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const active = useLocale();
  const homeHash = (hash: string) =>
    active === "en" ? `/#${hash}` : `/${active}#${hash}`;

  return (
    <footer id="footer" className="relative bg-[#2B3D30] text-bone">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10">
        {/* Colophon line — mono, Paysages-style */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-10 mb-16 border-b border-bone/12 font-mono text-[11px] tracking-[0.22em] uppercase text-bone/50">
          <span>{t("colophonLeft")}</span>
          <span>{t("colophonRight")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col">
            <Logo variant="dark" size={30} />
            <p className="mt-5 text-[14px] text-bone/65 leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
          </div>

          <div className="flex flex-col">
            <h3 className="font-mono text-[11px] font-medium text-bone mb-5 tracking-[0.22em] uppercase">
              {t("product")}
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href={homeHash(link.hash)}
                    className="text-[14.5px] text-bone/70 hover:text-brand-sage-bright transition-colors duration-200"
                  >
                    {tn(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="font-mono text-[11px] font-medium text-bone mb-5 tracking-[0.22em] uppercase">
              {t("company")}
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-[14.5px] text-bone/70 hover:text-brand-sage-bright transition-colors duration-200"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="download" className="scroll-mt-24 flex flex-col">
            <h3 className="font-mono text-[11px] font-medium text-bone mb-5 tracking-[0.22em] uppercase">
              {t("contact")}
            </h3>
            <ul className="space-y-3 mb-7">
              <li>
                <a
                  href="mailto:hello@getstroyka.com"
                  className="text-[14.5px] text-bone/70 hover:text-brand-sage-bright transition-colors duration-200"
                >
                  hello@getstroyka.com
                </a>
              </li>
            </ul>

            <h3 className="font-mono text-[11px] font-medium text-bone mb-5 tracking-[0.22em] uppercase">
              {t("getTheApp")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={IOS_URL}
                  aria-label="Download on the App Store"
                  className="group inline-flex items-center gap-2.5 text-[14.5px] text-bone/70 hover:text-brand-sage-bright transition-colors duration-200"
                >
                  <Apple size={15} className="shrink-0" />
                  <span>
                    {t("appStore")}
                    {IOS_URL === "#" && (
                      <span className="text-bone/35 ml-1.5">
                        ({t("soon")})
                      </span>
                    )}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={ANDROID_URL}
                  aria-label="Get it on Google Play"
                  className="group inline-flex items-center gap-2.5 text-[14.5px] text-bone/70 hover:text-brand-sage-bright transition-colors duration-200"
                >
                  <Play size={15} className="shrink-0" />
                  <span>
                    {t("googlePlay")}
                    {ANDROID_URL === "#" && (
                      <span className="text-bone/35 ml-1.5">
                        ({t("soon")})
                      </span>
                    )}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark — editorial finale */}
        <div className="py-12 border-t border-bone/12">
          <p className="font-display text-[clamp(4rem,16vw,14rem)] leading-[0.9] tracking-[-0.04em] text-bone/90 select-none">
            Stroyka<span className="text-brand-sage-bright">.</span>
          </p>
        </div>
      </div>

      {/* Light legal plinth — a bone base under the dark footer body.
          Purpose: iOS Safari's bottom URL bar is frosted glass that blurs the
          page surface directly behind it. Over the dark green footer it bakes
          into pale sage; over THIS light bone strip it frosts clean, the way
          every light section does (the Slack effect — Slack's page is light
          where its bar sits). min-h is kept ≥ the iOS toolbar's overlap so the
          bar only ever samples bone, not the green above. Reads as a
          conventional light legal bar on desktop. pb safe-area keeps the bone
          flush to the very bottom edge under the home indicator. */}
      <div className="bg-bone text-ink">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 min-h-[132px] py-9 pb-[calc(2.25rem+env(safe-area-inset-bottom,0px))] flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-ink/55">
          <p>&copy; {new Date().getFullYear()} Stroyka — {t("rights")}</p>
          <div className="flex items-center gap-5">
            <LanguageSwitcher placement="top" align="left" tone="onLight" />
            <p className="hidden sm:block">{t("madeFor")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
