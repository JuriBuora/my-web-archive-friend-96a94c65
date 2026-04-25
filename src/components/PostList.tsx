import { useState, useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import type { PostCategory } from "@/data/posts";
import { formatPostDate } from "@/lib/postDates";
import PostCard from "./PostCard";
import { Search, X } from "lucide-react";

type PostListProps = {
  lockedTab?: PostCategory;
};

const PostList = ({ lockedTab }: PostListProps) => {
  const { posts, labs, allTags } = usePosts();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "lab">("all");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const allPosts = useMemo(() => [...posts, ...labs], [posts, labs]);
  const selectedTab = lockedTab ?? activeTab;
  const scopedPosts = useMemo(() => {
    if (selectedTab === "all") return allPosts;
    return selectedTab === "blog" ? posts : labs;
  }, [allPosts, labs, posts, selectedTab]);
  const visibleTags = useMemo(() => {
    if (!lockedTab) return allTags;
    return Array.from(new Set(scopedPosts.flatMap((post) => post.tags))).sort();
  }, [allTags, lockedTab, scopedPosts]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let items = scopedPosts;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    if (activeTags.size > 0) {
      items = items.filter((p) => p.tags.some((t) => activeTags.has(t)));
    }
    return items;
  }, [activeTags, scopedPosts, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const post of filtered) {
      const key = formatPostDate(post.date, {
        month: "long",
        year: "numeric",
      });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {!lockedTab && (
          <div className="flex gap-1 font-mono text-xs">
            {(["all", "blog", "lab"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {tab === "all" ? `All (${allPosts.length})` : tab === "blog" ? `Blog (${posts.length})` : `Labs (${labs.length})`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tag filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {visibleTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`font-mono text-[11px] px-2 py-1 rounded-md border transition-all duration-200 ${
              activeTags.has(tag)
                ? "bg-primary/20 border-primary/50 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-secondary-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
        {activeTags.size > 0 && (
          <button
            onClick={() => setActiveTags(new Set())}
            className="font-mono text-[11px] px-2 py-1 rounded-md border border-destructive/30 text-destructive flex items-center gap-1 hover:bg-destructive/10 transition-colors"
          >
            <X className="w-3 h-3" />
            clear
          </button>
        )}
      </div>

      {grouped.length === 0 && (
        <p className="text-center text-muted-foreground py-12 font-mono text-sm">
          No posts found matching your filters
        </p>
      )}

      {grouped.map(([month, items]) => (
        <div key={month} className="mb-10">
          <h2 className="font-mono text-xs text-terminal-dim uppercase tracking-widest mb-4 border-b border-border pb-2">
            {month}
          </h2>
          <div className="space-y-2">
            {items.map((post) => (
              <PostCard key={`${post.category}-${post.day}`} post={post} onTagClick={toggleTag} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default PostList;
