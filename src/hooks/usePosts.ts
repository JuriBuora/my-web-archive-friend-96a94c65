import { jekyllSnapshot } from "@/data/jekyllSnapshot.generated";

export function usePosts() {
  return {
    ...jekyllSnapshot,
    loading: false as const,
  };
}
