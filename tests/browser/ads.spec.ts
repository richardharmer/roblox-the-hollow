import { test, expect, type Page } from "@playwright/test";
import { adCodes } from "../../src/lib/ad-codes";

async function stubAds(page: Page) {
  await page.route("https://bicea.org/**", async (route) => {
    // Deliberately slow the first banner: a second slot must not overwrite
    // atOptions before this script consumes the provider's global settings.
    if (route.request().url().includes("3b697")) await new Promise((resolve) => setTimeout(resolve, 100));
    await route.fulfill({
      contentType: "application/javascript",
      body: `var frame = document.createElement('iframe');
frame.dataset.testKey = atOptions.key;
frame.width = atOptions.width;
frame.height = atOptions.height;
frame.title = 'Provider creative';
document.currentScript.after(frame);`,
    });
  });
}

for (const [width, unit, key, adWidth, adHeight] of [
  [320, "rectangle", "5eab9d566df2017b106271025e01263d", 300, 250],
  [375, "mobile", "9a1a7edc1c25c225ff7981e4aa8e1fbc", 320, 50],
  [768, "mobile", "9a1a7edc1c25c225ff7981e4aa8e1fbc", 320, 50],
  [1440, "desktop", "3b697ed4f08c77989d03b8459db477b6", 728, 90],
] as const) {
  test(`original snippets execute directly with correct settings at ${width}px`, async ({ page }) => {
    await stubAds(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const header = page.locator(".ad-header");
    const ad = header.locator("iframe");
    await expect(ad).toHaveAttribute("data-test-key", key);
    await expect(ad).toHaveAttribute("width", String(adWidth));
    await expect(ad).toHaveAttribute("height", String(adHeight));
    await expect(header.locator("iframe[srcdoc], iframe[sandbox]")).toHaveCount(0);
    // Exact original inline script text, and no added external script attributes.
    expect(await header.locator("script").first().textContent()).toBe(adCodes[unit].split("<script>")[1].split("</script>")[0]);
    expect(await header.locator("script[src]").evaluate((el) => el.outerHTML)).toBe(adCodes[unit].split("\n").at(-1));
    await expect(page.locator(".ad-sidebar iframe")).toHaveAttribute("data-test-key", "5eab9d566df2017b106271025e01263d");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.setViewportSize({ width: width + 20, height: 900 });
    await expect(ad).toHaveAttribute("data-test-key", key);
    await expect(header.locator("script[src]")).toHaveCount(1);
  });
}

test("removed Native Banner and Social Bar never load on formerly enabled pages", async ({ page }) => {
  const removedRequests: string[] = [];
  page.on("request", (request) => {
    if (/bicea\.org\/(14|21)\//.test(request.url())) removedRequests.push(request.url());
  });
  await stubAds(page);
  for (const path of ["/", "/puzzle/", "/games/", "/quests/", "/rewards/", "/badges/", "/release-date/", "/quests/night-two-pillars/"]) {
    await page.goto(path);
    await expect(page.locator(".ad-header iframe")).toHaveCount(1);
    await expect(page.locator('.ad-native, script[src*="bicea.org/14/"], script[src*="bicea.org/21/"]')).toHaveCount(0);
  }
  expect(removedRequests).toEqual([]);
  await page.goto("/privacy/");
  await expect(page.locator("[data-ad-provider]")).toHaveCount(0);
});

test("long walkthrough includes a second placement after the complete steps", async ({ page }) => {
  await stubAds(page);
  await page.goto("/quests/night-two-pillars/");
  await expect(page.locator(".ad-header iframe")).toHaveCount(1);
  await expect(page.locator(".ad-content iframe")).toHaveCount(1);
  expect(await page.locator(".ad-content").evaluate((el) => Boolean(el.previousElementSibling?.querySelector(".step-list")))).toBe(true);
});
