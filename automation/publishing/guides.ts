import fs from "node:fs/promises";
import path from "node:path";
import {
  questSchema,
  rewardSchema,
  sourceSchema,
  gameSchema,
} from "../../src/lib/schema";
import { groundedGuide, type GuideProposal } from "../verification/guides";
import type { Evidence } from "../collectors";
import { hash } from "../extractors";
import config from "../config/monitor.json";
export async function publishGuides(
  items: { proposal: GuideProposal; evidence: Evidence }[],
  root = process.cwd(),
) {
  const read = async (name: string) =>
    JSON.parse(
      await fs.readFile(path.join(root, `src/data/${name}.json`), "utf8"),
    );
  const games = gameSchema.array().parse(await read("games"));
  const quests = questSchema.array().parse(await read("quests"));
  const rewards = rewardSchema.array().parse(await read("rewards"));
  const sources = sourceSchema.array().parse(await read("sources"));
  const published: string[] = [];
  let changed = false;
  for (const { proposal: p, evidence: e } of items.slice(
    0,
    config.maxNewPages,
  )) {
    if (!groundedGuide(p, e, games)) continue;
    const day = e.fetchedAt.slice(0, 10);
    const id = `${p.kind}-${hash(p.gameId + ":" + e.url + ":" + p.steps[0].quote).slice(0, 16)}`;
    const list = p.kind === "quest" ? quests : rewards;
    // Replays do not rewrite wording or lose stable IDs. Changed instructions remain held for explicit reconciliation.
    if (
      list.some(
        (x) => x.id === id || (x.gameId === p.gameId && x.name === p.name),
      )
    )
      continue;
    const sourceId = "official-" + hash(e.url).slice(0, 12);
    const base = {
      id,
      slug: id,
      name: p.name,
      description: p.overview.text,
      verificationLevel: "CONFIRMED",
      sources: [sourceId],
      firstSeenAt: day,
      lastVerifiedAt: day,
      updatedAt: day,
      publishDetail: true,
      image: null,
      gameId: p.gameId,
      steps: p.steps.map((s) => s.text),
    };
    if (p.kind === "quest")
      quests.push(
        questSchema.parse({
          ...base,
          prerequisites: p.requirements.map((x) => x.text),
          tips: [],
          troubleshooting: [],
          estimatedMinutes: null,
        }),
      );
    else {
      if (!p.requirements.length) continue;
      rewards.push(
        rewardSchema.parse({
          ...base,
          catalogItemId: null,
          type: "Event reward",
          free: p.free,
          availability: "UNKNOWN",
          requirements: p.requirements.map((x) => x.text),
          questIds: [],
        }),
      );
    }
    if (!sources.some((s) => s.id === sourceId))
      sources.push(
        sourceSchema.parse({
          id: sourceId,
          name: "Roblox official walkthrough evidence",
          url: e.url,
          level: "OFFICIAL",
          access: "READ",
          note: "Primary source; exact-span grounding and a separate semantic audit passed. Availability and catalog ID are not inferred.",
          lastCheckedAt: day,
          lastSuccessAt: day,
        }),
      );
    changed = true;
    published.push(id);
  }
  if (changed) {
    for (const [name, data] of Object.entries({ quests, rewards, sources }))
      await fs.writeFile(
        path.join(root, `src/data/${name}.json`),
        JSON.stringify(data, null, 2) + "\n",
      );
  }
  return { changed, published };
}
