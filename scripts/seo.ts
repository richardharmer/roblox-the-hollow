import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
const root = path.resolve("out");
const files = await fs.readdir(root, { recursive: true });
const pages = files.filter(
  (f) => f.endsWith(".html") && !f.startsWith("_next/"),
);
const titles = new Set<string>();
const descriptions = new Set<string>();
let checked = 0;
const issues: string[] = [];
for (const file of pages) {
  if (
    file === "404.html" ||
    file === "404/index.html" ||
    file === "_not-found/index.html"
  )
    continue;
  const $ = load(await fs.readFile(path.join(root, file), "utf8"));
  const title = $("title").text();
  const description = $('meta[name="description"]').attr("content");
  if (!title || titles.has(title))
    issues.push(`${file}: missing/duplicate title`);
  titles.add(title);
  if (!description || descriptions.has(description))
    issues.push(`${file}: missing/duplicate description`);
  if (description) descriptions.add(description);
  if ($("h1").length !== 1) issues.push(`${file}: H1 count`);
  if (
    !$('link[rel="canonical"]')
      .attr("href")
      ?.startsWith("https://robloxthehollow.com/")
  )
    issues.push(`${file}: canonical`);
  for (const name of ["og:title", "og:image"])
    if (!$(`meta[property="${name}"]`).attr("content"))
      issues.push(`${file}: ${name}`);
  if (!$('meta[name="twitter:card"]').length)
    issues.push(`${file}: Twitter card`);
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      JSON.parse($(el).text());
    } catch {
      issues.push(`${file}: invalid JSON-LD`);
    }
  });
  $("img").each((_, el) => {
    if (
      $(el).attr("alt") === undefined ||
      !$(el).attr("width") ||
      !$(el).attr("height")
    )
      issues.push(`${file}: image attributes`);
  });
  for (const href of $("a[href]")
    .map((_, el) => $(el).attr("href"))
    .get()) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split(/[?#]/)[0];
    const target = path.join(
      root,
      clean.endsWith("/") ? clean + "index.html" : clean,
    );
    try {
      await fs.access(target);
    } catch {
      issues.push(`${file}: broken link ${href}`);
    }
  }
  checked++;
}
const sitemap = await fs.readFile("out/sitemap.xml", "utf8");
const $xml = load(sitemap, { xmlMode: true });
for (const loc of $xml("loc")
  .map((_, el) => $xml(el).text())
  .get()) {
  const u = new URL(loc);
  if (u.pathname.includes("/progress/"))
    issues.push("Progress tool in sitemap");
  try {
    await fs.access(path.join(root, u.pathname, "index.html"));
  } catch {
    issues.push(`Sitemap missing page ${loc}`);
  }
}
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log(
  `SEO PASS: ${checked} HTML pages, unique metadata, H1s, canonicals, JSON-LD, images, internal links and sitemap.`,
);
