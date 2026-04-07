import { useParams, Link } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import BlogHeader from "@/components/BlogHeader";
import { posts, labs, type Post } from "@/data/posts";
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Tag, Clock } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import ScrollToTop from "@/components/ScrollToTop";

const PostPage = () => {
  const { category, day } = useParams<{ category: string; day: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [contentType, setContentType] = useState<"markdown" | "html">("markdown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const allPosts = useMemo(() => [...posts, ...labs].sort((a, b) => a.day - b.day), []);

  const post = useMemo(() => {
    const d = Number(day);
    const cat = category === "lab" ? "lab" : "blog";
    return allPosts.find((p) => p.day === d && p.category === cat);
  }, [category, day, allPosts]);

  const { prev, next } = useMemo(() => {
    if (!post) return { prev: null, next: null };
    const sameCat = allPosts.filter((p) => p.category === post.category);
    const idx = sameCat.findIndex((p) => p.day === post.day);
    return {
      prev: idx > 0 ? sameCat[idx - 1] : null,
      next: idx < sameCat.length - 1 ? sameCat[idx + 1] : null,
    };
  }, [post, allPosts]);

  useEffect(() => {
    if (!post) return;
    setLoading(true);
    setError(false);

    const dateParts = post.date.split("-");
    const fileName = post.category === "lab"
      ? `lab-${String(post.day).padStart(2, "0")}`
      : `day-${String(post.day).padStart(2, "0")}`;

    const folder = post.category === "lab" ? "Labs" : "Blog";
    const rawUrl = `https://raw.githubusercontent.com/JuriBuora/JuriBuora.github.io/main/${folder}/_posts/${dateParts[0]}-${dateParts[1]}-${dateParts[2]}-${fileName}.md`;

    // Try raw markdown from GitHub first
    fetch(rawUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((text) => {
        const stripped = text.replace(/^---[\s\S]*?---\n*/m, "");
        setContentType("markdown");
        setContent(stripped);
        setLoading(false);
      })
      .catch(() => {
        // Fall back to the live Jekyll site HTML
        fetch(post.url)
          .then((res) => {
            if (!res.ok) throw new Error("Not found");
            return res.text();
          })
          .then((html) => {
            // Extract the post-content div
            const match = html.match(/<div class="post-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/article>|<a class)/);
            if (match) {
              setContentType("html");
              setContent(match[1].trim());
              setLoading(false);
            } else {
              throw new Error("Could not extract content");
            }
          })
          .catch(() => {
            setContent(null);
            setLoading(false);
            setError(true);
          });
      });
  }, [post]);

  // Apply highlight.js to HTML content code blocks
  useEffect(() => {
    if (contentType === "html" && content && !loading) {
      import("highlight.js/lib/common").then((hljs) => {
        document.querySelectorAll("div.prose pre code").forEach((el) => {
          hljs.default.highlightElement(el as HTMLElement);
        });
      });
    }
  }, [content, contentType, loading]);
  const readingTime = useMemo(() => {
    if (!content) return null;
    const text = content.replace(/<[^>]*>/g, "").replace(/[#*`~\[\]()>_-]/g, "");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <BlogHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="font-mono text-muted-foreground">Post not found</p>
          <Link to="/" className="text-primary font-mono text-sm mt-4 inline-block hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const postPath = (p: Post) => `/${p.category}/${p.day}`;

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <div className="container mx-auto px-4 py-12 flex gap-8 max-w-5xl">
        <article className="min-w-0 flex-1 max-w-3xl">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to all posts
        </Link>

        {/* Post header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-primary border border-primary/30 rounded px-2 py-1">
              {post.category === "lab" ? `Lab ${String(post.day).padStart(2, "0")}` : `Day ${String(post.day).padStart(2, "0")}`}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            {readingTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {readingTime} min read
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View original post
          </a>
        </header>

        {/* Content */}
        <div className="border border-border rounded-lg bg-card p-6 md:p-8 mb-10">
          {loading && (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-secondary rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
              ))}
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-mono text-sm mb-4">
                Content could not be loaded from GitHub.
              </p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Read on the original site
              </a>
            </div>
          )}
          {!loading && !error && content && (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-card-foreground prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-li:text-card-foreground prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground prose-img:rounded-lg prose-hr:border-border">
              {contentType === "markdown" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex items-stretch gap-3">
          {prev ? (
            <Link
              to={postPath(prev)}
              className="flex-1 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group bg-card"
            >
              <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground mb-1">
                <ArrowLeft className="w-3 h-3" />
                Previous
              </span>
              <span className="text-xs text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              to={postPath(next)}
              className="flex-1 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group text-right bg-card"
            >
              <span className="flex items-center justify-end gap-1 font-mono text-[10px] text-muted-foreground mb-1">
                Next
                <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-xs text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
        </article>

        <TableOfContents contentReady={!loading && !error && !!content} />
      </div>
      <footer className="border-t border-border py-8 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          © 2026 Juri Buora · From Zero to Cybersecurity
        </p>
      </footer>
    </div>
  );
};

export default PostPage;
