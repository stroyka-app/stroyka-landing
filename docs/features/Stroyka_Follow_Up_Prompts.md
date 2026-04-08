# Stroyka — Follow-Up Claude Code Prompts

> Run these **after** the main landing page is built (Landing Page Prompt → Section 5).
> Each prompt is self-contained — paste the full prompt into Claude Code in the correct repo.
> Order: A → B → C for the website. D is for the Flutter app repo.

---

## ~~PROMPT A — Website Security & Validation Hardening~~ ✅ DONE (2026-04-07)
**Completed:** Rate limiting (Upstash Redis), Zod validation, honeypot field, security headers (CSP, X-Frame-Options, etc.), .env.example, graceful error handling in /api/demo.

---

## ~~PROMPT B — Legal Pages + SEO Infrastructure~~ ✅ DONE (2026-04-07)
**Completed:** Vercel Analytics + Speed Insights, enhanced metadata with title template, sitemap.xml, robots.txt, JSON-LD structured data, Privacy & Terms pages redesigned with interactive sidebar layout, footer links updated.

---

## ~~PROMPT C — Error States, UX Polish & Demo Thank-You Page~~ ✅ DONE (2026-04-07)
**Completed:** Branded 404 page, global error boundary, loading state, demo form loading/error/success states with spinner, branded HTML email template for demo requests.

---

## PROMPT D — Flutter App Repo Work
**🔧 Repo: `job-costing-app` (the Flutter app)**
**Status:** Not started — separate repo, separate session.

---

## Remaining Items (not from prompts)

### High Priority
- [ ] Add screenshots to the landing page — retake with iPhone 16 Pro simulator (Cmd+S export for 1170x2532 images). Screenshots component is built and hidden, just needs assets. See `tasks/lessons.md` for rejected approaches
- [ ] Review OG image (`/og-image.png`) on social sharing previews

### Medium Priority
- [ ] Convert hero video to WebM for better compression (optional, needs `brew install ffmpeg`)
- [ ] Update Supabase email templates in `job-costing-app` repo to match new brand palette
- [ ] Add real testimonials when available (Testimonials section is built but hidden)

### Nice to Have
- [ ] Add social media links to footer Contact column when accounts are created
- [ ] Cookie consent banner (not required — Vercel Analytics is cookie-free, but consider for PostHog in the app)
