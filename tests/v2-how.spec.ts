import { test, expect, type Page } from "@playwright/test";

async function scrollToFraction(page: Page, selector: string, f: number) {
  await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector(sel as string) as HTMLElement;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (frac as number) * el.offsetHeight - window.innerHeight * 0.5, behavior: "instant" as ScrollBehavior });
    },
    [selector, f] as const,
  );
}

const reached = (page: Page) => page.locator('#how-it-works li[data-step][data-reached="1"]');

test("how-it-works is its own section, not the hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#how-it-works")).toHaveCount(1);
  await expect(page.locator("#how-it-works")).not.toHaveAttribute("data-lift", /.*/);
  await expect(page.locator("#lift")).toHaveCount(1);
  await expect(page.locator("#how-it-works li[data-step]")).toHaveCount(4);
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the nav link lands on the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: /how it works/i }).first().click();
    await expect
      .poll(() => page.evaluate(() => document.getElementById("how-it-works")!.getBoundingClientRect().top), { timeout: 10000 })
      .toBeLessThan(200);
  });

  test("scrolling draws the line and stamps the steps in order, and back", async ({ page }) => {
    await page.goto("/");
    // -0.6 isn't far enough above the section to clamp useScroll's progress
    // to 0 for the real (translated) copy's measured `ol` height (~310px
    // at this viewport: needs roughly <= -0.87 given offset ["start 0.8",
    // "end 0.6"] against a 900px-tall viewport) — verified this settles,
    // not slow-animates, at a non-zero "reached" count, so it's a scroll-
    // target calibration issue, not flakiness. -1.2 gives comfortable
    // margin above that threshold without touching what's asserted below.
    await scrollToFraction(page, "#how-it-works ol", -1.2);
    await expect(reached(page)).toHaveCount(0, { timeout: 10000 });
    await scrollToFraction(page, "#how-it-works ol", 1.4);
    await expect(reached(page)).toHaveCount(4, { timeout: 10000 });
    await scrollToFraction(page, "#how-it-works ol", -1.2);
    await expect(reached(page)).toHaveCount(0, { timeout: 10000 });
  });
});

test("phones: the rail fills and all four steps stamp; no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await scrollToFraction(page, "#how-it-works ol", 1.3);
  await expect(reached(page)).toHaveCount(4, { timeout: 10000 });
  const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(sw).toBeLessThanOrEqual(cw);
});

test("phones: scroll-to-top still stays hidden over the crane hero", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight + 40, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(400);
  await expect(page.locator('[aria-label="Scroll to top"]')).toBeHidden();
});

test("reduced motion: every step is stamped at once, no hydration errors", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && /hydrat|did not match|Minified React error #4(1[89]|2[1235])/i.test(m.text()) && errors.push(m.text()));
  await page.goto("/");
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await expect(reached(page)).toHaveCount(4, { timeout: 5000 });
  expect(errors).toEqual([]);
  await ctx.close();
});

const noSidewaysScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

for (const viewport of [
  { width: 1024, height: 768 },
  { width: 820, height: 1180 },
]) {
  test(`${viewport.width}×${viewport.height}: the contour never widens the page, before or after it measures`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    // No waits: the un-measured server/first-paint width={1200} default must
    // never overflow — an isomorphic layout effect measures before paint,
    // and overflow-x-clip on the track is the backstop either way.
    expect(await noSidewaysScroll(page)).toBe(true);
    await page.locator("#how-it-works").scrollIntoViewIfNeeded();
    expect(await noSidewaysScroll(page)).toBe(true);
  });

  test(`${viewport.width}×${viewport.height}, JS disabled: the server-rendered contour alone doesn't overflow`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport });
    const page = await ctx.newPage();
    await page.goto("/");
    expect(await noSidewaysScroll(page)).toBe(true);
    await ctx.close();
  });
}
