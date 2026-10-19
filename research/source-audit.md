# Source audit — October 11, 2026

Research date uses Asia/Shanghai. Runtime reports retain UTC timestamps. Project directory is `roblox-the-hollow` (no `.com`). Contact: contact@robloxthehollow.com.

| Source | Result | What it supports |
|---|---|---|
| [Roblox Newsroom](https://about.roblox.com/newsroom) | Browser research read; native HTTPS collector subsequently passed | Official index reachable. No relevant Hollow announcement extracted. Does not prove no announcement exists. |
| [Roblox official X](https://x.com/Roblox/status/2108226475573096953) | Direct read failed | No direct official verification. A repost is not a substitute. |
| [Roblox Wiki](https://roblox.fandom.com/wiki/The_Hollow) | Direct read failed | No claims imported from inaccessible page. |
| [Community announcement](https://www.reddit.com/r/roblox/comments/1x2k1ct/hw_roblox_event/) | Direct page and search text read | Community uses “The Hollow”, discusses teaser and mentions Piggy. REPORTED, not CONFIRMED participation. |
| [DOORS discussion](https://www.reddit.com/r/doors_roblox/comments/1x2pl51/doors_is_apart_of_the_hollow/) | Search excerpt read; direct page failed | October 22 reported; DOORS link inferred from update timing. UNCONFIRMED participation. |
| [Early discussion](https://www.reddit.com/r/roblox/comments/1wryt1a/potential_upcoming_event/) | Page read | Discovery clue only. |
| [Roblox events](https://www.roblox.com/events) | Direct read failed | No verified event entry or hub. |
| [Roblox Presents](https://www.roblox.com/communities/4111519/Roblox-Presents) | Search establishes community link; public group games API tested successfully | Official-owned experience discovery available. No matching Hollow hub extracted in test. |
| Developer announcements | No confirmed lineup yet | No invented developer allowlist; not a claim of exhaustive developer coverage. |
| YouTube/news search | Ran targeted search; no primary event video independently verified | No video copied or presented as verified walkthrough. Secondary Halloween speculation surfaced. |

## Initial publication decisions

- Name and date: REPORTED. October 22, 2026; no exact time, timezone, duration or end date.
- Piggy: community watch only. DOORS: speculation only. Neither contributes to game counts.
- Quests, reward catalog, free access, badges and hub: not verified. Empty arrays are intentional, not fake zero event totals.
- 2025 mechanics are not carried into 2026.
- Updates contain one real editorial source review, not invented news.

## October 13 monitoring follow-up — 15:00 Asia/Shanghai

- User-supplied monitoring report identifies a homepage review-date mismatch. The homepage now derives Latest Review from editorial reviews' latest verification date, with the event verification date as a fallback. Existing October 13 review yields October 13, 2026.
- Report says Pro Game Guides cites Roblox X post `2108961492187918378`; the retained source is `2108226475573096953`. Different IDs are confirmed, but their content and relationship are not. Follow-up reads of Pro Game Guides and both X URLs failed. Retain the original link and disclose the unresolved correspondence in the source note and October 13 review; do not substitute the link or promote event claims.
- Internal candidate: Spider — UNCONFIRMED. Report attributes it to a new r/roblox discussion, without an exact discussion URL or verified publication time. Obtain that source before making a public entry. No change to the public game directory.
- No new confirmed hub, participating games, quests, rewards, badges or exact event timing established by this follow-up. No deployment implied.

## October 19 monitoring follow-up — Asia/Shanghai

- Compared the supplied October 18 20:00 and October 19 09:03 monitoring reports. Directly read the Bloxy News and RTC text via https://www.sotwe.com/Bloxy_News and https://www.sotwe.com/Roblox_RTC. Both name nine games and attribute the teasers to Roblox Instagram. These are secondary reports accessed through mirrors, not directly verified official announcements or independent primary confirmations.
- Roblox Instagram (https://www.instagram.com/roblox/) returned a generic access error in this follow-up. HTTP 429 belongs to the supplied report, not this access attempt. No individual Instagram video permalink or exact publication time was obtained. Profile mirrors display relative timestamps and may change; October 17–18 is the supplied report's approximate source-date range, not a timestamp established here.
- Published a local REPORTED editorial entry dated October 19 with the nine reported names and three source records. Existing schema uses verificationLevel and lastVerifiedAt; source-date uncertainty and the reported count are explained in prose without adding unsupported schema fields. Homepage Latest Review derives October 19 from this editorial entry.
- No game IDs, participating-game records, quests, badges, rewards, hub or exact timing were added. The nine-game claim does not establish a nine-night mechanism. TikTok montage and RosenberryRooms claims from the October 18 report remain internal leads; their exact URLs were not supplied or independently recovered during this follow-up.
- No claim of production freshness or deployment verification is made by this local change. The earlier reported cache-refresh failure cannot establish that production missed an update.

## Collector evidence

`npm run monitor -- --force` initially failed because Node's address-family selection expected an address list; fixed by disabling automatic family selection with a pinned verified DNS lookup.

Retest UTC 2026-10-11T02:16:45.289Z: sourcesChecked=2, errors=[], newCandidates=0, changed=false. Sources: newsroom and `https://games.roblox.com/v2/groups/4111519/games?accessFilter=Public&limit=50&sortOrder=Desc`. No content was promoted or deployment claimed. Later tests are recorded in `automation/reports/` locally.

## Official technical references checked

- [Games API](https://create.roblox.com/docs/cloud/reference/domains/games)
- [Badges API](https://create.roblox.com/docs/cloud/reference/domains/badges)
- [Next.js static export](https://nextjs.org/docs/app/guides/static-exports)
- [GitHub workflow triggers](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow): pushes using GITHUB_TOKEN do not generally trigger other workflows; pipeline does not rely on that.
- [Cloudflare deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [Cloudflare pages.dev redirect](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)

## Brand risk

[Roblox's current community name and logo guidelines](https://en.help.roblox.com/hc/en-us/articles/115001708126-Roblox-Name-and-Logo-Community-Usage-Guidelines) restrict general logo use and commercial trademark use. An ad-supported site using “Roblox” in its domain may raise trademark/licensing issues. Fan-site disclaimers do not establish permission. This project uses an original doorway mark and SVG forest; no official logo, avatar art, Fandom image or player artwork is reused. Domain rights or commercial permission have not been verified. Obtain appropriate rights review before monetization; this audit is not a legal clearance.
