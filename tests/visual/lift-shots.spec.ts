import { test } from "@playwright/test";

// Opt-in: SHOTS=1 npx playwright test -c playwright.visual.config.ts
test.skip(!process.env.SHOTS, "screenshots only on demand");

const STOPS = [0, 0.04, 0.16, 0.2, 0.3, 0.42, 0.55, 0.7, 0.9, 1];

test("lift: desktop frames for tuning", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  for (const p of STOPS) {
    await page.evaluate((v) => {
      const s = document.querySelector("[data-lift]") as HTMLElement;
      window.scrollTo(0, s.offsetTop + v * (s.offsetHeight - window.innerHeight));
    }, p);
    await page.waitForTimeout(1600); // the progress spring settles
    await page.screenshot({ path: `test-results/lift/desktop-${String(p).padEnd(4, "0")}.png` });
  }
});

test("lift: phone hero unchanged", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForTimeout(4000);
  await page.screenshot({ path: "test-results/lift/phone-hero.png" });
});
