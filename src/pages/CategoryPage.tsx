import { ArrowRight, BookOpen, FlaskConical } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import BlogFooter from "@/components/BlogFooter";
import BlogHeader from "@/components/BlogHeader";
import PostList from "@/components/PostList";
import ScrollToTop from "@/components/ScrollToTop";
import { collectionLabel, collectionPath, normalizeCollectionSlug } from "@/lib/contentRoutes";
import NotFound from "./NotFound";

const COLLECTION_COPY = {
  blog: {
    eyebrow: "Daily Study Log",
    title: "Blog Archive",
    description:
      "Browse the daily notes, progress logs, and reflections from the cybersecurity journey.",
    icon: BookOpen,
  },
  lab: {
    eyebrow: "Hands-On Practice",
    title: "Lab Archive",
    description:
      "Browse the practical exercises, experiments, and technical write-ups from the lab work.",
    icon: FlaskConical,
  },
} as const;

function trimTrailingSlash(pathname: string): string {
  return pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
}

const CategoryPage = () => {
  const { collection } = useParams<{ collection: string }>();
  const location = useLocation();
  const normalizedCollection = normalizeCollectionSlug(collection);

  if (!normalizedCollection) {
    return <NotFound />;
  }

  const canonicalPath = collectionPath(normalizedCollection);
  if (trimTrailingSlash(location.pathname) !== canonicalPath) {
    return <Navigate replace to={canonicalPath} />;
  }

  const alternateCollection = normalizedCollection === "blog" ? "lab" : "blog";
  const copy = COLLECTION_COPY[normalizedCollection];
  const Icon = copy.icon;

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <BlogHeader />

      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-4xl px-4 py-14">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {copy.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              View all posts
            </Link>
            <Link
              to={collectionPath(alternateCollection)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open {collectionLabel(alternateCollection)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <PostList key={canonicalPath} lockedTab={normalizedCollection} />
      <BlogFooter />
    </div>
  );
};

export default CategoryPage;
