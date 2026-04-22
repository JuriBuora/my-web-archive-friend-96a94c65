import {
  JEKYLL_FOLDERS,
  JEKYLL_SITE,
  contentsApiUrl,
  rawUrl,
} from "./jekyllSource";
import { posts as fallbackPosts, labs as fallbackLabs, type Post } from "./posts";

type GhFile = { name: string; path: string; type: string };

// Accepted filename patterns (in order of preference):
//   2026-03-31-day-59.md            ← Jekyll-standard, dated
//   2026-02-05-lab-01_day-14.md     ← lab + day combo
//   day-59.md / day_59.md / day59.md  ← undated shorthand
//   lab-01.md / lab_1.md / lab1.md
//   59-something.md                 ← bare leading number
// Markdown extensions accepted: .md, .markdown
const DATED_FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.(?:md|markdown)$/i;
const UNDATED_FILENAME_RE = /^(.+)\.(?:md|markdown)$/i;

// Day/lab number patterns — tolerate "day 59", "day-59", "day_59", "day59",
// "d59", "#59", or a bare leading number.
const DAY_PATTERNS: RegExp[] = [
  /\bday[\s\-_]*0*(\d{1,4})\b/i,
  /\bd0*(\d{1,4})\b/i,
  /#0*(\d{1,4})\b/,
  /^0*(\d{1,4})[\-_\s]/, // leading "59-..." / "59_..."
];
const LAB_PATTERNS: RegExp[] = [
  /\blab[\s\-_]*0*(\d{1,4})\b/i,
  /\bl0*(\d{1,4})\b/i,
  /#0*(\d{1,4})\b/,
  /^0*(\d{1,4})[\-_\s]/,
];

// Minimal YAML-ish front-matter extractor for the fields we care about.
// Handles: title, date, categories, and tags (inline [a, b] or block list).
function parseFrontMatter(md: string): Record<string, string | string[]> {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const body = m[1];
  const out: Record<string, string | string[]> = {};
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1].toLowerCase();
    let value = kv[2].trim();

    if (value === "" && lines[i + 1]?.startsWith("  - ")) {
      // Block list: collect indented "- item" lines
      const items: string[] = [];
      while (lines[i + 1]?.match(/^\s+-\s+/)) {
        items.push(lines[i + 1].replace(/^\s+-\s+/, "").trim().replace(/^["']|["']$/g, ""));
        i++;
      }
      out[key] = items;
    } else if (value.startsWith("[") && value.endsWith("]")) {
      out[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      out[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

function cleanTitle(raw: string): string {
  // Strip emoji/leading "Day NN – ", "Lab NN – " prefixes if present.
  return raw
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/^(Day|Lab)\s*\d+\s*[–\-:]\s*/i, "")
    .trim();
}

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

function deriveDay(
  filename: string,
  frontMatter: Record<string, string | string[]>,
  category: "blog" | "lab",
): number | null {
  // 1) Front-matter wins if it specifies an explicit number.
  const fmKey = category === "lab" ? "lab" : "day";
  const fmVal = frontMatter[fmKey] ?? frontMatter.number ?? frontMatter.order;
  if (typeof fmVal === "string") {
    const n = parseInt(fmVal, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }

  // 2) Strip date prefix and extension before pattern-matching.
  const stem = filename
    .replace(/\.(?:md|markdown)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");

  if (category === "lab") {
    return firstMatch(LAB_PATTERNS, stem) ?? firstMatch(DAY_PATTERNS, stem);
  }
  return firstMatch(DAY_PATTERNS, stem);
}

function jekyllUrlFor(
  date: string,
  filename: string,
  urlPrefix: string,
): string {
  const [y, m, d] = date.split("-");
  const slug = filename
    .replace(/\.(?:md|markdown)$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return `${JEKYLL_SITE}/${urlPrefix}/${y}/${m}/${d}/${slug}.html`;
}

async function fetchFolder(
  folder: string,
  category: "blog" | "lab",
  urlPrefix: string,
): Promise<Post[]> {
  const res = await fetch(contentsApiUrl(folder));
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${folder}`);
  const files: GhFile[] = await res.json();

  const mdFiles = files.filter(
    (f) => f.type === "file" && /\.(md|markdown)$/i.test(f.name),
  );

  const results = await Promise.all(
    mdFiles.map(async (f): Promise<Post | null> => {
      // Try dated pattern first; fall back to undated for shorthand names.
      const dated = f.name.match(DATED_FILENAME_RE);
      const undated = f.name.match(UNDATED_FILENAME_RE);
      if (!dated && !undated) return null;
      const dateFromName = dated ? `${dated[1]}-${dated[2]}-${dated[3]}` : "";

      const mdRes = await fetch(rawUrl(f.path));
      if (!mdRes.ok) return null;
      const text = await mdRes.text();
      const fm = parseFrontMatter(text);

      const day = deriveDay(f.name, fm, category);
      if (day === null) return null;

      const rawTitle = (fm.title as string) || f.name;
      const title = cleanTitle(rawTitle);

      // Prefer front-matter date; fall back to filename date; else today.
      const date =
        (fm.date as string) ||
        dateFromName ||
        new Date().toISOString().slice(0, 10);

      let tags: string[] = [];
      if (Array.isArray(fm.tags)) tags = fm.tags;
      else if (typeof fm.tags === "string") tags = [fm.tags];
      tags = tags.map((t) => t.toLowerCase()).filter(Boolean);

      return {
        day,
        title,
        date,
        url: jekyllUrlFor(date, f.name, urlPrefix),
        category,
        tags,
      };
    }),
  );

  return results.filter((p): p is Post => p !== null);
}

export type LoadedPosts = {
  posts: Post[];
  labs: Post[];
  allTags: string[];
  source: "jekyll" | "fallback";
};

function deriveAllTags(...lists: Post[][]) {
  return Array.from(new Set(lists.flat().flatMap((p) => p.tags))).sort();
}

let cache: Promise<LoadedPosts> | null = null;

export function loadPosts(): Promise<LoadedPosts> {
  if (cache) return cache;
  cache = (async () => {
    try {
      const lists = await Promise.all(
        JEKYLL_FOLDERS.map((f) => fetchFolder(f.folder, f.category, f.urlPrefix)),
      );
      const blog = (lists[0] || []).sort((a, b) => b.day - a.day);
      const labs = (lists[1] || []).sort((a, b) => b.day - a.day);
      if (blog.length === 0 && labs.length === 0) throw new Error("Empty");
      return {
        posts: blog,
        labs,
        allTags: deriveAllTags(blog, labs),
        source: "jekyll" as const,
      };
    } catch {
      return {
        posts: fallbackPosts,
        labs: fallbackLabs,
        allTags: deriveAllTags(fallbackPosts, fallbackLabs),
        source: "fallback" as const,
      };
    }
  })();
  return cache;
}