import { test } from "node:test";
import assert from "node:assert/strict";
import { verificationOrigin, verifySite } from "../publishing/deploy";

test("prelaunch verification defaults to Pages and supports explicit canonical switch", () => {
  assert.equal(
    verificationOrigin("roblox-the-hollow"),
    "https://roblox-the-hollow.pages.dev",
  );
  assert.equal(
    verificationOrigin("roblox-the-hollow", "https://robloxthehollow.com/"),
    "https://robloxthehollow.com",
  );
  for (const url of [
    "http://robloxthehollow.com",
    "https://example.com",
    "https://robloxthehollow.com/path",
    "https://user@robloxthehollow.com",
  ])
    assert.throws(() => verificationOrigin("roblox-the-hollow", url));
});

test("deployment verification survives network propagation and stale edge version", async () => {
  let attempts = 0;
  const routes: string[] = [];
  const request: typeof fetch = async (input) => {
    const path = new URL(String(input)).pathname;
    if (path === "/version.json") {
      attempts++;
      if (attempts === 1) throw new Error("DNS temporarily unavailable");
      return Response.json({ commit: attempts === 2 ? "old" : "target" });
    }
    routes.push(path);
    return new Response(
      path === "/sitemap.xml" ? "<urlset></urlset>" : "The Hollow",
    );
  };
  await verifySite(
    "https://roblox-the-hollow.pages.dev",
    "target",
    request,
    async () => {},
  );
  assert.equal(attempts, 3);
  assert.deepEqual(routes, ["/", "/games/", "/rewards/", "/sitemap.xml"]);
});

test("wrong deployed commit and broken routes fail closed", async () => {
  await assert.rejects(
    verifySite(
      "https://example.com",
      "target",
      async () => Response.json({ commit: "old" }),
      async () => {},
    ),
    /does not match/,
  );
  await assert.rejects(
    verifySite(
      "https://example.com",
      "target",
      async (input) =>
        String(input).endsWith("version.json")
          ? Response.json({ commit: "target" })
          : new Response("missing", { status: 404 }),
      async () => {},
    ),
    /route failed/,
  );
});
