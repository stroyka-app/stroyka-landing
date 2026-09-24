"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";
import { useReduced } from "@/components/site/ui/useReduced";

/**
 * One object for the one thing a desktop visitor can do: the QR tile with a
 * slow forest pulse ring, and the two store buttons beside it. Stores are
 * real buttons here, not pills: on this page they ARE the action.
 *
 * Morning Bone (2026-09-24): a slab card, the QR printed onto a bone tile
 * (the SVG's white ground multiplies into the bone, the modules stay ink, so
 * contrast for the camera is unchanged) inside forest crop marks, and the
 * stores as forest pills in the VisButton register.
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
  const reduced = useReduced();
  return (
    <motion.div
      className="relative flex w-full max-w-[540px] flex-col gap-5 rounded-[26px] bg-site-slab p-5 ring-1 ring-site-paper/[0.08] sm:flex-row sm:items-center sm:gap-7 sm:p-6"
      whileHover={reduced ? undefined : { y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mx-auto shrink-0 sm:mx-0">
        {!reduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[18px] border-2 border-site-vis"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0.45, 0], scale: [1, 1.18] }}
            transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, repeatDelay: 1.6 }}
          />
        )}
        <div className="relative rounded-[18px] bg-site-night p-3 ring-1 ring-site-paper/[0.1]">
          <CropMarks />
          <Image
            src="/get/qr-get.svg"
            alt={qrAlt}
            width={132}
            height={132}
            unoptimized
            className="block h-[132px] w-[132px] mix-blend-multiply"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 text-center sm:text-left">
        <div>
          <p className="font-flex text-[18px] font-semibold leading-tight tracking-[-0.015em] text-site-paper [font-variation-settings:'wdth'_105]">
            {scanLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-snug text-site-paper/65">{scanHint}</p>
        </div>
        {/* Store buttons: compact, side by side, just the store name (the
            hint above already says "or tap one below"). */}
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <StoreButton
            href={IOS_APP_URL}
            label={appStore}
            icon={<AppleGlyph className="h-[17px] w-[17px]" />}
            onClick={() => onStore("app_store")}
          />
          <StoreButton
            href={ANDROID_APP_URL}
            label={googlePlay}
            icon={<GooglePlayGlyph className="h-[15px] w-[15px]" />}
            onClick={() => onStore("google_play")}
          />
        </div>
      </div>
    </motion.div>
  );
}

/** Four forest corner ticks around the QR, like a print's registration marks. */
function CropMarks() {
  const corner = "pointer-events-none absolute h-3 w-3 border-site-vis";
  return (
    <>
      <span aria-hidden className={`${corner} left-1.5 top-1.5 rounded-tl-[4px] border-l-2 border-t-2`} />
      <span aria-hidden className={`${corner} right-1.5 top-1.5 rounded-tr-[4px] border-r-2 border-t-2`} />
      <span aria-hidden className={`${corner} bottom-1.5 left-1.5 rounded-bl-[4px] border-b-2 border-l-2`} />
      <span aria-hidden className={`${corner} bottom-1.5 right-1.5 rounded-br-[4px] border-b-2 border-r-2`} />
    </>
  );
}

function StoreButton({
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
    <a
      href={href}
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-site-vis pl-2 pr-4 text-site-on-vis transition-[background-color,transform] duration-200 ease-out hover:bg-site-vis-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-slab"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-site-on-vis text-site-vis">
        {icon}
      </span>
      <span className="text-[14px] font-medium tracking-[-0.005em]">{label}</span>
    </a>
  );
}
