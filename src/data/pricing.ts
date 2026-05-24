// src/data/pricing.ts

export type PricingTier = {
  readonly name: "Free" | "Starter" | "Pro";
  readonly monthlyPrice: number;
  readonly description: string;
};

export const PRICES = {
  starter: { monthly: 149, annual: 1488, annualPerMonth: 124 },
  pro: { monthly: 249, annual: 2484, annualPerMonth: 207 },
} as const;

// Plan-tier copy for the SoftwareApplication JSON-LD schema.
// Keep aligned with the FREE_/STARTER_/PRO_FEATURES lists in Pricing.tsx when plans change.
export const PRICING_TIERS: readonly PricingTier[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "Up to 5 workers, forever. Time tracking, daily logs, tasks, offline-first sync.",
  },
  {
    name: "Starter",
    monthlyPrice: PRICES.starter.monthly,
    description: "Up to 15 workers. Adds per-worker rates, overtime alerts, PDF reports, job costing dashboard, and CSV export.",
  },
  {
    name: "Pro",
    monthlyPrice: PRICES.pro.monthly,
    description: "Unlimited workers. Adds client invoice generator, file & photo attachments, Excel export, advanced analytics, priority support.",
  },
] as const;
