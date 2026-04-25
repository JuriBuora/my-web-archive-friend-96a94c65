import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/data/posts";
import { formatPostDate } from "@/lib/postDates";

const PostCard = ({ post, onTagClick }: { post: Post; onTagClick?: (tag: string) => void }) => {
  const formattedDate = formatPostDate(post.date, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/${post.category}/${post.day}`}
      className="group block border border-border rounded-lg p-4 transition-all duration-300 hover:border-primary/50 hover:border-glow bg-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-primary">
              {post.category === "lab" ? `Lab ${String(post.day).padStart(2, "0")}` : `Day ${String(post.day).padStart(2, "0")}`}
            </span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <h3 className="text-sm md:text-base font-medium text-card-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
      </div>
    </Link>
  );
};

export default PostCard;
