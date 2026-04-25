import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import { type Post, type PostContentPayload } from "@/data/posts";
import { usePosts } from "@/hooks/usePosts";
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Tag, Clock } from "lucide-react";
import TableOfContents from "@/components/TableOfContents";
import ScrollToTop from "@/components/ScrollToTop";
import useCodeCopyButtons from "@/hooks/useCodeCopyButtons";
import { normalizeCollectionSlug } from "@/lib/contentRoutes";
import { formatPostDate } from "@/lib/postDates";

const PostPage = () => {
  const { category, day } = useParams<{ category: string; day: string }>();
  const { posts, labs } = usePosts();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const allPosts = useMemo(
    () => [...posts, ...labs].sort((a, b) => a.day - b.day),
    [posts, labs],
  );

  const post = useMemo(() => {
    const dayNumber = Number(day);
    const postCategory = normalizeCollectionSlug(category);
    if (!postCategory) return null;
    return allPosts.find((entry) => entry.day === dayNumber && entry.category === postCategory);
  }, [allPosts, category, day]);

  const { prev, next } = useMemo(() => {
    if (!post) return { prev: null, next: null };
    const sameCategory = allPosts.filter((entry) => entry.category === post.category);
    const currentIndex = sameCategory.findIndex((entry) => entry.day === post.day);
    return {
      prev: currentIndex > 0 ? sameCategory[currentIndex - 1] : null,
      next: currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null,
    };
  }, [allPosts, post]);

  useEffect(() => {
    if (!post) return;

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    fetch(post.contentPath, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Content request failed with ${response.status}`);
        }
        const payload = (await response.json()) as PostContentPayload;
        setContent(payload.content);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if (
          fetchError &&
          typeof fetchError === "object" &&
          "name" in fetchError &&
          fetchError.name === "AbortError"
        ) {
          return;
        }

        setContent(null);
        setLoading(false);
        setError(true);
      });

    return () => controller.abort();
  }, [post]);

  useCodeCopyButtons(!loading && !error && !!content);

  const readingTime = useMemo(() => {
    if (!content) return null;
    const words = content.trim().split(/\s+/).length;
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

  const formattedDate = formatPostDate(post.date, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const postPath = (entry: Post) => `/${entry.category}/${entry.day}`;

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <ScrollToTop />

      <div className="container mx-auto px-4 py-12 flex gap-8 max-w-5xl">
        <article className="min-w-0 flex-1 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to all posts
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-primary border border-primary/30 rounded px-2 py-1">
                {post.category === "lab"
                  ? `Lab ${String(post.day).padStart(2, "0")}`
                  : `Day ${String(post.day).padStart(2, "0")}`}
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

          <div className="border border-border rounded-lg bg-card p-6 md:p-8 mb-10">
            {loading && (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-secondary rounded"
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-mono text-sm mb-4">
                  This post snapshot could not be loaded locally.
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
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>

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

      <BlogFooter />
    </div>
  );
};

export default PostPage;
