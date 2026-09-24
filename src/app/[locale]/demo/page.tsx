import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import FlapText from "@/components/site/ui/FlapText";
import { localeAlternates, canonicalFor, ogLocale, ogAlternateLocales } from "@/i18n/alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = canonicalFor(locale, "/demo");
  return {
    title: { absolute: t("demoTitle") },
    description: t("demoDescription"),
    alternates: { canonical, languages: localeAlternates("/demo") },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("demoTitle"),
      description: t("demoDescription"),
      locale: ogLocale[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("demoTitle"),
      description: t("demoDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-site-night pb-16 pt-32 text-site-paper md:pb-24 md:pt-40">
        {/* A low morning bloom behind the form — the home's sky, kept off the
            top edge so the status zone stays bone (iOS chrome invariant). */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-20%] top-[12%] h-[720px] w-[900px] max-w-none opacity-55"
          style={{ background: "radial-gradient(closest-side, var(--sky-top), transparent)" }}
        />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Left: the proposition, then what happens after you send it. */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("eyebrow")}</p>
            <FlapText
              as="h1"
              immediate
              lines={[t("title")]}
              className="max-w-[14ch] font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110] [overflow-wrap:anywhere]"
            />
            <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-site-paper/70">{t("subtitle")}</p>

            <div className="mt-12 hidden border-t border-site-paper/10 pt-8 lg:block">
              <NextSteps t={t} />
            </div>
          </div>

          {/* Right: the form, on a raised slab. */}
          <div>
            <div className="rounded-[26px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] sm:p-8 md:rounded-[30px] md:p-10">
              <DemoForm />
            </div>
            <div className="mt-12 lg:hidden">
              <NextSteps t={t} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** "What happens next" — three numbered promises and the fine print. */
function NextSteps({ t }: { t: Awaited<ReturnType<typeof getTranslations<"demo">>> }) {
  return (
    <>
      <h2 className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55">{t("nextTitle")}</h2>
      <ol className="space-y-5">
        {(["next1", "next2", "next3"] as const).map((key, i) => (
          <li key={key} className="flex items-baseline gap-5">
            <span className="font-mono text-[11px] tabular-nums tracking-[0.1em] text-site-vis">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-flex text-[18px] font-medium leading-snug tracking-[-0.01em] md:text-[19px]">
              {t(key)}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-8 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-site-paper/45">
        {t("nextNote")}
      </p>
    </>
  );
}
