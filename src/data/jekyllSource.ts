// Configuration for the upstream Jekyll source repository.
// Add a post to your Jekyll repo and it will appear here automatically.
export const JEKYLL_REPO = "JuriBuora/JuriBuora.github.io";
export const JEKYLL_BRANCH = "my-blog";

// The site URL where the rendered Jekyll post lives
// (used as "View original post" link and as a fallback content source).
export const JEKYLL_SITE = "https://juribuora.github.io";

// Folder names inside the Jekyll repo that contain markdown posts.
// Each tuple: [folder in repo, category in our app, URL prefix on Jekyll site]
export const JEKYLL_FOLDERS: Array<{
  folder: string;
  category: "blog" | "lab";
  urlPrefix: string;
}> = [
  { folder: "Blog", category: "blog", urlPrefix: "blog" },
  { folder: "Labs", category: "lab", urlPrefix: "labs" },
];

export const rawUrl = (path: string) =>
  `https://raw.githubusercontent.com/${JEKYLL_REPO}/${JEKYLL_BRANCH}/${path}`;

export const contentsApiUrl = (folder: string) =>
  `https://api.github.com/repos/${JEKYLL_REPO}/contents/${folder}/_posts?ref=${JEKYLL_BRANCH}`;