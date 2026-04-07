import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { posts } from "@/data/posts";
import { Progress } from "@/components/ui/progress";

const ProgressTimeline = () => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => a.day - b.day),
    []
  );

  const totalDays = sortedPosts.length;

  // Group by week for the weekly breakdown
  const weeks = useMemo(() => {
    const w: { week: number; posts: typeof sortedPosts }[] = [];
    for (const post of sortedPosts) {
      const weekNum = Math.ceil(post.day / 7);
      let entry = w.find((x) => x.week === weekNum);
      if (!entry) {
        entry = { week: weekNum, posts: [] };
        w.push(entry);
      }
      entry.posts.push(post);
    }
    return w;
  }, [sortedPosts]);

  // Collect unique tags with counts
  const topTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of sortedPosts) {
      for (const t of p.tags) map.set(t, (map.get(t) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [sortedPosts]);

  const hoveredPost = hoveredDay !== null ? sortedPosts.find((p) => p.day === hoveredDay) : null;

  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h2 className="font-mono text-xs text-terminal-dim uppercase tracking-widest mb-6">
        ▸ Learning Journey
      </h2>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between font-mono text-xs text-muted-foreground mb-1">
          <span>Day 1</span>
          <span className="text-primary">{totalDays} days logged</span>
        </div>
        <Progress value={(totalDays / 240) * 100} className="h-2" />
        <p className="font-mono text-[11px] text-muted-foreground mt-1">
          {Math.round((totalDays / 240) * 100)}% toward 240-day goal
        </p>
      </div>

      {/* Day grid */}
      <div className="mt-8 mb-2">
        <h3 className="font-mono text-[11px] text-muted-foreground mb-3 uppercase tracking-wider">
          Activity Grid
        </h3>
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(30, 1fr)' }}>
          {Array.from({ length: 240 }, (_, i) => {
            const day = i + 1;
            const post = sortedPosts.find((p) => p.day === day);
            const isActive = !!post;
            return (
              <a
                key={day}
                href={post?.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => isActive && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`aspect-square rounded-[2px] transition-all duration-200 ${
                  isActive
                    ? "bg-primary hover:bg-primary/80 hover:scale-150 cursor-pointer"
                    : "bg-secondary cursor-default"
                }`}
                onClick={(e) => !isActive && e.preventDefault()}
                title={post ? `Day ${day}: ${post.title}` : `Day ${day}: upcoming`}
              />
            );
          })}
        </div>
        {hoveredPost && (
          <div className="mt-2 font-mono text-xs text-primary animate-fade-in">
            Day {hoveredPost.day}: {hoveredPost.title}
          </div>
        )}
      </div>

      {/* Top topics */}
      <div className="mt-8">
        <h3 className="font-mono text-[11px] text-muted-foreground mb-3 uppercase tracking-wider">
          Top Topics
        </h3>
        <div className="space-y-2">
          {topTags.map(([tag, count]) => (
            <div key={tag} className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted-foreground w-24 text-right shrink-0">
                {tag}
              </span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/70 rounded-full transition-all"
                  style={{ width: `${(count / topTags[0][1]) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground w-6">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="mt-8">
        <h3 className="font-mono text-[11px] text-muted-foreground mb-3 uppercase tracking-wider">
          Weekly Breakdown
        </h3>
        <div className="flex items-end gap-1 h-20">
          {weeks.map((w) => (
            <div
              key={w.week}
              className="flex-1 bg-primary/60 hover:bg-primary rounded-t transition-colors cursor-default"
              style={{ height: `${(w.posts.length / 7) * 100}%` }}
              title={`Week ${w.week}: ${w.posts.length} posts`}
            />
          ))}
        </div>
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1">
          <span>W1</span>
          <span>W{weeks.length}</span>
        </div>
      </div>
    </section>
  );
};

export default ProgressTimeline;
