# The Hollow — unofficial event companion

English static Next.js site for `https://robloxthehollow.com`. Local project: `/Users/richardm/Documents/GitHub/roblox-the-hollow`. Contact: `contact@robloxthehollow.com`.

## Run locally

Node 22 LTS or newer:

```sh
npm ci
npm run check
npm run start
```

Open http://localhost:3000. `npm run dev` starts the development server. `npm run build` exports to `out/`; no database or server runtime is used. Versions are locked in package-lock.json.

## Content and routes

`src/data/` is the canonical source of event, games, quests, rewards, badges, sources, watch and updates. `src/lib/schema.ts` and `scripts/validate.ts` reject unsafe text, broken relationships, unverified detail pages and ID mismatches. Unknown values are null, not guessed. Empty entity arrays are intentional until evidence arrives.

`scripts/prepare.ts` generates physical static detail routes from validated entries with `publishDetail: true`. This avoids dummy fallback slugs when a collection is empty. Generated source is ignored and rebuilt each time. Templates live in `src/components/detail.tsx`; navigation, sitemap and related entities are data-driven. A detail requires enough real evidence to answer its distinct intent. Do not set `publishDetail` merely to increase page count.

Stable IDs are independent of slugs and titles. Changing an existing slug requires a real 301 mapping in `public/_redirects`. Do not delete historical URLs at event end. Dates in sitemap change only with content, not monitor timestamps.

## Progress

`hollow-progress` localStorage, schema v2. V1 quest/reward arrays migrate on read. Import validates event ID, size and identifier format, then merges. Unknown IDs are retained for forward/backward compatibility but excluded from published totals. Storage failure displays a warning; malformed saved content is not overwritten automatically. No Roblox account access.

## Assets and design

Original doorway mark: `public/icon.svg`; original forest: `public/forest.svg`. Build generates 16/32px favicons, 180px touch icon and 1200×630 OG PNG. No official or player artwork is included. Dark charcoal, crimson and muted orange; serif display headline, compact sans-serif UI. UI/SEO design skill's generic purple/3D recommendation was rejected in favor of the explicit project brief.

## Monitoring

```sh
npm run monitor -- --force
```

Run reports are ignored under `automation/reports/`; state/candidates under `.automation/`. No raw drafts are exported to `out/`. Sources use HTTPS, exact host allowlists, public DNS pinning, no redirect following, 15s timeout, bounded payloads and retry/backoff. Platforms fail independently. Official newsroom and Roblox Presents games discovery have passed live reads.

Supported auto-publication:

- Exact The Hollow Event JSON-LD dates from Roblox Newsroom.
- An exact-name event experience owned by Roblox Presents, with separate place/universe IDs.
- Explicit participating-games lists immediately following a matching heading on a 2026 official Hollow article, with Roblox APIs resolving entity IDs. No automatic thin detail.
- Official badge descriptions explicitly naming The Hollow inside an already-confirmed game. No inferred reward, cost or claim status.

Official 2026 Newsroom quest/reward walkthroughs also have an optional AI pipeline: extraction with literal evidence spans, confirmed-game association, original step order, a second independent semantic audit, and Zod validation before publishing. Cost remains unknown without explicit wording; catalog IDs and availability are never inferred. AI errors fail closed. This path is implemented but has NOT been tested with a live AI provider or actual official Hollow walkthrough because neither is available in this session.

Other formats, conflicting dates, untrusted instructions and rumors remain HOLD. **This release does not autonomously turn arbitrary community videos/posts into complete walkthroughs.** A source-format change may need a tested adapter; no system can guarantee coverage of unpublished or inaccessible data. Existing guide revisions are held instead of silently rewriting saved instructions; stable IDs derive from original source evidence, not display names.

YouTube RSS accepts explicitly configured channel IDs. No channels have been preapproved. X and Reddit automated access is not configured; initial community research was performed with the search tool. `YOUTUBE_API_KEY` is reserved and not currently consumed by a YouTube Data API adapter. Do not describe it as connected.

## Checks and deployment

See [DEPLOYMENT.md](DEPLOYMENT.md), [research/test-report.md](research/test-report.md), and [research/seo-audit.md](research/seo-audit.md). Cloudflare/GitHub live authorization is not available in this workspace. Local simulation tests do not prove production deployment.

Adsterra banners are enabled by default: responsive 728×90/320×50 upper-page slots and 300×250 content/sidebar slots. Keys are the public publisher embed identifiers for this site. `NEXT_PUBLIC_ADS_ENABLED=false` is the build-time kill switch. Official snippets are preserved verbatim in `src/lib/ad-codes.ts` and inserted directly into the page (no custom iframe, sandbox, parameter rewrite, or delayed visibility trigger). Long walkthroughs and game profiles have a second content placement. Social Bar is trialled on `/` and `/puzzle/`; leaving either page uses a full document navigation to discard the provider runtime. No automatic refresh or popunders. Privacy disclosures describe the provider. Browser regression tests intercept ad requests to avoid generating impressions. Brand/domain use is not legally cleared; see source audit.
