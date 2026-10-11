import { load } from "cheerio";
import { z } from "zod";
import { fetchJson } from "./http";
import type { Evidence } from "./index";
/** Only explicit participating-games sections on an official Hollow article qualify. */
export function participantLinks(html: string, url: string) {
  const u = new URL(url);
  if (u.hostname !== "about.roblox.com" || !/\/2026\//.test(u.pathname))
    return [];
  const $ = load(html);
  if (!/\bthe hollow\b/i.test($("h1").text())) return [];
  const result: { url: string; quote: string }[] = [];
  $("h2,h3").each((_, heading) => {
    const label = $(heading).text().trim();
    if (
      !/^(?:the hollow )?(?:confirmed )?participating (?:games|experiences)$/i.test(
        label,
      )
    )
      return;
    const list = $(heading).next();
    if (!list.is("ul,ol")) return;
    list.find("a[href]").each((_, a) => {
      try {
        const link = new URL($(a).attr("href")!, url);
        if (
          link.protocol === "https:" &&
          link.hostname === "www.roblox.com" &&
          /^\/games\/\d+\//.test(link.pathname)
        )
          result.push({
            url: link.href,
            quote: label + ": " + $(a).text().trim(),
          });
      } catch {}
    });
  });
  return result.slice(0, 5);
}
export async function resolveParticipant(
  link: { url: string; quote: string },
  sourceUrl: string,
  fetchedAt: string,
): Promise<Evidence> {
  const placeId = Number(new URL(link.url).pathname.split("/")[2]);
  const universe = z
    .object({ universeId: z.number().int().positive() })
    .parse(
      await fetchJson(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
      ),
    );
  const data = z
    .object({
      data: z.array(
        z.object({
          id: z.number().int().positive(),
          rootPlaceId: z.number().int().positive(),
          name: z.string(),
          description: z.string(),
        }),
      ),
    })
    .parse(
      await fetchJson(
        `https://games.roblox.com/v1/games?universeIds=${universe.universeId}`,
      ),
    );
  const game = data.data.find((g) => g.id === universe.universeId);
  if (!game) throw new Error("Participant universe not found");
  return {
    url: sourceUrl,
    publisher: "Roblox",
    authority: "OFFICIAL",
    kind: "PARTICIPANT",
    text: link.quote,
    payload: { ...game, listingQuote: link.quote },
    fetchedAt,
  };
}
