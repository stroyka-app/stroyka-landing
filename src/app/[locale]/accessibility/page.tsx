import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlapText from "@/components/site/ui/FlapText";
import { localeAlternates, canonicalFor, ogLocale, ogAlternateLocales } from "@/i18n/alternates";

const PATH = "/accessibility";
const CONTACT_EMAIL = "support@getstroyka.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = canonicalFor(locale, PATH);
  return {
    title: { absolute: t("accessibilityTitle") },
    description: t("accessibilityDescription"),
    alternates: { canonical, languages: localeAlternates(PATH) },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("accessibilityTitle"),
      description: t("accessibilityDescription"),
      locale: ogLocale[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
  };
}

const h2 = "font-flex text-[22px] font-semibold leading-tight tracking-[-0.015em] [font-variation-settings:'wdth'_110] md:text-[26px]";
const body = "mt-4 text-[16px] leading-relaxed text-site-paper/75";

/**
 * Accessibility statement (WCAG 2.1 AA commitment, what changed, known
 * limitations, a contact with a response time). Plain and dated on purpose:
 * update `updated`, `doneTitle` and the lists in messages/*.json whenever a
 * review happens.
 */
export default async function AccessibilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("accessibilityPage");
  const done = t.raw("done") as string[];
  const limits = t.raw("limits") as string[];

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="relative bg-site-night pb-24 pt-32 text-site-paper focus:outline-none md:pb-36 md:pt-40">
        <article className="mx-auto max-w-[760px] px-5 md:px-10">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("eyebrow")}</p>
          <FlapText
            as="h1"
            immediate
            lines={[t("title")]}
            className="max-w-[16ch] font-flex text-[clamp(2.4rem,5.6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110] [overflow-wrap:anywhere]"
          />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/70">{t("updated")}</p>
          <p className="mt-8 text-[17.5px] leading-relaxed text-site-paper/80">{t("intro")}</p>

          <section className="mt-14 border-t border-site-paper/10 pt-10">
            <h2 className={h2}>{t("goalTitle")}</h2>
            <p className={body}>{t("goalBody")}</p>
          </section>

          <section className="mt-14 border-t border-site-paper/10 pt-10">
            <h2 className={h2}>{t("doneTitle")}</h2>
            <NumberedList items={done} />
          </section>

          <section className="mt-14 border-t border-site-paper/10 pt-10">
            <h2 className={h2}>{t("limitsTitle")}</h2>
            <NumberedList items={limits} />
          </section>

          <section className="mt-14 rounded-[26px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] sm:p-8 md:p-10">
            <h2 className={h2}>{t("contactTitle")}</h2>
            <p className={body}>
              {t.rich("contactBody", {
                email: (chunks) => (
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="rounded-sm font-medium text-site-vis underline decoration-site-vis/40 underline-offset-4 transition-colors hover:decoration-site-vis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-slab"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <p className="mt-4 text-[14.5px] leading-relaxed text-site-paper/70">{t("scope")}</p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {items.map((item, i) => (
        <li key={item} className="flex items-baseline gap-5">
          <span aria-hidden className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-site-vis">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[16px] leading-relaxed text-site-paper/75">{item}</span>
        </li>
      ))}
    </ol>
  );
}
