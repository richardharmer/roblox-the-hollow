import fs from "node:fs/promises";
import {
  eventSchema,
  sourceSchema,
  gameSchema,
  questSchema,
  rewardSchema,
  badgeSchema,
  updateSchema,
  teaserSchema,
  gameProfileSchema,
} from "../src/lib/schema";
export async function validate(root = process.cwd()) {
  const read = async (name: string) =>
    JSON.parse(await fs.readFile(`${root}/src/data/${name}.json`, "utf8"));
  const event = eventSchema.parse(await read("event"));
  const sources = sourceSchema.array().parse(await read("sources"));
  const games = gameSchema.array().parse(await read("games"));
  const quests = questSchema.array().parse(await read("quests"));
  const rewards = rewardSchema.array().parse(await read("rewards"));
  const badges = badgeSchema.array().parse(await read("badges"));
  const updates = updateSchema.array().parse(await read("updates"));
  const teasers = teaserSchema.array().parse(await read("teasers"));
  const profiles = gameProfileSchema.array().parse(await read("game-profiles"));
  if (new Set(profiles.map((p) => p.id)).size !== profiles.length)
    throw new Error("Duplicate game profile IDs");
  for (const profile of profiles) {
    if (!teasers.some((t) => t.id === profile.id))
      throw new Error("Game profile lacks an event evidence record");
    const source = sources.find((s) => s.id === profile.sourceId);
    if (
      !source ||
      source.level !== "DEVELOPER" ||
      source.access !== "READ" ||
      source.url !== profile.robloxUrl
    )
      throw new Error("Game profile lacks a verified experience source");
    const u = new URL(profile.robloxUrl);
    if (
      u.hostname !== "www.roblox.com" ||
      !u.pathname.startsWith(`/games/${profile.placeId}/`)
    )
      throw new Error("Game profile place ID / URL mismatch");
    const imageHost = new URL(profile.image.sourceUrl).hostname;
    if (!imageHost.endsWith(".rbxcdn.com") && imageHost !== "rbxcdn.com")
      throw new Error("Game cover must come from the Roblox CDN");
    await fs.access(`${root}/public${profile.image.src}`);
  }
  if (new Set(teasers.map((t) => t.id)).size !== teasers.length)
    throw new Error("Duplicate teaser IDs");
  for (const teaser of teasers) {
    if (!profiles.some((p) => p.id === teaser.id))
      throw new Error("Teaser card lacks its internal game profile");
    const official = sources.find((s) => s.id === teaser.officialSourceId);
    if (
      !official ||
      official.level !== "OFFICIAL" ||
      official.access !== "READ"
    )
      throw new Error("Teaser lacks a directly read official source");
    for (const sourceId of teaser.reportSourceIds)
      if (!sources.some((s) => s.id === sourceId))
        throw new Error(`Unknown teaser report source ${sourceId}`);
    if (teaser.checkedAt < teaser.sourceDate)
      throw new Error("Invalid teaser chronology");
    await fs.access(`${root}/public${teaser.image.src}`);
  }
  const sourceIds = new Set(sources.map((s) => s.id));
  if (sourceIds.size !== sources.length)
    throw new Error("Duplicate source IDs");
  for (const items of [games, quests, rewards, badges, updates]) {
    if (
      new Set(items.map((x) => x.id)).size !== items.length ||
      new Set(items.map((x) => x.slug)).size !== items.length
    )
      throw new Error("Duplicate ID or slug");
    for (const x of items) {
      for (const id of x.sources)
        if (!sourceIds.has(id)) throw new Error(`Unknown source ${id}`);
      if (
        x.verificationLevel === "CONFIRMED" &&
        !x.sources.some((id) =>
          sources.some(
            (s) =>
              s.id === id && s.level !== "COMMUNITY" && s.access === "READ",
          ),
        )
      )
        throw new Error("Confirmed claim lacks primary evidence");
      if (x.verificationLevel === "UNCONFIRMED" && x.publishDetail)
        throw new Error("Unconfirmed detail pages are prohibited");
      if ("firstSeenAt" in x && x.lastVerifiedAt < x.firstSeenAt)
        throw new Error("Invalid verification chronology");
    }
  }
  for (const g of games) {
    if (
      g.participationStatus !== "CONFIRMED" ||
      g.verificationLevel !== "CONFIRMED"
    )
      throw new Error("Unconfirmed games belong in watch.json");
    if (
      !new URL(g.robloxUrl).pathname.startsWith(`/games/${g.placeId}/`) ||
      new URL(g.robloxUrl).hostname !== "www.roblox.com"
    )
      throw new Error("Place ID / URL mismatch");
    if (
      g.publishDetail &&
      g.walkthrough.length === 0 &&
      !quests.some((q) => q.gameId === g.id)
    )
      throw new Error("Thin game detail page");
  }
  for (const item of [...quests, ...rewards, ...badges])
    if (!games.some((g) => g.id === item.gameId))
      throw new Error(`Unknown game ${item.gameId}`);
  for (const r of rewards)
    for (const q of r.questIds)
      if (!quests.some((x) => x.id === q && x.gameId === r.gameId))
        throw new Error("Reward quest link mismatch");
  for (const b of badges)
    if (
      new URL(b.robloxUrl).hostname !== "www.roblox.com" ||
      !new URL(b.robloxUrl).pathname.startsWith(`/badges/${b.badgeId}/`)
    )
      throw new Error("Badge ID / URL mismatch");
  for (const id of event.sources)
    if (!sourceIds.has(id)) throw new Error("Unknown event source");
  if (event.startAt && event.startAt.slice(0, 10) !== event.startDate)
    throw new Error("Start date mismatch");
  if (event.endAt && event.startAt && event.endAt < event.startAt)
    throw new Error("End precedes start");
  return {
    games: games.length,
    quests: quests.length,
    rewards: rewards.length,
    badges: badges.length,
    updates: updates.length,
  };
}
if (process.argv[1]?.endsWith("validate.ts"))
  console.log("Data and content validation PASS", await validate());
