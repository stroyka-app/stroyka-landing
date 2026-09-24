import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlapText from "@/components/site/ui/FlapText";
import VisButton from "@/components/site/ui/VisButton";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  description: "Your plan hasn't changed. You can subscribe anytime.",
  robots: { index: false, follow: false },
};

export default async function CancelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "getStarted" });
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[86svh] flex-col justify-center overflow-hidden bg-site-night pb-16 pt-32 text-site-paper md:pb-24 md:pt-40">
        {/* Low morning bloom — the home's sky, kept off the top edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-20%] top-[8%] h-[560px] w-[820px] max-w-none opacity-50"
          style={{ background: "radial-gradient(closest-side, var(--sky-top), transparent)" }}
        />

        <div className="relative mx-auto w-full max-w-[1200px] px-5 md:px-10">
          <div className="max-w-3xl">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">{t("noWorries")}</p>
            <FlapText
              as="h1"
              immediate
              lines={[t("planUnchanged")]}
              className="max-w-[14ch] font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110] [overflow-wrap:anywhere]"
            />
            <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-site-paper/70">{t("subscribeAnytime")}</p>

            <div className="mt-10 border-t border-site-paper/10 pt-10">
              <VisButton href="/#pricing" size="lg">
                {t("backToPricing").replace(/\s*[←→]\s*/g, " ").trim()}
              </VisButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
