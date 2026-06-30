import { test, expect } from "@playwright/test";

for (const path of ["/demo", "/get-started"]) {
  test(`${path}: renders one decorative ambient backdrop`, async ({ page }) => {
    await page.goto(path);

    // Exactly one drifting grid layer is present.
    const grid = page.locator(".ambient-grid");
    await expect(grid).toHaveCount(1);

    // The backdrop is decorative: its container is aria-hidden and not interactive.
    const backdrop = page.locator('[aria-hidden="true"]').filter({ has: grid });
    await expect(backdrop).toHaveCount(1);
    await expect(backdrop).toHaveCSS("pointer-events", "none");

    // The page's primary CTA is still reachable above the backdrop.
    await expect(page.getByRole("button").first()).toBeVisible();
  });
}
