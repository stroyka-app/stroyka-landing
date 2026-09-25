import { test, expect, type Page } from "@playwright/test";

async function toLift(page: Page, p: number) {
  // The crane scene (R3F Canvas, dynamic-imported) and Framer's useScroll
  // must both be mounted before a programmatic scrollTo can be picked up as
  // a "change" on the scroll-linked progress value — scrolling before the
  // canvas exists occasionally left `landed` stuck at its initial state for
  // the rest of the test (flaky). Waiting for the canvas first makes the
  // scroll land on a scene that's actually listening.
  await page.waitForSelector("[data-lift-stage] canvas", { timeout: 15000 });
  await page.evaluate((v) => {
    const s = document.querySelector("[data-lift]") as HTMLElement;
    window.scrollTo(0, s.offsetTop + v * (s.offsetHeight - window.innerHeight));
  }, p);
}

test.describe("V2 phase 1 — ledger", () => {
  // Serial: these three share the pinned Lift scroll-scrub choreography.
  // Running them in parallel workers means multiple fresh WebGL/R3F scenes
  // (each test gets its own isolated browser context, so nothing is warm)
  // spin up and tick at once, competing for CPU/GPU-emulation time — that
  // contention is what made the resize test miss its poll window. Serial
  // removes the cross-test contention; the per-assertion timeouts below are
  // also generous enough to absorb a single scene's own cold-start (spring-
  // damped scroll progress + first WebGL frames) under sandbox load.
  test.describe.configure({ mode: "serial" });
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
    await expect(on).toHaveCount(1, { timeout: 15000 });
    await expect(on).toHaveAttribute("data-index", "2");
    await expect.poll(() => on.first().getAttribute("d"), { timeout: 15000 }).toMatch(/^M\d/);
  });

  test("leader lines re-anchor when the window is resized", async ({ page }) => {
    await page.goto("/");
    await toLift(page, 0.5);
    const first = page.locator('path[data-leader][data-on="1"]').first();
    await expect.poll(() => first.getAttribute("d"), { timeout: 15000 }).toMatch(/^M\d/);
    const before = await first.getAttribute("d");
    await page.setViewportSize({ width: 1280, height: 800 });
    await toLift(page, 0.5);
    await expect.poll(() => first.getAttribute("d"), { timeout: 15000 }).not.toBe(before);
  });
});

test("reduced motion: home hydrates without errors", async ({ browser }) => {
  // Production build strips React's dev hydration warnings down to minified
  // error codes (#418/#419/#421/#422/#423/#425), so a plain /hydrat/ filter
  // on console text goes blind against a prod server. Fail on ANY pageerror
  // (hydration mismatches surface there too), plus any console error that
  // matches the hydration wording or one of those minified codes.
  const hydrationPattern = /hydrat|did not match|Minified React error #4(1[89]|2[1235])/i;
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && hydrationPattern.test(m.text())) consoleErrors.push(m.text());
  });
  await page.goto("/");
  await page.waitForTimeout(2000);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
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
