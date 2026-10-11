# One-time GitHub / Cloudflare setup

The GitHub remote is `richardharmer/roblox-the-hollow`. The public Pages site at https://roblox-the-hollow.pages.dev/ returned a deployed commit on October 11, 2026. The custom domain returned deployed commit `6977bd4fca76c05279e0e6306e5d2085f9f898d7` on October 11, 2026. Automation credentials have not been verified.

## 1. GitHub

Create or choose the GitHub repository you want to own this site. This local directory already contains a Git repository and `.github/workflows`.

```sh
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git add .
git commit -m "Build The Hollow event companion"
git push -u origin main
```

If a remote already exists later, inspect it rather than replacing it. In repository Settings → Actions → General, enable Actions and permit workflows to write repository contents. Branch protection must permit this repository's bot update strategy, or the bot will report failed pushes. No daily manual review step is configured.

Scheduled workflows run from the default branch. Public-repository scheduled workflows may be disabled by GitHub after prolonged inactivity; an idle archive is not guaranteed to run forever. Monitor Actions notifications and GitHub's scheduling limits. Cron is best effort, not realtime.

## 2. Cloudflare Pages

Workers & Pages → Create application → Pages → Connect to Git → select repository.

- Production branch: `main`
- Framework: Next.js static HTML export, or no preset with explicit settings
- Build command: `npm run check` (includes the static build and all required gates)
- Build output directory: `out`
- Root directory: repository root
- Environment variable: `NODE_VERSION=22`
- Optional: `NEXT_PUBLIC_ADS_ENABLED=false`

Do not use a Workers/SSR adapter. Keep automatic Git production deployments enabled for human pushes. Set an ignored-build command if desired so research-only commits do not consume build quota; do not skip content changes.

Create a deploy hook for `main` under the Pages project's settings. Treat the full hook URL as a secret.

Create a Cloudflare API token with **Account → Cloudflare Pages → Edit**, scoped to the owning account. It is used to inspect target-commit deployments and retry failed ones. It is not embedded in the website.

## 3. GitHub configuration

Repository Settings → Secrets and variables → Actions:

Secrets:

| Name                     | Value                                               |
| ------------------------ | --------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`   | Scoped token above                                  |
| `CLOUDFLARE_ACCOUNT_ID`  | Account ID from Cloudflare dashboard                |
| `CLOUDFLARE_DEPLOY_HOOK` | Full private Pages hook URL for main                |
| `AI_API_KEY`             | Optional; only if enabling semantic lead extraction |

Variables:

| Name                      | Value                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| `CLOUDFLARE_PROJECT_NAME` | Exact Pages project name                                                      |
| `DEPLOY_VERIFY_ORIGIN`    | Optional override; the workflow now defaults to `https://robloxthehollow.com` |
| `AI_BASE_URL`             | Optional HTTPS OpenAI-compatible API base, e.g. `https://api.openai.com/v1`   |
| `AI_MODEL`                | Optional model ID supported by your provider                                  |

Without AI credentials, deterministic official evidence still works; semantic claims stay HOLD. Adding an AI key does not itself authorize ungrounded publication. The current adapter does not need a YouTube API key.

## 4. Canonical domain

Pages → Custom domains → add `robloxthehollow.com`; follow the DNS verification instructions for your zone. Confirm the certificate is active.

Cloudflare zone settings:

1. Enable HTTPS redirection for HTTP requests.
2. Add a redirect rule for hostname `www.robloxthehollow.com` to `https://robloxthehollow.com` preserving path and query, status 301. Ensure the www DNS record is proxied and covered by TLS.
3. Follow [Cloudflare's Pages-domain redirect guide](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/) to redirect the project's production `PROJECT.pages.dev` hostname to the canonical custom domain, preserving path/query. The current project hostname is `roblox-the-hollow.pages.dev`.
4. Protect branch previews with Access or send `X-Robots-Tag: noindex` using preview-specific deployment configuration. A canonical alone does not prevent indexing. Do not block production crawlers accidentally.

Test HTTP, HTTPS www, apex and pages.dev independently. None of these dashboard rules are applied by this repository alone.

## 5. First real end-to-end run

After the first Pages deployment succeeds, open GitHub Actions → Monitor evidence and publish → Run workflow. Review uploaded `latest.json` and `deployment.json`.

The monitor:

1. Scans supported public sources; evaluates candidates.
2. Writes only data/content; when content changes, validates, typechecks, lints, tests, builds and checks SEO. No-change runs skip the build; CI still checks code pushes.
3. Enforces a file whitelist; checks daily deployment budget before a bot commit.
4. Commits only actual changes; persists state after successful push/gates.
5. Looks for a production deployment whose commit hash exactly matches HEAD.
6. Waits for Git integration before using the secret deploy hook. It does not assume a GITHUB_TOKEN push triggers another Actions workflow.
7. Polls Cloudflare; then verifies the configured origin’s `version.json` commit, home, games, rewards and sitemap.
8. Reports failure if any stage cannot be proven. A future run retries the target deployment; it does not call a failed version live.

No-change scans do not create commits and do not trigger a new deployment when the target is already successfully deployed. Hook fallback only occurs if that target deployment is missing. API outages fail closed. A completed Git push is not sufficient for PRODUCTION VERIFIED.

Daily caps: pre-event 6, busy period 12, archive 2 bot-triggered deployments. Human pushes and external deployments can consume quota outside this gate. The script counts recent production deployments returned by the API; review quota if the project has very high external deployment volume.

## Schedule

Cron runs at :17 and :47 UTC. The code selects a phase from `automation/config/monitor.json`:

- Before October 22, 2026: every 120 minutes.
- October 22–November 5: every 30 minutes.
- November 6 onward: every 720 minutes.

GitHub cache preserves last-run state. Cache eviction may cause an extra safe scan; content publication is independently idempotent. Reports are run artifacts; source failures do not require the owner's computer to stay online.

If an official end timestamp is obtained, the event moves to ENDED with an archive heading on a scheduled rebuild. A date-only report does not infer an exact end. Reward availability changes require reward-specific evidence; ending the event does not invent expiry for every item.

## Development before domain binding

Continue development and Pages deployments using `roblox-the-hollow.pages.dev`. Leave `DEPLOY_VERIFY_ORIGIN` unset and set `CLOUDFLARE_PROJECT_NAME=roblox-the-hollow`. Successful verification reports `PAGES_VERIFIED`; this does not claim that the custom domain works. Canonicals and sitemap URLs remain on the intended custom domain. After binding and TLS succeed, set `DEPLOY_VERIFY_ORIGIN=https://robloxthehollow.com` before redirecting the Pages hostname, then run the monitor manually. Custom-domain verification reports `PRODUCTION_VERIFIED`.

## Production monitoring after domain binding

The workflow now defaults `DEPLOY_VERIFY_ORIGIN` to `https://robloxthehollow.com`. An existing repository variable overrides this value: remove a stale Pages override or set it to the canonical domain. The standalone verifier still defaults to Pages when no origin is supplied. Interval-skipped scans write a fresh SKIPPED report and do not save duplicate cache entries. No-change scans skip build and commit; deployment verification still runs to recover an earlier failed deployment. Invalid or future cached timestamps trigger a fresh scan.


## Configuration preflight and acceptance

The monitor now checks required variable names and formats before collection. `configuration.json` names missing settings without printing secret values. This preflight does not prove token permissions or AI connectivity. Configure all three Cloudflare secrets (API token, account ID, deploy hook) and the Pages project variable in repository Actions settings. GitHub supplies `GITHUB_TOKEN`; no personal access token is required by the current workflow. Keep the workflow's `contents: write` permission and ensure repository policies permit it.

Start with AI disabled. Optional AI uses secret `AI_API_KEY` and variables `AI_BASE_URL` and `AI_MODEL`. The provider must support the current Chat Completions request and JSON responses. A configured key is not proof that the model works; the guide pipeline may not call AI at all until eligible evidence and confirmed games exist.

After pushing these files to main, dispatch Monitor evidence and publish. Verify configuration, source collection, absence of unsupported publication, exact deployment commit and `PRODUCTION_VERIFIED` report. A no-change pass does not test a new bot commit or hook fallback. Validate those separately with a controlled truthful content change or a real qualifying source; do not add invented event data merely to exercise deployment. Preserve the report distinction between tested and untested stages.
