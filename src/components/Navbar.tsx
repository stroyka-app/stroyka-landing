"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * Navbar — single aesthetic across all sections.
 *
 * Before: transparent on hero, solid bone/sand when scrolled. The sand
 * state clashed with the dark R3F section and made the "Get Started"
 * button feel stuck-on.
 *
 * After: transparent on hero, then a dark-sage glass bar (brand-midnight
 * with blur + subtle bone border) on scroll. Bone text + logo are
 * readable over every section — sand, dark R3F, or footer — because the
 * nav itself carries its own dark surface.
 *
 * The "Get Started" CTA is a bespoke sage-tinted pill (not the shared
 * Button component) so it integrates with the glass bar instead of
 * sitting on top of it.
 */
export default function Navbar() {
  const scrollY = useScrollPosition();
  const pathname = usePathname();
  // Only the landing page has a dark hero behind the navbar — everywhere
  // else the page surface is bone-tinted from the very top, so the
  // transparent navbar would render bone-on-bone (invisible). Force the
  // dark-glass "scrolled" treatment from scroll=0 on every non-home route.
  const isHome = pathname === "/";
  const scrolled = !isHome || scrollY > 50;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Smooth scroll-bound height + logo-scale shrink. Anchored to first 320px
  // of vertical scroll so the bar settles by the time the hero copy clears.
  const { scrollY: rawY } = useScroll();
  const heightMV = useTransform(rawY, [0, 320], [72, 56]);
  const logoScaleMV = useTransform(rawY, [0, 320], [1, 0.86]);
  const height = useSpring(heightMV, { stiffness: 220, damping: 30, mass: 0.4 });
  const logoScale = useSpring(logoScaleMV, { stiffness: 220, damping: 30, mass: 0.4 });

  // Logo + nav text stay light across the whole page now — nav provides
  // its own dark surface once scrolled.
  const textBase = "text-bone/80 hover:text-bone";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-[rgba(30,46,36,0.72)] backdrop-blur-xl border-b border-bone/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.45)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <motion.div
        style={{ height }}
        className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between"
      >
        <Link href="/" aria-label="Home" className="flex items-center">
          {/* variant="dark" = "on dark bg" → renders bone text + sage-mist
              bracket. Our nav surface is always dark (transparent over
              the hero video, dark-sage glass when scrolled), so this
              stays fixed — no variant swap on scroll. */}
          <motion.div style={{ scale: logoScale, transformOrigin: "left center" }}>
            <Logo variant="dark" size={30} />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-[12px] tracking-[0.15em] uppercase transition-colors duration-200 ${textBase}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="/get-started"
            className="group relative inline-flex items-center gap-2 rounded-full pl-4 pr-3 py-2 font-heading text-[13.5px] font-medium tracking-wide text-bone border border-brand-sage-bright/40 bg-brand-sage-bright/10 hover:bg-brand-sage-bright/20 hover:border-brand-sage-bright/70 transition-[background-color,border-color,transform] duration-200 active:scale-[0.97]"
          >
            <span>Get started</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-sage-bright/90 text-brand-midnight-dark text-[11px] transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="block w-6 h-0.5 bg-bone"
            animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-bone"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-bone"
            animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[rgba(30,46,36,0.92)] backdrop-blur-xl border-b border-bone/10"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[12px] tracking-[0.15em] uppercase text-bone/80 hover:text-bone transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-heading text-[14px] font-medium text-bone border border-brand-sage-bright/50 bg-brand-sage-bright/15 hover:bg-brand-sage-bright/25"
                onClick={() => setMobileOpen(false)}
              >
                Get started
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-sage-bright/90 text-brand-midnight-dark text-[11px]">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
