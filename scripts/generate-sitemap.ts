/**
 * Build-time sitemap generator.
 *
 * Reads the locally generated Jekyll manifest produced by
 * `scripts/sync-jekyll-content.mjs` and writes `dist/sitemap.xml` with entries
 * for the homepage, about page, and every mirrored post route.
 *
 * If the manifest is unavailable, the build still succeeds with a static-only
 * sitemap so deploys never fail on content sync hiccups.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SITE = "https://juribuora.com";
const MANIFEST_PATH = path.resolve("public/generated/manifest.json");

type Entry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

type GeneratedManifest = {
  posts: Array<{ category: "blog" | "lab"; day: number; date: string }>;
  labs: Array<{ category: "blog" | "lab"; day: number; date: string }>;
};

async function readManifestEntries(): Promise<Entry[]> {
  const raw = await readFile(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw) as GeneratedManifest;
  const mirroredPosts = [...manifest.posts, ...manifest.labs];

  return mirroredPosts.map((post) => ({
    loc: `${SITE}/${post.category}/${post.day}`,
    lastmod: post.date,
    changefreq: "monthly",
    priority: 0.7,
  }));
}

function renderXml(entries: Entry[]): string {
  const head =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const body = entries
    .map((entry) => {
      const parts = [`    <loc>${entry.loc}</loc>`];
      if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority !== undefined) {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }
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

  let mirroredEntries: Entry[] = [];

  try {
    mirroredEntries = await readManifestEntries();
    // eslint-disable-next-line no-console
    console.log(`[sitemap] Indexed ${mirroredEntries.length} mirrored post URLs`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "[sitemap] Falling back to static-only sitemap:",
      (error as Error).message,
    );
  }

  const xml = renderXml([...staticEntries, ...mirroredEntries]);
  await mkdir(outDir, { recursive: true });
  const target = path.join(outDir, "sitemap.xml");
  await writeFile(target, xml, "utf8");
  // eslint-disable-next-line no-console
  console.log(`[sitemap] Wrote ${target} (${staticEntries.length + mirroredEntries.length} URLs)`);
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
