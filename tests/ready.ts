import type { Page } from "@playwright/test";

/**
 * The home streams in behind the loading.tsx shell: `load` can fire while the
 * shell (one screen tall) is still showing, and a scroll then clamps to 0.
 * Wait until the real page is in the document before scrolling it.
 */
export const homeReady = (page: Page) =>
  page.waitForFunction(() => {
    const main = document.querySelector("main.site-home") as HTMLElement | null;
    return !!main && main.offsetHeight > 5000 && document.documentElement.scrollHeight > 5000;
  }, undefined, { timeout: 15000 });
