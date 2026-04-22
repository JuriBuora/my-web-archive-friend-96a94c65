import { useEffect, useState } from "react";
import { loadPosts, type LoadedPosts } from "@/data/postsLoader";
import { posts as fallbackPosts, labs as fallbackLabs, allTags as fallbackAllTags } from "@/data/posts";

const initial: LoadedPosts = {
  posts: fallbackPosts,
  labs: fallbackLabs,
  allTags: fallbackAllTags,
  source: "fallback",
};

/**
 * Returns posts/labs/tags. Starts with the bundled snapshot so the UI never
 * flashes empty, then swaps to the live list pulled from the Jekyll repo.
 */
export function usePosts() {
  const [data, setData] = useState<LoadedPosts>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadPosts().then((d) => {
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading };
}