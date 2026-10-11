import https from "node:https";
import dns from "node:dns/promises";
import { isIP } from "node:net";
import config from "../config/monitor.json";
export function publicAddress(ip: string) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  if (isIP(ip) === 6)
    return (
      /^2[0-9a-f]{3}:/i.test(ip) && !ip.toLowerCase().startsWith("2001:db8:")
    );
  return false;
}
export function safeUrl(value: string, hosts: string[] = config.allowedHosts) {
  const u = new URL(value);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    (u.port && u.port !== "443") ||
    !hosts.includes(u.hostname) ||
    isIP(u.hostname)
  )
    throw new Error("URL is outside the source allowlist");
  return u;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export async function fetchText(
  value: string,
  hosts?: string[],
): Promise<string> {
  const u = safeUrl(value, hosts);
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const addresses = await dns.lookup(u.hostname, { all: true });
      if (!addresses.length || addresses.some((x) => !publicAddress(x.address)))
        throw new Error("Private or reserved network address rejected");
      const chosen = addresses[0];
      return await new Promise<string>((resolve, reject) => {
        const req = https.get(
          u,
          {
            ...{ autoSelectFamily: false },
            headers: {
              "User-Agent":
                "HollowGuideMonitor/1.0 (+https://robloxthehollow.com/sources/)",
              Accept: "application/json,text/html,application/xml",
            },
            lookup: (_hostname, _opts, cb) =>
              cb(null, chosen.address, chosen.family),
            timeout: 15000,
          },
          (res) => {
            if (res.statusCode !== 200) {
              res.resume();
              reject(new Error(`HTTP ${res.statusCode}`));
              return;
            }
            let body = "";
            let bytes = 0;
            res.on("data", (chunk: Buffer) => {
              bytes += chunk.length;
              if (bytes > 1500000) {
                req.destroy(new Error("Source too large"));
                return;
              }
              body += chunk.toString("utf8");
            });
            res.on("end", () => resolve(body));
            res.on("error", reject);
          },
        );
        req.on("timeout", () => req.destroy(new Error("Request timed out")));
        req.on("error", reject);
      });
    } catch (e) {
      last = e;
      if (/403|404|Private|allowlist|large/.test(String(e))) break;
      if (attempt < 2) await sleep(750 * 2 ** attempt);
    }
  }
  throw last;
}
export async function fetchJson(value: string) {
  return JSON.parse(await fetchText(value)) as unknown;
}
