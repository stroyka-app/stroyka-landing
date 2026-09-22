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
  // Server-render every section OPEN: that is what puts the whole document in
  // the HTML for print, archiving and crawlers. Mobile collapses after mount.
  //
  // `open` is driven from JS rather than CSS because CSS cannot reliably force
  // a <details> open any more — Chrome 131+ and Safari 18.4+ moved the
  // contents behind a `::details-content` pseudo with `content-visibility:
  // hidden`, which `display: block` on the inner element does not touch. That
  // exact assumption shipped broken on 2026-09-22: on desktop every section
  // but the first rendered as a bare heading.
  const [isWide, setIsWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // A section opened by a deep link. Must be STATE: `open` is a controlled
  // prop, so setting el.open imperatively survives exactly until the next
  // render — which on mobile closed the section the link had just opened.
  const [linkedId, setLinkedId] = useState<string | null>(null);
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

  // Scroll-spy: the current section is the LAST one whose top has passed the
  // reading line. An IntersectionObserver taking the topmost intersecting
  // entry got this wrong — a section taller than the band stays intersecting
  // while you read the one after it, so the pill lagged a whole section
  // behind (measured: landing on §5 lit "4. Data Isolation").
  useEffect(() => {
    let frame = 0;
    const READING_LINE = 140;
    const sync = () => {
      frame = 0;
      let current = sections[0]?.id ?? "";
      for (const sec of sections) {
        const el = document.getElementById(`section-${sec.id}`);
        if (el && el.getBoundingClientRect().top <= READING_LINE)
          current = sec.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // A pasted deep link has to land on the section, which means three things,
  // not one: the element has to be findable from the hash, a COLLAPSED section
  // has to open first (on mobile it is closed and the browser will not scroll
  // to something with no box), and the pill has to agree with where you are.
  //
  // The first version copied `#storage-security` while the element was
  // `section-storage-security`, so the browser found no target and the page
  // just sat where it was. Both spellings are accepted now; the clean one is
  // what gets copied.
  useEffect(() => {
    const go = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = raw.replace(/^section-/, "");
      const el = document.getElementById(`section-${id}`);
      if (!el) return;
      setLinkedId(id);
      setActiveId(id);
      // Two frames: one for React to render `open`, one for layout to
      // settle. A collapsed <details> has no box and cannot be scrolled to.
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document
            .getElementById(`section-${id}`)
            ?.scrollIntoView({ behavior: "auto", block: "start" }),
        ),
      );
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  const copyAnchor = async (id: string) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      await navigator.clipboard.writeText(url);
      // Reflect it in the address bar too — without this the person who just
      // copied a link has no way to see what they copied.
      window.history.replaceState(null, "", `#${id}`);
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

      {/* overflow-CLIP, not hidden: `overflow: hidden` on an ancestor makes
          it a scroll container and silently kills `position: sticky` on the
          section nav — measured 2026-09-22, the nav scrolled away at
          navTop=-1445. `clip` clips the vignette blur identically without
          creating that container. */}
      <main className="relative min-h-screen pt-28 pb-24 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-clip">
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
                  open={isWide || i === 0 || linkedId === section.id || undefined}
                  onToggle={(e) => {
                    // Desktop is a document: a stray click on a heading must
                    // not be able to collapse a section.
                    if (isWide && !(e.currentTarget as HTMLDetailsElement).open) {
                      (e.currentTarget as HTMLDetailsElement).open = true;
                    }
                  }}
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
                    className="pointer-events-none absolute top-5 right-7 select-none font-display font-light leading-none text-[84px] text-ink/[0.05]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* OUTSIDE <summary> on purpose: a button nested in a
                      summary is a control inside a control. */}
                  <button
                    onClick={() => copyAnchor(section.id)}
                    aria-label={t("copyLink")}
                    title={t("copyLink")}
                    className="hidden lg:block absolute top-[52px] left-3 z-10 text-ink/30 opacity-0 transition-opacity duration-200 hover:text-brand-forest group-hover:opacity-100 focus-visible:opacity-100"
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
                    <div className="relative legal-content text-ink-soft lg:text-[15px] lg:leading-[1.7]">
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
