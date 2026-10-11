import { createHash } from "node:crypto";
import { load } from "cheerio";
import type { Evidence } from "../collectors";
export interface Candidate {
  candidateId: string;
  sourceUrl: string;
  publisher: string;
  authority: Evidence["authority"];
  sourceType: Evidence["kind"];
  sourcePublishedAt: string | null;
  firstSeenAt: string;
  fetchedAt: string;
  rawTextHash: string;
  normalizedContent: string;
  kind:
    | "EVENT_DATE"
    | "HUB"
    | "GAME_METADATA"
    | "PARTICIPANT"
    | "EVENT_BADGE"
    | "LEAD";
  value: unknown;
  verificationStatus: "PENDING" | "PUBLISH" | "HOLD" | "REJECT";
}
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export function canonicalUrl(url: string) {
  const u = new URL(url);
  u.hash = "";
  for (const k of [...u.searchParams.keys()])
    if (k.startsWith("utm_") || ["ref", "fbclid"].includes(k))
      u.searchParams.delete(k);
  u.searchParams.sort();
  return u.href;
}
export function extract(e: Evidence): Candidate[] {
  const results: Candidate[] = [];
  const add = (
    kind: Candidate["kind"],
    value: unknown,
    text: string,
    published: string | null = null,
  ) => {
    const normalizedContent = text.replace(/\s+/g, " ").trim();
    results.push({
      candidateId: hash(kind + JSON.stringify(value)),
      sourceUrl: canonicalUrl(e.url),
      publisher: e.publisher,
      authority: e.authority,
      sourceType: e.kind,
      sourcePublishedAt: published,
      firstSeenAt: e.fetchedAt,
      fetchedAt: e.fetchedAt,
      rawTextHash: hash(normalizedContent),
      normalizedContent,
      kind,
      value,
      verificationStatus: "PENDING",
    });
  };
  if (e.kind === "PAGE" && typeof e.payload === "string") {
    const $ = load(e.payload);
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const raw = JSON.parse($(el).text());
        const nodes = Array.isArray(raw)
          ? raw
          : Array.isArray(raw["@graph"])
            ? raw["@graph"]
            : [raw];
        for (const n of nodes) {
          if (
            n["@type"] === "Event" &&
            /^the hollow(?: 2026)?$/i.test(n.name?.trim())
          )
            add(
              "EVENT_DATE",
              {
                name: n.name,
                startDate: n.startDate,
                endDate: n.endDate ?? null,
              },
              JSON.stringify(n),
            );
        }
      } catch {}
    });
  }
  if (e.kind === "PARTICIPANT") add("PARTICIPANT", e.payload, e.text);
  if (e.kind === "BADGES" && e.payload) {
    const payload = e.payload as {
      universeId: number;
      data: {
        id: number;
        name: string;
        description: string;
        enabled: boolean;
      }[];
    };
    for (const b of payload.data)
      if (/\bthe hollow\b/i.test(b.description))
        add(
          "EVENT_BADGE",
          { ...b, universeId: payload.universeId },
          b.description,
        );
  }
  if (e.kind === "GAME" && e.payload) {
    const g = e.payload as {
      id: number;
      rootPlaceId: number;
      name: string;
      description: string;
      creator: { id: number; type: string };
    };
    if (
      /^the hollow(?:\s*\[.*\])?$/i.test(g.name.trim()) &&
      e.publisher === "Roblox Presents"
    )
      add(
        "HUB",
        {
          universeId: g.id,
          placeId: g.rootPlaceId,
          name: g.name,
          creator: g.creator,
        },
        g.description,
      );
    else add("GAME_METADATA", g, g.description);
  }
  if (!results.length && /\bthe hollow\b/i.test(e.text))
    add("LEAD", null, e.text.slice(0, 12000));
  return results;
}
