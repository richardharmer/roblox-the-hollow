import fs from "node:fs/promises";
import { verificationOrigin } from "./publishing/deploy";

export function inspectConfiguration(env: Record<string, string | undefined>) {
  const required = [
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_PROJECT_NAME",
    "CLOUDFLARE_DEPLOY_HOOK",
  ];
  const missing = required.filter((key) => !env[key]?.trim());
  const errors: string[] = [];
  if (
    env.CLOUDFLARE_ACCOUNT_ID &&
    !/^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID)
  )
    errors.push(
      "CLOUDFLARE_ACCOUNT_ID must be the 32-character account ID, not a zone ID or email",
    );
  if (
    env.CLOUDFLARE_PROJECT_NAME &&
    !/^[a-z0-9-]+$/.test(env.CLOUDFLARE_PROJECT_NAME)
  )
    errors.push(
      "CLOUDFLARE_PROJECT_NAME must be the Pages project name, without a URL",
    );
  if (env.CLOUDFLARE_DEPLOY_HOOK) {
    try {
      const url = new URL(env.CLOUDFLARE_DEPLOY_HOOK);
      if (
        url.protocol !== "https:" ||
        url.hostname !== "api.cloudflare.com" ||
        url.username ||
        url.password ||
        !url.pathname.startsWith("/client/v4/pages/webhooks/deploy_hooks/")
      )
        throw new Error();
    } catch {
      errors.push(
        "CLOUDFLARE_DEPLOY_HOOK must be a Cloudflare Pages deploy hook URL",
      );
    }
  }
  if (env.CLOUDFLARE_PROJECT_NAME) {
    try {
      verificationOrigin(env.CLOUDFLARE_PROJECT_NAME, env.DEPLOY_VERIFY_ORIGIN);
    } catch {
      errors.push(
        "DEPLOY_VERIFY_ORIGIN must be the canonical or project Pages HTTPS origin",
      );
    }
  }
  const aiConfigured = Boolean(env.AI_API_KEY && env.AI_MODEL);
  return {
    status: missing.length || errors.length ? "FAILED" : "CONFIGURED",
    missing,
    errors,
    ai: aiConfigured
      ? "CONFIGURED_NOT_CONNECTIVITY_TESTED"
      : "DISABLED_OR_INCOMPLETE",
    note: "Presence and format checks only; API permissions, deployment and publication require a real run.",
  };
}
if (process.argv[1]?.endsWith("preflight.ts")) {
  const report = inspectConfiguration(process.env);
  await fs.mkdir("automation/reports", { recursive: true });
  await fs.writeFile(
    "automation/reports/configuration.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  if (report.status === "FAILED") process.exitCode = 1;
}
