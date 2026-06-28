import { test, expect } from "@playwright/test";

test("locale routing serves all three locales", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await page.goto("/ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});

test("language switcher navigates and preserves path", async ({ page }) => {
  await page.goto("/get-started");
  await page.getByRole("group", { name: "Language" }).first().getByLabel("Español").click();
  await expect(page).toHaveURL(/\/es\/get-started/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});
