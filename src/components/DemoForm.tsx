"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HardHat } from "lucide-react";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 space-y-4"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-forest/15 flex items-center justify-center">
            <HardHat size={32} className="text-brand-forest" />
          </div>
        </div>
        <h2 className="font-heading text-2xl font-bold text-brand-sage-mist">
          You&apos;re on the list.
        </h2>
        <p className="text-brand-sage max-w-md mx-auto">
          We&apos;ll reach out within 24 hours to schedule your demo. Check your email
          for a confirmation.
        </p>
        <p className="text-brand-sage/60 text-sm">
          In the meantime, questions? Email us at{" "}
          <a
            href="mailto:hello@getstroyka.com"
            className="text-brand-forest hover:text-brand-sage underline"
          >
            hello@getstroyka.com
          </a>
        </p>
      </motion.div>
    );
  }

  const inputCls =
    "w-full bg-brand-deep/50 border border-brand-deep rounded-xl px-4 py-3 text-white placeholder:text-brand-sage-mist/40 focus:outline-none focus:border-brand-forest transition-colors duration-200 font-body text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm text-brand-sage mb-1.5">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={inputCls}
            placeholder="John Smith"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm text-brand-sage mb-1.5">
            Company name *
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            value={form.company}
            onChange={handleChange}
            className={inputCls}
            placeholder="Smith Construction LLC"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="crewSize" className="block text-sm text-brand-sage mb-1.5">
            Crew size *
          </label>
          <select
            id="crewSize"
            name="crewSize"
            required
            value={form.crewSize}
            onChange={handleChange}
            className={inputCls}
          >
            <option value="" disabled>
              Select crew size
            </option>
            <option value="1-5">1–5 workers</option>
            <option value="5-10">5–10 workers</option>
            <option value="10-25">10–25 workers</option>
            <option value="25+">25+ workers</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-brand-sage mb-1.5">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputCls}
            placeholder="john@smithconstruction.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm text-brand-sage mb-1.5">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className={inputCls}
          placeholder="(555) 123-4567"
        />
      </div>
      <div>
        <label htmlFor="challenge" className="block text-sm text-brand-sage mb-1.5">
          What&apos;s your biggest challenge?
        </label>
        <textarea
          id="challenge"
          name="challenge"
          rows={4}
          value={form.challenge}
          onChange={handleChange}
          className={inputCls}
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
        <div className="rounded-lg border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-300">
          {errorMsg.includes("Too many") || errorMsg.includes("429")
            ? "Too many requests. Please wait an hour and try again, or email us directly at hello@getstroyka.com."
            : "Something went wrong on our end. Please email us at hello@getstroyka.com and we\u2019ll get back to you quickly."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto md:self-start relative inline-flex items-center justify-center font-heading font-semibold tracking-wide rounded-xl transition-colors duration-200 cursor-pointer bg-brand-forest text-white hover:bg-brand-deep active:scale-95 shadow-lg shadow-brand-forest/20 text-lg px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed gap-2"
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
