import { test, expect } from "@playwright/test";
import games from "../../src/data/games.json" with { type: "json" };
import rewards from "../../src/data/rewards.json" with { type: "json" };
import badges from "../../src/data/badges.json" with { type: "json" };
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
    // Wait for client effects before interacting with the directory.
    await expect(page.locator(".ad-header script[src]")).toHaveCount(1);
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
  expect(await r.text()).toContain(`${games.length} confirmed`);
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
    "official lineup confirms Seek from DOORS",
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
  await expect(board.locator(".player-reward-row")).toHaveCount(rewards.length);
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
  await expect(page.locator(".entry-card")).toHaveCount(rewards.length);
  await page.getByLabel("Free only", { exact: false }).check();
  await expect(page.locator(".entry-card")).toHaveCount(rewards.filter((reward) => reward.free === true).length);
  await expect(
    page.locator(".entry-list").getByText("Quack-o'-Lantern", { exact: true }),
  ).toHaveCount(0);
});

test("official badge directory searches IDs without upgrading claim evidence", async ({ page }) => {
  await page.goto("/badges/");
  await expect(page.locator(".entry-card")).toHaveCount(badges.length);
  await page.getByLabel("Search badges").fill("2455468832393759");
  await expect(page.locator(".entry-card")).toHaveCount(1);
  await expect(page.locator(".entry-card")).toContainText("Lord Umberhallow BLOXikin");
  await expect(page.locator(".entry-card")).toContainText("Reported — separate video-based reward guide");
  await page.getByLabel("Search badges").fill("1912601234268529");
  await expect(page.locator(".entry-card")).toContainText("Reported — separate video-based reward guide");
  await page.getByLabel("Search badges").fill("10770728771");
  await expect(page.locator(".entry-card")).toHaveCount(
    badges.filter((badge) => badge.universeId === 10770728771).length,
  );
});


test("Hub badge identities distinguish reported guides from unverified claims", async ({ page }) => {
  await page.goto("/badges/");
  await expect(page.locator(".prose").first()).toContainText(`${badges.filter((badge) => badge.universeId === 10770728771).length} enabled Hub badges`);
  for (const [id, name] of [
    ["1158209636385797", "Festering Felix"],
    ["1208009989394323", "Burned Necrobloxicon"],
    ["3255111880715709", "Biter Fedora"],
    ["3557398016002690", "Trick or Treat Squid"],
    ["79182670138641", "Cowboy Hat of the Dead"],
  ]) {
    await page.getByLabel("Search badges").fill(id);
    await expect(page.locator(".entry-card")).toHaveCount(1);
    await expect(page.locator(".entry-card")).toContainText(name);
    await expect(page.locator(".entry-card")).toContainText("Reported — separate video-based reward guide");
  }
  await page.getByLabel("Search badges").fill("3555451806029358");
  await expect(page.locator(".entry-card")).toContainText("Dark Crescent Helm");
  await expect(page.locator(".entry-card")).toContainText("Unverified — no complete claim instructions");
  await page.goto("/rewards/");
  await expect(page.getByRole("link", { name: `Check all ${badges.filter((badge) => badge.universeId === 10770728771).length} official Hub badge IDs →` })).toBeVisible();
});

test("game pages present recorded tasks before background and preserve pending gaps", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [slug, objective] of [
    ["doors", "50"],
    ["dandys-world", "200"],
    ["demonology", "six"],
    ["99-nights-in-the-forest", "tile"],
  ]) {
    await page.goto(`/games/${slug}/`);
    const tasks = page.locator("#event-tasks");
    await expect(tasks.locator(".step-list").first()).toBeVisible();
    await expect(tasks).toContainText(objective);
    await expect(tasks).not.toContainText("No event-specific instructions");
    await page.getByRole("link", { name: "Read tasks and claim steps", exact: false }).click();
    await expect(page).toHaveURL(/#event-tasks$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto("/games/warden/");
  await expect(page.locator("#event-tasks")).toContainText("Task guide: verification pending");
  await expect(page.locator("#event-tasks .step-list")).toHaveCount(0);
  await page.goto("/games/");
  const mystery = page.locator("#livestreams tr").filter({ hasText: "Unnamed official event" });
  await expect(mystery).toContainText("01:30");
  await expect(mystery.getByRole("link")).toHaveAttribute("href", "https://www.roblox.com/events/9185919240002208323");
  await expect(page.locator("#livestreams")).toContainText("do not identify it as the finale");
});

test("step checklist persists across game and quest pages and ads have no decorative shell", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/quests/forest-void-flowers/");
  const steps = page.getByRole("region", { name: "Step-by-step task checklist" });
  await expect(steps.getByRole("status")).toHaveText("0 of 8 completed");
  await steps.getByLabel("Step 1 done", { exact: true }).check();
  await expect(steps.getByRole("status")).toHaveText("1 of 8 completed");
  await steps.getByRole("link", { name: "Next unfinished step" }).click();
  await expect(page).toHaveURL(/#forest-void-flowers-step-2$/);
  await page.goto("/games/99-nights-in-the-forest/");
  await expect(page.locator(".quest-stepper").first().getByRole("status")).toHaveText("1 of 8 completed");
  await page.reload();
  await expect(page.locator(".quest-stepper").first().getByLabel("Step 1 done", { exact: true })).toBeChecked();
  await expect(page.locator(".ad-label")).toHaveCount(0);
  await expect(page.locator(".ad-slot").first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator(".quest-stepper").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/hollow-steps-mobile.png", fullPage: false });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".quest-stepper").first().scrollIntoViewIfNeeded();
  await expect(page.locator(".quest-stepper").first().getByRole("status")).toHaveText("1 of 8 completed");
  await page.screenshot({ path: "/tmp/hollow-steps-desktop.png", fullPage: false });
});

for (const width of [390, 1440]) {
  test(`puzzle intent routes and QR answer at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/puzzle/");
    await expect(page.locator(".puzzle-routes a")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/puzzle-${width}.png`, fullPage: false });
    await page.getByRole("link", { name: "Is the QR puzzle real?", exact: true }).click();
    await expect(page).toHaveURL(/#qr-code$/);
    await expect(page.locator("#qr-code")).toContainText("Neither supplies a QR reward destination");
    await page.getByRole("link", { name: "Floor 3 · Grave / coffin code", exact: true }).click();
    await expect(page).toHaveURL(/\/quests\/night-three-graves\/$/);
    await expect(page.getByRole("region", { name: "Step-by-step task checklist" })).toBeVisible();
  });
}
