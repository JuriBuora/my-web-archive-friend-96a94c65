export type PostCategory = "blog" | "lab";

export type Post = {
  day: number;
  title: string;
  date: string;
  url: string;
  category: PostCategory;
  tags: string[];
  slug: string;
  sourcePath: string;
  contentPath: string;
};

export type LoadedPosts = {
  posts: Post[];
  labs: Post[];
  allTags: string[];
  source: "snapshot";
  upstream: {
    repo: string;
    branch: string;
    site: string;
  };
};

export type PostContentPayload = {
  day: number;
  title: string;
  date: string;
  url: string;
  category: PostCategory;
  tags: string[];
  slug: string;
  sourcePath: string;
  content: string;
};
