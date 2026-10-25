import { test, expect, type Page } from "@playwright/test";
import { adCodes } from "../../src/lib/ad-codes";

async function stubAds(page: Page) {
  await page.route("https://bicea.org/**", async (route) => {
    if (route.request().url().includes("/21/")) {
      await route.fulfill({ contentType: "application/javascript", body: `var nativeContainer = document.getElementById('container-a3c4d96df4650a272f65a144fd62d913'); nativeContainer.textContent = 'Test native advertisement'; nativeContainer.style.height = '180px';` });
      return;
    }
    if (route.request().url().includes("/14/")) {
      await route.fulfill({ contentType: "application/javascript", body: "window.socialTrialLoaded = true;" });
      return;
    }
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
    const native = page.locator(".ad-native");
    await expect(native).toContainText("Test native advertisement");
    expect(await native.locator("script").evaluate((el) => el.outerHTML)).toBe(adCodes.native.split("\n")[0]);
    expect(await native.evaluate((el) => Boolean(el.compareDocumentPosition(document.querySelector('#reward-board')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await expect(page.locator(".ad-sidebar iframe")).toHaveAttribute("data-test-key", "5eab9d566df2017b106271025e01263d");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.setViewportSize({ width: width + 20, height: 900 });
    await expect(ad).toHaveAttribute("data-test-key", key);
    await expect(header.locator("script[src]")).toHaveCount(1);
  });
}

test("Social Bar runs on home and puzzle and is discarded on other pages", async ({ page }) => {
  await stubAds(page);
  await page.goto("/");
  const homeSocial = page.locator('script[src*="bicea.org/14/"]');
  await expect(homeSocial).toHaveCount(1);
  expect(await homeSocial.evaluate((el) => el.outerHTML)).toBe(adCodes.social);
  await page.getByRole("link", { name: "Privacy", exact: true }).click();
  await expect(page).toHaveURL(/privacy/);
  await expect(page.locator('script[src*="bicea.org"]')).toHaveCount(0);
  await page.goto("/puzzle/");
  const social = page.locator('script[src*="bicea.org/14/"]');
  await expect(social).toHaveCount(1);
  expect(await social.evaluate((el) => el.outerHTML)).toBe(adCodes.social);
  await expect(page.locator(".ad-content iframe")).toHaveCount(1);
  await page.getByRole("link", { name: "release-date briefing", exact: true }).click();
  await expect(page).toHaveURL(/release-date/);
  await expect(page.locator(".ad-header iframe")).toHaveCount(1);
  await expect(page.locator('script[src*="bicea.org/14/"]')).toHaveCount(0);
  await page.goto("/privacy/");
  await expect(page.locator("[data-ad-provider]")).toHaveCount(0);
  await expect(page.locator('script[src*="bicea.org"]')).toHaveCount(0);
});

test("long walkthrough includes a second placement after the complete steps", async ({ page }) => {
  await stubAds(page);
  await page.goto("/quests/night-two-pillars/");
  await expect(page.locator(".ad-header iframe")).toHaveCount(1);
  await expect(page.locator(".ad-content iframe")).toHaveCount(1);
  expect(await page.locator(".ad-content").evaluate((el) => Boolean(el.previousElementSibling?.classList.contains("step-list")))).toBe(true);
});
