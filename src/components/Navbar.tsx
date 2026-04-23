"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const scrollY = useScrollPosition();
  const scrolled = scrollY > 50;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "backdrop-blur-md bg-bone/85 border-b border-ink/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        <Link href="/" aria-label="Home">
          <Logo variant="light" size={30} />
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[12px] tracking-[0.15em] uppercase text-ink-soft hover:text-ink transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button variant="secondary" size="sm" href="/get-started">
            Get Started
          </Button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="block w-6 h-0.5 bg-ink"
            animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-ink"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-ink"
            animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden backdrop-blur-md bg-bone/95 border-b border-ink/10"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[12px] tracking-[0.15em] uppercase text-ink-soft hover:text-ink transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button variant="primary" size="sm" href="/get-started">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
