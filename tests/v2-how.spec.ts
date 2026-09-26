import { test, expect, webkit, type Page } from "@playwright/test";

async function scrollToFraction(page: Page, selector: string, f: number) {
  await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector(sel as string) as HTMLElement;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (frac as number) * el.offsetHeight - window.innerHeight * 0.5, behavior: "instant" as ScrollBehavior });
    },
    [selector, f] as const,
  );
}

/** The Lift swaps its server 760vh markup for PhoneLift / height:auto after hydration. */
const waitForLiftSwap = (page: Page) =>
  page.waitForFunction(
    () => {
      const lift = document.getElementById("lift");
      return !!lift && lift.offsetHeight < window.innerHeight * 3;
    },
    undefined,
    { timeout: 15000 },
  );

const reached = (page: Page) => page.locator('#how-it-works li[data-step][data-reached="1"]');

test("how-it-works is its own section, not the hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#how-it-works")).toHaveCount(1);
  await expect(page.locator("#how-it-works")).not.toHaveAttribute("data-lift", /.*/);
  await expect(page.locator("#lift")).toHaveCount(1);
  await expect(page.locator("#how-it-works li[data-step]")).toHaveCount(4);
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the nav link lands on the section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: /how it works/i }).first().click();
    await expect
      .poll(() => page.evaluate(() => document.getElementById("how-it-works")!.getBoundingClientRect().top), { timeout: 10000 })
      .toBeLessThan(200);
  });

  test("scrolling runs the board through the four steps in order, and back", async ({ page }) => {
    await page.goto("/");
    await scrollToFraction(page, "[data-how-track]", -0.3);
    await expect(reached(page)).toHaveCount(0, { timeout: 10000 });
    await scrollToFraction(page, "[data-how-track]", 0.5);
    await expect(reached(page)).toHaveCount(2, { timeout: 10000 });
    await scrollToFraction(page, "[data-how-track]", 1.1);
    await expect(reached(page)).toHaveCount(4, { timeout: 10000 });
    await scrollToFraction(page, "[data-how-track]", -0.3);
    await expect(reached(page)).toHaveCount(0, { timeout: 10000 });
  });

  test("the day tag starts on the drawing and jumps into the text", async ({ page }) => {
    await page.goto("/");
    // Early in beat 3 the tag is on the board; late in it, it's in the text column.
    const at = async (p: number) => {
      await page.evaluate((f) => {
        const el = document.querySelector("[data-how-track]") as HTMLElement;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + f * (el.offsetHeight - window.innerHeight), behavior: "instant" as ScrollBehavior });
      }, p);
      await page.waitForTimeout(1200);
      return page.evaluate(() => {
        const tag = document.querySelector("#how-it-works [data-day-tag]") as HTMLElement | null;
        const board = document.querySelector("#how-it-works svg") as SVGElement;
        if (!tag) return null;
        return tag.getBoundingClientRect().left > board.getBoundingClientRect().left;
      });
    };
    expect(await at(0.52)).toBe(true); // on the board
    expect(await at(0.7)).toBe(false); // jumped to the text column
  });
});

test("phones: every card runs its step as it scrolls through; no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await scrollToFraction(page, "#how-it-works ol", 1.3);
  await expect(reached(page)).toHaveCount(4, { timeout: 10000 });
  const [sw, cw] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(sw).toBeLessThanOrEqual(cw);
});

test("phones: scroll-to-top still stays hidden over the crane hero", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight + 40, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(400);
  await expect(page.locator('[aria-label="Scroll to top"]')).toBeHidden();
});

test("reduced motion: every step is stamped at once, no hydration errors", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && /hydrat|did not match|Minified React error #4(1[89]|2[1235])/i.test(m.text()) && errors.push(m.text()));
  await page.goto("/");
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await expect(reached(page)).toHaveCount(4, { timeout: 5000 });
  expect(errors).toEqual([]);
  await ctx.close();
});

const noSidewaysScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

for (const viewport of [
  { width: 1024, height: 768 },
  { width: 820, height: 1180 },
]) {
  test(`${viewport.width}×${viewport.height}: the contour never widens the page, before or after it measures`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    // No waits: the un-measured server/first-paint width={1200} default must
    // never overflow — an isomorphic layout effect measures before paint,
    // and overflow-x-clip on the track is the backstop either way.
    expect(await noSidewaysScroll(page)).toBe(true);
    await page.locator("#how-it-works").scrollIntoViewIfNeeded();
    expect(await noSidewaysScroll(page)).toBe(true);
  });
}

test("phones: step 1 isn't stamped before the list scrolls into view; all four after", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  // List top just below the fold: useScroll progress clamps to 0 here, so a
  // step-1 mark of exactly 0 would stamp it early.
  // Aim only after the Lift has swapped to PhoneLift (it moves the list by
  // thousands of px), then re-aim until the position holds.
  await waitForLiftSwap(page);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const ol = document.querySelector("#how-it-works ol") as HTMLElement;
          const top = ol.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top - window.innerHeight - 20, behavior: "instant" as ScrollBehavior });
          return new Promise<number>((r) =>
            setTimeout(() => r(Math.round(ol.getBoundingClientRect().top - window.innerHeight)), 300),
          );
        }),
      { timeout: 10000 },
    )
    .toBe(20);
  await page.waitForTimeout(600);
  await expect(page.locator('#how-it-works li[data-step="0"]')).toHaveAttribute("data-reached", "0");
  await scrollToFraction(page, "#how-it-works ol", 1.3);
  await expect(reached(page)).toHaveCount(4, { timeout: 10000 });
});

// Hash landing on the NATIVE path (Lenis off: touch or reduced motion). The
// Lift swaps its 760vh desktop markup after mount, so the browser's own
// fragment jump lands high above the target unless HashScroll re-settles.
const topOf = (page: Page, id: string) =>
  page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, id);

/**
 * Lands on #id and STAYS there. Waits for the Lift's post-hydration swap
 * (760vh → PhoneLift / height:auto) first: before it, the browser's own
 * fragment jump against the server layout can look right by accident.
 */
async function expectLanded(page: Page, id: string) {
  await waitForLiftSwap(page);
  // |top| < 200: a target scrolled far PAST would also satisfy "top < 200".
  await expect.poll(async () => Math.abs(await topOf(page, id)), { timeout: 5000 }).toBeLessThan(200);
  // ...and it stays there once the late corrections have run.
  await page.waitForTimeout(1200);
  expect(Math.abs(await topOf(page, id))).toBeLessThan(200);
}

for (const hash of ["how-it-works", "pricing"]) {
  test.describe(`native hash landing on #${hash}`, () => {
    // Playwright forbids use({ browserName }) inside a describe (it forces a
    // new worker), so this one launches WebKit itself.
    test("iOS-like phone (WebKit, touch): cross-route /demo → /#hash lands on the section", async ({ baseURL }) => {
      const browser = await webkit.launch();
      try {
        const ctx = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
        const page = await ctx.newPage();
        await page.goto("/demo");
        await page.goto(`/#${hash}`);
        await expectLanded(page, hash);
      } finally {
        await browser.close();
      }
    });

    test.describe("reduced-motion desktop (Chromium)", () => {
      test.use({ viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: "reduce" } });

      test("direct /#hash lands on the section", async ({ page }) => {
        await page.goto(`/#${hash}`);
        await expectLanded(page, hash);
      });
    });
  });
}

test("a click right after a /#hash landing stops the re-landing (never yanks the visitor back)", async ({ browser }) => {
  // Reduced motion = the native (no-Lenis) landing path.
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/#pricing");
  await page.waitForTimeout(350);
  // A visitor clicks something that scrolls elsewhere (a CTA, the logo…).
  await page.mouse.click(700, 450);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(1500); // past the 900ms re-land beat
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(100);
  await ctx.close();
});
