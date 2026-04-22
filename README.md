# juribuora.com — From Zero to Cybersecurity

Public learning log built with **React + Vite + TypeScript + Tailwind**, hosted on **GitHub Pages** at <https://juribuora.com>.

The post content lives in a separate Jekyll repo: <https://github.com/JuriBuora/JuriBuora.github.io>. This site reads it directly — adding a post is just a markdown commit there.

---

## How to add a new post

1. In the Jekyll repo, create a markdown file under `Blog/_posts/` (or `Labs/_posts/`) named like `YYYY-MM-DD-day-NN.md` (or `YYYY-MM-DD-lab-NN-day-NN.md`).
2. Use this front-matter:
   ```yaml
   ---
   layout: post
   title: "📅 Day 60 – Your Title Here"
   date: 2026-04-01
   categories: blog        # or "lab"
   tags: [tag1, tag2]
   ---
   ```
3. Commit and push.

That's it. This site fetches the index from GitHub on load — no rebuild, no edit to `posts.ts` needed. The bundled `src/data/posts.ts` is only a fallback used if the GitHub API is rate-limited.

## Local development

```bash
bun install
bun run dev
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. The custom domain is set via `public/CNAME`.

First-time setup:
1. Repo Settings → Pages → Source: **GitHub Actions**.
2. Repo Settings → Pages → Custom domain: `juribuora.com` (DNS already points here).

## Project structure

```
src/
  components/        UI building blocks
  pages/             Route components (Index, PostPage, AboutPage, NotFound)
  data/
    posts.ts         Static fallback list (kept for offline/rate-limit safety)
    postsLoader.ts   Live loader that pulls from the Jekyll repo
    jekyllSource.ts  Repo + branch config — change here if you fork the Jekyll source
  hooks/usePosts.ts  React hook used by every page
public/
  404.html           SPA fallback for GitHub Pages deep links
  CNAME              Custom domain
```

## Configuration knobs

Edit `src/data/jekyllSource.ts` to change the upstream Jekyll repo, branch, or folder layout.
