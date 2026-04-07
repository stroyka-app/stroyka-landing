"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface FormData {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone: string;
  challenge: string;
}

const INITIAL: FormData = {
  name: "",
  company: "",
  crewSize: "",
  email: "",
  phone: "",
  challenge: "",
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
        className="text-center py-16"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-heading text-2xl font-bold mb-3">Demo request received!</h2>
        <p className="text-brand-sage-mist/70 max-w-md mx-auto">
          We&apos;ll reach out within 24 hours to schedule your personalized demo. Looking forward to showing you Stroyka.
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
          <label htmlFor="name" className="block text-sm text-brand-sage mb-1.5">Name *</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className={inputCls} placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm text-brand-sage mb-1.5">Company name *</label>
          <input id="company" name="company" type="text" required value={form.company} onChange={handleChange} className={inputCls} placeholder="Smith Construction LLC" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="crewSize" className="block text-sm text-brand-sage mb-1.5">Crew size *</label>
          <select id="crewSize" name="crewSize" required value={form.crewSize} onChange={handleChange} className={inputCls}>
            <option value="" disabled>Select crew size</option>
            <option value="1-5">1–5 workers</option>
            <option value="5-10">5–10 workers</option>
            <option value="10-25">10–25 workers</option>
            <option value="25+">25+ workers</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-brand-sage mb-1.5">Email *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputCls} placeholder="john@smithconstruction.com" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm text-brand-sage mb-1.5">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputCls} placeholder="(555) 123-4567" />
      </div>
      <div>
        <label htmlFor="challenge" className="block text-sm text-brand-sage mb-1.5">What&apos;s your biggest challenge?</label>
        <textarea id="challenge" name="challenge" rows={4} value={form.challenge} onChange={handleChange} className={inputCls} placeholder="Tell us about your current process and what's not working..." />
      </div>
      {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}
      <Button variant="primary" size="lg" type="submit" disabled={status === "sending"} className="w-full md:w-auto md:self-start">
        {status === "sending" ? "Sending..." : "Request Your Demo"}
      </Button>
    </form>
  );
}
