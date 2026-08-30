"use client";

import { Globe, Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const LABELS: Record<string, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  es: { code: "ES", name: "Español" },
  ru: { code: "RU", name: "Русский" },
};

// Strong ease-out (Emil): starts fast, feels responsive on enter.
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface LanguageSwitcherProps {
  /** "popover" floats above the page (navbar, footer); "inline" expands an
   *  accordion in-flow (mobile menu sheet). */
  variant?: "popover" | "inline";
  /** Which way the popover opens — down from the navbar, up from the footer. */
  placement?: "bottom" | "top";
  /** Which edge the popover aligns to. "right" suits a right-anchored trigger
   *  (navbar); "left" suits a left-anchored trigger (footer) so the menu
   *  opens toward the screen center instead of off the edge. */
  align?: "left" | "right";
}

export default function LanguageSwitcher({
  variant = "popover",
  placement = "bottom",
  align = "right",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = useLocale();
  const reduce = useReducedMotion();
  const t = useTranslations("nav");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /**
   * The URL this option points at, so the switcher renders REAL anchors.
   *
   * It was `<button>` + router.replace(), which meant `/es` and `/ru` had
   * zero inbound `<a href>` anywhere on the site: they were discoverable only
   * via the sitemap and hreflang, and received no internal link equity at
   * all. A crawler could not walk to them.
   *
   * `localePrefix` is 'as-needed' with `en` as default, so English is
   * unprefixed — see src/i18n/routing.ts. Keep this in step with that
   * setting; hardcoding a prefix for `en` would emit /en URLs that redirect.
   */
  const hrefFor = (locale: string) =>
    locale === routing.defaultLocale ? pathname : `/${locale}${pathname}`;

  const switchTo = (locale: string) => {
    setOpen(false);
    if (locale === active) return;
    // Stay exactly where the user is. We deliberately do NOT carry the URL
    // hash: it's set on anchor clicks and never cleared on scroll, so it's a
    // stale "teleport target" (e.g. an old #pricing) that would otherwise be
    // re-applied here and yank the user away. scroll:false stops Next from
    // resetting scroll on the locale navigation.
    startTransition(() => {
      router.replace(pathname, { locale, scroll: false });
    });
  };

  // Close on outside pointer + Escape; restore focus to the trigger on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move focus into the menu (active option) when it opens.
  useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, routing.locales.indexOf(active as never));
    // rAF so the elements exist after the enter animation mounts.
    const id = requestAnimationFrame(() => itemRefs.current[idx]?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, active]);

  const onMenuKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const len = routing.locales.length;
      const next = e.key === "ArrowDown" ? (index + 1) % len : (index - 1 + len) % len;
      itemRefs.current[next]?.focus();
    }
  };

  const Options = (
    <ul role="menu" aria-label={t("selectLanguage")} className="flex flex-col gap-0.5">
      {routing.locales.map((loc, i) => {
        const isActive = loc === active;
        return (
          <li key={loc} role="none">
            <motion.a
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              href={hrefFor(loc)}
              // Real href for crawlers; the click is still handled in-app so
              // the user keeps the soft navigation and scroll position.
              // Modified clicks (new tab, download) fall through to the
              // browser, which is the whole point of using an anchor.
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                if (isPending) return;
                switchTo(loc);
              }}
              role="menuitemradio"
              aria-checked={isActive}
              aria-disabled={isPending}
              aria-label={LABELS[loc].name}
              onKeyDown={(e) => onMenuKey(e, i)}
              initial={reduce || !open ? false : { opacity: 0, y: placement === "top" ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: EASE_OUT, delay: reduce ? 0 : i * 0.035 }}
              className={`flex w-full items-center justify-between gap-6 rounded-xl px-3 py-2 text-left transition-colors duration-150 active:scale-[0.98] ${
                isActive
                  ? "bg-brand-sage-bright/20 text-bone"
                  : "text-bone/70 hover:bg-bone/5 hover:text-bone"
              }`}
            >
              <span className="flex items-baseline gap-2.5">
                <span className="w-5 font-mono text-[11px] tracking-[0.12em] uppercase text-bone/55">
                  {LABELS[loc].code}
                </span>
                <span className="font-body text-[13.5px]">{LABELS[loc].name}</span>
              </span>
              {isActive && <Check size={14} className="shrink-0 text-brand-sage-bright" aria-hidden />}
            </motion.a>
          </li>
        );
      })}
    </ul>
  );

  // --- Inline accordion (mobile menu sheet) ---
  if (variant === "inline") {
    return (
      <div ref={rootRef} className="flex flex-col">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={t("changeLanguage")}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-between rounded-xl py-1 text-bone/80 transition-colors hover:text-bone"
        >
          <span className="flex items-center gap-3 font-mono text-[12px] tracking-[0.15em] uppercase">
            <Globe size={15} className="text-bone/60" aria-hidden />
            {LABELS[active].name}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }}
          >
            <ChevronDown size={16} className="text-bone/40" aria-hidden />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <div className="pt-2">{Options}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- Floating popover (navbar, footer) ---
  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("changeLanguage")}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-1.5 rounded-full border border-bone/15 bg-brand-sage-bright/5 py-1.5 pl-2.5 pr-2 text-bone/80 transition-[background-color,border-color,transform] duration-150 hover:border-bone/25 hover:bg-brand-sage-bright/10 hover:text-bone active:scale-[0.97]"
      >
        <Globe size={14} className="shrink-0 text-bone/55 transition-colors group-hover:text-bone/75" aria-hidden />
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase">{LABELS[active].code}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }}
          className="flex"
        >
          <ChevronDown size={13} className="text-bone/40" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            // Origin-aware: scale in from the trigger corner, never from scale(0).
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: placement === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: placement === "top" ? 2 : -2 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            style={{ transformOrigin: `${placement === "top" ? "bottom" : "top"} ${align}` }}
            className={`absolute z-50 min-w-[176px] rounded-2xl border border-bone/12 bg-[rgba(30,46,36,0.97)] p-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl ${
              align === "left" ? "left-0" : "right-0"
            } ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
          >
            {Options}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
