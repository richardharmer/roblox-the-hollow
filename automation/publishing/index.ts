import fs from "node:fs/promises";
import path from "node:path";
import { eventSchema, sourceSchema } from "../../src/lib/schema";
import type { Decision } from "../verification";
import { hash } from "../extractors";
export async function publish(decisions: Decision[], root = process.cwd()) {
  const eventPath = path.join(root, "src/data/event.json");
  const sourcesPath = path.join(root, "src/data/sources.json");
  const event = eventSchema.parse(
    JSON.parse(await fs.readFile(eventPath, "utf8")),
  );
  const sources = sourceSchema
    .array()
    .parse(JSON.parse(await fs.readFile(sourcesPath, "utf8")));
  let changed = false;
  const published: string[] = [];
  const dates = decisions.filter(
    (d) => d.status === "PUBLISH" && d.candidate.kind === "EVENT_DATE",
  );
  const conflict =
    new Set(dates.map((d) => JSON.stringify(d.candidate.value))).size > 1;
  for (const d of decisions) {
    if (
      d.status !== "PUBLISH" ||
      (d.candidate.kind === "EVENT_DATE" && conflict)
    )
      continue;
    const c = d.candidate;
    const before = JSON.stringify(event);
    const today = c.fetchedAt.slice(0, 10);
    if (c.kind === "EVENT_DATE") {
      const v = c.value as { startDate: string; endDate: string | null };
      const sameDate = event.startDate === v.startDate.slice(0, 10);
      event.startDate = v.startDate.slice(0, 10);
      event.startAt = v.startDate.includes("T")
        ? v.startDate
        : sameDate
          ? event.startAt
          : null;
      if (v.endDate?.includes("T")) event.endAt = v.endDate;
      event.dateVerification = "CONFIRMED";
      event.verificationLevel = "CONFIRMED";
    } else if (c.kind === "HUB") {
      const v = c.value as { placeId: number };
      event.hubUrl = `https://www.roblox.com/games/${v.placeId}/`;
      event.verificationLevel = "CONFIRMED";
    }
    if (before === JSON.stringify(event)) continue;
    const sourceId = "official-" + hash(c.sourceUrl).slice(0, 12);
    if (!sources.some((s) => s.id === sourceId))
      sources.push({
        id: sourceId,
        name: c.publisher + " official evidence",
        url: c.sourceUrl,
        level: "OFFICIAL",
        access: "READ",
        note: d.reason,
        lastCheckedAt: today,
        lastSuccessAt: today,
      });
    if (!event.sources.includes(sourceId)) event.sources.push(sourceId);
    event.updatedAt = today;
    event.lastVerifiedAt = today;
    changed = true;
    published.push(c.candidateId);
  }
  // Lifecycle transitions require official timestamps; a date-only report never starts or ends the event.
  const now = new Date();
  const next =
    event.endAt && now >= new Date(event.endAt)
      ? "ENDED"
      : event.startAt && now >= new Date(event.startAt)
        ? "LIVE"
        : event.startAt
          ? "UPCOMING"
          : event.status;
  if (next !== event.status) {
    event.status = next;
    event.updatedAt = now.toISOString().slice(0, 10);
    changed = true;
  }
  eventSchema.parse(event);
  sourceSchema.array().parse(sources);
  if (changed) {
    await fs.writeFile(eventPath, JSON.stringify(event, null, 2) + "\n");
    await fs.writeFile(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
  }
  return { changed, published, conflicts: conflict ? dates.length : 0 };
}
