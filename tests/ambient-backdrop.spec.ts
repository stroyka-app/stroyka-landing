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

    // The page's primary content lives in the z-10 layer above the backdrop:
    // assert the heading and a CTA button render there (not just any nav button).
    const content = page.locator(".z-10").first();
    await expect(content.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(content.getByRole("button").first()).toBeVisible();
  });
}
