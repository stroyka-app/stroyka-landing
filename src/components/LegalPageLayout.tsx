"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Link2, Check, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  effectiveDate: string;
  sections: LegalSection[];
}

/**
 * A legal page, set as a DOCUMENT rather than a viewer.
 *
 * It used to hold `useState(sections[0].id)` and render only the active
 * section, which meant the other eleven existed nowhere: you could not Ctrl-F
 * the privacy policy, printing gave you section one, the Wayback Machine
 * archived section one, and a crawler or a compliance check saw section one.
 * We found it the hard way on 2026-09-22 — verifying a published change to
 * section 8 meant reading the deployed JavaScript bundle, because the served
 * HTML did not contain it.
 *
 * Everything is now in the DOM on every render. Desktop stacks the sections
 * and the sidebar scrolls you to them; mobile keeps the accordion, but as a
 * native <details>, whose contents browsers search and auto-expand on a
 * find-in-page match. Print forces every section open (globals.css).
 */
export default function LegalPageLayout({
  title,
  subtitle,
  effectiveDate,
  sections,
}: LegalPageLayoutProps) {
  const t = useTranslations("legal");
  const locale = useLocale();
  const showNotice = locale !== "en";
  const reduced = useReducedMotion();

  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  // Reading progress across the document body only — a rail that fills while
  // you are still in the header reads as broken.
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll-spy. The pill follows the reader instead of the reader driving it.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id.replace("section-", ""));
        }
      },
      // Top third of the viewport: a section counts as "being read" when its
      // heading has reached where a person's eyes actually are.
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const copyAnchor = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}#${id}`,
      );
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard can be denied; the anchor still works as a plain link.
    }
  };

  const scrollTo = (id: string) => {
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />

      {/* Reading progress — a hairline, not a loading bar. */}
      <motion.div
        aria-hidden
        style={{ scaleX: reduced ? 1 : progress }}
        className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-gradient-to-r from-brand-forest via-brand-sage to-brand-sage/40"
      />

      <main className="relative min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        {/* Soft sage vignette top-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 w-[55vw] h-[55vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 15% 15%, rgba(184,212,189,0.28), transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-14">
            <FadeIn>
              <SectionLabel>{t("eyebrow")}</SectionLabel>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-3">
                {title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-[15px] text-ink-soft mb-1.5 max-w-xl">
                {subtitle}
              </p>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-muted">
                {effectiveDate}
              </p>
            </FadeIn>
          </div>

          {/* English-only notice for non-en locales */}
          {showNotice && (
            <div className="mb-10 rounded-2xl border border-brand-sage/40 bg-brand-sage/8 px-6 py-5">
              <p className="font-display text-[15px] font-medium text-ink mb-1.5">
                {t("englishOnlyTitle")}
              </p>
              <p className="text-[14px] text-ink-soft leading-relaxed">
                {t("englishOnlyBody")}
              </p>
            </div>
          )}

          {/* ── ONE tree, styled two ways ──────────────────────────────
              Rendering a mobile accordion AND a desktop stack put every
              paragraph in the HTML twice, and left PRINT undecided: which
              copy reaches the paper depends on the print viewport width.
              Print is most of the reason this page was rebuilt.

              So there is one <details> per section. Mobile gets the native
              accordion, whose contents find-in-page can reach and open.
              Desktop and print force the body visible in CSS (globals.css),
              which needs no JavaScript and cannot disagree with itself. ── */}
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
            <nav
              className="hidden lg:block sticky top-28 self-start"
              aria-label={title}
            >
              <div className="space-y-1">
                {sections.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollTo(section.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                        isActive
                          ? "text-ink"
                          : "text-ink-soft hover:text-ink hover:bg-ink/5"
                      }`}
                    >
                      {/* One pill, moved between items by layout animation —
                          the same primitive as the FAQ activation. */}
                      {isActive && (
                        <motion.span
                          aria-hidden
                          layoutId="legal-active-pill"
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 38 }
                          }
                          className="absolute inset-0 rounded-xl bg-brand-sage/12"
                        />
                      )}
                      <span
                        aria-hidden
                        className={`relative block w-1 h-5 rounded-full transition-colors duration-200 ${
                          isActive
                            ? "bg-brand-forest"
                            : "bg-transparent group-hover:bg-ink/25"
                        }`}
                      />
                      <span className="relative font-display text-[15px] leading-tight">
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div ref={articleRef} className="space-y-2 lg:space-y-6">
              {sections.map((section, i) => (
                <motion.details
                  key={section.id}
                  id={`section-${section.id}`}
                  open={i === 0}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="legal-section group card-stone relative overflow-hidden rounded-2xl border border-ink/15 scroll-mt-28"
                >
                  {/* Oversized numeral — the Footer's move borrowed where it
                      costs nothing: presence without another thing to read. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-4 select-none font-display font-light leading-none text-[120px] text-ink/[0.045]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* OUTSIDE <summary> on purpose: a button nested in a
                      summary is a control inside a control. */}
                  <button
                    onClick={() => copyAnchor(section.id)}
                    aria-label={t("copyLink")}
                    title={t("copyLink")}
                    className="hidden lg:block absolute top-10 right-10 z-10 text-ink/35 opacity-0 transition-opacity duration-200 hover:text-brand-forest group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    {copiedId === section.id ? (
                      <Check className="w-4 h-4 text-brand-forest" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </button>

                  <summary className="legal-summary flex items-center justify-between gap-3 px-5 py-4 lg:px-10 lg:pt-10 lg:pb-0 cursor-pointer list-none">
                    <h2 className="font-display font-light text-[16px] leading-snug text-ink-soft lg:text-[30px] lg:leading-tight lg:text-ink lg:tracking-[-0.01em]">
                      {section.title}
                    </h2>
                    <span
                      aria-hidden
                      className="legal-details-marker shrink-0 text-ink/40 lg:hidden"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </summary>

                  <div className="legal-body px-5 py-5 border-t border-ink/10 lg:px-10 lg:pt-6 lg:pb-10 lg:border-t-0">
                    <div className="relative legal-content legal-dropcap text-ink-soft lg:text-[15px] lg:leading-[1.7]">
                      {section.content}
                    </div>
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
