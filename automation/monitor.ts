import { reviewGuides } from "./verification/guides";
import { publishGuides } from "./publishing/guides";
import { publishEntities } from "./publishing/entities";
import fs from "node:fs/promises";
import config from "./config/monitor.json";
import { collect } from "./collectors";
import { extract } from "./extractors";
import { verify, aiReview } from "./verification";
import { publish } from "./publishing";
export function phase(now: Date) {
  const day = now.toISOString().slice(0, 10);
  return day < config.preEventUntil
    ? "pre"
    : day < config.busyUntil
      ? "busy"
      : "archive";
}
export function due(now: Date, last: string | null) {
  return (
    !last ||
    !Number.isFinite(Date.parse(last)) ||
    Date.parse(last) > now.getTime() ||
    now.getTime() - Date.parse(last) >=
      config.intervalMinutes[phase(now)] * 60000 - 60000
  );
}
export async function runOutputs(ran: boolean, changed: boolean) {
  if (process.env.GITHUB_OUTPUT)
    await fs.appendFile(
      process.env.GITHUB_OUTPUT,
      `ran=${ran}\nchanged=${changed}\n`,
    );
}
async function main() {
  await fs.mkdir(".automation", { recursive: true });
  await fs.mkdir("automation/reports", { recursive: true });
  let state: {
    lastRun: string | null;
    seen: string[];
    lastSuccessfulRun: string | null;
  } = { lastRun: null, seen: [], lastSuccessfulRun: null };
  try {
    state = JSON.parse(await fs.readFile(".automation/state.json", "utf8"));
  } catch {}
  const now = new Date();
  if (!process.argv.includes("--force") && !due(now, state.lastRun)) {
    await runOutputs(false, false);
    await fs.writeFile(
      "automation/reports/latest.json",
      JSON.stringify(
        {
          status: "SKIPPED",
          reason: "Phase interval has not elapsed",
          lastRun: state.lastRun,
          checkedAt: now.toISOString(),
          phase: phase(now),
        },
        null,
        2,
      ),
    );
    console.log("Skipped: phase interval has not elapsed");
    return;
  }
  const result = await collect();
  const candidates = result.evidence.flatMap(extract);
  const unique = [
    ...new Map(candidates.map((c) => [c.candidateId, c])).values(),
  ];
  const decisions = unique.map(verify);
  for (const d of decisions.filter((x) => x.status === "HOLD").slice(0, 5)) {
    const ai = await aiReview(d.candidate);
    d.reason += "; " + ai.reason;
  }
  const unpublished = decisions.filter(
    (d) => !state.seen.includes(d.candidate.candidateId),
  );
  const publishing = await publish(unpublished);
  const entities = await publishEntities(unpublished);
  publishing.changed ||= entities.changed;
  publishing.published.push(...entities.published);
  const guideItems = [];
  const guideReview = [];
  for (const evidence of result.evidence
    .filter((e) => e.kind === "PAGE")
    .slice(0, 5)) {
    const review = await reviewGuides(evidence);
    guideReview.push({ source: evidence.url, reason: review.reason });
    for (const proposal of review.approved)
      guideItems.push({ proposal, evidence });
  }
  const guides = await publishGuides(guideItems);
  publishing.changed ||= guides.changed;
  publishing.published.push(...guides.published);
  state.lastRun = now.toISOString();
  if (result.evidence.length) state.lastSuccessfulRun = now.toISOString();
  state.seen = [...new Set([...state.seen, ...publishing.published])].slice(
    -20000,
  );
  await fs.writeFile(".automation/state.json", JSON.stringify(state, null, 2));
  await fs.writeFile(
    ".automation/candidates.json",
    JSON.stringify(decisions, null, 2),
  );
  const report = {
    lastRun: state.lastRun,
    lastSuccessfulRun: state.lastSuccessfulRun,
    phase: phase(now),
    sourcesChecked: result.checked,
    newCandidates: unpublished.length,
    publishedItems: publishing.published.length,
    heldItems: decisions.filter((d) => d.status === "HOLD").length,
    rejectedItems: decisions.filter((d) => d.status === "REJECT").length,
    conflicts: publishing.conflicts,
    errors: result.errors,
    deploymentResult: "NOT_ATTEMPTED",
    guideReview,
    changed: publishing.changed,
    limitations: [
      "X and Reddit automated access not configured",
      "Supported automatic updates: official structured dates, official-owned hub, explicit game listings, event-linked badges",
      "Official quest/reward extraction requires configured AI, exact quote grounding and semantic recheck; community guides stay HOLD",
    ],
  };
  await fs.writeFile(
    "automation/reports/latest.json",
    JSON.stringify(report, null, 2),
  );
  if (process.env.GITHUB_STEP_SUMMARY)
    await fs.appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `## Hollow monitor\n\nSources checked: ${report.sourcesChecked}; candidates: ${report.newCandidates}; published: ${report.publishedItems}; held: ${report.heldItems}; rejected: ${report.rejectedItems}.\n\nErrors: ${report.errors.length}. See private run artifacts for details.\n`,
    );
  await runOutputs(true, publishing.changed);
  console.log(JSON.stringify(report, null, 2));
  if (!result.evidence.length) process.exitCode = 1;
}
if (process.argv[1]?.endsWith("monitor.ts")) await main();
