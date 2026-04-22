import {
  JEKYLL_FOLDERS,
  JEKYLL_SITE,
  contentsApiUrl,
  rawUrl,
} from "./jekyllSource";
import { posts as fallbackPosts, labs as fallbackLabs, type Post } from "./posts";

type GhFile = { name: string; path: string; type: string };

// Filename like "2026-03-31-day-59.md" or "2026-02-05-lab-01_day-14.md"
const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;
const DAY_RE = /day[-_]?(\d{1,4})/i;
const LAB_RE = /^lab[-_]?(\d{1,4})/i;

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

function deriveDay(filename: string, category: "blog" | "lab"): number | null {
  // For labs prefer the lab number; for blog use the day number.
  const stem = filename.replace(/\.md$/, "");
  if (category === "lab") {
    const lab = stem.match(LAB_RE);
    if (lab) return Number(lab[1]);
    const day = stem.match(DAY_RE);
    if (day) return Number(day[1]);
  } else {
    const day = stem.match(DAY_RE);
    if (day) return Number(day[1]);
  }
  return null;
}

function jekyllUrlFor(
  date: string,
  filename: string,
  urlPrefix: string,
): string {
  const [y, m, d] = date.split("-");
  const slug = filename.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
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

  const mdFiles = files.filter((f) => f.type === "file" && f.name.endsWith(".md"));

  const results = await Promise.all(
    mdFiles.map(async (f): Promise<Post | null> => {
      const fmMatch = f.name.match(FILENAME_RE);
      if (!fmMatch) return null;
      const [, y, mo, d] = fmMatch;
      const dateFromName = `${y}-${mo}-${d}`;

      // Fetch only first ~2KB to read front-matter cheaply.
      const mdRes = await fetch(rawUrl(f.path));
      if (!mdRes.ok) return null;
      const text = await mdRes.text();
      const fm = parseFrontMatter(text);

      const day = deriveDay(f.name, category);
      if (day === null) return null;

      const rawTitle = (fm.title as string) || f.name;
      const title = cleanTitle(rawTitle);

      const date = (fm.date as string) || dateFromName;

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