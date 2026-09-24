"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Link2, Check, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlapText from "@/components/site/ui/FlapText";
import { useReduced } from "@/components/site/ui/useReduced";

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

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Prose inside a section. globals.css still carries base `.legal-content`
 * rules (unlayered, so they outrank utilities) and its print rules key off
 * that class — so the class stays, and the Morning Bone reading type is laid
 * over it with `!`. Bullets are short forest rules, not discs.
 */
const PROSE = [
  "[&_p]:!mb-5 [&_p]:!text-[15.5px] [&_p]:!leading-[1.75] [&_p]:!text-site-paper/70 lg:[&_p]:!text-[16.5px]",
  "[&_ul]:!mb-6 [&_ul]:!space-y-2.5",
  "[&_li]:relative [&_li]:!ml-0 [&_li]:!list-none [&_li]:pl-6 [&_li]:!text-[15.5px] [&_li]:!leading-[1.7] [&_li]:!text-site-paper/70 lg:[&_li]:!text-[16.5px]",
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.85em] [&_li]:before:h-[2px] [&_li]:before:w-3 [&_li]:before:rounded-full [&_li]:before:bg-site-vis [&_li]:before:content-['']",
  "[&_strong]:!font-semibold [&_strong]:!text-site-paper",
  "[&_a]:!text-site-vis [&_a]:decoration-site-vis/40 [&_a]:underline-offset-[3px] [&_a:hover]:!text-site-vis-hover [&_a:hover]:decoration-site-vis",
  "[&_h3]:!mb-3 [&_h3]:!mt-9 [&_h3]:!font-flex [&_h3]:!text-[17px] [&_h3]:!font-semibold [&_h3]:!tracking-[-0.01em] [&_h3]:!text-site-paper lg:[&_h3]:!text-[19px] [&_h3:first-child]:!mt-0",
].join(" ");

/** "7. Your Rights" → { num: "07", label: "Your Rights" }. Presentation only. */
function splitTitle(title: string, i: number) {
  const m = title.match(/^(\d+)\.\s+(.*)$/);
  return m
    ? { num: m[1].padStart(2, "0"), label: m[2] }
    : { num: String(i + 1).padStart(2, "0"), label: title };
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
  const reduced = useReduced();

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

  const total = String(sections.length).padStart(2, "0");
  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );

  return (
    <>
      <Navbar />

      {/* overflow-CLIP, not hidden: `overflow: hidden` on an ancestor makes
          it a scroll container and silently kills `position: sticky` on the
          section nav — measured 2026-09-22, the nav scrolled away at
          navTop=-1445. `clip` keeps sticky working (and print resets it in
          globals.css, where it used to truncate the document). */}
      <main className="relative min-h-screen overflow-clip bg-site-night pb-24 pt-32 text-site-paper md:pb-36 md:pt-40">
        <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
          {/* Header — the title opens like the home's site board. */}
          <header className="mb-10 border-b border-site-paper/10 pb-10 md:mb-16 md:pb-14">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">
              {t("eyebrow")}
            </p>
            <FlapText
              as="h1"
              immediate
              lines={[title]}
              className="font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
            />
            <div className="mt-8 grid gap-5 print:block md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
                className="max-w-xl text-[16px] leading-relaxed text-site-paper/70 md:text-[17px]"
              >
                {subtitle}
              </motion.p>
              <motion.p
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
                className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-site-paper/50 md:text-right"
              >
                {effectiveDate}
              </motion.p>
            </div>
          </header>

          {/* English-only notice for non-en locales */}
          {showNotice && (
            <div className="mb-10 flex max-w-3xl gap-4 rounded-[22px] bg-site-slab p-5 ring-1 ring-inset ring-site-paper/[0.08] md:mb-16 md:p-7">
              <span aria-hidden className="w-[3px] shrink-0 self-stretch rounded-full bg-site-vis" />
              <div>
                <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-site-vis">
                  {t("englishOnlyTitle")}
                </p>
                <p className="max-w-2xl text-[15px] leading-relaxed text-site-paper/70">
                  {t("englishOnlyBody")}
                </p>
              </div>
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
              which needs no JavaScript and cannot disagree with itself.

              The `lg:grid` class below is load-bearing for print: globals.css
              collapses `main .lg\:grid` to one column on paper. ── */}
          <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-28">
            <nav
              className="sticky top-28 hidden max-h-[calc(100dvh-8rem)] self-start overflow-y-auto pb-4 [scrollbar-width:none] lg:block"
              aria-label={title}
            >
              {/* Where you are: section counter + document progress. */}
              <div className="mb-5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums">
                <span className="text-site-vis">
                  § {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-site-paper/40">/ {total}</span>
              </div>
              <div aria-hidden className="relative mb-6 h-[2px] overflow-hidden rounded-full bg-site-paper/10">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-site-vis"
                  style={{ scaleX: progress }}
                />
              </div>

              <ol className="border-t border-site-paper/10">
                {sections.map((section, i) => {
                  const isActive = section.id === activeId;
                  const { num, label } = splitTitle(section.title, i);
                  return (
                    <li key={section.id} className="border-b border-site-paper/10">
                      <button
                        onClick={() => scrollTo(section.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`group relative flex w-full items-baseline gap-4 py-2.5 pl-4 pr-2 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-site-vis ${
                          isActive
                            ? "text-site-paper"
                            : "text-site-paper/55 hover:text-site-paper"
                        }`}
                      >
                        {/* One accent bar, moved between items by layout
                            animation — the same primitive as before. */}
                        {isActive && (
                          <motion.span
                            aria-hidden
                            layoutId="legal-active-bar"
                            transition={
                              reduced
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 420, damping: 38 }
                            }
                            className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-site-vis"
                          />
                        )}
                        <span
                          className={`w-5 shrink-0 font-mono text-[11px] tabular-nums tracking-[0.08em] transition-colors duration-200 ${
                            isActive ? "text-site-vis" : "text-site-paper/35"
                          }`}
                        >
                          {num}
                        </span>
                        <span className="text-[14.5px] font-medium leading-snug tracking-[-0.005em]">
                          {label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* A PLAIN <details> below, not motion.details, and that is not a
                style preference. It carried `whileInView`, which starts at
                opacity 0 and animates only once scrolled into view — so every
                section below the fold stayed INVISIBLE until you happened to
                scroll past it. Measured on a fresh load: §2 through §12 at
                computed opacity 0, open, full height. The page printed six
                sheets with two of them legible, and looked correct afterwards
                because the reveal fires once and stays, which is why it read
                as intermittent. Maks saw it from the outside: print from the
                top and pages 3+ are blank, scroll to the bottom first and they
                are all there.

                On a page whose job is to be readable, printable and
                archivable, visibility must never depend on having scrolled. */}
            <div ref={articleRef} className="relative space-y-3 lg:space-y-0">
              {sections.map((section, i) => {
                const { num, label } = splitTitle(section.title, i);
                return (
                  <details
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
                    className="legal-section group relative scroll-mt-28 rounded-[20px] bg-site-slab ring-1 ring-inset ring-site-paper/[0.08] lg:rounded-none lg:bg-transparent lg:pb-4 lg:pt-12 lg:ring-0 lg:[&+&]:border-t lg:[&+&]:!border-site-paper/10 lg:first:pt-0"
                  >
                    {/* OUTSIDE <summary> on purpose: a button nested in a
                        summary is a control inside a control. */}
                    <button
                      onClick={() => copyAnchor(section.id)}
                      aria-label={t("copyLink")}
                      title={t("copyLink")}
                      className="absolute right-0 top-[81px] z-10 hidden h-9 w-9 place-items-center rounded-full text-site-paper/45 opacity-0 ring-1 ring-inset ring-site-paper/15 transition-[opacity,color,background-color] duration-200 hover:bg-site-paper/[0.05] hover:text-site-vis focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis group-hover:opacity-100 lg:grid print:!hidden [.legal-section:first-child>&]:top-[33px]"
                    >
                      {copiedId === section.id ? (
                        <Check className="h-4 w-4 text-site-vis" />
                      ) : (
                        <Link2 className="h-4 w-4" />
                      )}
                    </button>

                    <summary className="legal-summary flex cursor-pointer list-none items-center justify-between gap-4 !bg-transparent px-5 py-5 lg:p-0 lg:pr-14">
                      <h2 className="flex items-baseline gap-4 font-flex text-[18px] font-semibold leading-snug tracking-[-0.015em] text-site-paper lg:block lg:text-[clamp(1.75rem,2.4vw,2.25rem)] lg:leading-[1.05] lg:tracking-[-0.025em] lg:[font-variation-settings:'wdth'_108]">
                        <span className="shrink-0 font-mono text-[11px] font-normal tabular-nums tracking-[0.1em] text-site-vis lg:mb-4 lg:block lg:tracking-[0.2em]">
                          <span className="hidden lg:inline">§ </span>
                          {num}
                        </span>{" "}
                        <span>{label}</span>
                      </h2>
                      <span
                        aria-hidden
                        className="legal-details-marker grid h-8 w-8 shrink-0 place-items-center rounded-full text-site-paper/60 ring-1 ring-inset ring-site-paper/20 lg:hidden"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </summary>

                    <div className="legal-body border-t border-site-paper/10 px-5 pb-6 pt-5 lg:border-t-0 lg:px-0 lg:pb-4 lg:pt-7">
                      <div className={`legal-content relative max-w-[68ch] ${PROSE}`}>
                        {section.content}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
