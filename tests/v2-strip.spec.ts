import { test, expect, type Page } from "@playwright/test";

const N = 6;
const toTrack = (page: Page, p: number) =>
  page.evaluate((frac) => {
    const el = document.querySelector("[data-strip-track]") as HTMLElement;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + frac * (el.offsetHeight - window.innerHeight), behavior: "instant" as ScrollBehavior });
  }, p);
const caption = (page: Page, scope: string) => page.locator(`${scope} [data-strip-caption]`).last();

test.describe("desktop reel", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("scrolling pulls the film through the gate, one screen at a time", async ({ page }) => {
    await page.goto("/");
    for (const k of [0, 3, 5]) {
      await toTrack(page, k / (N - 1));
      await expect(caption(page, "[data-strip-track]")).toHaveAttribute("data-strip-caption", String(k), { timeout: 8000 });
    }
  });

  test("the index jumps to a screen", async ({ page }) => {
    await page.goto("/");
    await toTrack(page, 0);
    await page.locator("[data-strip-track] ol button").nth(4).click();
    await expect(caption(page, "[data-strip-track]")).toHaveAttribute("data-strip-caption", "4", { timeout: 8000 });
  });
});

test.describe("phone reel", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("plays by itself, pauses on tap, jumps on a dot", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-strip-reel]").scrollIntoViewIfNeeded();
    await expect(caption(page, "[data-strip-reel]")).toHaveAttribute("data-strip-caption", "1", { timeout: 6000 });
    await page.getByRole("button", { name: "Pause" }).last().click();
    const held = await caption(page, "[data-strip-reel]").getAttribute("data-strip-caption");
    await page.waitForTimeout(4000);
    await expect(caption(page, "[data-strip-reel]")).toHaveAttribute("data-strip-caption", held!);
    await page.locator('[data-strip-dot="4"]').click();
    await expect(caption(page, "[data-strip-reel]")).toHaveAttribute("data-strip-caption", "4");
  });
});

test("reduced motion: no pin, no auto-advance, dots still switch screens", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.locator("[data-strip-reel]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-strip-track]")).toHaveCount(0);
  await page.waitForTimeout(4000);
  await expect(caption(page, "[data-strip-reel]")).toHaveAttribute("data-strip-caption", "0");
  await page.locator('[data-strip-dot="3"]').click();
  await expect(caption(page, "[data-strip-reel]")).toHaveAttribute("data-strip-caption", "3");
  await ctx.close();
});
