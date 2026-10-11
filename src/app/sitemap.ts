import type { MetadataRoute } from "next";
import { collections, updates, event, origin, sources } from "@/lib/content";
export const dynamic = "force-static";
const newest = (dates: string[]) => dates.sort().at(-1) || event.updatedAt;
export default function sitemap(): MetadataRoute.Sitemap {
  const staticDates: Record<string, string> = {
    "": newest([
      event.updatedAt,
      ...Object.values(collections).flatMap((items) =>
        items.map((x) => x.updatedAt),
      ),
      ...updates.map((x) => x.updatedAt),
    ]),
    games: newest(collections.games.map((x) => x.updatedAt)),
    quests: newest(collections.quests.map((x) => x.updatedAt)),
    rewards: newest(collections.rewards.map((x) => x.updatedAt)),
    badges: newest(collections.badges.map((x) => x.updatedAt)),
    updates: newest(updates.map((x) => x.updatedAt)),
    "release-date": event.updatedAt,
    about: "2026-10-11",
    sources: newest(sources.map((s) => s.lastCheckedAt)),
    privacy: "2026-10-11",
  };
  return [
    ...Object.entries(staticDates).map(([p, date]) => ({
      url: origin + "/" + (p ? p + "/" : ""),
      lastModified: date,
    })),
    ...Object.entries({ ...collections, updates }).flatMap(([kind, items]) =>
      items
        .filter((e) => e.publishDetail)
        .map((e) => ({
          url: `${origin}/${kind}/${e.slug}/`,
          lastModified: e.updatedAt,
        })),
    ),
  ];
}
