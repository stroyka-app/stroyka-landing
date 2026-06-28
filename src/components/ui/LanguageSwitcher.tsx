"use client";

import { Globe } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

const LABELS: Record<string, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  es: { code: "ES", name: "Español" },
  ru: { code: "RU", name: "Русский" },
};

interface LanguageSwitcherProps {
  variant?: "bar" | "stacked";
}

export default function LanguageSwitcher({ variant = "bar" }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = useLocale();
  const reduce = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: string) => {
    if (locale === active) return;
    // Preserve hash; next-intl's router rewrites the locale prefix for `pathname`.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    startTransition(() => {
      router.replace(`${pathname}${hash}`, { locale });
    });
  };

  if (variant === "stacked") {
    return (
      <div role="group" aria-label="Language" className="flex flex-col gap-2">
        {routing.locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchTo(loc)}
            aria-current={loc === active ? "true" : undefined}
            disabled={isPending}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 font-mono text-[12px] tracking-[0.15em] uppercase transition-colors ${
              loc === active ? "bg-brand-sage-bright/20 text-bone" : "text-bone/70 hover:text-bone"
            }`}
          >
            <span className="w-6">{LABELS[loc].code}</span>
            <span className="font-body normal-case tracking-normal text-[13px] text-bone/60">
              {LABELS[loc].name}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <LayoutGroup id="lang-switch">
      <div
        role="group"
        aria-label="Language"
        className="inline-flex items-center gap-0.5 rounded-full border border-bone/15 bg-brand-sage-bright/5 p-0.5"
      >
        <Globe size={13} className="ml-1.5 mr-0.5 shrink-0 text-bone/50" aria-hidden />
        {routing.locales.map((loc) => {
          const isActive = loc === active;
          return (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              aria-current={isActive ? "true" : undefined}
              aria-label={LABELS[loc].name}
              disabled={isPending}
              className="relative rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full bg-brand-sage-bright/25"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-bone" : "text-bone/55 hover:text-bone/85"}`}>
                {LABELS[loc].code}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
