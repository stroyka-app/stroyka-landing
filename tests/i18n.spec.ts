import { test, expect } from "@playwright/test";

// ── Existing tests ────────────────────────────────────────────────────────────

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
  // Open the navbar popover, then pick Spanish.
  await page.getByRole("button", { name: "Change language" }).first().click();
  await page.getByRole("menuitemradio", { name: "Español" }).click();
  await expect(page).toHaveURL(/\/es\/get-started/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

// ── New: translated hero CTA visible per locale ───────────────────────────────

const HERO_CTA = {
  en: { path: "/", text: "Start free" },
  es: { path: "/es", text: "Empieza gratis" },
  ru: { path: "/ru", text: "Начать бесплатно" },
};

for (const [loc, { path, text }] of Object.entries(HERO_CTA)) {
  test(`${loc}: renders translated hero CTA`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(text).first()).toBeVisible();
  });
}

// ── New: hreflang alternates on all three homepages ──────────────────────────

for (const [loc, { path }] of Object.entries(HERO_CTA)) {
  test(`${loc}: has all hreflang alternates`, async ({ page }) => {
    await page.goto(path);
    for (const lang of ["en", "es", "ru", "x-default"]) {
      await expect(
        page.locator(`link[hreflang="${lang}"]`),
      ).toHaveCount(1);
    }
  });
}

// ── New: legal page shows english-only notice in Spanish ─────────────────────

test("legal /es/privacy shows english-only notice", async ({ page }) => {
  await page.goto("/es/privacy");
  // legal.englishOnlyTitle in es.json = "Disponible en inglés"
  await expect(page.getByText("Disponible en inglés")).toBeVisible();
});
