import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProgress, percentage, emptyProgress } from "../src/lib/tracker";
test("unknown total is not shown as zero completion", () =>
  assert.equal(percentage([], []), null));
test("stable IDs survive name changes and exclude stale items from total", () =>
  assert.equal(
    percentage(["quest:q1", "quest:old"], ["quest:q1", "quest:q2"]),
    50,
  ));
test("v1 migrates quests and rewards without losing IDs", () =>
  assert.deepEqual(
    parseProgress({
      version: 1,
      eventId: "the-hollow-2026",
      completedQuestIds: ["q1"],
      claimedRewardIds: ["r1"],
    }).completed,
    ["quest:q1", "reward:r1"],
  ));
test("malformed and other-event backups rejected", () => {
  assert.throws(() => parseProgress({ ...emptyProgress(), eventId: "other" }));
  assert.throws(() =>
    parseProgress({ ...emptyProgress(), completed: ["<script>"] }),
  );
  assert.throws(() => parseProgress({ version: 99 }));
});
test("duplicates normalize to unique completion marks", () =>
  assert.equal(
    parseProgress({ ...emptyProgress(), completed: ["quest:q1", "quest:q1"] })
      .completed.length,
    1,
  ));
