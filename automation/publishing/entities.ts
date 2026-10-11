import fs from "node:fs/promises";
import path from "node:path";
import { gameSchema, badgeSchema, sourceSchema } from "../../src/lib/schema";
import type { Decision } from "../verification";
import { hash } from "../extractors";
import config from "../config/monitor.json";
export async function publishEntities(
  decisions: Decision[],
  root = process.cwd(),
) {
  const read = async (name: string) =>
    JSON.parse(
      await fs.readFile(path.join(root, `src/data/${name}.json`), "utf8"),
    );
  const games = gameSchema.array().parse(await read("games"));
  const badges = badgeSchema.array().parse(await read("badges"));
  const sources = sourceSchema.array().parse(await read("sources"));
  const published: string[] = [];
  const changedFiles = new Set<string>();
  for (const d of decisions
    .filter(
      (d) =>
        d.status === "PUBLISH" &&
        ["PARTICIPANT", "EVENT_BADGE"].includes(d.candidate.kind),
    )
    .slice(0, config.maxNewPages)) {
    const c = d.candidate;
    const sourceId = "official-" + hash(c.sourceUrl).slice(0, 12);
    const day = c.fetchedAt.slice(0, 10);
    const base = {
      verificationLevel: "CONFIRMED" as const,
      sources: [sourceId],
      firstSeenAt: day,
      lastVerifiedAt: day,
      updatedAt: day,
      publishDetail: false,
      image: null,
    };
    let changed = false;
    if (c.kind === "PARTICIPANT") {
      const v = c.value as { id: number; rootPlaceId: number; name: string };
      const old = games.find((g) => g.universeId === v.id);
      if (!old) {
        games.push(
          gameSchema.parse({
            ...base,
            id: `game-${v.id}`,
            slug: `${
              v.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .slice(0, 60) || "game"
            }-${v.id}`,
            name: v.name,
            description:
              "Listed as a participating experience in Roblox’s official The Hollow announcement. Task details will be added when verified.",
            robloxUrl: `https://www.roblox.com/games/${v.rootPlaceId}/`,
            universeId: v.id,
            placeId: v.rootPlaceId,
            participationStatus: "CONFIRMED",
            walkthrough: [],
            troubleshooting: [],
          }),
        );
        changedFiles.add("games");
        changed = true;
      }
    } else {
      const v = c.value as {
        id: number;
        universeId: number;
        name: string;
        description: string;
      };
      const game = games.find((g) => g.universeId === v.universeId);
      if (!game) continue;
      const old = badges.find((b) => b.badgeId === v.id);
      if (!old) {
        badges.push(
          badgeSchema.parse({
            ...base,
            id: `badge-${v.id}`,
            slug: `badge-${v.id}`,
            name: v.name,
            description:
              "The official badge description explicitly references The Hollow. Consult the official page for its current wording.",
            gameId: game.id,
            badgeId: v.id,
            robloxUrl: `https://www.roblox.com/badges/${v.id}/`,
            requirements: [],
          }),
        );
        changedFiles.add("badges");
        changed = true;
      }
    }
    if (changed) {
      if (!sources.some((s) => s.id === sourceId))
        sources.push(
          sourceSchema.parse({
            id: sourceId,
            name: c.publisher + " official evidence",
            url: c.sourceUrl,
            level: "OFFICIAL",
            access: "READ",
            note: d.reason,
            lastCheckedAt: day,
            lastSuccessAt: day,
          }),
        );
      changedFiles.add("sources");
      published.push(c.candidateId);
    }
  }
  const data = { games, badges, sources };
  for (const name of changedFiles)
    await fs.writeFile(
      path.join(root, `src/data/${name}.json`),
      JSON.stringify(data[name as keyof typeof data], null, 2) + "\n",
    );
  return { changed: changedFiles.size > 0, published };
}
