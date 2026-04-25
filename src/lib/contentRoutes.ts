import type { PostCategory } from "@/data/posts";

export function normalizeCollectionSlug(value?: string): PostCategory | null {
  const slug = value?.toLowerCase();

  if (slug === "blog" || slug === "blogs") return "blog";
  if (slug === "lab" || slug === "labs") return "lab";

  return null;
}

export function collectionPath(category: PostCategory): string {
  return category === "blog" ? "/blog" : "/labs";
}

export function collectionLabel(category: PostCategory): string {
  return category === "blog" ? "Blog" : "Labs";
}
