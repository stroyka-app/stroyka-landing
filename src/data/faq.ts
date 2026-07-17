// src/data/faq.ts
export type FaqItem = {
  readonly q: string;
  readonly a: string;
  readonly meta: string;
};

export const QUESTIONS: readonly FaqItem[] = [
  {
    q: "Does it work without internet?",
    a: "Yes. Stroyka is offline-first — all data is stored locally on each device and syncs automatically when a connection is restored. Workers in basements, rural areas, or anywhere with poor signal can still log time, submit requests, and view tasks.",
    meta: "Offline",
  },
  {
    q: "How do workers join?",
    a: "The boss sends email invites directly from the app. Workers click the link, create a password, and they're in. No app store download required for web — it runs in the browser on any phone.",
    meta: "Setup",
  },
  {
    q: "What happens if a worker leaves?",
    a: "You can deactivate a worker's account instantly from the app. They immediately lose access. Their historical timesheet and cost data stays in your account.",
    meta: "Admin",
  },
  {
    q: "Is my data secure?",
    a: "Your company's data is siloed from every other company's data at the database level — we don't mingle it, don't share it, don't sell it. Encrypted at rest and in transit, hosted on battle-tested infrastructure. See our Privacy Policy for the specifics.",
    meta: "Security",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Every project, timesheet, and cost record can be exported as CSV or PDF at any time. If you ever cancel, you have 30 days to export everything.",
    meta: "Data",
  },
  {
    q: "Why not just use enterprise construction software?",
    a: "Most construction platforms are designed for large general contractors with dedicated office staff and IT teams. They cost $500–$1,000+/month, take weeks to onboard, and charge per seat. Stroyka is purpose-built for small crews of 5–25 workers — the people who actually swing hammers. Flat pricing, no per-seat fees, no training required. Your crew can be up and running the same day.",
    meta: "Comparison",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — start free for up to 5 workers, forever. Need more? Claim a founding spot at $99/mo locked for life, or book a 20-minute demo and we'll walk you through the app live with your own sample data.",
    meta: "Pricing",
  },
  {
    q: "How do I bill my clients?",
    a: "Generate an invoice from any project's unbilled hours, materials, and fuel — add markup or custom line items, then email the PDF to your client right from the app. If an invoice goes overdue, send a one-tap payment reminder, or turn on automatic reminders and Stroyka politely follows up for you (up to 3 times).",
    meta: "Invoicing",
  },
];
