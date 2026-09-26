import { test, expect, type Page } from "@playwright/test";
import { homeReady } from "./ready";

const toFeatures = (page: Page, f: number) =>
  homeReady(page).then(() =>
  page.evaluate((frac) => {
    const el = document.querySelector("#features") as HTMLElement;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + frac * (el.offsetHeight - window.innerHeight), behavior: "instant" as ScrollBehavior });
  }, f));

test.describe("desktop binder", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the top page's tab lights up, and a tab flips back to its page", async ({ page }) => {
    await page.goto("/");
    await toFeatures(page, 0.97);
    await expect(page.locator('#features [data-tab="3"]')).toHaveAttribute("data-top", "1", { timeout: 8000 });
    // Every buried page's tab is still visible above the pile.
    for (const i of [0, 1, 2]) await expect(page.locator(`#features [data-tab="${i}"]`)).toBeVisible();
    await page.locator('#features [data-tab="0"]').click();
    await expect(page.locator('#features [data-tab="0"]')).toHaveAttribute("data-top", "1", { timeout: 8000 });
  });

  test("proof chips stamp on as a page lands", async ({ page }) => {
    await page.goto("/");
    await toFeatures(page, 0.12);
    const chips = page.locator("#features [data-proof]").first().locator("li");
    await expect(chips).toHaveCount(3);
    await expect.poll(() => chips.first().evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 8000 }).toBeGreaterThan(0.95);
  });
});

test("phones: no tabs, no sideways scroll, chips present", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#features").scrollIntoViewIfNeeded();
  await expect(page.locator('#features [data-tab="0"]')).toBeHidden();
  await expect(page.locator("#features [data-proof] li")).toHaveCount(12);
  const ok = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  expect(ok).toBe(true);
});
