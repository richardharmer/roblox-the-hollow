# Game page player-value audit — October 26, 2026 Beijing

Baseline production/remote: 3159f7342d0e29e955488dbaa4499274c60cdd3b, clean worktree.

All nine game pages used one GameProfile template. It displayed generic overview copy before an unconditional statement that event-specific instructions were unverified. This was false for already published DOORS, Dandy's World and Demonology quests. The game data participation status was being confused with claim-instruction status.

Replaced the unconditional text with explicitly associated, sourced quest content. Each relevant game page now includes the full existing steps, reward requirements/cost label, tips and troubleshooting, directly on the page. Four pages covered:
- DOORS: Candy Vault + Floor 1 Hub maze.
- Dandy's World: 200 pumpkins + Floor 2 Hub puzzle.
- Demonology: six relics + Floor 3 Hub puzzle.
- 99 Nights: Floor 4 Hub path puzzle only. The original-game flower quest is a separate research item; no false implication that the Hub path earns Chrome Deer Skull Chain.

Original-game location and Hub location are explicitly distinguished by task ID, not overloaded gameId fields. Existing recorded steps retain REPORTED status, attributed dates and sources. No new account playtest is claimed.

Five remaining profiles (Warden, Animal Hospital, The Mimic, Scary Shawarma Kiosk, Piggy) have no associated full verified quest yet. They now show a concise pending checklist (entry, objective, reward/cost, final claim), with original-game background secondary. This is an acknowledged research gap, not nine complete guides.

Official events API directly read:
https://apis.roblox.com/virtual-events/v1/universes/10770728771/virtual-events?limit=50&sortOrder=Asc

10 records, empty next cursor. Event 9185919240002208323 has title/subtitle/description ?????????, host verified Roblox Presents group 4111519, universe 10770728771, place 116463962153167. Active/public, start 2026-10-31T17:30:07.952+00:00, end 18:00:07.952. Created October 23 UTC, not October 26. Display unnamed and do not identify as finale or infer rewards.

Additional original research read this session: complete native transcript of SharkBlox D3m2Ru2reUQ (3:45). It corroborates fire level 3, void entry, 20 flowers and hub return. Video image at late seek was black in this browser session, so no new visual purchase/claim assertion is published from it. Earlier Waffle 5jRcBVF3hrE full transcript and key gameplay frames remain useful. Revisit original footage for the exact final hub interaction before publishing the remaining reward guide.
