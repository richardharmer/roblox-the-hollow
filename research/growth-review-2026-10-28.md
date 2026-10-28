# The Hollow growth review — October 28, 2026

## Decision

Improve the existing puzzle landing page before creating more URLs. Searchers have two distinct needs: verify a QR/Robux claim, or get unstuck inside a specific maze floor. The old `/puzzle/` page still discussed what to do before launch, while the site already had reviewed Floor 1–6 walkthroughs. Preserve its URL and QR answer, add a floor selector and reward troubleshooting, and connect it from the homepage and main navigation.

This is a provisional event-period analysis, not proof of sustained evergreen demand. All numbers below are aggregated dashboard observations; no personal visitor data or recording exports are retained.

## Sources and windows

- [GSC domain property](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Arobloxthehollow.com): Web search, all countries/devices. Selected 28-day view contained available data October 10–25, 2026; the comparison dialog actually showed October 10–25 versus September 24–October 9. Previous period had zero clicks/impressions. Do not present this as two complete 28-day periods or calculate a percentage increase from zero. Dashboard chart comparison dates also rendered incorrectly, so date inputs were checked directly.
- Meaningful short comparison: October 19–25 versus October 12–18. 1,623 vs 221 clicks; approximately 51.7k vs 6,891 impressions; CTR 3.1% vs 3.2%; average position 6.2 vs 5.3. Launch on October 22 materially changes intent and demand. Rankings are aggregate positions, not fixed SERP ranks.
- [GA4 property 558384181](https://analytics.google.com/analytics/web/#/a385293242p558384181/reports/intelligenthome): September 30–October 27, 28 days. Report indicated 100% of available data. Page/screen and event reports, not a dedicated landing-page cohort. Initial unrelated default property was excluded. Property located through the global search UI.
- [Clarity project yvw1o9u5jy](https://clarity.microsoft.com/projects/view/yvw1o9u5jy/dashboard?date=Last%2028%20days): rolling 28 days as viewed October 28; also inspected rolling 3 days. Clarity relative-window and GA4 calendar-window values must not be treated as identical cohorts. Puzzle filter was “visited URL” regex, not “landing URL”; its metrics describe sessions containing that page, not exclusively time spent on it.
- Official content rechecked October 28: [Roblox announcement](https://about.roblox.com/newsroom/2026/10/the-hollow-halloween-survival-event), [official Hub](https://www.roblox.com/games/116463962153167/The-Hollow). Neither visible source supplies a QR reward destination, secret-word solution or code-entry procedure. This does not prove that every QR image is fake or that no future code can exist. Floor summaries reuse previously reviewed recordings cited by the existing quest pages.

## Search opportunities

Available GSC window: 1,849 clicks / 58,734 impressions / 3.1% CTR / average position 6.1.

| Query | Clicks | Impressions | CTR | Average position | User's task |
|---|---:|---:|---:|---:|---|
| the hollow roblox qr code | 137 | 453 | 30.2% | 2.2 | Find QR destination / check authenticity |
| roblox the hollow qr code | 60 | 227 | 26.4% | 2.3 | Same intent; use the same URL |
| the hollow roblox qr | 58 | 225 | 25.8% | 2.7 | Same intent |
| roblox the hollow puzzle | 22 | 312 | 7.1% | 6.5 | Find the relevant puzzle and solution |
| the hollow puzzle | 12 | 256 | 4.7% | 5.3 | Disambiguate teaser versus playable floor |
| is the hollow puzzle in roblox real | 0 | 146 | 0% | 8.1 | Verify the claim before acting |
| is the roblox hollow puzzle real | 1 | 133 | 0.8% | 5.9 | Same authenticity question |
| racket rivals the hollow | 6 | 327 | 1.8% | 6.2 | Complete candy task and claim badge |
| the hollow racket rivals | 1 | 103 | 1.0% | 5.0 | Same game task |
| roblox the hollow games | 6 | 274 | 2.2% | 6.9 | Find game/task entry points |
| the hollow roblox release date | 0 | 98 | 0% | 9.3 | Learn whether event is open / when to join |
| the hollow coffin code | 0 | 27 | 0% | 8.1 | Solve this run's grave-symbol combination |
| dead rails the hollow | 0 | 48 | 0% | 9.1 | Complete the Dead Rails event quest |

These are this site's impressions, not market search volumes. Broad navigational event terms such as “the hollow roblox” (219 clicks / 6,644 impressions) support the homepage, not a new keyword page.

## Priority decisions

| Priority | Action | Target | Evidence | Why now | Success metric | Risks / prerequisite |
|---|---|---|---|---|---|---|
| P1 | Improve content/intent | `/puzzle/` | 703 clicks / 6,555 impressions; GA4 1,834 views and 11s mean engagement/user; old prelaunch text | Existing high-value entry point misses current floor task | Puzzle query clicks/CTR and floor-page views; Clarity visited-puzzle activity and quick backs | Short answers can satisfy quickly; more time alone is not success |
| P1 | Improve navigation/content | `/` and main navigation | Home 818 clicks / 32,814 impressions; 2.5% CTR; GA4 12s mean engagement/user | Long update paragraph obscured the next action | Homepage CTR at comparable positions; visits to puzzle/reward routes | Event demand and ranking shifts confound attribution |
| P2 | Improve CTR | `/quests/racket-rivals-trickster/` | 27 clicks / 1,117 impressions / 2.4% CTR / position 6.0; core query 1.8% CTR | Existing full guide can match “Hollow quest” wording explicitly | Query-specific CTR and clicks | No guarantee Google uses title; don't promise unobserved Ticket credit |
| P2 | Improve CTR / temporal relevance | `/release-date/` | 21 clicks / 3,964 impressions / 0.5% CTR / position 6.1 | Launch has passed; finale and reward cutoff are next decisions | Schedule query CTR and relevant query mix | Historical launch queries will naturally decline |
| P2 | Monitor, then investigate UX | Puzzle-page visited cohort | 102 performance pageviews; LCP 4.2s, INP 560ms; dead clicks 10.71% | Recent 3-day whole-site metrics differ; avoid sitewide changes from small sample | URL/device-specific field performance and dead-click trend | Not proof ads cause the issue; no element-level recording review completed |
| P2 | Improve existing route in next evidence pass | `/quests/night-three-graves/` | Recent 7 days: 5 clicks / 506 impressions / 1% CTR / position 6.9; GA4 183 views, 10s engagement/user | Coffin-code intent is specific and can be routed from puzzle hub now | Floor 3 query clicks and task-page engagement | A calculator would require exact date/tie rules and demonstrated user need |

## Behavior evidence

GA4: 4,992 active users, 5,562 session_start events, 9,312 pageviews, 25,895 events. Average engagement per active user 19 seconds. Puzzle: 1,414 active users, 1.30 views/user, 11 seconds average engagement/user. Rewards: 850 views / 620 active users / 16 seconds. Quests: 682 / 545 / 18 seconds. Progress: 191 / 130 / 25 seconds. These values do not establish completion or reward delivery.

GA4 observed event names: `page_view` 9,312; `session_start` 5,562; `first_visit` 4,996; `user_engagement` 3,965; `scroll` 1,674; `click` 386. Key events total was 0. No dedicated floor-link or checklist-completion event was present. Do not claim zero users completed tasks, or treat all outbound clicks as a Roblox launch. No analytics configuration was changed.

GA4 session sources: Google organic 1,917; ChatGPT / ai-assistant 1,493; Bing organic 929; direct 664; Yandex referral 235. These are the report's attributed sources, not independently verified human quality. AI-referred visitors reinforce the usefulness of direct answers and explicit source links.

Clarity 28 days: 5,759 sessions excluding 417 bots, 1.50 pages/session, 48.36% scroll depth, 24 seconds active time; 11.76% dead clicks (677 sessions), 9.64% quick backs (555), 0.24% rage clicks (14), 371 sessions with outbound clicks. 654 performance pageviews, LCP 2.3s, INP 200ms, CLS 0. JavaScript errors in 0.40% of sessions. No causal claim from these aggregates.

Clarity visited-puzzle cohort: 1,410 sessions, 1.28 pages/session, 60.03% scroll, 15 seconds active time; 10.71% dead clicks (151), 4.75% quick backs (67), 168 outbound-click sessions. ChromeMobile 43.05% and MobileSafari 20.92% of this cohort. Dashboard top-page count before the regex filter was 1,422, so the two figures must not be substituted for one another.

Clarity last 3 days, whole site: 1,225 sessions excluding 95 bots, 1.34 pages/session, 33.86% scroll, 23 seconds active time, 7.35% dead clicks and 3.27% quick backs. This overlapping shorter window is not an independent before/after experiment. Native/Social ad removals on October 26 are another confounder.

## Overlap and pages not to build yet

- QR query-page check, October 19–25, query contains `qr`: puzzle URL 377 clicks / 1,470 impressions / 25.6% CTR / position 2.2; homepage 1 click / 42 impressions / 2.4% CTR / position 6.2; three other pages had only 2–5 impressions and no clicks. There is incidental overlap but no strong evidence of harmful QR cannibalization. Keep `/puzzle/` as the main answer and do not create `/qr-code/`, `/secret-code/` and `/is-it-real/` duplicates.
- Do not publish Floor 7–9 walkthroughs without reviewed evidence. Later floor guides would be genuinely distinct pages once the requirements are verified; append them to the puzzle hub then.
- Do not create a “universal coffin code” page. The existing guide explains run-specific symbols. Consider a grave lifespan helper only after the full date/tie handling is verified; current 27-impression query is a small signal.
- Ticket-not-received troubleshooting is a reasonable future standalone candidate only if query-level demand and a stable verified recovery flow emerge. Current `/rewards/#tickets` already serves that task; no promise of a universal fix.

## Changes shipped in this revision

- Reworked `/puzzle/` into a direct answer plus six floor routes, QR authenticity questions, missing-reward checks, and historical teaser context. Moved the existing header ad after the floor answer list; kept original embed behavior.
- Added Puzzle to main navigation and a direct floor-guide CTA on the homepage. Replaced the oversized homepage update paragraph with a short task explanation.
- Updated homepage description, Racket Rivals title and schedule-page title; retained canonical paths. Homepage title remains event-focused to separate it from the puzzle hub.
- Updated genuine content modification dates and October 28 official-source review notes; did not alter older gameplay verification dates.
- Refreshed stale browser checks for current game count, DOORS wording and reported-versus-unverified reward evidence. Added mobile/desktop route checks for the revised puzzle page.

## Measurement next cycle

Review October 29–November 4 against October 22–28 once GSC data is complete; report daily values around the October 31 finale and November 2 reward cutoff instead of attributing seasonal drops to this edit. Also compare the next available 28-day window, with the archive transition explicitly separated.

1. GSC: clicks, impressions, CTR and average position for `qr`, `puzzle`, `racket rivals`, `coffin`, and finale/end-time queries; use query+page rows to check ownership. Compare within similar position/device/country mixes. Target improved qualified clicks, not just impressions.
2. GA4: `/puzzle/` and floor-route pageviews, active users, engagement per active user, `user_engagement`, `scroll`, and filtered outbound `click` destinations. These are proxies; internal navigation/completion is not directly instrumented. Separate Google, Bing and ChatGPT sources.
3. Clarity: same visited-puzzle URL filter and mobile segment; active time, pages/session, quick-back and dead-click percentages. Inspect element-level heatmaps/recordings before further UI changes. Check LCP/INP sample size and URL/device scope.
4. Indexing: revised pages retain existing URLs, canonicals and sitemap entries. GSC overview showed 39 indexed / 18 not indexed; reasons were not audited in this pass, so no blanket indexing repair is claimed.

## Validation

Full `npm run check`: validation, TypeScript, lint (existing GA inline-script warning only), 33 tests, static build and SEO validation of 82 HTML pages. Browser checks: 17 existing tests passed on the first executable run; three stale assertions were corrected and passed on retest, alongside two new mobile/desktop puzzle-route checks (22 passing checks across both runs). The missing bundled Playwright executable was resolved by selecting installed Chrome. Desktop and 390px screenshots, QR anchor navigation, menu and Floor 3 destination were also inspected. Deployment verification follows the commit and push; a successful push alone is not production verification.
