// src/components/AccountPage.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlapText from "@/components/site/ui/FlapText";
import { useReduced } from "@/components/site/ui/useReduced";

type PageState = "loading" | "success" | "error" | "direct";

const EASE = [0.22, 1, 0.36, 1] as const;
const APP_URL = "https://www.getstroyka.com/get";

/* ────────────────────────────────────────────────────────────────────────────
 * Morning Bone pieces
 * ──────────────────────────────────────────────────────────────────────── */

/**
 * The home's VisButton, as an EXTERNAL link. VisButton routes through the
 * locale-aware Link and opens in place; this CTA has always opened the app
 * page in a new tab (ui/Button's external branch), so it keeps doing that.
 */
function AppButton({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-12 items-center gap-4 rounded-full bg-site-vis pl-6 pr-1.5 text-[15px] font-medium tracking-[-0.005em] text-site-on-vis transition-[background-color,transform] duration-200 ease-out hover:bg-site-vis-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-slab"
    >
      <span>{children}</span>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-site-on-vis text-site-vis">
        <ArrowUpRight
          size={17}
          strokeWidth={2.2}
          className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6 group-hover:translate-x-6"
        />
        <ArrowUpRight
          size={17}
          strokeWidth={2.2}
          className="absolute -translate-x-6 translate-y-6 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
        />
      </span>
    </a>
  );
}

const quietLink =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/50 transition-colors hover:text-site-vis focus-visible:outline-none focus-visible:text-site-vis";

/** An indeterminate hairline — a load moving along the rail. */
function WorkingRail({ label }: { label: string }) {
  const reduced = useReduced();
  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden
        className="relative h-[2px] w-32 overflow-hidden rounded-full bg-site-paper/10"
      >
        {reduced ? (
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-site-vis" />
        ) : (
          <motion.span
            className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-site-vis"
            initial={{ x: "-100%" }}
            animate={{ x: "300%" }}
            transition={{ duration: 1.1, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/50">
        {label}
      </span>
    </div>
  );
}

/** The site's stamp: forest border, Flex extrabold, spring-landed. */
function Stamp({ label }: { label: string }) {
  const reduced = useReduced();
  return (
    <motion.div
      initial={reduced ? false : { scale: 0, rotate: -18, opacity: 0 }}
      animate={{ scale: 1, rotate: -8, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.35 }}
      className="pointer-events-none absolute -top-5 right-5 origin-center md:-top-6 md:right-8"
    >
      <span className="relative block rounded-lg border-[2.5px] border-site-vis bg-site-night px-4 py-2 font-flex text-site-vis [font-variation-settings:'wdth'_125]">
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-lg ring-2 ring-site-vis"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.85, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.42 }}
          />
        )}
        <span className="block text-[20px] font-extrabold uppercase leading-none tracking-[0.04em]">
          {label}
        </span>
      </span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Shell + state views
 * ──────────────────────────────────────────────────────────────────────── */

function PageShell({
  heading,
  children,
  stamp,
}: {
  heading: string;
  children: React.ReactNode;
  stamp?: React.ReactNode;
}) {
  const t = useTranslations("account");
  const reduced = useReduced();
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen items-center overflow-x-clip bg-site-night pb-24 pt-32 text-site-paper md:pb-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
          <div className="relative mx-auto max-w-[560px] rounded-[28px] bg-site-slab p-7 ring-1 ring-inset ring-site-paper/[0.08] md:p-10">
            {stamp}
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">
              {t("title")}
            </p>
            <FlapText
              as="h1"
              immediate
              lines={[heading]}
              className="font-flex text-[clamp(2rem,4.4vw,2.9rem)] font-semibold leading-[1] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
            />
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const bodyText = "mt-5 max-w-md text-[15.5px] leading-relaxed text-site-paper/70";
const actions =
  "mt-9 flex flex-col items-start gap-5 border-t border-site-paper/10 pt-7 sm:flex-row sm:items-center sm:justify-between";

function DirectVisitView() {
  const t = useTranslations("account");
  return (
    <PageShell heading={t("manageInApp")}>
      <p className={bodyText}>
        {t.rich("managedInside", {
          highlight: (chunks) => (
            <span className="font-medium text-site-paper">{chunks}</span>
          ),
        })}
      </p>
      <div className={actions}>
        <AppButton>{t("getTheApp")}</AppButton>
        <a href="mailto:hello@getstroyka.com" className={quietLink}>
          {t("needHelp")}
        </a>
      </div>
    </PageShell>
  );
}

function LoadingView() {
  const t = useTranslations("account");
  return (
    <PageShell heading={t("redirectingBilling")}>
      <div className="mt-8" role="status" aria-live="polite">
        <WorkingRail label={t("loading")} />
        <p className="mt-4 text-[15px] leading-relaxed text-site-paper/60">
          {t("verifying")}
        </p>
      </div>
    </PageShell>
  );
}

function SuccessView() {
  const t = useTranslations("account");
  return (
    <PageShell heading={t("allSet")} stamp={<Stamp label={t("updated")} />}>
      <p className={bodyText}>{t("changesSaved")}</p>
      <div className={actions}>
        <AppButton>{t("getTheApp")}</AppButton>
        <Link href="/" className={quietLink}>
          {t("backToSite")}
        </Link>
      </div>
    </PageShell>
  );
}

function ErrorView() {
  const t = useTranslations("account");
  return (
    <PageShell heading={t("couldntVerify")}>
      <p className={bodyText}>
        {t.rich("tryFromApp", {
          email: (chunks) => (
            <a
              href="mailto:hello@getstroyka.com"
              className="text-site-vis underline decoration-site-vis/40 underline-offset-[3px] transition-colors hover:text-site-vis-hover hover:decoration-site-vis"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <div className={actions}>
        <AppButton>{t("getTheApp")}</AppButton>
      </div>
    </PageShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Page orchestration — unchanged logic
 * ──────────────────────────────────────────────────────────────────────── */

export default function AccountPage() {
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("direct");
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Only process params once — replaceState triggers re-renders
    // with empty params which would reset state to "direct"
    if (hasProcessed.current) return;

    const token = searchParams.get("token");
    const status = searchParams.get("status");

    // Nothing to process — stay on direct visit state
    if (!token && !status) return;

    hasProcessed.current = true;

    // Determine state BEFORE clearing URL. Clearing keeps the current PATH
    // (only the token/status query goes): a hard-coded "/account" dropped the
    // /es or /ru prefix, and Next's router then re-rendered in English.
    if (status === "success") {
      setPageState("success");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (!token) {
      setPageState("direct");
      return;
    }

    // Token present — attempt portal redirect
    setPageState("loading");
    window.history.replaceState({}, "", window.location.pathname);

    fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Portal session failed");
        return res.json();
      })
      .then((data: { url: string }) => {
        window.location.href = data.url;
      })
      .catch(() => {
        setPageState("error");
      });
  }, [searchParams]);

  switch (pageState) {
    case "loading":
      return <LoadingView />;
    case "success":
      return <SuccessView />;
    case "error":
      return <ErrorView />;
    case "direct":
    default:
      return <DirectVisitView />;
  }
}
