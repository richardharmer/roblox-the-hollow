import fs from "node:fs/promises";
import config from "../config/monitor.json";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
type Deployment = {
  id: string;
  environment: string;
  created_on: string;
  url: string;
  deployment_trigger: { metadata: { commit_hash: string } };
  latest_stage: { status: string };
};
export async function ensureDeployment(
  commit: string,
  api: (path: string, init?: RequestInit) => Promise<unknown>,
  hook: () => Promise<void>,
  wait = sleep,
) {
  const list = async () => {
    const r = (await api("/deployments")) as {
      success: boolean;
      result: Deployment[];
    };
    if (!r.success || !Array.isArray(r.result))
      throw new Error("Cloudflare deployment list failed");
    return r.result;
  };
  let target: Deployment | undefined;
  for (let i = 0; i < 4; i++) {
    target = (await list()).find(
      (d) =>
        d.environment === "production" &&
        d.deployment_trigger?.metadata?.commit_hash === commit,
    );
    if (target) break;
    if (i < 3) await wait(20000);
  }
  if (!target) {
    const deployments = await list();
    const day = new Date().toISOString().slice(0, 10);
    const phase =
      day < config.preEventUntil
        ? "pre"
        : day < config.busyUntil
          ? "busy"
          : "archive";
    if (
      deployments.filter(
        (d) => d.environment === "production" && d.created_on.startsWith(day),
      ).length >= config.dailyDeployLimit[phase]
    )
      throw new Error("Daily deployment budget reached; retry next day");
    await hook();
  } else if (
    target.latest_stage.status === "failure" ||
    target.latest_stage.status === "canceled"
  ) {
    await api(`/deployments/${target.id}/retry`, { method: "POST" });
  }
  for (let i = 0; i < 30; i++) {
    target = (await list()).find(
      (d) =>
        d.environment === "production" &&
        d.deployment_trigger?.metadata?.commit_hash === commit,
    );
    if (target?.latest_stage.status === "success") return target;
    if (target?.latest_stage.status === "failure")
      throw new Error("Cloudflare build failed; retry next monitor run");
    await wait(20000);
  }
  throw new Error("Timed out waiting for target commit deployment");
}
async function main() {
  const {
    CLOUDFLARE_API_TOKEN: token,
    CLOUDFLARE_ACCOUNT_ID: account,
    CLOUDFLARE_PROJECT_NAME: project,
    CLOUDFLARE_DEPLOY_HOOK: hook,
  } = process.env;
  if (!token || !account || !project)
    throw new Error("Cloudflare credentials are not configured");
  const commit = process.argv[2];
  if (!/^[a-f0-9]{40}$/.test(commit || ""))
    throw new Error("Expected full commit SHA");
  const base = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/pages/projects/${encodeURIComponent(project)}`;
  const api = async (p: string, init?: RequestInit) => {
    const r = await fetch(base + p, {
      ...init,
      signal: AbortSignal.timeout(20000),
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error(`Cloudflare API HTTP ${r.status}`);
    return r.json();
  };
  let report;
  try {
    const deployed = await ensureDeployment(commit, api, async () => {
      if (!hook)
        throw new Error("Deploy hook missing and Git deployment not found");
      const u = new URL(hook);
      if (u.hostname !== "api.cloudflare.com" || u.protocol !== "https:")
        throw new Error("Invalid Cloudflare hook");
      const r = await fetch(u, {
        method: "POST",
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw new Error("Deploy hook failed");
    });
    let verified = false;
    for (let i = 0; i < 6; i++) {
      const r = await fetch("https://robloxthehollow.com/version.json", {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (r.ok && (await r.json()).commit === commit) {
        verified = true;
        break;
      }
      await sleep(10000);
    }
    if (!verified)
      throw new Error("Production content does not match target commit");
    for (const p of ["/", "/games/", "/rewards/", "/sitemap.xml"]) {
      const r = await fetch("https://robloxthehollow.com" + p, {
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error(`Production route failed: ${p}`);
      const text = await r.text();
      if (
        p === "/sitemap.xml"
          ? !text.includes("<urlset")
          : !text.includes("The Hollow")
      )
        throw new Error(`Production route content invalid: ${p}`);
    }
    report = {
      status: "PRODUCTION_VERIFIED",
      commit,
      deploymentId: deployed.id,
    };
  } catch (e) {
    report = { status: "FAILED", commit, error: String(e) };
    process.exitCode = 1;
  }
  await fs.mkdir("automation/reports", { recursive: true });
  await fs.writeFile(
    "automation/reports/deployment.json",
    JSON.stringify(report, null, 2),
  );
  console.log(report);
}
if (process.argv[1]?.endsWith("deploy.ts")) await main();
