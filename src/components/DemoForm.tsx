"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HardHat, Mail, ArrowRight } from "lucide-react";

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

export default function DemoForm() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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
      errors.name = "Please enter your name so we know who to reach out to.";
    }
    if (!form.company.trim()) {
      errors.company = "We'd love to know your company name.";
    }
    if (!form.crewSize) {
      errors.crewSize = "Pick a crew size so we can tailor the demo to your team.";
    }
    if (!form.email.trim()) {
      errors.email = "We need your email to send demo details.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "That doesn't look like a valid email — double-check it?";
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

      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    const stagger = {
      hidden: { opacity: 0, y: 16 },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
      }),
    };

    return (
      <div className="text-center py-12 space-y-6">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-brand-sage/15 border border-brand-sage/45 flex items-center justify-center shadow-[0_8px_24px_-10px_rgba(63,78,53,0.45)]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <HardHat size={32} strokeWidth={1.6} className="text-brand-forest" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          custom={1}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="font-display font-light text-3xl lg:text-4xl leading-tight text-ink tracking-[-0.01em]"
        >
          You&rsquo;re on the list
        </motion.h2>

        <motion.p
          custom={2}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-ink-soft max-w-md mx-auto text-[15px] lg:text-base leading-relaxed"
        >
          We&rsquo;ll reach out within 24 hours to schedule your demo.
        </motion.p>

        {/* Email notice card — bone stone surface */}
        <motion.div
          custom={3}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="card-stone border border-ink/15 rounded-2xl p-5 max-w-sm mx-auto"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-sage/15 border border-brand-sage/40 text-brand-forest flex items-center justify-center shrink-0">
              <Mail size={16} strokeWidth={1.8} />
            </div>
            <div className="text-left">
              <p className="text-ink text-sm font-medium">
                Confirmation sent to your email
              </p>
              <p className="text-ink-muted text-[11px] font-mono tracking-[0.08em] mt-0.5">
                from hello@getstroyka.com
              </p>
            </div>
          </div>
          <p className="text-ink-muted text-[11px] text-left font-mono tracking-[0.05em]">
            Don&rsquo;t see it? Check your spam or promotions folder.
          </p>
        </motion.div>

        <motion.div
          custom={4}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted hover:text-brand-forest transition-colors duration-200 group"
          >
            Back to homepage
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputCls = (field?: keyof FormData) =>
    `w-full bg-bone-soft/80 border ${
      field && fieldErrors[field]
        ? "border-red-500/60"
        : "border-ink/20 hover:border-ink/35"
    } rounded-xl px-4 py-3 text-ink placeholder:text-ink-muted/55 focus:outline-none focus:border-brand-forest focus:bg-bone transition-colors duration-200 font-body text-[15px]`;

  const FieldError = ({ field }: { field: keyof FormData }) =>
    fieldErrors[field] ? (
      <p className="text-[12px] text-red-600 mt-1.5">{fieldErrors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={inputCls("name")}
            placeholder="John Smith"
          />
          <FieldError field="name" />
        </div>
        <div>
          <label htmlFor="company" className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2">
            Company name *
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            className={inputCls("company")}
            placeholder="Smith Construction LLC"
          />
          <FieldError field="company" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="crewSize" className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2">
            Crew size *
          </label>
          <select
            id="crewSize"
            name="crewSize"
            value={form.crewSize}
            onChange={handleChange}
            className={inputCls("crewSize")}
          >
            <option value="" disabled>
              Select crew size
            </option>
            <option value="1-5">1–5 workers</option>
            <option value="5-10">5–10 workers</option>
            <option value="10-25">10–25 workers</option>
            <option value="25+">25+ workers</option>
          </select>
          <FieldError field="crewSize" />
        </div>
        <div>
          <label htmlFor="email" className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputCls("email")}
            placeholder="john@smithconstruction.com"
          />
          <FieldError field="email" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className={inputCls()}
          placeholder="(555) 123-4567"
        />
      </div>
      <div>
        <label htmlFor="challenge" className="block font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-2">
          What&apos;s your biggest challenge?
        </label>
        <textarea
          id="challenge"
          name="challenge"
          rows={4}
          value={form.challenge}
          onChange={handleChange}
          className={inputCls()}
          placeholder="Tell us about your current process and what's not working..."
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
        <div className="rounded-xl border border-red-500/35 bg-red-50/70 p-4 text-sm text-red-700">
          {errorMsg.includes("Too many") || errorMsg.includes("429")
            ? "Too many requests. Please wait an hour and try again, or email us directly at hello@getstroyka.com."
            : "Something went wrong on our end. Please email us at hello@getstroyka.com and we\u2019ll get back to you quickly."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto md:self-start relative inline-flex items-center justify-center font-heading font-semibold tracking-wide rounded-full transition-colors duration-200 cursor-pointer bg-brand-deep text-bone hover:bg-brand-midnight-dark active:scale-95 shadow-[0_10px_28px_-12px_rgba(43,61,48,0.5)] text-[15px] px-7 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed gap-2"
      >
        {status === "sending" ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Request Your Demo →"
        )}
      </button>
    </form>
  );
}
