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

test("reduced motion: home hydrates without errors", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await page.waitForTimeout(2000);
  expect(errors.filter((e) => /hydrat|did not match/i.test(e))).toEqual([]);
  await expect(page.locator('path[data-leader][data-on="1"]')).toHaveCount(0);
  await ctx.close();
});

test("390px: the home never scrolls sideways", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const y of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((f) => window.scrollTo(0, f * document.documentElement.scrollHeight), y);
    await page.waitForTimeout(300);
    const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    expect(sw).toBeLessThanOrEqual(cw);
  }
});
