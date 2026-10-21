import { test, expect } from "@playwright/test";

for (const [width, key, adWidth, adHeight] of [
  [320, "5eab9d566df2017b106271025e01263d", 300, 250],
  [375, "9a1a7edc1c25c225ff7981e4aa8e1fbc", 320, 50],
  [768, "9a1a7edc1c25c225ff7981e4aa8e1fbc", 320, 50],
  [1440, "3b697ed4f08c77989d03b8459db477b6", 728, 90],
] as const) {
  test(`ad request, isolation and stable layout at ${width}px`, async ({
    page,
  }) => {
    const requests: string[] = [];
    await page.route("https://bicea.org/**", async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        contentType: "application/javascript",
        body: "document.body.dataset.testLoaded = atOptions.key;",
      });
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const ad = page.locator(".ad-header iframe");
    await expect(ad).toHaveAttribute("data-ad-key", key);
    await expect(ad).toHaveAttribute("width", String(adWidth));
    await expect(ad).toHaveAttribute("height", String(adHeight));
    await expect(
      page.frameLocator(".ad-header iframe").locator("body"),
    ).toHaveAttribute("data-test-loaded", key);
    expect(requests).toEqual([`https://bicea.org/22/${key}`]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    // Resizing may change the slot, but must not generate extra impressions.
    await page.setViewportSize({ width: width + 20, height: 900 });
    await expect(ad).toHaveAttribute("data-ad-key", key);
    expect(requests).toHaveLength(1);
    await page.locator(".ad-sidebar").scrollIntoViewIfNeeded();
    await expect(
      page.frameLocator(".ad-sidebar iframe").locator("body"),
    ).toHaveAttribute("data-test-loaded", "5eab9d566df2017b106271025e01263d");
    expect(requests).toHaveLength(2);
  });
}

test("content pages load ads after navigation; privacy remains ad-free", async ({
  page,
}) => {
  await page.route("https://bicea.org/**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
  await page.goto("/puzzle/");
  await expect(page.locator(".ad-header iframe")).toHaveCount(1);
  await page
    .getByRole("link", { name: "release-date briefing", exact: true })
    .click();
  await expect(page).toHaveURL(/release-date/);
  await expect(page.locator(".ad-header iframe")).toHaveCount(1);
  await page.goto("/privacy/");
  await expect(page.locator("[data-ad-provider]")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Adsterra Privacy Policy" }),
  ).toBeVisible();
});
