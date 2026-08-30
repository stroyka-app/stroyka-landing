// src/data/pricing.ts

export type PricingTier = {
  readonly name: "Free" | "Starter" | "Pro";
  readonly monthlyPrice: number;
  readonly description: string;
};

// Repriced 2026-08-30. The old $149 floor sold nothing: zero Starter
// subscriptions ever, and the one paying company is on Pro at a locked
// founding rate. Job costing and invoicing moved into Free (capped by
// volume), so the ladder now starts where this buyer actually lives —
// Joist, the closest comparable product, sits at $12/mo with a
// 5-documents-per-month cap and 13,891 ratings behind that decision.
//
// Pro deliberately stays ABOVE $99 so the founding rate remains a real
// discount rather than a price the public can simply buy.
// Annual keeps the standing "two months free" ratio.
export const PRICES = {
  starter: { monthly: 29, annual: 290, annualPerMonth: 24 },
  pro: { monthly: 149, annual: 1490, annualPerMonth: 124 },
} as const;

// Plan-tier copy for the SoftwareApplication JSON-LD schema.
// Keep aligned with the FREE_/STARTER_/PRO_FEATURES lists in Pricing.tsx when plans change.
export const PRICING_TIERS: readonly PricingTier[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "Job costing, P&L and invoicing included, forever. Capped at 2 active jobs and 3 invoices a month. Time tracking, daily logs, tasks, supply requests, contracts, receipt scanning, offline-first sync.",
  },
  {
    name: "Starter",
    monthlyPrice: PRICES.starter.monthly,
    description: "Unlimited active jobs and invoices, up to 15 workers. Adds per-worker rates, overtime alerts, PDF reports and CSV export.",
  },
  {
    name: "Pro",
    monthlyPrice: PRICES.pro.monthly,
    description: "Unlimited workers. Adds the client book with CSV import, file & photo attachments, Excel export, automatic overdue reminders and priority support.",
  },
] as const;
