import { useState, useMemo } from "react";
import { posts, labs } from "@/data/posts";
import PostCard from "./PostCard";
import { Search } from "lucide-react";

const PostList = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "lab">("all");

  const allPosts = useMemo(() => [...posts, ...labs], []);

  const filtered = useMemo(() => {
    let items = activeTab === "all" ? allPosts : activeTab === "blog" ? posts : labs;
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }
    return items;
  }, [search, activeTab, allPosts]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const post of filtered) {
      const key = new Date(post.date).toLocaleDateString("en-US", {
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
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
      </div>

      {grouped.length === 0 && (
        <p className="text-center text-muted-foreground py-12 font-mono text-sm">
          No posts found matching "{search}"
        </p>
      )}

      {grouped.map(([month, items]) => (
        <div key={month} className="mb-10">
          <h2 className="font-mono text-xs text-terminal-dim uppercase tracking-widest mb-4 border-b border-border pb-2">
            {month}
          </h2>
          <div className="space-y-2">
            {items.map((post) => (
              <PostCard key={`${post.category}-${post.day}`} post={post} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default PostList;
