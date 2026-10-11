import { participantLinks, resolveParticipant } from "./participants";
import { load } from "cheerio";
import { z } from "zod";
import { fetchJson, fetchText } from "./http";
import config from "../config/monitor.json";
import { games } from "../../src/lib/content";
export interface Evidence {
  url: string;
  publisher: string;
  authority: "OFFICIAL" | "DEVELOPER" | "COMMUNITY";
  kind: "PAGE" | "GAME" | "BADGES" | "VIDEO" | "PARTICIPANT";
  text: string;
  payload?: unknown;
  fetchedAt: string;
}
export interface CollectionResult {
  evidence: Evidence[];
  errors: { source: string; error: string }[];
  checked: number;
}
const apiGame = z.object({
  id: z.number().int().positive(),
  rootPlaceId: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  creator: z.object({ id: z.number(), type: z.string() }),
});
export async function collect(): Promise<CollectionResult> {
  const result: CollectionResult = { evidence: [], errors: [], checked: 0 };
  const read = async (url: string, fn: () => Promise<void>) => {
    result.checked++;
    try {
      await fn();
    } catch (e) {
      result.errors.push({
        source: url,
        error: String(e).replace(/key=[^&\s]+/g, "key=REDACTED"),
      });
    }
  };
  const now = new Date().toISOString();
  for (const url of config.officialPages) {
    await read(url, async () => {
      const html = await fetchText(url);
      const $ = load(html);
      $("script,style,nav,footer,header").remove();
      result.evidence.push({
        url,
        publisher: "Roblox",
        authority: "OFFICIAL",
        kind: "PAGE",
        text:
          $("main").text().replace(/\s+/g, " ").trim().slice(0, 80000) ||
          $("body").text().replace(/\s+/g, " ").trim().slice(0, 80000),
        payload: html,
        fetchedAt: now,
      });
      const links = [
        ...new Set(
          $("a[href]")
            .map((_, a) => {
              try {
                return new URL($(a).attr("href")!, url).href;
              } catch {
                return "";
              }
            })
            .get(),
        ),
      ]
        .filter(
          (x) =>
            x.startsWith("https://about.roblox.com/newsroom/") &&
            /hollow/i.test(x),
        )
        .slice(0, 5);
      for (const article of links) {
        await read(article, async () => {
          const raw = await fetchText(article);
          for (const link of participantLinks(raw, article)) {
            await read(link.url, async () => {
              result.evidence.push(
                await resolveParticipant(link, article, now),
              );
            });
          }
          const $a = load(raw);
          $a("script,style,nav,footer,header").remove();
          result.evidence.push({
            url: article,
            publisher: "Roblox",
            authority: "OFFICIAL",
            kind: "PAGE",
            text: $a("main").text().replace(/\s+/g, " ").trim().slice(0, 80000),
            payload: raw,
            fetchedAt: now,
          });
        });
      }
    });
  }
  // Discover public experiences belonging to the official Presents group; discovery is NOT event confirmation.
  const groupUrl = `https://games.roblox.com/v2/groups/${config.presentsGroupId}/games?accessFilter=Public&limit=50&sortOrder=Desc`;
  const universeIds = new Set(games.map((g) => g.universeId));
  await read(groupUrl, async () => {
    const data = z
      .object({
        data: z.array(
          z.object({ id: z.number().int().positive(), name: z.string() }),
        ),
        nextPageCursor: z.string().nullable().optional(),
      })
      .parse(await fetchJson(groupUrl));
    for (const g of data.data)
      if (/\bthe hollow\b/i.test(g.name)) universeIds.add(g.id);
    if (data.nextPageCursor)
      result.errors.push({
        source: groupUrl,
        error:
          "Discovery covers latest 50 experiences; additional pages not scanned.",
      });
  });
  for (const universeId of universeIds) {
    const url = `https://games.roblox.com/v1/games?universeIds=${universeId}`;
    await read(url, async () => {
      const { data } = z
        .object({ data: z.array(apiGame) })
        .parse(await fetchJson(url));
      for (const g of data) {
        if (g.id !== universeId) throw new Error("Universe ID mismatch");
        const officialHub =
          g.creator.type === "Group" && g.creator.id === config.presentsGroupId;
        result.evidence.push({
          url,
          publisher: officialHub
            ? "Roblox Presents"
            : `Game creator ${g.creator.id}`,
          authority: officialHub ? "OFFICIAL" : "DEVELOPER",
          kind: "GAME",
          text: g.description,
          payload: g,
          fetchedAt: now,
        });
      }
    });
    if (!games.some((g) => g.universeId === universeId)) continue;
    const badgeUrl = `https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&sortOrder=Desc`;
    await read(badgeUrl, async () => {
      const data = z
        .object({
          data: z.array(
            z.object({
              id: z.number().int().positive(),
              name: z.string(),
              description: z.string(),
              enabled: z.boolean(),
            }),
          ),
          nextPageCursor: z.string().nullable().optional(),
        })
        .parse(await fetchJson(badgeUrl));
      result.evidence.push({
        url: badgeUrl,
        publisher: "Roblox Badges API",
        authority: "OFFICIAL",
        kind: "BADGES",
        text: JSON.stringify(data.data),
        payload: { universeId, ...data },
        fetchedAt: now,
      });
      if (data.nextPageCursor)
        result.errors.push({
          source: badgeUrl,
          error: "Badge scan capped at latest 100; older entries not scanned.",
        });
    });
  }
  for (const channel of config.youtubeChannelIds as string[]) {
    if (!/^[A-Za-z0-9_-]{10,64}$/.test(channel)) continue;
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`;
    await read(url, async () => {
      const xml = await fetchText(url);
      result.evidence.push({
        url,
        publisher: channel,
        authority: "COMMUNITY",
        kind: "VIDEO",
        text: load(xml, { xmlMode: true })("entry").text().slice(0, 40000),
        fetchedAt: now,
      });
    });
  }
  return result;
}
