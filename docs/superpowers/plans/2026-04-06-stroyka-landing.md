# Stroyka Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the marketing website for Stroyka at getstroyka.com — a single-page landing with 8 WOW interaction effects, a `/demo` form page with Resend email + Telegram bot notification, deployed to Vercel.

**Architecture:** Next.js 14 App Router with TypeScript. Tailwind CSS for styling with custom brand tokens. Framer Motion for all animations. Lenis for smooth scrolling. Server-side API route for form submission (Resend + Telegram in parallel). All WOW effects are client-side with `prefers-reduced-motion` fallbacks.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lenis, Resend, Telegram Bot API

**Spec:** `docs/superpowers/specs/2026-04-06-stroyka-landing-design.md`

---

## File Structure

```
src/
  app/
    layout.tsx                 ← Root layout: fonts, metadata, Lenis, CursorDot
    page.tsx                   ← Landing page: assembles all sections
    globals.css                ← Tailwind directives, base styles, selection
    demo/
      page.tsx                 ← Demo request form page
    api/
      demo/
        route.ts               ← POST handler: Resend email + Telegram notification
  components/
    Logo.tsx                   ← SVG logo React component
    Navbar.tsx                 ← Sticky glassmorphism nav
    Hero.tsx                   ← Hero with video + geometric overlay + falling letter
    Problem.tsx                ← Pain points section
    Features.tsx               ← 4 feature cards with parallax + 3D tilt
    HowItWorks.tsx             ← Boss/Worker tabbed workflow
    Screenshots.tsx            ← App screenshot showcase
    Pricing.tsx                ← Pricing cards + founding member callout
    FAQ.tsx                    ← Accordion FAQ
    CTABanner.tsx              ← Bottom CTA section
    Footer.tsx                 ← Footer with links
    DemoForm.tsx               ← Contact form component
    CursorDot.tsx              ← Global cursor follower
    SmoothScroll.tsx           ← Lenis provider wrapper
    ui/
      Button.tsx               ← Reusable magnetic button
      FadeIn.tsx               ← Scroll-triggered fade wrapper
      SectionLabel.tsx         ← Uppercase eyebrow label
      TextReveal.tsx           ← Word-by-word scroll headline reveal
      FallingLetter.tsx        ← Single letter detach/fall on scroll
  lib/
    utils.ts                   ← cn() helper
    hooks/
      useScrollPosition.ts     ← Scroll Y tracker
      useMagnetic.ts           ← Magnetic pull effect for buttons
      useParallax.ts           ← Parallax scroll offset
      useSectionColors.ts      ← Background color interpolation on scroll
public/
  favicon-32.png
  favicon-16.png
  favicon-64.png
  apple-touch-icon.png
  og-image.png
  app-icon-512.png
  logo-full-dark.svg
  logo-full-light.svg
  videos/                      ← hero-construction.mp4 (added later)
  screenshots/
    dashboard.png              ← placeholder
    tasks.png                  ← placeholder
    requests.png               ← placeholder
tailwind.config.ts             ← Brand tokens, fonts, animations
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Use `--no-git` since the repo already has git initialized.

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion lenis
```

- [ ] **Step 3: Update `tailwind.config.ts` with brand tokens**

Replace the entire file:

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
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Write `src/app/globals.css`**

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

- [ ] **Step 5: Write `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 6: Install clsx and tailwind-merge**

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 7: Write `src/app/layout.tsx`**

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
    description:
      "Job costing, crew management, and supply tracking built for small construction teams.",
    url: "https://getstroyka.com",
    siteName: "Stroyka",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroyka — Construction Management for Real Crews",
    description:
      "Job costing, crew management, and supply tracking built for small construction teams.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-brand-midnight text-white antialiased font-body">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Write a placeholder `src/app/page.tsx`**

```typescript
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-heading text-4xl font-bold">Stroyka</h1>
    </main>
  );
}
```

- [ ] **Step 9: Copy static assets to `public/`**

```bash
cp assets/favicon-32.png assets/favicon-16.png assets/favicon-64.png assets/apple-touch-icon.png assets/og-image.png assets/app-icon-512.png assets/social-avatar-400.png assets/logo-full-dark.svg assets/logo-full-light.svg public/
mkdir -p public/screenshots public/videos
```

- [ ] **Step 10: Create placeholder screenshot images**

Create three simple dark placeholder PNGs for screenshots. Use a Node.js script or just create empty placeholder files:

```bash
# Create minimal placeholder files (will be replaced with real screenshots)
for name in dashboard tasks requests; do
  cp assets/favicon-64.png "public/screenshots/${name}.png"
done
```

These are temporary — they'll be replaced with real app screenshots.

- [ ] **Step 11: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:3000`, page shows "Stroyka" heading on dark background.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with brand tokens and assets"
```

---

## Task 2: UI Primitives — Button, FadeIn, SectionLabel, Logo

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/FadeIn.tsx`
- Create: `src/components/ui/SectionLabel.tsx`
- Create: `src/components/Logo.tsx`

- [ ] **Step 1: Write `src/components/ui/SectionLabel.tsx`**

```typescript
export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-xs font-semibold tracking-[0.2em] uppercase text-brand-forest mb-3">
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Write `src/components/ui/FadeIn.tsx`**

```typescript
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
}: FadeInProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const dirs = {
    up: { y: 28 },
    down: { y: -28 },
    left: { x: 28 },
    right: { x: -28 },
    none: {},
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

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

- [ ] **Step 3: Write `src/components/ui/Button.tsx`**

This includes the magnetic pull effect. The magnetic behavior is inline rather than a separate hook since it's tightly coupled to the button element.

```typescript
"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness: 300, damping: 20 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDist = 100;

    if (distance < maxDist) {
      const pull = (1 - distance / maxDist) * 8;
      x.set((distX / distance) * pull);
      y.set((distY / distance) * pull);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const base =
    "inline-flex items-center justify-center font-heading font-semibold tracking-wide rounded-xl transition-colors duration-200 cursor-pointer";
  const variants = {
    primary:
      "bg-brand-forest text-white hover:bg-brand-deep active:scale-95 shadow-lg shadow-brand-forest/20",
    secondary:
      "border border-brand-forest text-brand-sage hover:bg-brand-forest/10 active:scale-95",
    ghost: "text-brand-sage hover:text-white active:scale-95",
  };
  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const cls = cn(base, variants[variant], sizes[size], className);

  const inner = href ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <button className={cls} {...props}>
      {children}
    </button>
  );

  if (prefersReduced) {
    return inner;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </motion.div>
  );
}
```

- [ ] **Step 4: Write `src/components/Logo.tsx`**

```typescript
interface LogoProps {
  variant?: "dark" | "light";
  size?: number;
  showWordmark?: boolean;
}

export default function Logo({
  variant = "dark",
  size = 36,
  showWordmark = true,
}: LogoProps) {
  const markColors =
    variant === "dark"
      ? {
          bracketTop: "#cad2c5",
          bracketBot: "#52796f",
          dotTop: "#84a98c",
          dotBot: "#52796f",
        }
      : {
          bracketTop: "#2f3e46",
          bracketBot: "#52796f",
          dotTop: "#354f52",
          dotBot: "#84a98c",
        };

  const textColor = variant === "dark" ? "#ffffff" : "#2f3e46";
  const dividerColor =
    variant === "dark" ? "rgba(255,255,255,0.2)" : "rgba(47,62,70,0.2)";

  return (
    <div className="flex items-center gap-3.5" role="img" aria-label="Stroyka">
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 28 L6 6 L28 6"
          stroke={markColors.bracketTop}
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M50 28 L50 50 L28 50"
          stroke={markColors.bracketBot}
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <circle cx="6" cy="6" r="4" fill={markColors.dotTop} />
        <circle cx="50" cy="50" r="4" fill={markColors.dotBot} />
      </svg>

      {showWordmark && (
        <>
          <div
            style={{
              width: 1,
              height: size * 0.7,
              background: dividerColor,
            }}
          />
          <span
            className="font-heading font-bold tracking-widest uppercase"
            style={{
              fontSize: size * 0.52,
              color: textColor,
              letterSpacing: "0.1em",
            }}
          >
            Stroyka
          </span>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add UI primitives — Button, FadeIn, SectionLabel, Logo"
```

---

## Task 3: Smooth Scroll + Cursor Dot + Hooks

**Files:**
- Create: `src/components/SmoothScroll.tsx`
- Create: `src/components/CursorDot.tsx`
- Create: `src/lib/hooks/useScrollPosition.ts`
- Create: `src/lib/hooks/useParallax.ts`
- Create: `src/lib/hooks/useSectionColors.ts`
- Modify: `src/app/layout.tsx` (wrap body content)

- [ ] **Step 1: Write `src/components/SmoothScroll.tsx`**

```typescript
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Write `src/components/CursorDot.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export default function CursorDot() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const springConfig = { stiffness: 500, damping: 28 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReduced) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, [data-interactive]");
      setHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [x, y, prefersReduced, visible]);

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
        backgroundColor: hovering ? "rgba(132,169,140,0.15)" : "rgba(132,169,140,0.8)",
        boxShadow: hovering
          ? "0 0 20px rgba(132,169,140,0.2)"
          : "0 0 12px rgba(132,169,140,0.3)",
        opacity: visible ? 1 : 0,
        transition: "width 0.2s, height 0.2s, background-color 0.2s, box-shadow 0.2s",
      }}
    />
  );
}
```

- [ ] **Step 3: Write `src/lib/hooks/useScrollPosition.ts`**

```typescript
"use client";

import { useState, useEffect } from "react";

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}
```

- [ ] **Step 4: Write `src/lib/hooks/useParallax.ts`**

```typescript
"use client";

import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

export function useParallax(offset: number = 20): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return { ref, y };
}
```

- [ ] **Step 5: Write `src/lib/hooks/useSectionColors.ts`**

```typescript
"use client";

import { useEffect, useState } from "react";

const SECTION_COLORS = [
  "#2f3e46", // Hero — midnight
  "#2b3940", // Problem — darker
  "#2f3e46", // Features — midnight
  "#334a4f", // How It Works — lighter
  "#2f3e46", // Screenshots — midnight
  "#2b3940", // Pricing — darker
  "#334a4f", // CTA Banner — lighter
  "#2f3e46", // Footer — midnight
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
    .toString(16)
    .slice(1)}`;
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

export function useSectionColors(sectionIds: string[]): string {
  const [bgColor, setBgColor] = useState(SECTION_COLORS[0]);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY + vh / 2;

      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          const progress = (scrollY - top) / el.offsetHeight;
          const currentColor = SECTION_COLORS[i] || SECTION_COLORS[0];
          const nextColor = SECTION_COLORS[i + 1] || currentColor;
          setBgColor(interpolateColor(currentColor, nextColor, progress));
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return bgColor;
}
```

- [ ] **Step 6: Update `src/app/layout.tsx` to include SmoothScroll and CursorDot**

Add imports and wrap body content:

```typescript
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CursorDot from "@/components/CursorDot";
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
    description:
      "Job costing, crew management, and supply tracking built for small construction teams.",
    url: "https://getstroyka.com",
    siteName: "Stroyka",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroyka — Construction Management for Real Crews",
    description:
      "Job costing, crew management, and supply tracking built for small construction teams.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-brand-midnight text-white antialiased font-body">
        <SmoothScroll>
          <CursorDot />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components/SmoothScroll.tsx src/components/CursorDot.tsx src/lib/ src/app/layout.tsx
git commit -m "feat: add Lenis smooth scroll, cursor dot, and scroll hooks"
```

---

## Task 4: TextReveal + FallingLetter Components

**Files:**
- Create: `src/components/ui/TextReveal.tsx`
- Create: `src/components/ui/FallingLetter.tsx`

- [ ] **Step 1: Write `src/components/ui/TextReveal.tsx`**

```typescript
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

export default function TextReveal({
  children,
  className,
  as: Tag = "h2",
}: TextRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const words = children.split(" ");

  if (prefersReduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
```

- [ ] **Step 2: Write `src/components/ui/FallingLetter.tsx`**

This component renders a headline where one letter (the "K" in STROYKA) detaches and falls on scroll.

```typescript
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface FallingLetterProps {
  text: string;
  fallingIndex: number; // index of the letter that falls
  className?: string;
}

export default function FallingLetter({
  text,
  fallingIndex,
  className,
}: FallingLetterProps) {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const fallY = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 400]);
  const fallRotate = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 45]);
  const fallOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [1, 1, 0.6, 0]);

  if (prefersReduced) {
    return (
      <span ref={containerRef} className={className}>
        {text}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={`inline-block ${className || ""}`}>
      {text.split("").map((char, i) => {
        if (i === fallingIndex) {
          return (
            <motion.span
              key={i}
              className="inline-block origin-bottom-left"
              style={{
                y: fallY,
                rotate: fallRotate,
                opacity: fallOpacity,
              }}
            >
              {char}
            </motion.span>
          );
        }
        return (
          <span key={i} className="inline-block">
            {char}
          </span>
        );
      })}
    </span>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/TextReveal.tsx src/components/ui/FallingLetter.tsx
git commit -m "feat: add TextReveal and FallingLetter animation components"
```

---

## Task 5: Navbar

**Files:**
- Create: `src/components/Navbar.tsx`

- [ ] **Step 1: Write `src/components/Navbar.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const scrollY = useScrollPosition();
  const scrolled = scrollY > 50;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "backdrop-blur-md bg-brand-midnight/80 border-b border-brand-deep"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" aria-label="Home">
          <Logo variant="dark" size={32} />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm text-brand-sage hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="secondary" size="sm" href="/demo">
            Request Demo
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="block w-6 h-0.5 bg-white"
            animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-white"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-white"
            animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden backdrop-blur-md bg-brand-midnight/95 border-b border-brand-deep"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-heading text-sm text-brand-sage hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button variant="primary" size="sm" href="/demo">
                Request Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add sticky Navbar with glassmorphism and mobile drawer"
```

---

## Task 6: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Write `src/components/Hero.tsx`**

This is the most complex section — includes the hybrid video + geometric overlay, falling letter, staggered animations, and trust signals.

```typescript
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import FallingLetter from "@/components/ui/FallingLetter";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

function GeometricOverlay() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <div ref={ref} className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {/* L-shape bracket — echoes Cornerstone mark */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[15%] right-[10%] w-24 h-24 border-l-4 border-t-4 border-brand-sage-mist/20 rounded-tl-md"
      />
      {/* Floating rectangle */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[40%] right-[25%] w-16 h-10 bg-brand-forest/15 rounded-lg"
      />
      {/* Small dot */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[25%] right-[5%] w-4 h-4 rounded-full bg-brand-sage/20"
      />
      {/* Lower bracket */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[20%] right-[15%] w-20 h-20 border-r-4 border-b-4 border-brand-forest/20 rounded-br-md"
      />
      {/* Horizontal bar */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[60%] right-[8%] w-32 h-2 bg-brand-deep/40 rounded-full"
      />
    </div>
  );
}

export default function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 75% 50%, rgba(82,121,111,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-20">
        {/* Left column — text */}
        <div>
          <FadeIn delay={0}>
            <SectionLabel>Construction Management</SectionLabel>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.05] text-balance mb-6">
              for Real{" "}
              <FallingLetter text="Crews" fallingIndex={0} />
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-brand-sage-mist/75 leading-relaxed mb-8 max-w-lg">
              Stop cobbling together spreadsheets, text messages, and gut feelings
              to run your jobsites. Stroyka gives your whole crew — boss and
              workers — one simple tool that works even without cell service.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary" size="lg" href="/demo">
                Request a Demo
              </Button>
              <Button variant="ghost" size="lg" href="#how-it-works">
                See How It Works
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap gap-6 text-sm text-brand-sage-mist/60">
              <span>⚡ Offline-first</span>
              <span>👷 Built for crews of 5–20</span>
              <span>💳 Flat monthly pricing</span>
            </div>
          </FadeIn>
        </div>

        {/* Right column — video + geometric overlay */}
        <FadeIn direction="right" delay={0.2} className="relative">
          <div className="relative rounded-2xl overflow-hidden bg-brand-deep ring-1 ring-brand-forest/30 rotate-1 shadow-2xl">
            {/* Video background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[400px] lg:h-[500px] object-cover opacity-40 blur-[1px]"
              poster=""
            >
              <source src="/videos/hero-construction.mp4" type="video/mp4" />
            </video>

            {/* Fallback gradient if video fails */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-midnight via-brand-deep to-brand-forest/30" />

            {/* Geometric overlay */}
            <GeometricOverlay />

            {/* Centered app badge */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-brand-midnight/80 backdrop-blur-sm rounded-2xl p-8 text-center">
                <svg width="48" height="48" viewBox="0 0 56 56" fill="none" className="mx-auto mb-4">
                  <path d="M6 28 L6 6 L28 6" stroke="#cad2c5" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"/>
                  <path d="M50 28 L50 50 L28 50" stroke="#52796f" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"/>
                  <circle cx="6" cy="6" r="4" fill="#84a98c"/>
                  <circle cx="50" cy="50" r="4" fill="#52796f"/>
                </svg>
                <p className="font-heading text-sm text-brand-sage tracking-wider uppercase">Coming Soon</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero section with video, geometric overlay, and falling letter"
```

---

## Task 7: Problem Section

**Files:**
- Create: `src/components/Problem.tsx`

- [ ] **Step 1: Write `src/components/Problem.tsx`**

```typescript
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const PAIN_CARDS = [
  {
    icon: "💸",
    title: "Budget surprises",
    body: "You only know you went over budget after the project ends.",
  },
  {
    icon: "📵",
    title: "No cell service, no updates",
    body: "Workers can't log time or submit requests when they're underground or in remote areas.",
  },
  {
    icon: "👔",
    title: "Tools built for enterprise",
    body: "Procore costs $500+/month and requires an onboarding team. You need something that works on day one.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <FadeIn>
          <SectionLabel>The Problem</SectionLabel>
        </FadeIn>

        <TextReveal
          as="h2"
          className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6"
        >
          Construction runs on chaos
        </TextReveal>

        <FadeIn delay={0.1}>
          <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-16">
            Your current system: a group chat for requests, a spreadsheet for
            budgets, a whiteboard for tasks, and hope that someone remembers to
            update it. When a worker buys materials, you find out at month-end.
            When a project goes over budget, you find out too late.
          </p>
        </FadeIn>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        {PAIN_CARDS.map((card, i) => (
          <FadeIn key={card.title} delay={0.1 * i}>
            <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-8">
              <span className="text-3xl mb-4 block">{card.icon}</span>
              <h3 className="font-heading font-semibold text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-brand-sage-mist/70 text-sm leading-relaxed">
                {card.body}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

```bash
npm run build && git add src/components/Problem.tsx && git commit -m "feat: add Problem section with pain point cards"
```

---

## Task 8: Features Section (with Parallax + 3D Tilt)

**Files:**
- Create: `src/components/Features.tsx`

- [ ] **Step 1: Write `src/components/Features.tsx`**

```typescript
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParallax } from "@/lib/hooks/useParallax";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.008v.008H12V18z" />
      </svg>
    ),
    title: "Works without cell service",
    body: "Stroyka stores everything locally on each device and syncs automatically when a connection returns. Workers can log time, submit requests, and check tasks at any job site — basement, rural, or underground.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Built for both sides of the crew",
    body: "Bosses get budget tracking, approval workflows, and real-time cost reports. Workers get a focused view of their tasks, time logging, and request submission. Same app, purpose-built for each role.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Know your numbers before month-end",
    body: "Every purchase, timesheet entry, and fuel trip rolls up automatically into a project P&L. See labor costs, material spend, and budget remaining at a glance — updated the moment a worker submits.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: 'No more "did you approve that?"',
    body: "Workers submit material or supply requests from the field. Bosses review and approve with one tap. Approved items auto-log to project costs. Full audit trail, no text message chains.",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const { ref: parallaxRef, y } = useParallax(index % 2 === 0 ? 20 : -20);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -4, y: x * 4 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <FadeIn delay={0.1 * index}>
      <motion.div ref={parallaxRef} style={{ y }}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-brand-deep/40 border border-brand-deep hover:border-brand-forest rounded-2xl p-8 transition-colors duration-200 h-full"
          style={{
            perspective: "1000px",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div className="w-12 h-12 bg-brand-forest/15 rounded-xl flex items-center justify-center text-brand-sage mb-5">
            {feature.icon}
          </div>
          <h3 className="text-xl font-heading font-semibold mb-3">
            {feature.title}
          </h3>
          <p className="text-brand-sage-mist/65 text-sm leading-relaxed">
            {feature.body}
          </p>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <SectionLabel>Features</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight"
          >
            Everything your crew needs. Nothing they don't.
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

```bash
npm run build && git add src/components/Features.tsx && git commit -m "feat: add Features section with parallax cards and 3D tilt"
```

---

## Task 9: HowItWorks Section

**Files:**
- Create: `src/components/HowItWorks.tsx`

- [ ] **Step 1: Write `src/components/HowItWorks.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const TABS = {
  boss: {
    label: "For the Boss",
    steps: [
      {
        num: "01",
        title: "Create a project",
        body: "Add the name, address, and budget. Takes 30 seconds.",
      },
      {
        num: "02",
        title: "Invite your crew",
        body: "Workers get an email invite and join with one tap. No account setup forms.",
      },
      {
        num: "03",
        title: "Watch costs update",
        body: "As workers log time and submit requests, your project P&L updates in real time.",
      },
    ],
  },
  worker: {
    label: "For the Crew",
    steps: [
      {
        num: "01",
        title: "Accept your invite",
        body: "Tap the link in your email. You're in.",
      },
      {
        num: "02",
        title: "See your tasks",
        body: "Your boss assigns tasks with instructions and priority. They're waiting for you when you open the app.",
      },
      {
        num: "03",
        title: "Log and submit",
        body: "Clock in, submit supply requests, mark tasks done. Works offline — it all syncs when you get signal.",
      },
    ],
  },
} as const;

type TabKey = keyof typeof TABS;

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<TabKey>("boss");

  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>How It Works</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-8"
          >
            Simple for everyone.
          </TextReveal>

          {/* Tab switcher */}
          <FadeIn delay={0.1}>
            <div className="inline-flex gap-2 bg-brand-deep/50 rounded-full p-1">
              {(Object.keys(TABS) as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-2.5 rounded-full font-heading text-sm font-medium transition-all duration-200 ${
                    activeTab === key
                      ? "bg-brand-forest text-white"
                      : "text-brand-sage hover:text-white"
                  }`}
                >
                  {TABS[key].label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col gap-12">
              {TABS[activeTab].steps.map((step) => (
                <div key={step.num} className="relative pl-24">
                  <span className="absolute left-0 top-0 text-7xl font-heading font-bold text-brand-forest/20 leading-none select-none">
                    {step.num}
                  </span>
                  <h3 className="font-heading font-semibold text-xl mb-2">
                    {step.title}
                  </h3>
                  <p className="text-brand-sage-mist/70 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

```bash
npm run build && git add src/components/HowItWorks.tsx && git commit -m "feat: add HowItWorks section with Boss/Crew tabs"
```

---

## Task 10: Screenshots Section

**Files:**
- Create: `src/components/Screenshots.tsx`

- [ ] **Step 1: Write `src/components/Screenshots.tsx`**

```typescript
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const SCREENSHOTS = [
  { src: "/screenshots/dashboard.png", label: "Real-time project P&L" },
  { src: "/screenshots/tasks.png", label: "Task management with priorities" },
  { src: "/screenshots/requests.png", label: "Supply request workflow" },
];

export default function Screenshots() {
  return (
    <section id="screenshots" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <SectionLabel>The App</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight"
          >
            See it in action
          </TextReveal>
        </div>

        {/* Desktop: 3 columns, Mobile: horizontal scroll */}
        <div className="grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none flex md:grid pb-4 md:pb-0">
          {SCREENSHOTS.map((shot, i) => (
            <FadeIn key={shot.label} delay={0.1 * i}>
              <div className="bg-brand-deep rounded-2xl ring-1 ring-brand-forest/25 p-3 min-w-[280px] md:min-w-0 snap-center">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-brand-midnight">
                  <Image
                    src={shot.src}
                    alt={shot.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-brand-sage uppercase tracking-wider mt-3 text-center">
                  {shot.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-brand-sage-mist/50 mt-8">
            Screenshots from the live app. Request a personalized demo to see
            your own projects and crew.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

```bash
npm run build && git add src/components/Screenshots.tsx && git commit -m "feat: add Screenshots section with grid/scroll layout"
```

---

## Task 11: Pricing Section

**Files:**
- Create: `src/components/Pricing.tsx`

- [ ] **Step 1: Write `src/components/Pricing.tsx`**

```typescript
"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

const STARTER_FEATURES = [
  "Unlimited projects",
  "Up to 10 workers",
  "Job costing & P&L reports",
  "Time tracking & timesheets",
  "Supply request workflow",
  "Offline-first sync",
  "CSV & PDF export",
  "Email support",
];

const PRO_FEATURES = [
  "Everything in Starter",
  "Up to 25 workers",
  "Advanced reporting",
  "Priority support",
  "Dedicated onboarding call",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <SectionLabel>Pricing</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4"
          >
            One price. Whole crew included.
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-base text-brand-sage-mist/75 max-w-lg mx-auto">
              No per-seat fees. No hidden add-ons. One flat monthly rate — your
              entire team uses Stroyka for the same price.
            </p>
          </FadeIn>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          {/* Starter */}
          <FadeIn>
            <div className="bg-brand-deep/50 border border-brand-deep rounded-2xl p-8 h-full">
              <h3 className="font-heading font-semibold text-xl mb-1">
                Starter
              </h3>
              <p className="text-brand-sage-mist/60 text-sm mb-6">
                For crews up to 10 workers
              </p>
              <div className="mb-6">
                <span className="text-4xl font-heading font-bold">$149</span>
                <span className="text-brand-sage-mist/60 ml-1">/ month</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8">
                {STARTER_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-brand-sage-mist/70"
                  >
                    <span className="text-brand-forest mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" href="/demo" className="w-full">
                Request Demo
              </Button>
            </div>
          </FadeIn>

          {/* Pro */}
          <FadeIn delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-brand-deep border border-brand-forest ring-1 ring-brand-forest/30 rounded-2xl p-8 relative h-full"
            >
              <span className="absolute -top-3 left-8 bg-brand-forest text-white text-xs font-heading font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="font-heading font-semibold text-xl mb-1">Pro</h3>
              <p className="text-brand-sage-mist/60 text-sm mb-6">
                For crews up to 25 workers
              </p>
              <div className="mb-6">
                <span className="text-4xl font-heading font-bold">$299</span>
                <span className="text-brand-sage-mist/60 ml-1">/ month</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-brand-sage-mist/70"
                  >
                    <span className="text-brand-forest mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="primary" href="/demo" className="w-full">
                Request Demo
              </Button>
            </motion.div>
          </FadeIn>
        </div>

        {/* Founding Member callout */}
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto border border-dashed border-brand-sage/30 bg-brand-deep/30 rounded-2xl p-8 text-center mb-10">
            <p className="text-lg font-heading font-semibold mb-2">
              🔒 Founding Member Rate — $99/month, locked forever
            </p>
            <p className="text-sm text-brand-sage-mist/70 mb-6">
              The first 20 companies to sign up lock in $99/month for life.
              Price never increases, no matter what the public rate becomes.
            </p>
            <Button variant="primary" href="/demo" className="mb-6">
              Claim a Founding Spot →
            </Button>
            {/* Progress bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-brand-deep rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-forest rounded-full"
                  style={{ width: "40%" }}
                />
              </div>
              <p className="text-xs text-brand-sage-mist/50 mt-2">
                12 of 20 spots remaining
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-center text-sm text-brand-sage-mist/50">
            Not sure which plan fits? Book a 20-minute demo and we'll recommend
            the right one for your crew size.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

```bash
npm run build && git add src/components/Pricing.tsx && git commit -m "feat: add Pricing section with cards and founding member callout"
```

---

## Task 12: FAQ Section

**Files:**
- Create: `src/components/FAQ.tsx`

- [ ] **Step 1: Write `src/components/FAQ.tsx`**

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const QUESTIONS = [
  {
    q: "Does it work without internet?",
    a: "Yes. Stroyka is offline-first — all data is stored locally on each device and syncs automatically when a connection is restored. Workers in basements, rural areas, or anywhere with poor signal can still log time, submit requests, and view tasks.",
  },
  {
    q: "How do workers join?",
    a: "The boss sends email invites directly from the app. Workers click the link, create a password, and they're in. No app store download required for web — it runs in the browser on any phone.",
  },
  {
    q: "What happens if a worker leaves?",
    a: "You can deactivate a worker's account instantly from the app. They immediately lose access. Their historical timesheet and cost data stays in your account.",
  },
  {
    q: "Is my data secure?",
    a: "Stroyka runs on Supabase (enterprise-grade PostgreSQL) with row-level security — meaning your company's data is completely isolated from other companies at the database level. We don't share or sell your data. See our Privacy Policy for full details.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Every project, timesheet, and cost record can be exported as CSV or PDF at any time. If you ever cancel, you have 30 days to export everything.",
  },
  {
    q: "How is Stroyka different from Procore or Buildertrend?",
    a: "Those tools are built for large general contractors and cost $500–$1,000+/month with complex onboarding. Stroyka is built specifically for small crews (5–25 workers) who need job costing and crew coordination — not enterprise project management. Flat pricing from $149/month, no per-seat fees, works on day one.",
  },
  {
    q: "Is there a free trial?",
    a: "We're currently offering personalized demos for early customers. Request a demo and we'll walk you through the app live with your own sample data.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: typeof QUESTIONS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-brand-deep">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-5 text-left cursor-pointer group"
      >
        <span className={`font-heading font-semibold text-base transition-colors duration-200 ${isOpen ? "text-brand-sage" : "text-white group-hover:text-white"}`}>
          {item.q}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-brand-sage flex-shrink-0 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-brand-sage-mist/70 text-sm leading-relaxed pb-5">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <SectionLabel>FAQ</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="text-4xl lg:text-5xl font-heading font-bold leading-tight"
          >
            Common questions
          </TextReveal>
        </div>

        <FadeIn>
          <div>
            {QUESTIONS.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build & commit**

```bash
npm run build && git add src/components/FAQ.tsx && git commit -m "feat: add FAQ accordion section"
```

---

## Task 13: CTA Banner + Footer

**Files:**
- Create: `src/components/CTABanner.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Write `src/components/CTABanner.tsx`**

```typescript
import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";

export default function CTABanner() {
  return (
    <section
      id="cta"
      className="py-24 lg:py-32 relative"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(82,121,111,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <TextReveal
          as="h2"
          className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6"
        >
          Ready to stop guessing and start knowing?
        </TextReveal>

        <FadeIn delay={0.1}>
          <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-8">
            Book a 20-minute demo. We'll show you Stroyka live with a real
            project and real crew data.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Button variant="primary" size="lg" href="/demo">
            Book Your Demo →
          </Button>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-sm text-brand-sage-mist/50 mt-6">
            No commitment. No credit card. Just a conversation.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/components/Footer.tsx`**

```typescript
import Logo from "@/components/Logo";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-brand-midnight border-t border-brand-deep py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <Logo variant="dark" size={28} />
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-brand-sage/50 hover:text-brand-sage transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-brand-deep">
          <p className="text-sm text-brand-sage/50">
            © {new Date().getFullYear()} Stroyka. All rights reserved.
          </p>
          <p className="text-sm text-brand-sage/50">
            Made for crews who build things.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify build & commit**

```bash
npm run build && git add src/components/CTABanner.tsx src/components/Footer.tsx && git commit -m "feat: add CTA Banner and Footer sections"
```

---

## Task 14: Assemble Landing Page + Section Colors

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write the full `src/app/page.tsx`**

```typescript
"use client";

import { useSectionColors } from "@/lib/hooks/useSectionColors";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Screenshots from "@/components/Screenshots";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

const SECTION_IDS = [
  "hero",
  "problem",
  "features",
  "how-it-works",
  "screenshots",
  "pricing",
  "cta",
  "footer",
];

export default function Home() {
  const bgColor = useSectionColors(SECTION_IDS);

  return (
    <main style={{ backgroundColor: bgColor }} className="transition-colors duration-500">
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

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Full page builds successfully.

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000` — all 10 sections should render. Scroll to test animations, cursor dot, smooth scroll, and section color transitions.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble landing page with all sections and section color transitions"
```

---

## Task 15: Demo Request Form Page + API Route

**Files:**
- Create: `src/components/DemoForm.tsx`
- Create: `src/app/demo/page.tsx`
- Create: `src/app/api/demo/route.ts`

- [ ] **Step 1: Install Resend**

```bash
npm install resend
```

- [ ] **Step 2: Write `src/components/DemoForm.tsx`**

```typescript
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
        <h2 className="font-heading text-2xl font-bold mb-3">
          Demo request received!
        </h2>
        <p className="text-brand-sage-mist/70 max-w-md mx-auto">
          We'll reach out within 24 hours to schedule your personalized demo.
          Looking forward to showing you Stroyka.
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
          What's your biggest challenge?
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

      {status === "error" && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        type="submit"
        disabled={status === "sending"}
        className="w-full md:w-auto md:self-start"
      >
        {status === "sending" ? "Sending..." : "Request Your Demo"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Write `src/app/demo/page.tsx`**

```typescript
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Request a Demo — Stroyka",
  description:
    "Book a personalized 20-minute demo of Stroyka for your construction crew.",
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <FadeIn>
            <SectionLabel>Get Started</SectionLabel>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4">
              Request your demo
            </h1>
            <p className="text-base text-brand-sage-mist/75 leading-relaxed mb-10">
              Fill out the form below and we'll schedule a 20-minute personalized
              demo with your own sample data. No commitment, no credit card.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <DemoForm />
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Write `src/app/api/demo/route.ts`**

```typescript
import { NextResponse } from "next/server";

interface DemoRequest {
  name: string;
  company: string;
  crewSize: string;
  email: string;
  phone?: string;
  challenge?: string;
}

async function sendEmail(data: DemoRequest): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Stroyka <noreply@getstroyka.com>",
      to: ["hello@getstroyka.com"],
      subject: `Demo Request from ${data.name} at ${data.company}`,
      text: [
        `Name: ${data.name}`,
        `Company: ${data.company}`,
        `Crew Size: ${data.crewSize}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not provided"}`,
        `Challenge: ${data.challenge || "Not provided"}`,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error: ${res.status} ${body}`);
  }
}

async function sendTelegram(data: DemoRequest): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram env vars not set — skipping notification");
    return;
  }

  const message = [
    "🏗 *New Demo Request*",
    "",
    `*Name:* ${data.name}`,
    `*Company:* ${data.company}`,
    `*Crew Size:* ${data.crewSize}`,
    `*Email:* ${data.email}`,
    `*Phone:* ${data.phone || "—"}`,
    data.challenge ? `\n*Challenge:*\n${data.challenge}` : "",
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram error: ${res.status} ${body}`);
  }
}

export async function POST(request: Request) {
  try {
    const data: DemoRequest = await request.json();

    // Validate required fields
    if (!data.name || !data.company || !data.crewSize || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send email and Telegram notification in parallel
    const results = await Promise.allSettled([
      sendEmail(data),
      sendTelegram(data),
    ]);

    // Log any failures but don't fail the request
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Notification error:", result.reason);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo route error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 5: Create `.env.local` template**

```bash
echo "RESEND_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=" > .env.local
```

Make sure `.env.local` is in `.gitignore` (it is by default with Next.js, and we added `.env*` patterns too).

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds. The API route and demo page compile.

- [ ] **Step 7: Commit**

```bash
git add src/components/DemoForm.tsx src/app/demo/ src/app/api/
git commit -m "feat: add /demo form page with Resend email + Telegram notification"
```

---

## Task 16: Lint, Build Verification, and Final Cleanup

**Files:**
- Modify: various (fix any lint/type issues)

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Fix any reported issues.

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: Build succeeds with zero errors.

- [ ] **Step 3: Test in browser**

Start dev server and manually verify:

```bash
npm run dev
```

Checklist:
- All 10 sections render on desktop and mobile
- Navbar goes opaque on scroll
- Cursor dot follows mouse on desktop
- Smooth scrolling on desktop
- FadeIn animations trigger on scroll
- TextReveal headlines animate word-by-word
- Falling letter "C" detaches and falls on scroll
- Feature cards tilt on hover
- Feature cards parallax on scroll
- Section background colors transition on scroll
- Magnetic buttons pull toward cursor
- Tab switcher works in How It Works
- FAQ accordion opens/closes
- Pricing cards styled correctly
- All CTA buttons link to `/demo`
- Demo form submits and shows success state
- Mobile hamburger menu works
- `prefers-reduced-motion` disables animations (test in Chrome DevTools)

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: lint fixes and build verification"
```

- [ ] **Step 5: Push**

User pushes to GitHub:

```bash
git push -u origin main
```
