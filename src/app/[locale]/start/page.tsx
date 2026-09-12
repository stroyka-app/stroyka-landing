import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { localeAlternates, canonicalFor, ogLocale } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";
import StartCta from "./StartCta";
import reportShot from "../../../../public/start/report.jpg";

/**
 * /start: the paid landing for Facebook and Instagram traffic.
 *
 * The brief is one number: content on screen in under 0.8 s from a cold tap
 * inside the in-app browser. So this page is what the home page is not: a
 * server component, statically prerendered, no video, no three.js, no lenis,
 * no framer-motion, no curtain, no cursor dot. The only client JS beyond the
 * framework runtime is the CTA href island (StartCta). Motion chrome from the
 * locale layout is skipped for this route by SiteChrome.
 *
 * noindex: it repeats the home page's intent for a different entry channel,
 * and the home page is the one that should rank.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "start" });
  const canonical = canonicalFor(locale, "/start");
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical, languages: localeAlternates("/start") },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("metaTitle"),
      description: t("metaDescription"),
      locale: ogLocale[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/og-image.png"],
    },
  };
}

/** Same surface as ui/Button `primary lg`, without the framer wrapper. */
const CTA_CLASS =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-brand-deep px-8 py-4 font-heading text-[16px] font-semibold tracking-wide text-bone transition-colors hover:bg-brand-midnight-dark";

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-[3px] h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="#4B5F4E"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

export default async function StartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("start");
  const legalPrefix = locale === "en" ? "" : `/${locale}`;

  return (
    <main className="min-h-svh">
      {/* Forest crown: the hero's top tones (#34453A to #4B5F4E), so the
          iOS status zone (#485348, globals.css) reads as the page continuing. */}
      <section
        className="px-6 pb-14 pt-[calc(env(safe-area-inset-top,0px)+2.25rem)] sm:pt-14 lg:pb-20"
        style={{ background: "linear-gradient(180deg, #34453A 0%, #3E5043 55%, #4B5F4E 100%)" }}
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-bone">
            Stroyka
          </p>
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-16">
            <div>
              <p className="mb-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-brand-sage-bright">
                {t("kicker")}
              </p>
              <h1 className="mb-6 max-w-[14ch] font-display text-[clamp(2.6rem,9vw,5.25rem)] font-light leading-[0.96] tracking-[-0.025em] text-bone">
                {t("h1")}
              </h1>
              <p className="mb-8 max-w-xl text-[17px] leading-[1.55] text-bone/85 lg:text-lg">
                {t("line")}
              </p>
              <div className="hidden lg:block">
                <StartCta locale={locale} label={t("cta")} className={CTA_CLASS} />
              </div>
            </div>

            {/* The screenshot. Height-capped on phones so the CTA below it
                stays inside the first screen; the crop keeps the budget line
                and the money numbers at the top where they show. */}
            <figure className="mx-auto mt-2 w-full max-w-[400px] lg:mt-0">
              <div className="max-h-[44svh] overflow-hidden rounded-[22px] border border-bone/25 shadow-[0_30px_80px_-30px_rgba(10,18,12,0.8)] lg:max-h-none">
                <Image
                  src={reportShot}
                  alt={t("imageAlt")}
                  width={960}
                  height={1385}
                  priority
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="block h-auto w-full object-cover object-top"
                />
              </div>
            </figure>

            <div className="mt-8 lg:hidden">
              <StartCta locale={locale} label={t("cta")} className={CTA_CLASS} />
            </div>
          </div>
        </div>
      </section>

      <section className="page-surface px-6 py-12 lg:py-16">
        <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3 sm:gap-8">
          {(["bullet1", "bullet2", "bullet3"] as const).map((key) => (
            <li key={key} className="flex items-start gap-3 text-[16px] leading-snug text-ink">
              <Check />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="page-surface px-6 pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] pt-4">
        <p className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/10 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          <span>&copy; {new Date().getFullYear()} Stroyka</span>
          <a href={`${legalPrefix}/privacy`} className="underline-offset-4 hover:text-ink hover:underline">
            {t("privacy")}
          </a>
          <a href={`${legalPrefix}/terms`} className="underline-offset-4 hover:text-ink hover:underline">
            {t("terms")}
          </a>
        </p>
      </footer>
    </main>
  );
}
