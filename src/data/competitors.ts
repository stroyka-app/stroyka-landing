// src/data/competitors.ts
//
// EVERY NUMBER ON THE COMPARISON PAGE COMES FROM HERE, AND EVERY NUMBER HERE
// CARRIES ITS SOURCE. That is not bookkeeping fussiness — the entire premise
// of /compare/construction-job-costing-cost is "here is the honest
// arithmetic." One made-up figure and the page is worth less than nothing,
// because the competitor it misquotes will be the first to read it.
//
// RULES FOR EDITING
//   1. A price goes in ONLY if it is published in the page TEXT at `source`.
//      Several vendors render pricing in JS that does not appear in the
//      served HTML; those belong in HIDDEN_PRICING, not here.
//   2. `verifiedOn` is the day a human or an agent actually read that page.
//      Stale beats wrong, but stale is still a liability: re-check quarterly.
//   3. Never round in our favour. If a rate is annual-billing-only, say so in
//      `note` — a monthly buyer pays more, and claiming otherwise is the kind
//      of error that gets a page cited AGAINST us.
//
// Verified 2026-09-23.

export type CrewCost = {
  /** Total $/month for a crew of `n` — null when the vendor publishes no price. */
  (n: number): number | null;
};

export type Competitor = {
  readonly id: string;
  readonly name: string;
  /** How the bill is built, in the vendor's own words. */
  readonly model: string;
  readonly source: string;
  readonly verifiedOn: string;
  readonly note?: string;
  /** Monthly total for a crew of n. */
  readonly costFor: (n: number) => number;
};

/**
 * Workyard. $6/user/mo + $50 base, billed annually.
 *
 * Quoted from Workyard's OWN comparison page, which is the same page that
 * currently ranks first for "best app to track job costs for a small
 * construction crew". Using a vendor's published figure against them is fair;
 * inventing one is not.
 */
export const WORKYARD: Competitor = {
  id: "workyard",
  name: "Workyard",
  model: "$6 per user / month + $50 base",
  source: "https://www.workyard.com/compare/job-costing-software",
  verifiedOn: "2026-09-23",
  note: "Rate shown is annual billing. Monthly billing costs more.",
  costFor: (n) => 50 + 6 * n,
};

/**
 * Knowify. Published as two fixed points rather than a formula:
 * $99/mo for 1 user, $329/mo for 10 users.
 *
 * We interpolate BETWEEN those two points and refuse to extrapolate past 10,
 * because a straight line through two marketing figures is a guess, and a
 * guess is exactly what this page must not contain. Above 10 the UI says
 * "not published" instead of drawing a number.
 */
export const KNOWIFY: Competitor = {
  id: "knowify",
  name: "Knowify",
  model: "$99/mo for 1 user · $329/mo for 10",
  source: "https://www.workyard.com/compare/job-costing-software",
  verifiedOn: "2026-09-23",
  note: "Only two price points are published. Between them we interpolate; above 10 users we do not guess.",
  costFor: (n) => {
    if (n <= 1) return 99;
    if (n >= 10) return 329;
    return Math.round(99 + ((329 - 99) * (n - 1)) / 9);
  },
};

export const COMPETITORS: readonly Competitor[] = [WORKYARD, KNOWIFY] as const;

/** Above this crew size Knowify's published range runs out. */
export const KNOWIFY_PUBLISHED_MAX = 10;

/**
 * The rest of the category will not tell you the price at all.
 *
 * This list is quoted from Workyard's comparison page too — a competitor
 * confirming that its own competitors hide their pricing is about as
 * unimpeachable as sourcing gets. For a contractor deciding on a Sunday
 * evening, "request a quote" is a wall, and naming the wall is useful
 * information rather than a cheap shot.
 */
export const HIDDEN_PRICING: readonly { name: string; detail: string }[] = [
  { name: "Procore", detail: "Custom quote, based on your annual construction volume" },
  { name: "Buildertrend", detail: "No standard rates published — custom quote" },
  { name: "Sage Intacct Construction", detail: "Quote only" },
  { name: "FOUNDATION", detail: "No published pricing — priced by module" },
  { name: "HCSS HeavyJob", detail: "No published pricing — custom quote" },
  { name: "CMiC", detail: "Enterprise quote only" },
] as const;

export const HIDDEN_PRICING_SOURCE = "https://www.workyard.com/compare/job-costing-software";

/**
 * Stroyka's own ladder. Kept in sync with `src/data/pricing.ts` and, upstream
 * of both, `lib/features/auth/auth_providers.dart` in the app repo — the plan
 * gates there are the real contract. If those disagree with this file, this
 * file is wrong.
 */
export type StroykaPlan = {
  readonly name: "Free" | "Starter" | "Pro";
  readonly monthly: number;
  /** Highest crew size this plan covers; Infinity for unlimited. */
  readonly maxWorkers: number;
  readonly caps: string;
};

export const STROYKA_PLANS: readonly StroykaPlan[] = [
  { name: "Free", monthly: 0, maxWorkers: 5, caps: "3 active jobs · 3 invoices a month" },
  { name: "Starter", monthly: 29, maxWorkers: 15, caps: "Unlimited jobs and invoices" },
  { name: "Pro", monthly: 149, maxWorkers: Infinity, caps: "Unlimited workers" },
] as const;

/** The cheapest Stroyka plan that actually covers a crew of `n`. */
export function stroykaPlanFor(n: number): StroykaPlan {
  return STROYKA_PLANS.find((p) => n <= p.maxWorkers) ?? STROYKA_PLANS[STROYKA_PLANS.length - 1];
}

export const MAX_CREW = 25;
export const DEFAULT_CREW = 10;
