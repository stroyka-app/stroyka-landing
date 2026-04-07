# Stroyka Landing Page — Design Spec

**Date:** 2026-04-06
**Status:** Approved
**Repo:** `stroyka-landing`
**Domain:** getstroyka.com
**Goal:** Get construction company owners to book a demo call or join the waitlist.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript, `src/` directory)
- **Styling:** Tailwind CSS with custom brand tokens
- **Animations:** Framer Motion
- **Smooth scroll:** Lenis
- **Fonts:** Space Grotesk (headings) + Inter (body) via `next/font`
- **Deployment:** Vercel

---

## Brand System

### Colors (Tailwind tokens under `brand.*`)

| Token        | Hex       | Role                    |
|-------------|-----------|-------------------------|
| sage-mist   | `#cad2c5` | Tertiary text           |
| sage        | `#84a98c` | Secondary text          |
| forest      | `#52796f` | Primary accent / CTAs   |
| deep        | `#354f52` | Card backgrounds        |
| midnight    | `#2f3e46` | Page background         |

### Typography

| Element         | Font            | Weight | Size (desktop)  |
|----------------|-----------------|--------|-----------------|
| Hero headline  | Space Grotesk   | 700    | 52–72px         |
| Section headline| Space Grotesk  | 700    | 36–48px         |
| Card headline  | Space Grotesk   | 600    | 20px            |
| Eyebrow/label  | Space Grotesk   | 600    | 11px, uppercase |
| Body large     | Inter           | 400    | 16–18px         |
| Body small     | Inter           | 400    | 13–14px         |

### Logo

React component (`Logo.tsx`) renders the Cornerstone mark as inline SVG. Variants: `dark` (for dark backgrounds) and `light` (for light backgrounds). Supports optional wordmark.

---

## Site Structure

### Pages

1. **`/`** — Main landing page (single-page with all sections)
2. **`/demo`** — Demo request form page

### Landing Page Sections (in order)

1. Navbar
2. Hero
3. Problem
4. Features
5. How It Works
6. Screenshots
7. Pricing
8. FAQ
9. CTA Banner
10. Footer

---

## Component Architecture

```
src/
  app/
    page.tsx              ← Landing page (assembles sections)
    demo/page.tsx         ← Demo request form
    layout.tsx            ← Root layout (fonts, metadata, Lenis)
    globals.css
  components/
    Logo.tsx
    Navbar.tsx
    Hero.tsx
    Problem.tsx
    Features.tsx
    HowItWorks.tsx
    Screenshots.tsx
    Pricing.tsx
    FAQ.tsx
    CTABanner.tsx
    Footer.tsx
    DemoForm.tsx          ← Form component used on /demo
    CursorDot.tsx         ← Global cursor follower
    SmoothScroll.tsx      ← Lenis wrapper provider
    ui/
      Button.tsx          ← Reusable magnetic button
      FadeIn.tsx          ← Scroll-triggered fade wrapper
      SectionLabel.tsx    ← Uppercase eyebrow labels
      TextReveal.tsx      ← Word-by-word scroll reveal
      FallingLetter.tsx   ← Letter detach/fall on scroll
  lib/
    utils.ts              ← cn() helper, etc.
    hooks/
      useScrollPosition.ts
      useMagnetic.ts      ← Magnetic pull effect for buttons
      useParallax.ts      ← Parallax scroll offset
```

---

## WOW Interaction Effects

All 8 effects are included. These layer on top of the base section specs from the prompt.

### 1. Falling Letter Effect

- One letter from "STROYKA" in the hero headline (the "K") detaches as the user scrolls past the hero section.
- The letter translates downward with gravity-like easing and slight rotation.
- Scrolling back up reverses the animation — letter rolls back into place.
- Implementation: Split hero headline into individual `<span>` elements. Use Framer Motion `useScroll` + `useTransform` to map scroll progress to `translateY` and `rotate` on the target letter.
- The letter should travel roughly 1 viewport height before resting.

### 2. Cursor Dot Follower

- Global component (`CursorDot.tsx`) rendered in the root layout.
- A 12px sage-green (`#84a98c`) circle with a soft glow (`box-shadow`).
- Follows cursor with spring-based lag (Framer Motion `useSpring`).
- Grows to 40px with reduced opacity when hovering interactive elements (buttons, links, cards).
- Hidden on touch devices (`@media (pointer: coarse)`).
- Uses `pointer-events: none` so it doesn't interfere with clicks.

### 3. Hero Hybrid Visual (Video + 3D Geometric Overlay)

- **Background layer:** Looping ambient construction video (`<video>` tag), darkened with a CSS overlay (`bg-brand-midnight/60`), slightly blurred (`blur-sm`). Muted, autoplay, loop, playsinline. Falls back to a dark gradient if video fails to load.
- **Foreground layer:** CSS/SVG geometric construction elements (rectangles, L-shapes, circles in brand colors) positioned absolutely, floating with subtle parallax offsets on scroll. These shapes echo the Cornerstone mark's geometry — right-angle brackets and dots.
- **Depth effect:** Video has `z-0`, geometric shapes have `z-10` at varying parallax speeds, creating layered depth.

### 4. Magnetic CTA Buttons

- All primary and secondary CTA buttons have a magnetic pull effect.
- When cursor enters a ~100px radius around the button, the button translates toward the cursor (max ~8px offset).
- On cursor leave, the button springs back to center.
- Implementation: `useMagnetic` custom hook using Framer Motion `useSpring` for `x` and `y` transforms based on cursor distance from button center.
- Disabled on touch devices.

### 5. Scroll-Driven Text Reveal

- Applied to all section headlines (Problem, Features, How It Works, Screenshots, Pricing, FAQ, CTA Banner).
- `TextReveal.tsx` splits text into words, each wrapped in a `<span>` with `overflow: hidden`.
- As the section scrolls into view, words animate in sequence — each sliding up from below and fading in.
- Stagger: 50ms between words.
- Uses `useInView` with `once: true` and `-80px` margin.
- Respects `prefers-reduced-motion` (falls back to simple fade).

### 6. Lenis Smooth Scroll

- `SmoothScroll.tsx` wraps the entire app in a Lenis instance.
- Provides buttery, inertia-based scrolling.
- Duration: 1.2s, easing: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`.
- Integrates with Framer Motion's scroll tracking.
- Disabled on touch devices (native scroll is better on mobile).

### 7. Parallax Feature Cards

- Feature cards in the 2x2 grid move at slightly different scroll speeds (offset between -20px and +20px relative to scroll).
- On hover: cards tilt up to 4 degrees in 3D (`rotateX`/`rotateY` based on cursor position within card), with `perspective: 1000px` on the container.
- Shadow shifts dynamically opposite to the tilt direction.
- Implementation: `useParallax` hook for scroll offset, `onMouseMove` handler for tilt calculation.

### 8. Section Color Transitions

- The page background isn't a flat `bg-brand-midnight` everywhere.
- As the user scrolls, the background interpolates between:
  - Hero: `#2f3e46` (midnight)
  - Problem: `#2b3940` (slightly darker)
  - Features: `#2f3e46` (midnight)
  - How It Works: `#334a4f` (slightly lighter)
  - Screenshots: `#2f3e46` (midnight)
  - Pricing: `#2b3940` (darker)
  - CTA Banner: `#334a4f` (lighter, draws attention)
  - Footer: `#2f3e46` (midnight)
- Transitions are smooth and tied to scroll position, not discrete section breaks.
- Implementation: A scroll listener on the main `<main>` element that interpolates `backgroundColor` based on scroll progress through each section.

---

## Section Specifications

### Navbar

- Fixed at top, `z-50`, full width.
- Default: transparent. On scroll >50px: `backdrop-blur-md`, `bg-brand-midnight/80`, subtle `border-b border-brand-deep`.
- Left: `<Logo variant="dark" size={32} />`
- Center (desktop): Features, How It Works, Pricing, FAQ links.
- Right: "Request Demo" secondary button → `/demo`.
- Mobile: hamburger → slide-down drawer.
- 200ms transitions on all state changes.

### Hero

- Two-column (desktop), stacked (mobile).
- **Left:** Eyebrow "Construction Management" → headline "for Real Crews" (52–72px) → subtext → two CTAs ("Request a Demo" primary → `/demo`, "See How It Works" ghost → `#how-it-works`) → trust signals row.
- **Right:** Hybrid video + geometric overlay (see WOW effect #3).
- **Background:** Radial gradient bloom behind the right visual.
- **Animation:** Left column elements stagger-fade-up (100ms each). Right column fades in from right. The "K" in STROYKA is the falling letter target.

### Problem

- Centered, max-width 680px.
- Eyebrow "The Problem" → headline "Construction runs on chaos" (TextReveal) → explanatory paragraph → 3 pain cards in a row.
- Pain cards: `bg-brand-deep/50`, `border-brand-deep`, `rounded-2xl`, icon + headline + body.

### Features

- 2x2 grid (desktop), 1 column (mobile).
- Eyebrow "Features" → headline "Everything your crew needs. Nothing they don't." (TextReveal).
- 4 cards: Offline-First Sync, Boss + Worker Roles, Real-Time Job Costing, Supply Request Workflow.
- Cards have parallax scroll offset + 3D tilt on hover (WOW effect #7).
- Card styling: `bg-brand-deep/40`, `border-brand-deep hover:border-brand-forest`, `rounded-2xl`, `p-8`.

### How It Works

- Two-tab layout: "For the Boss" / "For the Crew".
- Tab switcher: pill buttons, active `bg-brand-forest text-white`.
- 3 steps each with large dim step numbers behind content.
- TextReveal on section headline.

### Screenshots

- 3-column grid (desktop), horizontal scroll (mobile).
- Dark card frames (`bg-brand-deep rounded-2xl ring-1 ring-brand-forest/25 p-3`).
- Placeholder screenshots initially.
- Eyebrow "The App" → headline "See it in action" (TextReveal).
- Note below: "Screenshots from the live app. Request a personalized demo to see your own projects and crew."

### Pricing

- Two cards side by side: Starter ($149/mo, up to 10 workers) and Pro ($299/mo, up to 25 workers, highlighted).
- Founding Member callout below: $99/mo locked forever, 12 of 20 spots remaining (hardcoded), dashed border, progress bar.
- Pro card: `border-brand-forest ring-1 ring-brand-forest/30`, `hover:scale-[1.02]`.
- All CTA buttons → `/demo`.

### FAQ

- 7 questions with accordion expand/collapse.
- Smooth height animation with Framer Motion `AnimatePresence`.
- Chevron rotates 180 degrees on expand.
- Questions cover: offline, worker onboarding, deactivation, security, export, vs Procore, trial.

### CTA Banner

- Full-width, `bg-brand-deep/30` with centered radial glow.
- Headline "Ready to stop guessing and start knowing?" (TextReveal).
- Subtext + large primary "Book Your Demo →" button → `/demo`.
- "No commitment. No credit card. Just a conversation."

### Footer

- Two rows. Top: logo + nav links. Bottom: copyright + tagline.
- `bg-brand-midnight border-t border-brand-deep py-12`.

---

## Demo Request Page (`/demo`)

- Clean, focused single-column form centered on the page.
- Fields: Name, Company name, Crew size (dropdown: 1-5, 5-10, 10-25, 25+), Email, Phone (optional), "What's your biggest challenge?" (textarea).
- Submit: Next.js API route does two things in parallel:
  1. Sends email via Resend to `hello@getstroyka.com`.
  2. POSTs to Telegram Bot API to send an instant notification to the founder's chat (includes name, company, crew size, email).
- Env vars: `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Both calls are fire-and-forget in parallel (`Promise.allSettled`) — form succeeds even if one fails.
- Success state: friendly confirmation message with animation.
- The page has the Navbar and Footer for consistency.
- Same dark theme, same brand styling.

---

## Design System Rules

### Spacing

- Section padding: `py-24 lg:py-32`
- Section max-width: `max-w-6xl mx-auto px-6`
- Card padding: `p-8`
- Eyebrow to headline: `mb-3`
- Headline to body: `mb-6`

### Animation Rules

- Wrap every section's content in `<FadeIn>` with staggered delays.
- All scroll animations trigger once (`once: true`), except the falling letter (reversible).
- Hover transitions: 200ms ease.
- No animation exceeds 600ms.
- Respect `prefers-reduced-motion` — skip all motion effects.
- Lenis smooth scroll disabled on touch devices.
- Cursor effects disabled on touch devices.

### Colors in Context

- Page background: `bg-brand-midnight` (#2f3e46) with scroll-driven transitions.
- Card background: `bg-brand-deep/50`.
- Primary accent: `bg-brand-forest`.
- Text primary: white. Secondary: `text-brand-sage`. Tertiary: `text-brand-sage-mist/60`.
- Border default: `border-brand-deep`. Accent: `border-brand-forest`.

---

## Static Assets

```
public/
  favicon-32.png         ← from assets/
  favicon-16.png         ← from assets/
  apple-touch-icon.png   ← from assets/
  og-image.png           ← from assets/
  app-icon-512.png       ← from assets/
  videos/
    hero-construction.mp4  ← sourced later, placeholder gradient initially
  screenshots/
    dashboard.png          ← placeholder initially
    tasks.png              ← placeholder initially
    requests.png           ← placeholder initially
```

---

## Quality Checklist

- [ ] Site builds without TypeScript errors (`npm run build`)
- [ ] All sections render correctly on desktop (1280px+) and mobile (375px)
- [ ] All 8 WOW effects functional
- [ ] Navbar glassmorphism on scroll
- [ ] All CTA buttons route to `/demo`
- [ ] Demo form submits and shows success state
- [ ] FadeIn + TextReveal animations on scroll
- [ ] Falling letter works on scroll down and scroll up
- [ ] Cursor dot visible on desktop, hidden on mobile
- [ ] Magnetic buttons respond to cursor proximity
- [ ] Lenis smooth scroll on desktop, native on mobile
- [ ] Parallax + 3D tilt on feature cards
- [ ] Fonts load correctly (Space Grotesk headings, Inter body)
- [ ] Logo renders correctly in navbar and footer
- [ ] Pricing cards styled correctly (Starter understated, Pro highlighted)
- [ ] Founding Member callout visible with progress bar
- [ ] FAQ accordion smooth expand/collapse
- [ ] Meta tags (title, description, OG, Twitter) set correctly
- [ ] `npm run lint` passes
- [ ] `prefers-reduced-motion` respected
- [ ] Lighthouse Performance > 85 on desktop
