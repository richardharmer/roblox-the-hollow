import { test, expect } from "@playwright/test";
for (const width of [375, 390, 768, 1440])
  test(`layout and navigation at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("HOLLOW");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `research/screenshots/home-${width}.png`,
      fullPage: true,
    });
    await page
      .locator("summary")
      .filter({ hasText: "When does The Hollow start?" })
      .click();
    await expect(
      page.getByText("October 22, 2026 is the reported date.", {
        exact: false,
      }),
    ).toBeVisible();
    if (width <= 768) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(
        page.getByRole("navigation", { name: "Main navigation" }),
      ).toBeVisible();
    }
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Games", exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText("The Hollow Games");
    await page.getByLabel("Search games").fill("nonexistent");
    await expect(
      page.getByRole("heading", { name: "No matching games", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
test("progress import, persistence, merge, export and reset", async ({
  page,
}) => {
  await page.goto("/progress/");
  await page.getByLabel("Import progress JSON").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        eventId: "the-hollow-2026",
        completedQuestIds: ["test-quest"],
        claimedRewardIds: [],
      }),
    ),
  });
  await expect(page.getByRole("status")).toContainText("Backup imported");
  await page.reload();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("hollow-progress")!).completed,
    ),
  ).toEqual(["quest:test-quest"]);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  expect((await download).suggestedFilename()).toBe("my-hollow-progress.json");
  await page.getByLabel("Import progress JSON").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByRole("status")).toContainText("Import failed");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("hollow-progress")!).completed,
    ),
  ).toEqual(["quest:test-quest"]);
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("hollow-progress")!).completed.length,
    ),
  ).toBe(1);
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await page.getByRole("button", { name: "Yes, reset progress" }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("hollow-progress")!).completed,
    ),
  ).toEqual([]);
});
test("static HTML and real 404", async ({ request }) => {
  const r = await request.get("/");
  expect(await r.text()).toContain("The lineup is still behind the door.");
  const missing = await request.get("/quests/not-a-real-quest/");
  expect(missing.status()).toBe(404);
});
