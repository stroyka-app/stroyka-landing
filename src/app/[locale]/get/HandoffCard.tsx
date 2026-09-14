"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";

/**
 * One object for the one thing a desktop visitor can do: the QR tile with a
 * slow sage pulse ring, and the two store buttons stacked beside it. Stores
 * are real buttons here, not pills: on this page they ARE the action.
 */
export default function HandoffCard({
  qrAlt,
  scanLabel,
  scanHint,
  appStore,
  googlePlay,
  onStore,
}: {
  qrAlt: string;
  scanLabel: string;
  scanHint: string;
  appStore: string;
  googlePlay: string;
  onStore: (store: "app_store" | "google_play") => void;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className="card-stone relative flex w-full max-w-[520px] flex-col gap-5 rounded-[24px] p-5 sm:flex-row sm:items-center sm:gap-6"
      whileHover={prefersReduced ? undefined : { y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mx-auto shrink-0 sm:mx-0">
        {!prefersReduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[18px] border-2 border-brand-sage"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0.5, 0], scale: [1, 1.18] }}
            transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, repeatDelay: 1.6 }}
          />
        )}
        <div className="rounded-[18px] bg-white p-2.5 shadow-[inset_0_0_0_1px_rgba(46,38,28,0.06)]">
          <Image
            src="/get/qr-get.svg"
            alt={qrAlt}
            width={136}
            height={136}
            unoptimized
            className="block h-[136px] w-[136px] rounded-[8px]"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div>
          <p className="font-heading text-[15px] font-semibold leading-tight text-ink">
            {scanLabel}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-ink-soft">{scanHint}</p>
        </div>
        {/* Store badges: compact, side by side, just the store name (the
            hint above already says "or tap one below") in the site's ink
            (Maks, 2026-09-14: the long brown bars took too much of the
            card). */}
        <div className="flex flex-wrap gap-2">
          <StoreBadge
            href={IOS_APP_URL}
            label={appStore}
            icon={<AppleGlyph className="h-[18px] w-[18px]" />}
            onClick={() => onStore("app_store")}
          />
          <StoreBadge
            href={ANDROID_APP_URL}
            label={googlePlay}
            icon={<GooglePlayGlyph className="h-4 w-4" />}
            onClick={() => onStore("google_play")}
          />
        </div>
      </div>
    </motion.div>
  );
}

function StoreBadge({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-ink pl-2.5 pr-3.5 text-bone shadow-[0_6px_14px_-8px_rgba(46,38,28,0.6)] transition-colors hover:bg-brand-deep"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="font-heading text-[13px] font-semibold tracking-[-0.01em]">
        {label}
      </span>
    </motion.a>
  );
}
