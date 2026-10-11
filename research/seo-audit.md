# UI / SEO audit — October 11, 2026

| Priority | URL/template | Evidence / check | Impact | Resolution | Status |
|---|---|---|---|---|---|
| P0 | All published routes | `npm run build` exports complete HTML | Crawlers receive main answers without client JS | Next.js static export; real-data-only detail generation | PASS |
| P1 | 12 HTML content/tool pages | `npm run seo`: unique titles/descriptions, single H1, canonical, OG, Twitter, valid JSON-LD, image dimensions/alt and internal href existence | Search presentation and navigation | Central metadata helpers; no dead local links detected | PASS |
| P1 | Sitemap | Every listed path maps to exported HTML; progress excluded | Avoid empty/generated junk routes | 11 indexable URLs; substantive data dates only | PASS |
| P1 | Unknown task URL | Playwright HTTP request | Avoid soft 404 | Static server returns actual 404 | PASS locally; production NOT TESTED |
| P1 | Home / games | Playwright 375, 390, 768, 1440px | Mobile navigation/overflow | No horizontal document overflow; menu and directory inputs work | PASS |
| P1 | Progress | Import/export/reload/reset browser test | User data reliability | Merge, v1 migration, invalid import retains current state, reset confirmation | PASS |
| P1 | Release-date / home | Initial rendered text and data check | Prevent false countdown | October 22 marked reported; no hour-level countdown; exact time TBA | PASS |
| P2 | Brand | Original SVG in header/footer; generated icons and OG | Distinct unofficial identity | Doorway mark, no Roblox logo; assets explicitly sized | PASS local screenshot/code inspection |
| P2 | Console | `pageerror` observer during four viewport flows | Broken JS | No uncaught runtime errors observed | PASS sampled flows |
| P1 | Production redirects | No Cloudflare access | Duplicate host indexing | Document exact dashboard setup | NOT TESTED |
| P1 | Real Core Web Vitals | No production field data | Performance | Static HTML, small SVG, no third-party embeds/scripts; no score claimed | NOT TESTED |
| P2 | Google indexing/rich results | No GSC or production domain verification | Discovery | Sitemap/robots implemented, eligibility not guaranteed | NOT TESTED |

Structured data: WebSite, BreadcrumbList, Article for real editorial update. No fake Product, reviews or FAQ rich-result promise. Main directory entries are server rendered; client filters enhance the static body.

Screenshots: `research/screenshots/home-{375,390,768,1440}.png`. Desktop and mobile screenshots were visually inspected. Tests are local and are not a substitute for Cloudflare response checks.

Design: dark charcoal surfaces, crimson actions, orange date emphasis, original doorway/forest scene. Compact UI and serif title are intentionally different from a standard blog. Mobile card text was enlarged after initial screenshot review. Keyboard focus styling, skip link, native details controls and reduced-motion rules are implemented. A complete assistive-technology/contrast audit has not been performed.
