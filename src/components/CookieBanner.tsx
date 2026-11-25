"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  OPEN_SETTINGS_EVENT,
  clearTrackingCookies,
  readConsent,
  saveConsent,
  type ConsentChoice,
} from "@/lib/consent";

const BTN =
  "inline-flex h-11 flex-1 items-center justify-center rounded-full px-5 text-[14.5px] font-medium text-site-paper ring-1 ring-inset ring-site-paper/25 transition-[background-color,box-shadow,transform] duration-200 hover:bg-site-paper/[0.06] hover:ring-site-paper/45 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis sm:flex-none sm:min-w-[132px]";

/**
 * The cookie choice, asked once. Accept and Reject are the same size, the
 * same style and the same number of taps — rejecting must be as easy as
 * accepting. Nothing optional loads until Accept (see lib/consent.ts).
 *
 * No framer-motion here on purpose: this renders on /start too, whose first
 * load is kept free of it (SiteChrome).
 */
export default function CookieBanner() {
  const t = useTranslations("cookies");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ConsentChoice | null>(null);
  const firstButton = useRef<HTMLButtonElement>(null);
  const reopened = useRef(false);

  useEffect(() => {
    const choice = readConsent();
    setCurrent(choice);
    if (choice === null) setOpen(true);
    // A refused visitor keeps nothing: clears any ph_* / _fbp left over from
    // before the refusal, or re-written while the withdrawing page unloaded.
    if (choice === "denied") clearTrackingCookies();
    const reopen = () => {
      reopened.current = true;
      setCurrent(readConsent());
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  // When opened from "Cookie settings", move focus into the banner so a
  // keyboard user lands on the choice they asked for.
  useEffect(() => {
    if (open && reopened.current) firstButton.current?.focus();
  }, [open]);

  const choose = (choice: ConsentChoice) => {
    const withdrawing = current === "granted" && choice === "denied";
    saveConsent(choice);
    setCurrent(choice);
    setOpen(false);
    if (withdrawing) {
      // saveConsent has just told PostHog (opt_out_capturing) and the pixel
      // (consent revoke) to stop, synchronously. They are still loaded in
      // this page, so clear what they stored and load the page fresh
      // without them; the next load clears again (mount effect above).
      clearTrackingCookies();
      window.location.reload();
    }
  };

  if (!open) return null;

  return (
    <section
      role="region"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[150] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] sm:px-6 print:hidden"
    >
      <div className="mx-auto max-w-[760px] rounded-[22px] bg-site-slab p-5 text-site-paper shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-site-paper/[0.12] md:p-6">
        <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-site-vis">{t("title")}</p>
        <p className="text-[14.5px] leading-relaxed text-site-paper/75">
          {t("body")}{" "}
          <Link href="/privacy#cookies" className="text-site-vis underline decoration-site-vis/40 underline-offset-[3px] hover:text-site-vis-hover">
            {t("learnMore")}
          </Link>
        </p>
        {current && (
          <p className="mt-2 text-[13px] text-site-paper/65">
            {current === "granted" ? t("statusGranted") : t("statusDenied")}
          </p>
        )}
        <div className="mt-4 flex gap-3">
          <button ref={firstButton} type="button" className={BTN} onClick={() => choose("denied")}>
            {t("reject")}
          </button>
          <button type="button" className={BTN} onClick={() => choose("granted")}>
            {t("accept")}
          </button>
        </div>
      </div>
    </section>
  );
}
