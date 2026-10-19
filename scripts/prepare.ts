import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { collections, updates, gameProfiles } from "../src/lib/content";
const dir = "src/app/(generated)";
await fs.rm(dir, { recursive: true, force: true });
for (const [kind, entries] of Object.entries({ ...collections, updates })) {
  for (const e of entries.filter((e) => e.publishDetail)) {
    const title = "title" in e ? e.title : e.name;
    const summary = "summary" in e ? e.summary : e.description;
    const target = path.join(dir, kind, e.slug);
    await fs.mkdir(target, { recursive: true });
    await fs.writeFile(
      path.join(target, "page.tsx"),
      `import {Detail} from '@/components/detail';import {metadata as makeMetadata} from '@/lib/seo';export const metadata=makeMetadata(${JSON.stringify(title + " | The Hollow Guide")},${JSON.stringify(summary)},${JSON.stringify("/" + kind + "/" + e.slug + "/")});export default function Page(){return <Detail kind=${JSON.stringify(kind)} slug=${JSON.stringify(e.slug)}/>}`,
    );
  }
}
for (const profile of gameProfiles) {
  if (collections.games.some((g) => g.slug === profile.id && g.publishDetail))
    continue;
  const target = path.join(dir, "games", profile.id);
  await fs.mkdir(target, { recursive: true });
  await fs.writeFile(
    path.join(target, "page.tsx"),
    `import {GameProfile} from '@/components/game-profile';import {metadata as makeMetadata} from '@/lib/seo';export const metadata=makeMetadata(${JSON.stringify(profile.name + " in The Hollow — Game & Event Status")},${JSON.stringify(profile.summary + " Check its reported Hollow status, official Roblox link and teaser evidence.")},${JSON.stringify("/games/" + profile.id + "/")},true);export default function Page(){return <GameProfile id=${JSON.stringify(profile.id)}/>}`,
  );
}
const missing = async (file: string) => {
  try {
    await fs.access(file);
    return false;
  } catch {
    return true;
  }
};
for (const size of [16, 32, 180]) {
  const file =
    size === 180 ? "public/apple-touch-icon.png" : `public/favicon-${size}.png`;
  if (await missing(file))
    await sharp("public/icon.svg")
      .resize(size, size, { fit: "contain", background: "#101014" })
      .png()
      .toFile(file);
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#101014"/><path d="M810 520V230l120-130 120 130v290h-55V250l-65-70-65 70v270" fill="#8c1f2d"/><text x="75" y="140" fill="#f59e52" font-size="22" font-family="sans-serif" letter-spacing="5">2026 / UNOFFICIAL EVENT GUIDE</text><text x="70" y="300" fill="#f5f2f0" font-size="95" font-family="serif" font-weight="bold">THE HOLLOW</text><text x="75" y="380" fill="#aaa5b1" font-size="30" font-family="sans-serif">Games. Quests. Rewards. Your progress.</text><path d="M75 440h120" stroke="#e54149" stroke-width="5"/><text x="75" y="530" fill="#aaa5b1" font-size="20" font-family="sans-serif">robloxthehollow.com</text></svg>`;
if (await missing("public/og.png"))
  await sharp(Buffer.from(svg)).png().toFile("public/og.png");
await fs.writeFile(
  "public/version.json",
  JSON.stringify({
    commit:
      process.env.DEPLOY_COMMIT ||
      process.env.CF_PAGES_COMMIT_SHA ||
      process.env.GITHUB_SHA ||
      "local",
  }),
);
console.log("Prepared real detail routes and original brand assets.");
