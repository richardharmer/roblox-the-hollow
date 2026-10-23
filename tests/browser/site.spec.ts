import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route("https://bicea.org/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* Ad request intercepted during automated tests. */",
    }),
  );
});
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
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page
      .locator("summary")
      .filter({ hasText: "When does The Hollow start?" })
      .click();
    await expect(
      page.getByText("October 22, 2026 is the confirmed date.", {
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
  expect(await r.text()).toContain("9 confirmed");
  const missing = await request.get("/quests/not-a-real-quest/");
  expect(missing.status()).toBe(404);
});

test("confirmed lineup filters link to sourced monster profiles", async ({
  page,
}) => {
  await page.goto("/games/");
  await page.getByLabel("Evidence").selectOption("CONFIRMED");
  await expect(page.locator(".teaser-card")).toHaveCount(9);
  await page.getByLabel("Search games").fill("DOORS");
  await expect(page.locator(".teaser-card")).toHaveCount(1);
  await expect(page.locator(".teaser-card")).toContainText("Seek");
  await page.getByRole("link", { name: "DOORS", exact: true }).click();
  await expect(page.locator("#hollow-status")).toContainText(
    "Confirmed monster: Seek",
  );
  await expect(
    page.getByRole("link", { name: "Play on Roblox" }),
  ).toHaveAttribute("href", /games\/6516141723\//);
  await expect(page.locator("#game-sources")).toContainText(
    "official announcement",
  );
});

for (const width of [375, 1440]) {
  test(`schedule and reward reading at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/release-date/", "/rewards/", "/games/"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/${path.replaceAll("/", "")}-${width}.png`,
        fullPage: true,
      });
    }
    await page.goto("/release-date/");
    await expect(page.locator(".schedule-primary time")).toHaveAttribute(
      "datetime",
      "2026-10-22T21:00:00Z",
    );
    await expect(page.locator(".event-schedule")).toContainText(
      "Nov 3, 04:00 Beijing",
    );
    await page.goto("/rewards/");
    await expect(page.locator(".reward-categories li")).toHaveCount(3);
    await expect(page.locator(".reward-categories")).toContainText(
      "not confirmed free quest rewards",
    );
  });
}

test("player rewards stay on-site and Plus is excluded by the free filter", async ({
  page,
}) => {
  await page.goto("/");
  const board = page.locator("#reward-board");
  await expect(board.locator(".player-reward-row")).toHaveCount(5);
  await board
    .getByRole("link", { name: "Gourdlord: The Entangled", exact: true })
    .click();
  await expect(page).toHaveURL(/\/rewards\/gourdlord-entangled\//);
  await expect(page.locator(".step-list")).toContainText("100 Tickets");
  await page.goto("/rewards/");
  await expect(page.locator("#tickets")).toContainText("Confirm");
  await expect(page.locator("#codes")).toContainText(
    "No working event redemption code was verified",
  );
  await expect(page.locator(".entry-card")).toHaveCount(5);
  await page.getByLabel("Free only", { exact: false }).check();
  await expect(page.locator(".entry-card")).toHaveCount(4);
  await expect(
    page.locator(".entry-list").getByText("Quack-o'-Lantern", { exact: true }),
  ).toHaveCount(0);
});
