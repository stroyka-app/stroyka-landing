#!/usr/bin/env node
// Local-only visual-check helper. Hardcoded to http://localhost:3000 so it
// can never be pointed at an external host. Screenshots go to /tmp/ — never
// committed.
//
// Usage:
//   node scripts/snap.mjs                           # full page, viewport 1440x900
//   node scripts/snap.mjs --path /                  # explicit path
//   node scripts/snap.mjs --scroll 0.5              # scroll to 50% of doc height
//   node scripts/snap.mjs --selector "#plan-to-done" # scroll to element
//   node scripts/snap.mjs --viewport 390x844        # mobile viewport
//   node scripts/snap.mjs --out /tmp/foo.png        # custom output path
//   node scripts/snap.mjs --full-page false         # viewport-only capture
//
// All flags are optional.

import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const BASE_URL = "http://localhost:3000"; // hardcoded — no external hosts

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    path: "/",
    scroll: null,          // 0..1 fraction of doc scroll height
    selector: null,        // CSS selector to scroll into view
    sectionProgress: null, // 0..1 inside a section (requires --selector)
    viewport: "1440x900",
    out: null,
    fullPage: true,
    waitMs: 1500,
  };
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    const val = args[i + 1];
    switch (key) {
      case "--path":      opts.path = val; i++; break;
      case "--scroll":    opts.scroll = parseFloat(val); i++; break;
      case "--selector":  opts.selector = val; i++; break;
      case "--section-progress": opts.sectionProgress = parseFloat(val); i++; break;
      case "--viewport":  opts.viewport = val; i++; break;
      case "--out":       opts.out = val; i++; break;
      case "--full-page": opts.fullPage = val !== "false"; i++; break;
      case "--wait":      opts.waitMs = parseInt(val, 10); i++; break;
      default: break;
    }
  }
  return opts;
}

function defaultOut(opts) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = opts.path.replace(/\W+/g, "_") || "root";
  const scroll = opts.selector
    ? `_sel-${opts.selector.replace(/\W+/g, "_")}`
    : opts.scroll != null
      ? `_s${Math.round(opts.scroll * 100)}`
      : "";
  return `/tmp/stroyka-landing-${slug}${scroll}-${stamp}.png`;
}

async function main() {
  const opts = parseArgs();
  if (!opts.out) opts.out = defaultOut(opts);
  mkdirSync(dirname(opts.out), { recursive: true });

  const [w, h] = opts.viewport.split("x").map(Number);
  const url = new URL(opts.path, BASE_URL).toString();

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2, // retina-ish, matches how user sees the page
  });
  const page = await ctx.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (err) {
    console.error(`❌ Could not reach ${url} — is \`npm run dev\` running?`);
    console.error(`   ${err.message}`);
    await browser.close();
    process.exit(1);
  }

  // Settle: fonts, initial Framer Motion transitions, R3F canvas hydration
  await page.waitForTimeout(opts.waitMs);

  if (opts.selector && opts.sectionProgress != null) {
    // Scroll inside a specific section: 0 = section top at viewport top,
    // 1 = section bottom at viewport bottom. For sticky-animated sections,
    // this linearly walks the internal useScroll progress.
    const frac = Math.max(0, Math.min(1, opts.sectionProgress));
    await page.evaluate(
      ({ sel, f }) => {
        const el = document.querySelector(sel);
        if (!el) throw new Error(`selector not found: ${sel}`);
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const scrollable = rect.height - window.innerHeight;
        window.scrollTo({ top: top + Math.max(0, scrollable) * f, behavior: "instant" });
      },
      { sel: opts.selector, f: frac },
    );
    await page.waitForTimeout(800);
  } else if (opts.selector) {
    await page.locator(opts.selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  } else if (opts.scroll != null) {
    const frac = Math.max(0, Math.min(1, opts.scroll));
    await page.evaluate((f) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * f, behavior: "instant" });
    }, frac);
    await page.waitForTimeout(600); // let sticky/scroll-driven things settle
  }

  await page.screenshot({
    path: opts.out,
    fullPage:
      opts.fullPage &&
      !opts.selector &&
      opts.scroll == null &&
      opts.sectionProgress == null,
  });
  console.log(`📸 ${opts.out}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
