import { test } from "node:test";
import assert from "node:assert/strict";
import { inspectConfiguration } from "../preflight";
const env = {
  CLOUDFLARE_API_TOKEN: "private-token",
  CLOUDFLARE_ACCOUNT_ID: "a".repeat(32),
  CLOUDFLARE_PROJECT_NAME: "roblox-the-hollow",
  CLOUDFLARE_DEPLOY_HOOK:
    "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/private-hook",
  DEPLOY_VERIFY_ORIGIN: "https://robloxthehollow.com",
};
test("preflight supports automation without AI and never echoes secrets", () => {
  const report = inspectConfiguration(env);
  assert.equal(report.status, "CONFIGURED");
  assert.equal(report.ai, "DISABLED_OR_INCOMPLETE");
  assert.equal(JSON.stringify(report).includes("private-"), false);
});
test("preflight identifies missing values and rejects wrong hook host", () => {
  assert.equal(inspectConfiguration({}).missing.length, 4);
  assert.equal(
    inspectConfiguration({
      ...env,
      CLOUDFLARE_DEPLOY_HOOK: "https://example.com/hook",
    }).status,
    "FAILED",
  );
  assert.equal(
    inspectConfiguration({
      ...env,
      CLOUDFLARE_PROJECT_NAME: "https://roblox-the-hollow.pages.dev",
    }).status,
    "FAILED",
  );
});
