import { test, expect, type Page } from "@playwright/test";

async function toLift(page: Page, p: number) {
  await page.evaluate((v) => {
    const s = document.querySelector("[data-lift]") as HTMLElement;
    window.scrollTo(0, s.offsetTop + v * (s.offsetHeight - window.innerHeight));
  }, p);
}

test.describe("V2 phase 1 — ledger", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the ledger card tilts on hover and returns to no transform after", async ({ page }) => {
    await page.goto("/");
    await toLift(page, 0.5);
    const card = page.locator("[data-ledger-card]");
    await expect(card).toBeVisible({ timeout: 8000 });
    const box = (await card.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.2);
    await expect.poll(() => card.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
    await page.mouse.move(40, 450);
    await page.waitForTimeout(800);
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });

  test("the load that just landed draws a leader line to its storey", async ({ page }) => {
    await page.goto("/");
    await toLift(page, 0.5); // loads 0–2 have landed (landingProgress(2) ≈ 0.467 < 0.5 < 0.594)
    const on = page.locator('path[data-leader][data-on="1"]');
    await expect(on).toHaveCount(1, { timeout: 8000 });
    await expect(on).toHaveAttribute("data-index", "2");
    await expect.poll(() => on.first().getAttribute("d")).toMatch(/^M\d/);
  });

  test("leader lines re-anchor when the window is resized", async ({ page }) => {
    await page.goto("/");
    await toLift(page, 0.5);
    const first = page.locator('path[data-leader][data-on="1"]').first();
    await expect.poll(() => first.getAttribute("d"), { timeout: 8000 }).toMatch(/^M\d/);
    const before = await first.getAttribute("d");
    await page.setViewportSize({ width: 1280, height: 800 });
    await toLift(page, 0.5);
    await expect.poll(() => first.getAttribute("d"), { timeout: 8000 }).not.toBe(before);
  });
});
