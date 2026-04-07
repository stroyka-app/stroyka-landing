# Claude Code Prompt — Stroyka Landing Page (Section 5)

> **Repo:** `stroyka-landing` (separate repo from the Flutter app)
> **Paste this entire prompt** into Claude Code in the `stroyka-landing` directory.
> If the repo doesn't exist yet, create it first: `mkdir stroyka-landing && cd stroyka-landing`

---

## Project Overview

You are building the marketing website for **Stroyka** — a construction job-costing and crew management SaaS app targeting small US construction crews (5–20 workers). The website lives at **getstroyka.com** and is the primary sales and conversion tool before the app launches to the public.

**Tech stack:**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (with custom brand tokens)
- Framer Motion (for scroll animations and micro-interactions)
- `next/font` for Google Fonts (Space Grotesk + Inter)
- Deployed to Vercel

**Primary goal of this website:**
Get a construction company owner to book a demo call or join the waitlist. Everything on the page should drive toward that single action.

---

## Project Setup

### 1. Initialize the project (if not already done)

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install framer-motion
```

### 2. Tailwind config — brand tokens

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          "sage-mist": "#cad2c5",
          sage:        "#84a98c",
          forest:      "#52796f",
          deep:        "#354f52",
          midnight:    "#2f3e46",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)",         "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease-out forwards",
        "fade-in":   "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

### 3. Root layout — fonts and metadata

`src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stroyka — Construction Management for Real Crews",
  description:
    "Job costing, crew management, and supply tracking built for small construction teams. Offline-first. Simple pricing. No enterprise bloat.",
  metadataBase: new URL("https://getstroyka.com"),
  openGraph: {
    title: "Stroyka — Construction Management for Real Crews",
    description: "Job costing, crew management, and supply tracking built for small construction teams.",
    url: "https://getstroyka.com",
    siteName: "Stroyka",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroyka — Construction Management for Real Crews",
    description: "Job costing, crew management, and supply tracking built for small construction teams.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-brand-midnight text-white antialiased font-body">
        {children}
      </body>
    </html>
  );
}
```

### 4. Global CSS

`src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  ::selection {
    background-color: #52796f;
    color: #cad2c5;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## Component Architecture

Create these files in `src/components/`:

```
src/
  app/
    page.tsx          ← Main landing page (assembles all sections)
    layout.tsx        ← Root layout (fonts, metadata)
    globals.css
  components/
    Logo.tsx          ← SVG logo as React component
    Navbar.tsx        ← Sticky nav with glassmorphism on scroll
    Hero.tsx          ← Hero section
    Problem.tsx       ← Pain point section
    Features.tsx      ← 4 feature cards
    HowItWorks.tsx    ← Boss + Worker workflow steps
    Screenshots.tsx   ← App screenshot showcase
    Pricing.tsx       ← Pricing cards
    FAQ.tsx           ← Accordion FAQ
    CTABanner.tsx     ← Bottom CTA
    Footer.tsx        ← Links and legal
    ui/
      Button.tsx      ← Reusable button variants
      FadeIn.tsx      ← Scroll-triggered fade animation wrapper
      SectionLabel.tsx ← Uppercase section eyebrow labels
```

---

## Component Specifications

### `Logo.tsx` — The Cornerstone Mark

```typescript
// src/components/Logo.tsx
interface LogoProps {
  variant?: "dark" | "light";  // dark = for dark backgrounds, light = for light backgrounds
  size?: number;                // height in px, default 36
  showWordmark?: boolean;       // show STROYKA text, default true
}

export default function Logo({ variant = "dark", size = 36, showWordmark = true }: LogoProps) {
  const markColors = variant === "dark"
    ? { bracketTop: "#cad2c5", bracketBot: "#52796f", dotTop: "#84a98c", dotBot: "#52796f" }
    : { bracketTop: "#2f3e46", bracketBot: "#52796f", dotTop: "#354f52", dotBot: "#84a98c" };

  const textColor = variant === "dark" ? "#ffffff" : "#2f3e46";
  const dividerColor = variant === "dark" ? "rgba(255,255,255,0.2)" : "rgba(47,62,70,0.2)";

  return (
    <div className="flex items-center gap-3.5" role="img" aria-label="Stroyka">
      {/* Cornerstone mark */}
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M6 28 L6 6 L28 6"
          stroke={markColors.bracketTop} strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"/>
        <path d="M50 28 L50 50 L28 50"
          stroke={markColors.bracketBot} strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"/>
        <circle cx="6" cy="6" r="4" fill={markColors.dotTop}/>
        <circle cx="50" cy="50" r="4" fill={markColors.dotBot}/>
      </svg>

      {showWordmark && (
        <>
          <div style={{ width: 1, height: size * 0.7, background: dividerColor }} />
          <span
            className="font-heading font-bold tracking-widest uppercase"
            style={{ fontSize: size * 0.52, color: textColor, letterSpacing: "0.1em" }}
          >
            Stroyka
          </span>
        </>
      )}
    </div>
  );
}
```

### `ui/Button.tsx`

```typescript
// src/components/ui/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Button({ variant = "primary", size = "md", href, children, className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-heading font-600 tracking-wide rounded-xl transition-all duration-200 cursor-pointer";
  const variants = {
    primary:   "bg-brand-forest text-white hover:bg-brand-deep active:scale-95 shadow-lg shadow-brand-forest/20",
    secondary: "border border-brand-forest text-brand-sage hover:bg-brand-forest/10 active:scale-95",
    ghost:     "text-brand-sage hover:text-white active:scale-95",
  };
  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button className={cls} {...props}>{children}</button>;
}
```

### `ui/FadeIn.tsx` — Scroll Animation Wrapper

```typescript
// src/components/ui/FadeIn.tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export default function FadeIn({ children, delay = 0, direction = "up", className }: FadeInProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const dirs = {
    up:    { y: 28 }, down: { y: -28 },
    left:  { x: 28 }, right: { x: -28 },
    none:  {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### `ui/SectionLabel.tsx`

```typescript
// src/components/ui/SectionLabel.tsx
export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-xs font-semibold tracking-[0.2em] uppercase text-brand-forest mb-3">
      {children}
    </p>
  );
}
```

---

## Page Sections — Full Specifications

### `Navbar.tsx`

- Sticky at top (`position: fixed`, `top: 0`, full width, `z-50`)
- Default state: transparent background
- On scroll (>50px): `backdrop-blur-md` + `bg-brand-midnight/80` + subtle bottom border `border-brand-deep`
- Use `useScrollPosition` hook to detect scroll
- Left: `<Logo variant="dark" size={32} />`
- Center (desktop only): nav links — Features, How It Works, Pricing, FAQ
- Right: `<Button variant="secondary" size="sm" href="#demo">Request Demo</Button>`
- Mobile: hamburger menu → slide-down drawer with the same links
- Smooth transition for all state changes (200ms)

### `Hero.tsx`

**Layout:** Two-column on desktop (text left, visual right), stacked on mobile.

**Left column content:**

```
[eyebrow label]
Construction Management
for Real Crews

[headline — 52-60px, Space Grotesk 700, tight leading]

Stop cobbling together spreadsheets, text messages, and gut feelings
to run your jobsites. Stroyka gives your whole crew — boss and workers —
one simple tool that works even without cell service.

[two CTAs, side by side]
→ "Request a Demo"  [primary button, large]
→ "See How It Works"  [ghost button, large, links to #how-it-works]

[trust signal below CTAs]
⚡ Offline-first · 👷 Built for crews of 5–20 · 💳 Flat monthly pricing
```

**Right column:** A subtle dark card/frame containing a screenshot of the app Dashboard. Use a placeholder image (`/screenshots/dashboard.png`) wrapped in a mock phone/tablet frame. Add a slight tilt (`rotate-1`) and floating shadow. The frame itself should use `bg-brand-deep` with a `ring-1 ring-brand-forest/30` border and `rounded-2xl`.

**Background:** Full-section dark background `bg-brand-midnight`. Subtle radial gradient bloom behind the right-side visual: `radial-gradient(ellipse 60% 60% at 75% 50%, rgba(82,121,111,0.15) 0%, transparent 70%)`.

**Animation:** Left column text fades up in sequence (eyebrow → headline → subtext → CTAs, each 100ms staggered). Right column fades in from right.

### `Problem.tsx`

**Purpose:** Agitate the pain before presenting the solution.

**Layout:** Centered, max-width 680px.

```
[eyebrow] The Problem

Construction runs on chaos

Your current system: a group chat for requests, a spreadsheet for budgets,
a whiteboard for tasks, and hope that someone remembers to update it.
When a worker buys materials, you find out at month-end. When a project
goes over budget, you find out too late.

[3 pain cards in a row]

Card 1: 💸 "Budget surprises"
"You only know you went over budget after the project ends."

Card 2: 📵 "No cell service, no updates"
"Workers can't log time or submit requests when they're underground or in remote areas."

Card 3: 👔 "Tools built for enterprise"
"Procore costs $500+/month and requires an onboarding team. You need something that works on day one."
```

**Pain cards:** `bg-brand-deep/50` background, `border border-brand-deep`, `rounded-2xl`, generous padding. Icon in `text-brand-sage` color. Headline bold. Body text `text-brand-sage-mist/70`.

### `Features.tsx`

**Layout:** 2×2 grid on desktop, 1 column on mobile.

**Section header:**
```
[eyebrow] Features
Everything your crew needs.
Nothing they don't.
```

**4 Feature cards:**

**Card 1 — Offline-First Sync**
Icon: signal bars with X (or wifi-off)
Headline: Works without cell service
Body: Stroyka stores everything locally on each device and syncs automatically when a connection returns. Workers can log time, submit requests, and check tasks at any job site — basement, rural, or underground.

**Card 2 — Boss + Worker Roles**
Icon: two people / hierarchy
Headline: Built for both sides of the crew
Body: Bosses get budget tracking, approval workflows, and real-time cost reports. Workers get a focused view of their tasks, time logging, and request submission. Same app, purpose-built for each role.

**Card 3 — Real-Time Job Costing**
Icon: dollar sign / chart
Headline: Know your numbers before month-end
Body: Every purchase, timesheet entry, and fuel trip rolls up automatically into a project P&L. See labor costs, material spend, and budget remaining at a glance — updated the moment a worker submits.

**Card 4 — Supply Request Workflow**
Icon: clipboard / checklist
Headline: No more "did you approve that?"
Body: Workers submit material or supply requests from the field. Bosses review and approve with one tap. Approved items auto-log to project costs. Full audit trail, no text message chains.

**Card styling:** `bg-brand-deep/40` background, `border border-brand-deep hover:border-brand-forest` transition, `rounded-2xl`, `p-8`. Icon container: 48×48px `bg-brand-forest/15` rounded-xl with `text-brand-sage` icon. Headline: `text-xl font-heading font-semibold`. Body: `text-brand-sage-mist/65 text-sm leading-relaxed`.

### `HowItWorks.tsx`

**Purpose:** Show simplicity. Two perspectives: Boss and Worker.

**Section header:**
```
[eyebrow] How It Works
Simple for everyone.
```

**Two-tab or two-column layout:**

**Boss tab:**
Step 1 — Create a project. Add the name, address, and budget. Takes 30 seconds.
Step 2 — Invite your crew. Workers get an email invite and join with one tap. No account setup forms.
Step 3 — Watch costs update. As workers log time and submit requests, your project P&L updates in real time.

**Worker tab:**
Step 1 — Accept your invite. Tap the link in your email. You're in.
Step 2 — See your tasks. Your boss assigns tasks with instructions and priority. They're waiting for you when you open the app.
Step 3 — Log and submit. Clock in, submit supply requests, mark tasks done. Works offline — it all syncs when you get signal.

**Tab switcher:** Two pill buttons, "For the Boss" and "For the Crew". Active tab: `bg-brand-forest text-white`. Inactive: `text-brand-sage hover:text-white`. Steps numbered with large dim numbers `text-brand-forest/20 text-7xl font-heading font-bold` overlapping behind the step content.

### `Screenshots.tsx`

**Purpose:** Social proof through product visuals. Show the app looks professional and complete.

**Layout:** Horizontal scroll on mobile, 3-column grid on desktop.

**Screenshots to include (use placeholder paths — swap with real screenshots):**
- `/screenshots/dashboard.png` — "Real-time project P&L"
- `/screenshots/tasks.png` — "Task management with priorities"
- `/screenshots/requests.png` — "Supply request workflow"

**Each screenshot:** Wrapped in a dark card frame (`bg-brand-deep rounded-2xl ring-1 ring-brand-forest/25 p-3`), with a small label below (`text-xs text-brand-sage uppercase tracking-wider`).

**Section header:**
```
[eyebrow] The App
See it in action
```

Add a subtle note below the screenshots: "Screenshots from the live app. Request a personalized demo to see your own projects and crew."

### `Pricing.tsx`

**Layout:** Two cards side by side on desktop, stacked on mobile. Center-aligned section header.

**Section header:**
```
[eyebrow] Pricing
One price. Whole crew included.

No per-seat fees. No hidden add-ons. One flat monthly rate —
your entire team uses Stroyka for the same price.
```

**Card 1 — Starter** (left card)
- Price: **$149 / month**
- Subtitle: "For crews up to 10 workers"
- Features list:
  - ✓ Unlimited projects
  - ✓ Up to 10 workers
  - ✓ Job costing & P&L reports
  - ✓ Time tracking & timesheets
  - ✓ Supply request workflow
  - ✓ Offline-first sync
  - ✓ CSV & PDF export
  - ✓ Email support
- CTA: "Request Demo" (secondary button)

**Card 2 — Pro** (right card, highlighted)
- Badge: "Most Popular" (small pill, `bg-brand-forest text-white`)
- Price: **$299 / month**
- Subtitle: "For crews up to 25 workers"
- All Starter features, plus:
  - ✓ Up to 25 workers
  - ✓ Advanced reporting
  - ✓ Priority support
  - ✓ Dedicated onboarding call
- CTA: "Request Demo" (primary button)

**Founding Member callout — render this BELOW both pricing cards, above the note:**

A slim banner/card spanning the full width of the pricing section (or just below the two cards), styled differently to stand out — use a subtle amber/warm tint to contrast with the green palette, or a dashed border to signal "limited offer":

```
🔒  Founding Member Rate — $99/month, locked forever

The first 20 companies to sign up lock in $99/month for life.
Price never increases, no matter what the public rate becomes.
[  Claim a Founding Spot →  ]   (primary button, links to demo request)

[░░░░░░░░░░░░░░░░░  ] 12 of 20 spots remaining   ← placeholder, update manually
```

Style: `border border-dashed border-brand-sage/40 rounded-2xl p-8 text-center`. The "spots remaining" bar is a simple visual element — just a div with partial fill. **Hardcode "12 of 20" as a starting placeholder**; update this number manually as spots fill. When all 20 are taken, remove this entire callout.

**Note below cards:** "Not sure which plan fits? Book a 20-minute demo and we'll recommend the right one for your crew size."

**Starter card:** `bg-brand-deep/50 border border-brand-deep` — understated.
**Pro card:** `bg-brand-deep border border-brand-forest ring-1 ring-brand-forest/30` — distinguished. Slight scale-up on hover (`hover:scale-[1.02]` transition).
**Founding Member callout:** `bg-brand-deep/30 border border-dashed border-brand-sage/30` — distinct from both cards, feels special and limited.

### `FAQ.tsx`

**Accordion component** — click to expand, smooth height animation.

**Questions:**

1. **Does it work without internet?**
   Yes. Stroyka is offline-first — all data is stored locally on each device and syncs automatically when a connection is restored. Workers in basements, rural areas, or anywhere with poor signal can still log time, submit requests, and view tasks.

2. **How do workers join?**
   The boss sends email invites directly from the app. Workers click the link, create a password, and they're in. No app store download required for web — it runs in the browser on any phone.

3. **What happens if a worker leaves?**
   You can deactivate a worker's account instantly from the app. They immediately lose access. Their historical timesheet and cost data stays in your account.

4. **Is my data secure?**
   Stroyka runs on Supabase (enterprise-grade PostgreSQL) with row-level security — meaning your company's data is completely isolated from other companies at the database level. We don't share or sell your data. See our Privacy Policy for full details.

5. **Can I export my data?**
   Yes. Every project, timesheet, and cost record can be exported as CSV or PDF at any time. If you ever cancel, you have 30 days to export everything.

6. **How is Stroyka different from Procore or Buildertrend?**
   Those tools are built for large general contractors and cost $500–$1,000+/month with complex onboarding. Stroyka is built specifically for small crews (5–25 workers) who need job costing and crew coordination — not enterprise project management. Flat pricing from $149/month, no per-seat fees, works on day one.

7. **Is there a free trial?**
   We're currently offering personalized demos for early customers. Request a demo and we'll walk you through the app live with your own sample data.

**Accordion styling:** Question row: `flex justify-between items-center py-5 border-b border-brand-deep cursor-pointer`. Hover: `text-white`. Expanded: `text-brand-sage`. Answer: `text-brand-sage-mist/70 text-sm leading-relaxed pb-5`. Chevron icon rotates 180° when expanded.

### `CTABanner.tsx`

**Full-width section**, slightly lighter background than surrounding (`bg-brand-deep/30` with a centered radial glow).

**Content (centered):**
```
Ready to stop guessing and start knowing?

Book a 20-minute demo. We'll show you Stroyka
live with a real project and real crew data.

[Button: "Book Your Demo →"]  [large, primary]

No commitment. No credit card. Just a conversation.
```

### `Footer.tsx`

**Layout:** Two rows. Top: logo + nav links. Bottom: copyright + legal links.

**Top row:**
- Left: `<Logo variant="dark" size={28} />`
- Right: horizontal links — Features, Pricing, FAQ, Privacy Policy, Terms of Service

**Bottom row:**
- Left: `© 2025 Stroyka. All rights reserved.`
- Right: "Made for crews who build things."

**Styling:** `bg-brand-midnight border-t border-brand-deep py-12`. Text `text-brand-sage/50 text-sm`.

---

## Main Page Assembly

`src/app/page.tsx`:

```typescript
import Navbar       from "@/components/Navbar";
import Hero         from "@/components/Hero";
import Problem      from "@/components/Problem";
import Features     from "@/components/Features";
import HowItWorks   from "@/components/HowItWorks";
import Screenshots  from "@/components/Screenshots";
import Pricing      from "@/components/Pricing";
import FAQ          from "@/components/FAQ";
import CTABanner    from "@/components/CTABanner";
import Footer       from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <Screenshots />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  );
}
```

---

## Design System Rules

### Spacing
- Section padding: `py-24 lg:py-32`
- Section max-width: `max-w-6xl mx-auto px-6`
- Card padding: `p-8`
- Between section label and headline: `mb-3`
- Between headline and body: `mb-6`

### Typography Scale
- Hero headline: `text-5xl lg:text-7xl font-heading font-bold leading-[1.05] text-balance`
- Section headline: `text-4xl lg:text-5xl font-heading font-bold leading-tight`
- Card headline: `text-xl font-heading font-semibold`
- Body text: `text-base font-body text-brand-sage-mist/75 leading-relaxed`
- Caption / eyebrow: `text-xs font-heading font-semibold tracking-[0.2em] uppercase text-brand-forest`

### Colors in context
- Page background: `bg-brand-midnight` (#2f3e46)
- Card background: `bg-brand-deep/50` (#354f52 at 50% opacity)
- Primary accent (CTAs, active states): `bg-brand-forest` (#52796f)
- Text primary: `text-white`
- Text secondary: `text-brand-sage` (#84a98c)
- Text tertiary: `text-brand-sage-mist/60` (#cad2c5 at 60%)
- Border default: `border-brand-deep` (#354f52)
- Border accent: `border-brand-forest` (#52796f)

### Animation rules
- Wrap every section's content in `<FadeIn>` with staggered delays (0, 0.1, 0.2, etc.)
- Page elements animate once on scroll (use `useInView` with `once: true`)
- Hover transitions: 200ms ease
- No animation should exceed 600ms duration
- Respect `prefers-reduced-motion` — wrap Framer Motion usage:
  ```typescript
  const prefersReduced = useReducedMotion();
  // skip animations if true
  ```

---

## Static Assets

Create a `public/` directory with these placeholder files (you'll replace with real assets later):

```
public/
  favicon-32.png       ← Export from brand/favicon-strata-dark.svg at 32x32
  favicon-16.png       ← Export from brand/favicon-strata-dark.svg at 16x16
  apple-touch-icon.png ← Export from brand/app-icon-512.svg at 180x180
  og-image.png         ← Create: 1200x630, dark teal bg, centered logo + tagline
  screenshots/
    dashboard.png      ← App screenshot (replace with real)
    tasks.png          ← App screenshot (replace with real)
    requests.png       ← App screenshot (replace with real)
```

**For placeholder screenshots:** Use a simple dark rectangle with the app color scheme and a centered label ("Dashboard", "Tasks", "Requests") so the layout renders correctly before real screenshots are added.

**For og-image.png:** Create programmatically or with a simple canvas: `#2f3e46` background, Cornerstone mark left-center, "Stroyka" wordmark, tagline "Construction Management for Real Crews" in `#84a98c`.

---

## Demo Request Flow

The "Request Demo" and "Book Your Demo" buttons should link to:

**Option A (simplest):** A `mailto:` link — `mailto:hello@getstroyka.com?subject=Demo%20Request`

**Option B (recommended):** A simple contact form at `/demo` route:
- Name, Company name, Crew size (dropdown: 1-5, 5-10, 10-25, 25+), Email, Phone (optional), "What's your biggest challenge?" (text area)
- On submit: send via a Next.js API route to `hello@getstroyka.com` using Resend (already set up in the Flutter app backend — use the same API key)
- Success state: friendly confirmation message

Implement Option A first, add Option B as a follow-up improvement.

---

## Vercel Deployment

```bash
# In the stroyka-landing directory:
vercel --prod

# Or connect the repo to Vercel dashboard at vercel.com
# Project settings:
#   Framework: Next.js
#   Build command: next build
#   Output directory: .next
#   Install command: npm install
```

**Environment variables to set in Vercel:**
- `RESEND_API_KEY` — same key used in the Flutter app (for the contact form)
- `NEXT_PUBLIC_APP_URL` — `https://app.getstroyka.com` (future app URL)

**Custom domain:** In Vercel project settings → Domains → Add `getstroyka.com` and `www.getstroyka.com`. Point your Wix DNS to Vercel's nameservers or add the Vercel-provided A and CNAME records.

---

## Quality Checklist

Before considering this prompt complete:

- [ ] Site builds without TypeScript errors (`npm run build`)
- [ ] All 8 sections render correctly on desktop (1280px+)
- [ ] All sections stack correctly on mobile (375px)
- [ ] Navbar becomes opaque on scroll (test by scrolling)
- [ ] All CTA buttons link correctly (demo request or mailto)
- [ ] FadeIn animations work on scroll (test by refreshing and scrolling slowly)
- [ ] No Tailwind class conflicts or undefined brand colors
- [ ] Fonts load correctly (Space Grotesk for headings, Inter for body)
- [ ] Logo renders at correct size in navbar and footer
- [ ] Pricing cards display correctly (Starter understated, Pro highlighted)
- [ ] FAQ accordion opens/closes smoothly
- [ ] Page title and meta description set correctly
- [ ] OG meta tags present (for social sharing)
- [ ] `npm run lint` passes with no errors
- [ ] Lighthouse Performance score > 85 on desktop

---

*This prompt is Section 5 of the Stroyka Master Action Plan. After completion, proceed to Section 6: Demo Video (script, screen recording, narration).*
