# Actual test results

October 11, 2026. No live production success is implied.

## PASS

- `npm run check` — data validation, TypeScript, ESLint, unit tests, Next.js static production build, HTML/SEO audit passed together. Final full run includes 25 unit tests.
- `npm test` — final 25 tests pass. Includes idempotence, community HOLD, badge/reward separation, AI unavailable/transport failure HOLD, source injection/SSRF rejection, conflicting dates, date precision preservation, official participant publication and source/ID validation, schedule phases, deploy hook deduplication, deployment retry simulation, tracker migration/import validation and real-data totals.
- `npm run typecheck` and `npm run lint` — final rerun after regression change.
- `npm run build` — Next.js 16.4.0 static export to `out/`; no SSR functions required.
- `npm run seo` — 12 content/tool HTML pages checked. Internal Next 404 pages excluded from ordinary metadata assertions. Public unknown URLs tested separately.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE='<installed Chromium executable>' npm run test:browser` — 6 browser tests: four viewport flows plus progress import/export/reload/reset and static HTML/404. Actual host binary: `/Users/richardm/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`.
- `npm run monitor -- --force` — two real official sources read, no errors, no candidates, no changes. Final live retest UTC 2026-10-11T02:30:10.655Z.
- `npm audit --omit=dev --json` — zero production dependency advisories.
- `git diff --check` — no whitespace errors in tracked differences; initial files were untracked at time of this check.

## FAILED / RESOLVED

- Initial `npm run build`: tsx CLI IPC forbidden by sandbox. Scripts switched to `node --import tsx`.
- Initial production build: parser error in collector; corrected and rebuilt.
- Initial live monitor: Node DNS family selection error; fixed with pinned public-address lookup and family auto-selection disabled. Retest passed.
- Initial SEO script incorrectly included `_not-found` metadata as a normal content page; corrected scope. Real missing URL still returns 404.
- First browser attempt timed out on an overly exact FAQ text locator including a child `+`; changed to a summary locator and reran successfully.
- ESLint caught one browser-storage hydration effect. The intentional SSR hydration exception is narrowly documented in the component; final lint passed.

## FAILED / OPEN

- `npm audit --json` — 5 high-severity dev-tool advisories remain in the `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces` chain. Registry's latest braces at audit time was 3.0.3, still affected. Do not feed untrusted glob patterns into the lint tool. This chain is not shipped as browser runtime. No forced downgrade to incompatible Next tooling was applied.
- Initially detected sharp and compression advisories were fixed: sharp 0.35.5 and compression override 1.8.2.

## NOT TESTED

- Real GitHub scheduled execution, bot push, branch protection and cache retention.
- Cloudflare API credentials, actual Git integration/hook trigger and deployment polling. API recovery tests use mocked responses; public production content verification passed separately below.
- A real new official event item moving through publication to the live domain. Only fixture publication and local checks were tested.
- Live AI provider request, YouTube RSS channel feed, X/Reddit authenticated API.
- Live confirmed-universe badge scan (no confirmed game universe available yet). Group discovery API was tested.
- LCP/CLS/INP field metrics, Lighthouse score, Google indexing, AdSense approval or complete accessibility audit.

## Scope limits

The code publishes supported official date/hub/game-list/badge formats and includes an optional two-pass grounded AI pipeline for official quest/reward guides. The AI provider and real official guide publication remain NOT TESTED. Community/video guides, changing existing guide instructions and unsupported official page structures still remain HOLD. These are limits of the full unattended target, not a claim that credentials alone solve every source format.


## Production-domain follow-up — October 11, 2026

- HTTPS canonical domain returned commit `6977bd4fca76c05279e0e6306e5d2085f9f898d7`; the verifier passed version, home, games, rewards and sitemap checks.
- Full `npm run check` passed: 29 tests, validation, TypeScript, lint, static export and SEO across 12 HTML pages.
- Forced public-source monitor checked 2 sources, with 0 errors and 0 new candidates; no content was fabricated or published.
- A second non-forced run correctly returned SKIPPED and wrote a fresh report because the phase interval had not elapsed.
- Workflow now skips build/commit for unchanged content and saves cache only after a scan. Deployment recovery still executes on every successful workflow run.
- Workflow behavior was inspected locally; actual GitHub scheduled execution and repository secrets remain unverified. No frontend changes were made in this follow-up, so browser visual tests were not repeated.
