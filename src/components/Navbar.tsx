"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";

type NavKey = "features" | "howItWorks" | "pricing" | "faq";

const NAV_LINKS: Array<{ key: NavKey; hash: string }> = [
  { key: "features", hash: "features" },
  { key: "howItWorks", hash: "how-it-works" },
  { key: "pricing", hash: "pricing" },
  { key: "faq", hash: "faq" },
];

/**
 * Navbar — Morning Bone.
 *
 * On the home it sits transparent on the morning sky (it's part of the
 * hero, not a band over it) and turns into bone glass once you scroll.
 * Every other route starts on the bone page, so it's bone glass from the
 * top. Ink type, forest "Get started".
 *
 * iOS: the glass lives on the absolute child, NOT the fixed <nav> — iOS 26
 * samples fixed elements' background-color into the toolbar tint, so the
 * fixed element stays background-free. The glass starts from --page-top
 * across the safe area on phones (globals.css .nav-glass-scrolled).
 *
 * Phones get a full bone sheet instead of a dropdown strip: big links,
 * the language list inline, one forest CTA at the thumb.
 */
export default function Navbar() {
  const t = useTranslations("nav");
  const active = useLocale();
  const homeHash = (hash: string) => (active === "en" ? `/#${hash}` : `/${active}#${hash}`);
  const scrollY = useScrollPosition();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = !isHome || scrollY > 50;
  const prefersReduced = useReducedMotion();
  const [mobileOpen, setMobileOpenRaw] = useState(false);
  // Scroll offset the sheet is pinned to (captured when it opens).
  const [sheetTop, setSheetTop] = useState(0);
  const setMobileOpen = (open: boolean) => {
    if (open) setSheetTop(window.scrollY);
    setMobileOpenRaw(open);
  };
  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => setPortalReady(true), []);
  const track = useCtaTracker("navbar");

  const { scrollY: rawY } = useScroll();
  const heightMV = useTransform(rawY, [0, 320], [72, 60]);
  const logoScaleMV = useTransform(rawY, [0, 320], [1, 0.9]);
  const height = useSpring(heightMV, { stiffness: 220, damping: 30, mass: 0.4 });
  const logoScale = useSpring(logoScaleMV, { stiffness: 220, damping: 30, mass: 0.4 });

  // Tell SafariBottomTint (iOS toolbar tint) the sheet is up / down.
  useEffect(() => {
    const html = document.documentElement;
    if (mobileOpen) html.dataset.sheet = "open";
    else delete html.dataset.sheet;
    window.dispatchEvent(new Event("site:sheet"));
  }, [mobileOpen]);

  // The sheet owns the screen while open: lock the page behind it.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const glass = scrolled || mobileOpen;

  return (
    <>
    <nav className="fixed left-0 right-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
          glass
            ? "nav-glass-scrolled border-b border-site-paper/[0.07] shadow-[0_10px_30px_-18px_rgba(60,50,30,0.35)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      />
      <motion.div style={{ height }} className="mx-auto flex max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link href="/" aria-label="Home" className="flex items-center" onClick={() => setMobileOpen(false)}>
          <motion.div style={{ scale: logoScale, transformOrigin: "left center" }}>
            <Logo variant="light" size={30} />
          </motion.div>
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.hash}
              href={homeHash(link.hash)}
              className="group relative font-mono text-[12px] uppercase tracking-[0.13em] text-site-paper/70 transition-colors duration-200 hover:text-site-paper lg:tracking-[0.15em]"
            >
              {t(link.key)}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-site-vis transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Link
            href="/get-started"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-site-vis pl-5 pr-4 text-[13.5px] font-medium text-site-on-vis transition-[background-color,transform] duration-200 hover:bg-site-vis-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night"
            onClick={() => track("cta_get_started", { placement: "desktop" })}
          >
            {t("getStarted")}
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          className="relative -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t("toggleMenu")}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <motion.span
            className="block h-0.5 w-6 rounded-full bg-site-paper"
            animate={mobileOpen ? (prefersReduced ? { opacity: 0 } : { rotate: 45, y: 4 }) : prefersReduced ? { opacity: 1 } : { rotate: 0, y: 0 }}
          />
          <motion.span className="block h-0.5 w-6 rounded-full bg-site-paper" animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} />
          <motion.span
            className="block h-0.5 w-6 rounded-full bg-site-paper"
            animate={mobileOpen ? (prefersReduced ? { opacity: 0 } : { rotate: -45, y: -4 }) : prefersReduced ? { opacity: 1 } : { rotate: 0, y: 0 }}
          />
        </button>
      </motion.div>

    </nav>
    {/* The phone sheet lives in <body>, outside the fixed nav (see above). */}
    {portalReady &&
      createPortal(
      <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              // PAGE CONTENT, not a fixed overlay: iOS 26 clips fixed elements
              // at the toolbar line (proven in the simulator, 2026-09-24), so a
              // fixed sheet stopped there and the page showed through the glass
              // below it. The page is scroll-locked while the sheet is open, so
              // an absolute sheet placed at the current scroll offset stays put
              // and runs on behind the toolbar like the crane stage does.
              // Inline sizes: Tailwind mangles hyphens inside env().
              style={{
                top: sheetTop,
                height: "calc(100lvh + 140px)",
                paddingTop: "calc(72px + env(safe-area-inset-top, 0px) + 24px)",
                paddingBottom: "calc(100lvh - 100svh + 160px)",
              }}
              className="absolute inset-x-0 z-[45] flex flex-col overflow-y-auto bg-site-night px-5 md:hidden"
            >
              <ul className="flex flex-col border-t border-site-paper/10">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.hash}
                    initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.04 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-site-paper/10"
                  >
                    <a
                      href={homeHash(link.hash)}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-5 font-flex text-[30px] font-semibold tracking-[-0.02em] text-site-paper [font-variation-settings:'wdth'_110]"
                    >
                      {t(link.key)}
                      <span className="font-mono text-[11px] font-normal tracking-[0.1em] text-site-paper/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <LanguageSwitcher variant="inline" />
              </div>
              <Link
                href="/get-started"
                className="mt-auto flex h-14 items-center justify-center gap-2 rounded-full bg-site-vis text-[16px] font-medium text-site-on-vis active:scale-[0.98]"
                onClick={() => {
                  track("cta_get_started", { placement: "mobile_menu" });
                  setMobileOpen(false);
                }}
              >
                {t("getStarted")}
                <ArrowUpRight size={17} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
