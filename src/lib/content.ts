import eventRaw from "@/data/event.json";
import gamesRaw from "@/data/games.json";
import questsRaw from "@/data/quests.json";
import rewardsRaw from "@/data/rewards.json";
import badgesRaw from "@/data/badges.json";
import sourcesRaw from "@/data/sources.json";
import updatesRaw from "@/data/updates.json";
import {
  eventSchema,
  gameSchema,
  questSchema,
  rewardSchema,
  badgeSchema,
  sourceSchema,
  updateSchema,
} from "./schema";
export const event = eventSchema.parse(eventRaw);
export const games = gameSchema.array().parse(gamesRaw);
export const quests = questSchema.array().parse(questsRaw);
export const rewards = rewardSchema.array().parse(rewardsRaw);
export const badges = badgeSchema.array().parse(badgesRaw);
export const sources = sourceSchema.array().parse(sourcesRaw);
export const updates = updateSchema
  .array()
  .parse(updatesRaw)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const collections = { games, quests, rewards, badges };
export type Collection = keyof typeof collections;
export const origin = "https://robloxthehollow.com";
export const contact = "contact@robloxthehollow.com";
export const formatDate = (d: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(d));
export const startLabel = event.startDate
  ? formatDate(event.startDate)
  : "To Be Announced";
export function eventStatus(now = new Date()) {
  if (event.endAt && now >= new Date(event.endAt)) return "ENDED";
  if (event.startAt && now >= new Date(event.startAt)) return "LIVE";
  return event.status;
}
