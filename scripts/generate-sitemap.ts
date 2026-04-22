/**
 * Build-time sitemap generator.
 *
 * Pulls the live post list from the Jekyll repo (same source as the runtime
 * loader) and writes dist/sitemap.xml with entries for:
 *   - / (homepage)
 *   - /about
 *   - /blog/:day for every blog post
 *   - /lab/:day for every lab
 *
 * Runs as a Vite `closeBundle` hook in production builds. If the network
 * fetch fails (rate-limit, offline build), it still emits a minimal sitemap
 * with the static routes so the build never breaks.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://juribuora.com";
const REPO = "JuriBuora/JuriBuora.github.io";
const BRANCH = "my-blog";

const FOLDERS: Array<{ folder: string; category: "blog" | "lab" }> = [
  { folder: "Blog", category: "blog" },
  { folder: "Labs", category: "lab" },
];

const DAY_PATTERNS = [
  /\bday[\s\-_]*0*(\d{1,4})\b/i,
  /\bd0*(\d{1,4})\b/i,
  /#0*(\d{1,4})\b/,
  /^0*(\d{1,4})[\-_\s]/,
];
const LAB_PATTERNS = [
  /\blab[\s\-_]*0*(\d{1,4})\b/i,
  /\bl0*(\d{1,4})\b/i,
  /#0*(\d{1,4})\b/,
  /^0*(\d{1,4})[\-_\s]/,
];

function firstMatch(patterns: RegExp[], stem: string): number | null {
  for (const re of patterns) {
    const m = stem.match(re);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return null;
}

function deriveDay(filename: string, category: "blog" | "lab"): number | null {
  const stem = filename
    .replace(/\.(?:md|markdown)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
  if (category === "lab") {
    return firstMatch(LAB_PATTERNS, stem) ?? firstMatch(DAY_PATTERNS, stem);
  }
  return firstMatch(DAY_PATTERNS, stem);
}

function dateFromFilename(name: string): string | null {
  const m = name.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

type Entry = { loc: string; lastmod?: string; changefreq?: string; priority?: number };

async function fetchEntries(): Promise<Entry[]> {
  const collected: Entry[] = [];
  for (const { folder, category } of FOLDERS) {
    const url = `https://api.github.com/repos/${REPO}/contents/${folder}/_posts?ref=${BRANCH}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${folder}`);
    const files = (await res.json()) as Array<{ name: string; type: string }>;
    for (const f of files) {
      if (f.type !== "file" || !/\.(md|markdown)$/i.test(f.name)) continue;
      const day = deriveDay(f.name, category);
      if (day === null) continue;
      collected.push({
        loc: `${SITE}/${category}/${day}`,
        lastmod: dateFromFilename(f.name) ?? undefined,
        changefreq: "monthly",
        priority: 0.7,
      });
    }
  }
  return collected;
}

function renderXml(entries: Entry[]): string {
  const head =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const body = entries
    .map((e) => {
      const parts = [`    <loc>${e.loc}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority !== undefined) parts.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `${head}${body}\n</urlset>\n`;
}

export async function generateSitemap(outDir: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const staticEntries: Entry[] = [
    { loc: `${SITE}/`, lastmod: today, changefreq: "weekly", priority: 1.0 },
    { loc: `${SITE}/about`, lastmod: today, changefreq: "monthly", priority: 0.8 },
  ];

  let postEntries: Entry[] = [];
  try {
    postEntries = await fetchEntries();
    // eslint-disable-next-line no-console
    console.log(`[sitemap] Indexed ${postEntries.length} post URLs from Jekyll`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[sitemap] Falling back to static-only sitemap:`, (err as Error).message);
  }

  const xml = renderXml([...staticEntries, ...postEntries]);
  const target = path.join(outDir, "sitemap.xml");
  await writeFile(target, xml, "utf8");
  // eslint-disable-next-line no-console
  console.log(`[sitemap] Wrote ${target} (${staticEntries.length + postEntries.length} URLs)`);
}

export function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    apply: "build" as const,
    async closeBundle() {
      await generateSitemap(path.resolve("dist"));
    },
  };
}