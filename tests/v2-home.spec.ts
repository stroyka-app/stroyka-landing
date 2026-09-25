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
});
