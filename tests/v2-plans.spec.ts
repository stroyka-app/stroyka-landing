import { test, expect } from "@playwright/test";

test.describe("home pricing", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the crew you dial in on SeatMath carries down to pricing", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#pricing [data-plan]")).toHaveCount(3);
    // Untouched slider: no personalisation.
    await expect(page.locator("[data-crew-line]")).toHaveCount(0);
    await page.locator("#crew").scrollIntoViewIfNeeded();
    await page.locator("#crew").focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight"); // 12 → 15
    const line = page.locator("[data-crew-line]");
    await expect(line).toContainText("15");
    await expect(line).toContainText("$29");
    await expect(line).toContainText("140"); // Workyard: $50 + $6 × 15
    await expect(page.locator('#pricing [data-plan="starter"]')).toHaveAttribute("data-fits", "1");
    for (let i = 0; i < 12; i++) await page.keyboard.press("ArrowLeft"); // → 3: Free fits
    await expect(page.locator('#pricing [data-plan="free"]')).toHaveAttribute("data-fits", "1");
  });

  test("flipping billing re-prices the tags", async ({ page }) => {
    await page.goto("/");
    await page.locator("#pricing").scrollIntoViewIfNeeded();
    const starter = page.locator('#pricing [data-plan="starter"]');
    await expect(starter).toContainText("$29");
    await page.locator("#pricing").getByRole("button", { name: /annual/i }).click();
    await expect(starter).toContainText("$24");
  });
});

test("get-started: picking a plan hoists and stamps it, and Continue still advances", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/get-started");
  const pro = page.locator('[data-plan="pro"]');
  await pro.click({ position: { x: 40, y: 40 } });
  await expect(pro).toHaveAttribute("data-selected", "1");
  await expect(page.locator('[data-plan="starter"]')).toHaveAttribute("data-selected", "0");
  await pro.getByRole("button").click();
  await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 8000 });
});

test("get-started on phones: hanging cards, no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/get-started");
  await expect(page.locator("[data-plan]")).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
