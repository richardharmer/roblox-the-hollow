# The Hollow — player-content investigation, October 22, 2026 (Beijing)

## Editorial decision

“No new official announcement” is not a stop condition. Investigate player questions through public game metadata, developer posts, original video, livestreams and community demonstrations. Publish supported portions of a guide immediately; label community demonstrations with author, date, video timestamp and limits. Do not require a Newsroom announcement for an observable gameplay solution. Do not convert an unknown field into an invented ID or route.

## Checks actually completed

- Re-read the [official announcement](https://about.roblox.com/newsroom/2026/10/the-hollow-halloween-survival-event). It names creator champions but gives no daily monster order, detailed quest objectives or hub ID.
- Discovered the [official DevForum topic](https://devforum.roblox.com/t/the-hollow-new-platform-wide-survival-event-for-halloween/4948535). Web extraction hit a JavaScript check; public `/t/4948535.json` worked through direct HTTPS. Read the first 20 posts and fetched the remaining two through the topic posts endpoint. Total coverage: 22 posts. Post 17 asks about catching up on missed days, with no answer in the posts read. Other replies include player requests for items, not awarded-item evidence.
- Extracted the original [Roblox trailer](https://www.youtube.com/watch?v=4oFH5keX1gY) from the staff post. Browser page identifies verified Roblox, unlisted status, a 24-second video, no description and unavailable captions. Video frames were not fully reviewed; no gameplay steps inferred.
- Searched YouTube directly for `The Hollow Roblox KreekCraft`, after web search returned little relevant video material. Results expose theme tutorials, reactions, speculation and clips, including https://www.youtube.com/watch?v=40DpGTK1XJ8 and https://www.youtube.com/shorts/YtoRojJMuZI . These are leads, not watched or verified instructions. The actual KreekCraft channel appears as https://www.youtube.com/@KreekCraft ; distinguish it from clip channels.
- Retried `https://games.roblox.com/v2/groups/4111519/games?accessFilter=Public&limit=50&sortOrder=Desc` through direct HTTPS after sandbox DNS and web retrieval failed. Response lists 13 experiences, none named The Hollow. It unusually includes a previous cursor despite an initial request; do not claim this proves exhaustive publisher coverage or absence of the hub. Roblox Presents is a discovery lead, not established Hollow ownership.
- Investigated search result “Hollow Horseman - Torso”, ID `111182280020417`. Official `https://economy.roblox.com/v2/assets/111182280020417/details` reports creator `derekiscool180` (user 10005566922), created August 8, 2026, not for sale. This does not establish a connection to the announced item. Do not publish it as an official event reward.
- Public catalog keyword search succeeded, but returned fuzzy matches including Headless Horseman and unrelated UGC. Only the first result page was inspected; no official Hollow Horseman identifier was verified.
- Broad web searches covered event + badges, catalog, games, day 1, rewards, maze, named creators and livestreams. Unrelated older experiences and generic prelaunch advice are not gameplay evidence.

## Website change

Expanded `/quests/` with shared-hub guidance, the announced gameplay loop, named live clue-solving sources and the unanswered catch-up question. Added the DevForum source record. No synthetic quest records, reward IDs or launch-order table. Validation and TypeScript checks passed. No deployment performed.

## Next investigation queue, not completed coverage

1. Watch the original trailer and creator theme tutorial; capture exact timestamped observations, then distinguish cosmetic setup from event completion.
2. Open the named creators' actual upcoming/live streams and descriptions; follow hub links back to Roblox and verify place → universe → publisher.
3. Follow the DevForum community mention of Twin Atlas to its official channels; it is currently only a community attribution.
4. Once the hub is established, enumerate its badges and inspect descriptions, enablement and award counts; check related assets and bundles. A badge alone does not prove a catalog item is granted.
5. Search the nine developers' announcements and public community channels for direct hub links, recorded play and corrections. Do not assume original-game badges belong to this shared hub.
6. Record reproducible quest steps, starting location, prerequisites, visual landmarks, failure/reset behavior and actual completion outcome. Publish partial guides with explicitly unresolved steps where useful.
7. Track individual monster appearances by evidence and date. Announcement bullet order is not a calendar.

This was an expanded investigation, not an exhaustion of every available source. No live gameplay was performed; private Discord, full creator streams, all catalog pages and every original-game badge list were not reviewed.

## Follow-up investigation and implementation (same day)

The queue above records the earlier pass. This follow-up completed these additional checks:

- **Official trailer:** sampled frames throughout the original 24-second video (roughly 0, 2, 4, 7, 9, 11, 14, 16, 19 and 21 seconds). Side Eye Café, an underground corridor and a red-lit facade are timestamped on `/quests/`. No continuous maze path, completion screen or objective UI was observed in these samples.
- **Full official poster:** WaffleTrades' full transcript and the frame at 6:15 led to https://x.com/Roblox/status/2112997455042125939. Opened the original verified-account post and the full-size image, read all three categories. DOM timestamp: `2026-10-21T20:00:25.000Z`. The main nine are only Nightly Haunts; the poster additionally names nine roaming entries and an Outskirts side-quest lineup. Transcribed creator pairings, monster names and all Outskirts labels. No dated daily order is printed. The poster separates names with vertical bars; these are retained as printed labels, not treated as independently identity-verified Roblox experience records.
- **Hunted developer:** original verified franchise post https://x.com/DarkDeceptionDD/status/2112957420624609606 and its promotional image read. Explicit Hollow quest → special badge confirmation. The image gives no additional objective. The author's reply links its confirmation to the Roblox poster.
- **Hunted APIs:** place-to-universe endpoint, game metadata and full public badge list read. Place `136431686349723`, universe `7229780065`, publisher group `35512405`, Glowstick Entertainment x Exclusible. Game title HUNTED [HALLOWEEN EVENT]. Exactly 29 badges returned with null next cursor, no explicit Hollow name/description. Ordinary chapter and PvP badges excluded; ordinary soul-shard instructions not repackaged as an event objective.
- **Original theme demonstration:** KreekCraft https://www.youtube.com/watch?v=YtoRojJMuZI, full 15-second transcript and visual samples. Settings → theme selector → The Hollow; reported Plus early rollout. Published as REPORTED on `/rewards/`, with no invented platform submenu or claim that non-Plus access was tested.
- **Creator walkthrough claim checked:** NoobBlox https://www.youtube.com/watch?v=a7qfC7OEGY4, full 3:35 transcript. Mostly predictions and prior-event assumptions; at 2:55 admits no leaked items except an asserted bundle. No demonstrated completion or claim, so not promoted to a usable quest guide.
- **Livestream channels:** latest rendered live lists on verified KreekCraft and LimaMosca checked. No Hollow walkthrough found in those lists. Bundun search identified original @Bundun and a recent general Roblox/EToH Halloween stream; not watched or counted as a Hollow walkthrough. No exhaustive channel-history claim.
- **Actual livestream replay:** SirDapper original Twitch profile links https://www.twitch.tv/videos/2907048930, title THE HOLLOW PREP, length 2:39:53. Opened replay and sampled around 0:04 (starting screen), 0:30 (other UGC gameplay), 1:30 (game death/respawn screen). No verified Hollow route inferred. Full replay was not watched.
- **Nine original game developers:** queried all nine game metadata records through official Roblox API; descriptions did not provide Hollow quest steps. Twin Atlas original X profile read; latest rendered original posts did not supply a Hollow announcement. This does not establish the hub publisher.
- **X search deepening:** searched event + quest/badge/maze/launcher, followed the Dark Deception original and a community badge-image lead. Community image showed a generic `???` badge for +1 Speed Keyboard Escape / Candy & Chocolate, no visible badge ID or objective. It is not sufficient evidence for a universal two-badge rule.

### Implemented player content

- `/games/`: complete official category lists and nightly monster/creator table, separate from the existing nine identity-verified original-game profiles.
- `/quests/`: Hunted entry and partial guide, Outskirts list, timestamped trailer landmarks and precise creator-coverage limits.
- `/rewards/`: creator-demonstrated app-theme steps, eligibility caveats, link to Hunted badge briefing.
- `/badges/`: Hunted announcement, correct game identity and badge-list check result.
- `/updates/`: dedicated sourced expansion article; `/sources/`: nine additional source records.
- Homepage copy and directory empty states updated so confirmed announcements are not obscured by incomplete structured catalogs.

No private Discord access, account gameplay, complete replay viewing, or exhaustive catalog enumeration is claimed. Partial evidence is published immediately; unknown routes and IDs remain explicitly unknown.

### Validation

`npm run check` passed: content/schema validation, TypeScript, lint (existing GTM warning only), 33 tests, static build and SEO audit. All 14 existing browser tests passed using the installed Chromium 1243 executable and the actual local preview port. Initial browser launch failed because Playwright expected an uncached version; no tests ran on that first attempt. Desktop lineup and mobile reward screenshots reviewed; no horizontal overflow at tested widths.
