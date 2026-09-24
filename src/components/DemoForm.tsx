"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, Loader2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import { useReduced } from "@/components/site/ui/useReduced";

interface FormData {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone: string;
  challenge: string;
  honeypot: string;
}

const INITIAL: FormData = {
  name: "",
  company: "",
  crewSize: "",
  email: "",
  phone: "",
  challenge: "",
  honeypot: "",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* Morning Bone field styles — see docs/design/morning-bone-system.md. */
const FIELD =
  "w-full rounded-xl bg-site-night px-4 text-[15px] ring-1 ring-inset placeholder:text-site-paper/35 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-site-vis";
const LABEL = "mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55";

/** The copy's own arrows ("→") would double up with the knob's arrow. */
const bare = (s: string) => s.replace(/\s*[→←]\s*/g, " ").trim();

export default function DemoForm() {
  const t = useTranslations("demo");
  const reduced = useReduced();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const track = useCtaTracker("demo_form");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined });
    }
  };

  const validateFields = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) {
      errors.name = t("errors.nameRequired");
    }
    if (!form.company.trim()) {
      errors.company = t("errors.companyRequired");
    }
    if (!form.crewSize) {
      errors.crewSize = t("errors.crewSizeRequired");
    }
    if (!form.email.trim()) {
      errors.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = t("errors.emailInvalid");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 429) {
          throw new Error("Too many requests");
        }
        throw new Error(data.error || "Something went wrong");
      }

      // Only after the API accepted it: a rejected or rate-limited submit is
      // not a lead. Crew size is the one field that is not personal data and
      // is what a sales follow-up sorts by.
      track("demo_submitted", { crewSize: form.crewSize });
      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    const rise = (i: number) => ({
      initial: reduced ? false : ({ opacity: 0, y: 14 } as const),
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.35 + i * 0.09, duration: 0.4, ease: EASE },
    });

    return (
      <div className="py-4 md:py-6" role="status">
        {/* The seal lands like a stamp: overshoot spring + impact ring. */}
        <motion.div
          initial={reduced ? false : { scale: 0, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 14 }}
          className="relative grid h-16 w-16 place-items-center rounded-full bg-site-vis text-site-on-vis"
        >
          {!reduced && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full ring-2 ring-site-vis"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.85, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            />
          )}
          <Check size={28} strokeWidth={2.4} />
        </motion.div>

        <motion.h2
          {...rise(0)}
          className="mt-8 font-flex text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[0.98] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
        >
          {t("successTitle")}
        </motion.h2>

        <motion.p {...rise(1)} className="mt-4 max-w-md text-[16px] leading-relaxed text-site-paper/70">
          {t("successBody")}
        </motion.p>

        <motion.div
          {...rise(2)}
          className="mt-8 flex gap-4 rounded-2xl bg-site-night p-5 ring-1 ring-inset ring-site-paper/10"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-site-vis/10 text-site-vis">
            <Mail size={17} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-site-paper">{t("confirmSent")}</p>
            <p className="mt-1 break-words font-mono text-[11px] uppercase tracking-[0.14em] text-site-paper/50">
              {t("fromEmail")}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-site-paper/55">{t("checkSpam")}</p>
          </div>
        </motion.div>

        <motion.div {...rise(3)} className="mt-9">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/60 transition-colors duration-200 hover:text-site-vis"
          >
            {t("backHome")}
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const ring = (field?: keyof FormData, ink = "text-site-paper") =>
    `${ink} ${field && fieldErrors[field] ? "ring-site-alert/70" : "ring-site-paper/15 hover:ring-site-paper/30"}`;

  const FieldError = ({ field }: { field: keyof FormData }) =>
    fieldErrors[field] ? (
      <p id={`${field}-error`} className="mt-2 text-[13px] leading-snug text-site-alert">
        {fieldErrors[field]}
      </p>
    ) : null;

  const errProps = (field: keyof FormData) =>
    fieldErrors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `${field}-error` }
      : {};

  const Req = () => (
    <span aria-hidden className="ml-1 text-site-vis">
      *
    </span>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            {t("name")}
            <Req />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            className={`${FIELD} h-12 ${ring("name")}`}
            placeholder={t("namePlaceholder")}
            {...errProps("name")}
          />
          <FieldError field="name" />
        </div>
        <div>
          <label htmlFor="company" className={LABEL}>
            {t("company")}
            <Req />
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={handleChange}
            className={`${FIELD} h-12 ${ring("company")}`}
            placeholder={t("companyPlaceholder")}
            {...errProps("company")}
          />
          <FieldError field="company" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="crewSize" className={LABEL}>
            {t("crewSize")}
            <Req />
          </label>
          <div className="relative">
            <select
              id="crewSize"
              name="crewSize"
              value={form.crewSize}
              onChange={handleChange}
              className={`${FIELD} h-12 cursor-pointer appearance-none pr-11 ${ring("crewSize", form.crewSize ? "text-site-paper" : "text-site-paper/40")}`}
              {...errProps("crewSize")}
            >
              <option value="" disabled>
                {t("crewSizePlaceholder")}
              </option>
              <option value="1-5" className="text-site-paper">{t("crew1to5")}</option>
              <option value="5-10" className="text-site-paper">{t("crew5to10")}</option>
              <option value="10-25" className="text-site-paper">{t("crew10to25")}</option>
              <option value="25+" className="text-site-paper">{t("crew25plus")}</option>
            </select>
            <ChevronDown
              aria-hidden
              size={17}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-site-paper/50"
            />
          </div>
          <FieldError field="crewSize" />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            {t("email")}
            <Req />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={`${FIELD} h-12 ${ring("email")}`}
            placeholder={t("emailPlaceholder")}
            {...errProps("email")}
          />
          <FieldError field="email" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className={LABEL}>
          {t("phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange}
          className={`${FIELD} h-12 ${ring()}`}
          placeholder={t("phonePlaceholder")}
        />
      </div>
      <div>
        <label htmlFor="challenge" className={LABEL}>
          {t("challenge")}
        </label>
        <textarea
          id="challenge"
          name="challenge"
          rows={4}
          value={form.challenge}
          onChange={handleChange}
          className={`${FIELD} min-h-[128px] resize-y py-3 leading-relaxed ${ring()}`}
          placeholder={t("challengePlaceholder")}
        />
      </div>

      {/* Honeypot — hidden from real users, filled by bots */}
      <input
        type="text"
        name="honeypot"
        value={form.honeypot}
        onChange={handleChange}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      />

      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl bg-site-alert/[0.08] p-4 text-[14px] leading-relaxed text-site-alert ring-1 ring-inset ring-site-alert/30"
        >
          {errorMsg.includes("Too many") || errorMsg.includes("429")
            ? t("errors.tooManyRequests")
            : t("errors.genericError")}
        </div>
      )}

      <div className="mt-2 border-t border-site-paper/10 pt-7">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-14 w-full items-center justify-between gap-4 rounded-full bg-site-vis pl-7 pr-2 text-[16px] font-medium tracking-[-0.005em] text-site-on-vis transition-[background-color,transform] duration-200 ease-out hover:bg-site-vis-hover active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-slab sm:w-auto"
        >
          <span>{status === "sending" ? t("submitting") : bare(t("submit"))}</span>
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-site-on-vis text-site-vis">
            {status === "sending" ? (
              <Loader2 size={17} strokeWidth={2.2} className="animate-spin" />
            ) : (
              <>
                <ArrowRight
                  size={17}
                  strokeWidth={2.2}
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-7"
                />
                <ArrowRight
                  size={17}
                  strokeWidth={2.2}
                  className="absolute -translate-x-7 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
                />
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
