import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const GENERATED_MANIFEST_TS = path.join(ROOT, "src/data/jekyllSnapshot.generated.ts");
const GENERATED_MANIFEST_JSON = path.join(ROOT, "public/generated/manifest.json");
const GENERATED_POSTS_DIR = path.join(ROOT, "public/generated/posts");

const UPSTREAM = {
  repo: "JuriBuora/JuriBuora.github.io",
  branch: "my-blog",
  site: "https://juribuora.github.io",
  folders: [
    { folder: "Blog", category: "blog", urlPrefix: "blog" },
    { folder: "Labs", category: "lab", urlPrefix: "labs" },
  ],
};

const DAY_PATTERNS = [
  /\bday[\s\-_]*0*(\d{1,4})(?:\b|(?=[\s\-_]))/i,
  /\bd0*(\d{1,4})(?:\b|(?=[\s\-_]))/i,
  /#0*(\d{1,4})\b/,
  /^0*(\d{1,4})[\-_\s]/,
];
const LAB_PATTERNS = [
  /\blab[\s\-_]*0*(\d{1,4})(?:\b|(?=[\s\-_]))/i,
  /\bl0*(\d{1,4})(?:\b|(?=[\s\-_]))/i,
  /#0*(\d{1,4})\b/,
  /^0*(\d{1,4})[\-_\s]/,
];

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "juribuora-content-sync",
};

function firstMatch(patterns, stem) {
  for (const re of patterns) {
    const match = stem.match(re);
    if (match) {
      const value = Number(match[1]);
      if (Number.isFinite(value) && value > 0) return value;
    }
  }
  return null;
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const output = {};
  const lines = match[1].split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1].toLowerCase();
    const value = kv[2].trim();

    if (value === "" && lines[index + 1]?.match(/^\s+-\s+/)) {
      const items = [];
      while (lines[index + 1]?.match(/^\s+-\s+/)) {
        items.push(lines[index + 1].replace(/^\s+-\s+/, "").trim().replace(/^["']|["']$/g, ""));
        index += 1;
      }
      output[key] = items;
      continue;
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      output[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }

    output[key] = value.replace(/^["']|["']$/g, "");
  }

  return output;
}

function stripFrontMatter(markdown) {
  return markdown
    .replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(\r?\n)?/, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .concat("\n");
}

function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/^(Day|Lab)\s*\d+\s*[—–\-:]\s*/i, "")
    .trim();
}

function deriveDay(filename, frontMatter, category) {
  const frontMatterKey = category === "lab" ? "lab" : "day";
  const frontMatterValue =
    frontMatter[frontMatterKey] ?? frontMatter.number ?? frontMatter.order;

  if (typeof frontMatterValue === "string") {
    const parsed = parseInt(frontMatterValue, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  const stem = filename
    .replace(/\.(?:md|markdown)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");

  if (category === "lab") {
    return firstMatch(LAB_PATTERNS, stem) ?? firstMatch(DAY_PATTERNS, stem);
  }

  return firstMatch(DAY_PATTERNS, stem);
}

function jekyllUrlFor(date, filename, urlPrefix) {
  const [year, month, day] = date.split("-");
  const slug = filename
    .replace(/\.(?:md|markdown)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");

  return `${UPSTREAM.site}/${urlPrefix}/${year}/${month}/${day}/${slug}.html`;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: githubHeaders });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: githubHeaders });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}) for ${url}`);
  }
  return response.text();
}

async function listSourceFiles() {
  const apiUrl = `https://api.github.com/repos/${UPSTREAM.repo}/git/trees/${UPSTREAM.branch}?recursive=1`;
  const payload = await fetchJson(apiUrl);
  const tree = Array.isArray(payload.tree) ? payload.tree : [];

  return tree.filter((entry) => {
    if (entry.type !== "blob") return false;
    if (!/\.(md|markdown)$/i.test(entry.path)) return false;

    return UPSTREAM.folders.some(({ folder }) => entry.path.startsWith(`${folder}/_posts/`));
  });
}

function buildSummary(post) {
  return {
    day: post.day,
    title: post.title,
    date: post.date,
    url: post.url,
    category: post.category,
    tags: post.tags,
    slug: post.slug,
    sourcePath: post.sourcePath,
    contentPath: post.contentPath,
  };
}

async function buildSnapshot() {
  const files = await listSourceFiles();
  const collected = [];

  for (const file of files) {
    const folderConfig = UPSTREAM.folders.find(({ folder }) => file.path.startsWith(`${folder}/_posts/`));
    if (!folderConfig) continue;

    const filename = path.posix.basename(file.path);
    const markdown = await fetchText(
      `https://raw.githubusercontent.com/${UPSTREAM.repo}/${UPSTREAM.branch}/${file.path}`,
    );

    const frontMatter = parseFrontMatter(markdown);
    const day = deriveDay(filename, frontMatter, folderConfig.category);
    if (day === null) continue;

    const dateFromNameMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
    const dateFromName = dateFromNameMatch
      ? `${dateFromNameMatch[1]}-${dateFromNameMatch[2]}-${dateFromNameMatch[3]}`
      : "";

    const date =
      (typeof frontMatter.date === "string" && frontMatter.date) ||
      dateFromName ||
      new Date().toISOString().slice(0, 10);

    const slug = filename
      .replace(/\.(?:md|markdown)$/i, "")
      .replace(/^\d{4}-\d{2}-\d{2}-/, "");

    const rawTags = Array.isArray(frontMatter.tags)
      ? frontMatter.tags
      : typeof frontMatter.tags === "string"
        ? [frontMatter.tags]
        : [];

    const tags = rawTags.map((tag) => tag.toLowerCase()).filter(Boolean);

    const title = cleanTitle(
      typeof frontMatter.title === "string" && frontMatter.title ? frontMatter.title : filename,
    );

    collected.push({
      day,
      title,
      date,
      url: jekyllUrlFor(date, filename, folderConfig.urlPrefix),
      category: folderConfig.category,
      tags,
      slug,
      sourcePath: file.path,
      contentPath: `/generated/posts/${folderConfig.category}/${day}.json`,
      content: stripFrontMatter(markdown),
    });
  }

  const posts = collected
    .filter((post) => post.category === "blog")
    .sort((left, right) => right.day - left.day);
  const labs = collected
    .filter((post) => post.category === "lab")
    .sort((left, right) => right.day - left.day);

  const manifest = {
    posts: posts.map(buildSummary),
    labs: labs.map(buildSummary),
    allTags: Array.from(new Set([...posts, ...labs].flatMap((post) => post.tags))).sort(),
    source: "snapshot",
    generatedAt: new Date().toISOString(),
    upstream: {
      repo: UPSTREAM.repo,
      branch: UPSTREAM.branch,
      site: UPSTREAM.site,
    },
  };

  return { manifest, posts, labs };
}

async function writeIfChanged(targetPath, contents) {
  const current = existsSync(targetPath) ? await readFile(targetPath, "utf8") : null;
  if (current === contents) return false;
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, contents, "utf8");
  return true;
}

async function writeGeneratedOutputs(snapshot) {
  const manifestJson = `${JSON.stringify(snapshot.manifest, null, 2)}\n`;
  const manifestTs =
    "/* Auto-generated by scripts/sync-jekyll-content.mjs. Do not edit by hand. */\n" +
    'import type { LoadedPosts } from "./posts";\n\n' +
    `export const jekyllSnapshot: LoadedPosts = ${JSON.stringify(snapshot.manifest, null, 2)};\n`;

  await rm(GENERATED_POSTS_DIR, { recursive: true, force: true });
  await mkdir(GENERATED_POSTS_DIR, { recursive: true });

  let writes = 0;
  writes += Number(await writeIfChanged(GENERATED_MANIFEST_TS, manifestTs));
  writes += Number(await writeIfChanged(GENERATED_MANIFEST_JSON, manifestJson));

  for (const post of [...snapshot.posts, ...snapshot.labs]) {
    const payload = {
      day: post.day,
      title: post.title,
      date: post.date,
      url: post.url,
      category: post.category,
      tags: post.tags,
      slug: post.slug,
      sourcePath: post.sourcePath,
      content: post.content,
    };

    const targetPath = path.join(
      ROOT,
      "public",
      post.contentPath.replace(/^\//, ""),
    );

    writes += Number(
      await writeIfChanged(targetPath, `${JSON.stringify(payload, null, 2)}\n`),
    );
  }

  return writes;
}

async function main() {
  try {
    const snapshot = await buildSnapshot();
    const writes = await writeGeneratedOutputs(snapshot);
    const totalPosts = snapshot.manifest.posts.length + snapshot.manifest.labs.length;

    console.log(
      `[sync] Snapshot ready: ${snapshot.manifest.posts.length} blog posts, ` +
        `${snapshot.manifest.labs.length} labs (${totalPosts} total, ${writes} files written)`,
    );
  } catch (error) {
    const hasFallbackSnapshot =
      existsSync(GENERATED_MANIFEST_TS) &&
      existsSync(GENERATED_MANIFEST_JSON) &&
      existsSync(GENERATED_POSTS_DIR);

    if (hasFallbackSnapshot) {
      console.warn(`[sync] Refresh failed; using existing snapshot instead: ${(error).message}`);
      return;
    }

    console.error(`[sync] Refresh failed and no local snapshot is available: ${(error).message}`);
    process.exitCode = 1;
  }
}

await main();
