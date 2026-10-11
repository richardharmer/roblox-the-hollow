import config from "../config/monitor.json";
export async function checkBudget() {
  const {
    CLOUDFLARE_API_TOKEN: token,
    CLOUDFLARE_ACCOUNT_ID: account,
    CLOUDFLARE_PROJECT_NAME: project,
  } = process.env;
  if (!token || !account || !project)
    throw new Error(
      "Cloudflare configuration missing; refusing unattended content push",
    );
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/pages/projects/${encodeURIComponent(project)}/deployments`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!response.ok) throw new Error(`Budget check HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success || !Array.isArray(data.result))
    throw new Error("Invalid deployment budget response");
  const day = new Date().toISOString().slice(0, 10);
  const phase =
    day < config.preEventUntil
      ? "pre"
      : day < config.busyUntil
        ? "busy"
        : "archive";
  const count = data.result.filter(
    (d: { environment: string; created_on: string }) =>
      d.environment === "production" && d.created_on.startsWith(day),
  ).length;
  if (count >= config.dailyDeployLimit[phase])
    throw new Error(
      "Daily deployment cap reached. Changes will be rediscovered on a future run.",
    );
  console.log(`Deployment budget: ${count}/${config.dailyDeployLimit[phase]}`);
}
if (process.argv[1]?.endsWith("budget.ts")) await checkBudget();
